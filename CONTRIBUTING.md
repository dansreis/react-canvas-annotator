# Contributing

Welcome, and thanks for your interest in contributing! Please take a moment to review the following:

## Style Guide

- **Code** is formatted via [Prettier](https://prettier.io/)
- **Languages** only [TypeScript](https://www.typescriptlang.org/) should be used.

## Getting Started

### Setup

1. [Fork the repo](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) and clone to your machine.
2. Create a new branch with your contribution.
3. Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) on your machine.
4. In the repo, install dependencies via:
   ```sh
   npm i
   ```
5. Voilà, you're ready to go!

### Scripts

- `npm build` – production build
- `npm test` – runs jest, watching for file changes
- `npm run lint` – check linting
- `npm run format` – format all code
- `npm run storybook` – runs storybook for development purposes

### Commit Convention
This repository is currently in a stage where conventional commits are not utilized. Instead, contributors are encouraged to provide detailed and descriptive explanations of the tasks they are undertaking and the changes they are implementing.

When contributing to this repository, please ensure the following:

1. **Descriptive Changes**: Be as descriptive and elucidative as possible when documenting the task you are working on and the changes you are applying. This helps maintain clarity and transparency throughout the development process.

2. **Detailed Explanations**: Provide detailed explanations of the changes made, including the rationale behind them and any potential impacts they may have on the project.

3. **Future Considerations**: While conventional commits are not currently employed, there may be plans to adopt them in the future. Stay updated with any changes to the contribution guidelines.

For reference, you can explore [Conventional Commits](https://www.conventionalcommits.org/) to familiarize yourself with the conventional commit format, which may be utilized in the future.

Thank you for your contributions!

## Releases

In the mean-time releases will be made manually by the project owner. The process is quite simple:

1. Open a PR bumping the current `package.json` version.
2. Manualy create a release in Github
3. Check files changes and decide between **MAJOR**, **MINOR** or **PATCH**.
