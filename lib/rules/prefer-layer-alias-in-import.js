/* eslint-disable eslint-plugin/prefer-message-ids */
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
      },
    };
  },
};
