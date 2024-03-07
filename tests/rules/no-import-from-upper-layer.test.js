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

describe("no-import-from-upper-layer", () => {
  const layers = [
    { name: "shared", path: "tests/rules/shared" },
    { name: "repository", path: "tests/rules/repository" },
    { name: "app", path: "tests/rules/app" },
  ];

  const ruleConfig = ["error", ...layers];

  beforeAll(() => util.layers.setup(layers));

  afterAll(() => util.layers.destroy(layers));

  afterEach(() => util.layers.clear(layers));

  test("should not give error when layers are empty", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "shared", "foo.js"),
        "import bar from 'some-random-library'",
        `--rule 'no-import-from-upper-layer: ['error']'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).resolves.not.toThrow();
  });
  test("should not throw error when layers are defined and is importing from library", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "shared", "foo.js"),
        "import bar from 'some-random-library'",
        `--rule 'no-import-from-upper-layer: ${JSON.stringify(ruleConfig)}'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).resolves.not.toThrow();
  });
  test("should not throw error when importing from immediate lower layer", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "repository", "foo.js"),
        "import bar from '../shared/bar.js'",
        `--rule 'no-import-from-upper-layer: ${JSON.stringify(ruleConfig)}'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).resolves.not.toThrow();
  });
  test("should not throw error when importing from lower layer (not immediate)", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "app", "index.js"),
        "import { something } from '../shared'",
        `--rule 'no-import-from-upper-layer: ${JSON.stringify(ruleConfig)}'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).resolves.not.toThrow();
  });
  test("should throw when importing from upper layer", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "shared", "foo.js"),
        "import bar from '../repository/bar.js'",
        `--rule 'no-import-from-upper-layer: ${JSON.stringify(ruleConfig)}'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).rejects.toThrow();
  });
  test("should not throw when importing from folder outside of defined layers", async () => {
    await expect(
      util.execEslint(
        path.join(__dirname, "app", "index.js"),
        "import { something } from '../identity'",
        `--rule 'no-import-from-upper-layer: ${JSON.stringify(ruleConfig)}'`,
        `--parser-options sourceType:module`,
        `--env es6`,
      ),
    ).resolves.not.toThrow();
  });
});
