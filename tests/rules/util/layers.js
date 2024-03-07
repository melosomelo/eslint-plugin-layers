const fs = require("fs");
const path = require("path");
const { cwd } = require("process");

exports.setup = (layers) => {
  layers.forEach((layer) => fs.mkdirSync(path.join(cwd(), layer.path)));
};

exports.destroy = (layers) => {
  layers.forEach((layer) =>
    fs.rmSync(path.join(cwd(), layer.path), { recursive: true, force: true })
  );
};

exports.clear = (layers) => {
  layers.forEach((layer) => {
    const layerPath = path.join(cwd(), layer.path);
    fs.readdirSync(layerPath).forEach((file) =>
      fs.unlinkSync(path.join(layerPath, file))
    );
  });
};
