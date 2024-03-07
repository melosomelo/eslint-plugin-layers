/* eslint-disable eslint-plugin/prefer-message-ids */
const path = require("path");

/**
 * A layer of your codebase
 * @typedef Layer
 * @type {object}
 * @property {string} name - The name of the layer
 * @property {string} path - The path to the layer, relative to the directory containing your .eslintrc file
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

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 */

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "problem",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          path: { type: "string" },
        },
      },
    },
  },
  create(ctx) {
    const { physicalFilename, options, cwd } = ctx;
    return {
      ImportDeclaration: (node) => {
        if (options.length === 0) return;

        const resolvedLayers = resolveLayers(options, cwd);
        const currentLayerIdx = resolvedLayers.findIndex((layer) =>
          physicalFilename.startsWith(layer.path)
        );
        // Current file is not in any layer, so just ignore it.
        if (!currentLayerIdx === -1) return;

        const importAbsPath = path.resolve(
          resolvedLayers[currentLayerIdx].path,
          node.source.value
        );
        const importSourceLayerIdx = resolvedLayers.findIndex((layer) =>
          importAbsPath.startsWith(layer.path)
        );
        // Import source is not in any layer, so just ignore it.
        if (!importSourceLayerIdx === -1) return;

        // If we're here, both are in a layer, so we just check if we're importing
        // from an upper layer.
        if (currentLayerIdx < importSourceLayerIdx)
          return ctx.report({
            node,
            message:
              "Do not import from upper layers. Import from the current layer or lower layers only.",
          });
      },
    };
  },
};
