# Toolbox Storage Helpers

A collection of packages for working with /r/toolbox data.

## Packages

See the README in each package for more information.

### [`toolbox-storage`](/packages/toolbox-storage/) [![npm version](https://img.shields.io/npm/v/toolbox-storage.svg)](https://www.npmjs.com/package/toolbox-storage)

Defines basic helpers classes for reading and manipulating the storage formats.
This package includes no data fetching/API helpers; you'll have to read to/write
from the relevant wiki pages yourself.

### [`toolbox-devvit`](/packages/toolbox-devvit/) [![npm version](https://img.shields.io/npm/v/toolbox-devvit.svg)](https://www.npmjs.com/package/toolbox-devvit)

Wraps the basic helpers in a Devvit-specific client class which handles data
fetching for you via Devvit's built-in API client.

## Development/Contributing

This project uses [npm workspaces][npm-workspaces]. Run `npm install` from the
root directory in order to install dependencies for all packages and create
`node_modules` symlinks for packages that depend on each other.

### Package scripts

Each package defines several scripts for itself, which include:

- `fmt` formats the package's source code.
- `fmt:check` checks the format without making any changes to files.
- `build` compiles the package and its tests.
- `test` runs the package's tests. Make sure you run `build` first.
- `coverage` compiles and runs tests and generates a test coverage report.

Each of these scripts can be run in two ways:

- To run for a single package, run `npm run <script>` from the package's
  directory.
- To run for all packages at once, `npm run <script> --workspaces` from the
  repo's root directory.

### Project scripts

These scripts are defined in the root `package.json` rather than in the
`package.json` of each individual package and are mostly used for CI/release
purposes. Run them with `npm run <script>` in the root directory.

- `build:all` builds all packages at once. This is functionally identical to
  running the individual package `build` scripts, but avoids invoking Typescript
  multiple times which makes it faster.
- `docs` generates API documentation for all packages at once, combining it
  into a single folder for all packages which can be uploaded to Github Pages.

[npm-workspaces]: https://docs.npmjs.com/cli/using-npm/workspaces

## License

[MIT &copy; the toolbox team](/LICENSE)
