# Pancake developing 

## Set up 

Set up the right Node version: 

    nvm use
    
Install yarn 

    npm i -g yarn 
    
Install packages

    yarn 


## Publishing

Include a Changeset with your changes: 

    yarn feature
    
or 

    yarn changeset

Changes will be deployed in CI on merge to `main`, see './.github/workflows/publish.yml'.
