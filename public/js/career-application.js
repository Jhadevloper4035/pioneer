(() => {
  const MAX_RESUME_SIZE = 5 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = new Set(["pdf", "doc", "docx"]);

  const formatBytes = (bytes) => {
    if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  document.querySelectorAll("[data-career-application-form]").forEach((form) => {
    const dropzone = form.querySelector("[data-resume-dropzone]");
    const input = form.querySelector("[data-resume-input]");
    const fileStatus = form.querySelector("[data-resume-file]");
    const progress = form.querySelector("[data-resume-progress]");
    const progressBar = form.querySelector("[data-resume-progress-bar]");
    const progressText = form.querySelector("[data-resume-progress-text]");
    const status = form.querySelector("[data-career-application-status]");
    const button = form.querySelector("button[type='submit']");

    if (!dropzone || !input || !fileStatus || !progress || !progressBar || !progressText || !status || !button) return;

    const setStatus = (message, state) => {
      status.textContent = message;
      status.className = `career-application-form__status${state ? ` is-${state}` : ""}`;
    };

    const showFile = (file) => {
      const extension = String(file?.name || "").split(".").pop().toLowerCase();

      if (!file || !ALLOWED_EXTENSIONS.has(extension)) {
        input.value = "";
        fileStatus.textContent = "Please choose a PDF, DOC, or DOCX file.";
        fileStatus.className = "career-resume-dropzone__file is-error";
        return false;
      }

      if (file.size > MAX_RESUME_SIZE) {
        input.value = "";
        fileStatus.textContent = "Resume must be 5 MB or smaller.";
        fileStatus.className = "career-resume-dropzone__file is-error";
        return false;
      }

      fileStatus.textContent = `Ready: ${file.name} (${formatBytes(file.size)})`;
      fileStatus.className = "career-resume-dropzone__file is-ready";
      return true;
    };

    input.addEventListener("change", () => showFile(input.files[0]));

    ["dragenter", "dragover"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.add("is-dragging");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        dropzone.classList.remove("is-dragging");
      });
    });

    dropzone.addEventListener("drop", (event) => {
      const file = event.dataTransfer?.files?.[0];
      if (!showFile(file)) return;

      const files = new DataTransfer();
      files.items.add(file);
      input.files = files.files;
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const file = input.files[0];
      if (!showFile(file)) {
        setStatus("Please choose a valid resume before submitting.", "error");
        return;
      }

      button.disabled = true;
      progress.hidden = false;
      progressBar.value = 0;
      progressText.textContent = "Starting upload...";
      setStatus("Uploading your application...", "pending");

      const request = new XMLHttpRequest();
      request.open("POST", form.action);
      request.setRequestHeader("Accept", "application/json");

      request.upload.addEventListener("progress", (uploadEvent) => {
        if (!uploadEvent.lengthComputable) return;

        const percent = Math.round((uploadEvent.loaded / uploadEvent.total) * 100);
        progressBar.value = percent;
        progressText.textContent = `Uploading ${percent}% (${formatBytes(uploadEvent.loaded)} of ${formatBytes(uploadEvent.total)})`;
      });

      request.addEventListener("load", () => {
        let result = {};

        try {
          result = JSON.parse(request.responseText || "{}");
        } catch {
          result = {};
        }

        if (request.status >= 200 && request.status < 300 && result.success) {
          progressBar.value = 100;
          progressText.textContent = "Upload complete.";
          fileStatus.textContent = `Uploaded successfully: ${file.name}`;
          fileStatus.className = "career-resume-dropzone__file is-success";
          setStatus("Application submitted successfully. Redirecting...", "success");
          window.setTimeout(() => window.location.assign("/thank-you"), 900);
          return;
        }

        button.disabled = false;
        setStatus(result.message || "Unable to submit your application right now.", "error");
      });

      request.addEventListener("error", () => {
        button.disabled = false;
        setStatus("Unable to submit your application right now.", "error");
      });

      request.send(new FormData(form));
    });
  });
})();
