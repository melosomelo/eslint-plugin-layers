# eslint-plugin-layers

A set of ESLint rules that enforce a layered software architecture style.

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-layers`:

```sh
npm install eslint-plugin-layers --save-dev
```

## Usage

Add `layers` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["layers"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "layers/rule-name": 2
  }
}
```

## Rules

This plugin ships with two main rules, both of which regard the handling of imports and the defined layers.

### `no-import-from-upper-layer`

This rule enforces that imports between layers must be done in a downwards or lateral fashion (layers must import
from either itself or from lower layers). Any upwards import probably signal that either your current or the imported piece
of code should be placed in another layer.

The configuration for this rule is a sequence of objects that represent the layers in your code. **The order in which
you specify the layers matters.** The position of the object in your sequence represents the position of the layer in your
architecture in an ascending fashion, i.e., the first object in the sequence represents the bottommost layer, and the last represents the
topmost one. Each object will have a `name` and a `path` field. The `path` must be relative to your `.eslintrc` file.

Here's an example configuration.

```jsonc
  //...
  "rules": {
    "layers/no-import-from-upper-layer": [
      2,
      // shared is the bottommost layer and can import only from itself
      { "name": "shared", "path": "src/shared" },
      { "name": "repository", "path": "src/repository" },
      // app is the topmost layer and can import from anyone
      { "name": "app", "path": "src/app" }
    ]
  }
  //...
```

### `prefer-layer-alias-in-import`

This rule enforces that any reference to a layer in any import must be done so via is config-defined alias.

For example, consider a code base with the layers `shared -> repository -> app`, with `shared` being the bottommost layer,
each of which are directly located under the `src/` directory.
In a lot of large and deep code bases, it's very common to define aliases for certain folders in order to avoid
ugly relative paths. Therefore, a file such as
