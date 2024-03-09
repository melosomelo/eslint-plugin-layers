const path = require("path");
const {
  test,
  describe,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} = require("@jest/globals");

const util = require("./util");

describe("prefer-layer-alias-in-import", () => {
  const layers = [
    { alias: "~shared", path: "tests/rules/shared" },
    { alias: "~repository", path: "tests/rules/repository" },
    { alias: "~app", path: "tests/rules/app" },
  ];

  const ruleConfig = ["error", ...layers];

  beforeAll(() => util.layers.setup(layers));

  afterAll(() => util.layers.destroy(layers));

  afterEach(() => util.layers.clear(layers));

  test("should not throw when layers are empty", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "shared", "foo.js"),
        "import bar from 'some-random-library'",
        `--rule 'prefer-layer-alias-in-import: ['error']'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).resolves.not.toThrow();
  });
  test("should not throw if import is not from a layer", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "shared", "foo.js"),
        "import bar from '../not-a-layer'",
        `--rule 'prefer-layer-alias-in-import: ${JSON.stringify(ruleConfig)}'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).resolves.not.toThrow();
  });
  test("should throw if import is from a layer and is not using alias", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "repository", "foo.js"),
        "import bar from '../shared'",
        `--rule 'prefer-layer-alias-in-import: ${JSON.stringify(ruleConfig)}'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).rejects.toThrow();
  });
});
