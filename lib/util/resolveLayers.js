const path = require("path");

/**
 * @typedef {import("../typedefs.js").LayerLike} Layer
 */

/**
 * Resolves each relative layer path to an absolute path, relative to `cwd`.
 * @param {Array.<Layer>} layers
 * @param {string} cwd
 * @returns {Array.<Layer>}
 */
function resolveLayers(layers, cwd) {
  return layers.map((layer) => ({
    ...layer,
    path: path.resolve(cwd, layer.path),
  }));
}

module.exports = resolveLayers;
