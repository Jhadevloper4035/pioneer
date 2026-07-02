const fs = require("fs");
const path = require("path");

const MAX_RESUME_SIZE = 5 * 1024 * 1024;
const MAX_REQUEST_SIZE = 6 * 1024 * 1024;
const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);

function splitBuffer(buffer, separator) {
  const parts = [];
  let start = 0;
  let index = buffer.indexOf(separator, start);

  while (index !== -1) {
    parts.push(buffer.subarray(start, index));
    start = index + separator.length;
    index = buffer.indexOf(separator, start);
  }

  parts.push(buffer.subarray(start));
  return parts;
}

function parseContentDisposition(value) {
  return value.split(";").reduce((params, segment) => {
    const [rawKey, ...rawValue] = segment.trim().split("=");
    if (!rawKey || !rawValue.length) return params;

    const key = rawKey.toLowerCase();
    const joinedValue = rawValue.join("=").trim();
    params[key] = joinedValue.replace(/^"|"$/g, "");
    return params;
  }, {});
}

function parseMultipartBody(buffer, boundary) {
  const separator = Buffer.from(`--${boundary}`);
  const fields = {};
  const files = {};

  splitBuffer(buffer, separator).forEach((rawPart) => {
    let part = rawPart;

    if (!part.length || part.equals(Buffer.from("--\r\n")) || part.equals(Buffer.from("--"))) return;
    if (part.subarray(0, 2).toString() === "\r\n") part = part.subarray(2);
    if (part.subarray(0, 2).toString() === "--") return;
    if (part.subarray(-2).toString() === "\r\n") part = part.subarray(0, -2);

    const headerEnd = part.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd === -1) return;

    const headerText = part.subarray(0, headerEnd).toString("utf8");
    let body = part.subarray(headerEnd + 4);
    if (body.subarray(-2).toString() === "\r\n") body = body.subarray(0, -2);

    const headers = headerText.split("\r\n").reduce((acc, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return acc;

      acc[line.slice(0, separatorIndex).toLowerCase()] = line.slice(separatorIndex + 1).trim();
      return acc;
    }, {});

    const disposition = parseContentDisposition(headers["content-disposition"] || "");
    if (!disposition.name) return;

    if (Object.prototype.hasOwnProperty.call(disposition, "filename")) {
      files[disposition.name] = {
        buffer: body,
        mimetype: headers["content-type"] || "application/octet-stream",
        originalName: path.basename(disposition.filename || "")
      };
      return;
    }

    fields[disposition.name] = body.toString("utf8").trim();
  });

  return { fields, files };
}

function sanitizeFilename(filename) {
  const extension = path.extname(filename).toLowerCase();
  const base = path
    .basename(filename, extension)
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

  return `${base || "resume"}-${Date.now()}${extension}`;
}

function resumeUpload(req, res, next) {
  const contentType = req.headers["content-type"] || "";
  const normalizedContentType = contentType.toLowerCase();
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

  if (!normalizedContentType.includes("multipart/form-data") || !boundaryMatch) {
    return res.status(400).json({
      success: false,
      message: "Resume upload form data is required."
    });
  }

  const contentLength = Number(req.headers["content-length"] || 0);
  if (contentLength > MAX_REQUEST_SIZE) {
    return res.status(413).json({
      success: false,
      message: "Application upload is too large."
    });
  }

  const chunks = [];
  let totalSize = 0;
  let requestTooLarge = false;

  req.on("data", (chunk) => {
    totalSize += chunk.length;

    if (totalSize > MAX_REQUEST_SIZE) {
      requestTooLarge = true;
      chunks.length = 0;
      return;
    }

    chunks.push(chunk);
  });

  req.on("error", next);

  req.on("end", async () => {
    try {
      if (requestTooLarge) {
        return res.status(413).json({
          success: false,
          message: "Application upload is too large."
        });
      }

      const { fields, files } = parseMultipartBody(Buffer.concat(chunks), boundaryMatch[1] || boundaryMatch[2]);
      const resume = files.resume;

      if (!resume || !resume.originalName) {
        return res.status(400).json({
          success: false,
          message: "Please upload your resume."
        });
      }

      const extension = path.extname(resume.originalName).toLowerCase();
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        return res.status(400).json({
          success: false,
          message: "Resume must be a PDF, DOC, or DOCX file."
        });
      }

      if (resume.buffer.length > MAX_RESUME_SIZE) {
        return res.status(400).json({
          success: false,
          message: "Resume must be 5 MB or smaller."
        });
      }

      const uploadDir = path.join(process.cwd(), "uploads", "resumes");
      const filename = sanitizeFilename(resume.originalName);
      const storedPath = path.join(uploadDir, filename);

      await fs.promises.mkdir(uploadDir, { recursive: true });
      await fs.promises.writeFile(storedPath, resume.buffer);

      req.body = fields;
      req.file = {
        filename,
        mimetype: resume.mimetype,
        originalName: resume.originalName,
        path: storedPath,
        size: resume.buffer.length
      };

      return next();
    } catch (error) {
      return next(error);
    }
  });
}

module.exports = resumeUpload;
