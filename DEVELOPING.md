# Pancake developing

## Set up

Set up the right Node version:

    nvm use

Install [Yarn](https://yarnpkg.com):

    npm i -g yarn

Install packages:

    yarn

## Build

    yarn build

## Develop

    cd packages/pancake
    yarn watch

## Publishing

Include a [Changeset](https://github.com/atlassian/changesets) with your changes:

    yarn changeset

Changes will be deployed in CI on merge to `main`, see './.github/workflows/publish.yml'.
