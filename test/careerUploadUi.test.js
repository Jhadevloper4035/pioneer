const assert = require("assert");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

["src/views/public/pages/career/all-career-page.ejs", "src/views/public/pages/career/single-career-page.ejs"].forEach((file) => {
  const view = read(file);
  assert.match(view, /data-resume-dropzone/);
  assert.match(view, /data-resume-progress/);
  assert.match(view, /\/js\/career-application\.js/);
});

const uploader = read("public/js/career-application.js");
assert.match(uploader, /new XMLHttpRequest\(\)/);
assert.match(uploader, /upload\.addEventListener\("progress"/);
assert.match(uploader, /dropzone\.addEventListener\("drop"/);

console.log("Career upload UI checks passed.");
