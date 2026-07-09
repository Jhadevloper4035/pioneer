const fs = require("fs");
const path = require("path");
const { series } = require("gulp");
const sass = require("sass");

function styles(done) {
  const result = sass.compile(path.join(__dirname, "public/scss/main.scss"), {
    style: "compressed"
  });

  fs.mkdirSync(path.join(__dirname, "public/css"), { recursive: true });
  fs.writeFileSync(path.join(__dirname, "public/css/main.css"), result.css);
  done();
}

exports.styles = styles;
exports.build = series(styles);
exports.default = exports.build;
