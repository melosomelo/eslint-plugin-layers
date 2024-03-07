const path = require("path");
const fs = require("fs");
const { exec: callbackExec } = require("child_process");
const { promisify } = require("util");
const { cwd } = require("process");

const exec = promisify(callbackExec);

function execEslint(filename, code, ...opts) {
  fs.writeFileSync(filename, code);
  const options = opts.length === 0 ? "" : opts.join(" ");
  return exec(
    path.join(
      cwd(),
      "node_modules",
      ".bin",
      `eslint --rulesdir ${path.join(
        cwd(),
        "lib",
        "rules"
      )} ${options} --no-eslintrc ${filename}`
    )
  );
}

module.exports = execEslint;
