/* eslint-disable eslint-plugin/prefer-message-ids */
const path = require("path");
const resolveLayers = require("../util/resolveLayers");

/**
 * @typedef {import('eslint').Rule.RuleModule} RuleModule
 */

/**
 * @type {RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          alias: { type: "string" },
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
        const importAbsPath = path.resolve(
          path.dirname(physicalFilename),
          node.source.value,
        );
        const importSourceLayerIdx = resolvedLayers.findIndex((layer) =>
          importAbsPath.startsWith(layer.path),
        );
        // Import source is not in any layer, just ignore it.
        if (importSourceLayerIdx === -1) return;

        /**
        @type {import("../typedefs.js").AliasedLayer}
        */
        const layer = resolvedLayers[importSourceLayerIdx];
        if (node.source.value !== layer.alias) {
          ctx.report({
            node,
            message: `Prefer using the defined alias for this layer (${layer.alias})`,
          });
        }
      },
    };
  },
};
