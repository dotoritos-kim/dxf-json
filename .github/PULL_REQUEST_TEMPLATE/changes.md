## Overview

<!--
  Please describe your pull request, may include followings:

  - Why I created this PR
  - Why my changes are required
  - The issue numbers related to this PR (Add with #)

  We highly recommend to pile an issue before open PR
-->

## Changes

Check the relevants of your pull request

- [ ] Add new features
- [ ] Fix bug
- [ ] Refactor which doesn't change internal behavior (indent, typo)
- [ ] Refactor which do changes internal behavior
- [ ] Edit the existing documents/comments
- [ ] Edit the build part or package manager

## Approval Requirement

- Title of the PR must start with one of them: (choose the most important one of above changes)
  - `feat: `
  - `fix: `
  - `chore: `
  - `refactor: `
- You must apply prettier
- You should add test cases for new feature(s) (especially for complex cases)
- You should add **jsdoc comment** to `function`, `type`, `interface` and constants.
- You must add followings to `import-test.ts` and **pass the test**
  - New parser snippets
  - New `enum` and constants
  - New parse `function`
  - Helper functions or internal things are optional, but the maintainer would request to add them.

You can test by yourself in local, by executing following commands:

```
npm run build
npm run test
```
