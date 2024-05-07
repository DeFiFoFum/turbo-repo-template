# turbo-repo-template

> [!IMPORTANT]
> If you are setting up this template for the first time, please follow the setup steps in the dropdown below to ensure that the template is correctly configured.
<details>
  <summary>Template Setup Instructions</summary>
  
  1. Search and replace `turbo-repo-template` with the name of your repository.
  2. Search and replace `@org` with the organization of your repository. (Or remove if not needed)
     1. Some packages are prefixed with `@repo`, which may be changed to `@org` if needed, but it's kind of nice to keep them remove specific to the monorepo instead of a specific org.

  <!-- Feel free to add more steps or information as needed -->
</details>

## Setup

```bash
git clone https://github.com/DeFiFoFum/turbo-repo-template.git
cd turbo-repo-template
yarn install
```

## Usage

From the root directory, you can run the following commands:

```bash
yarn test # Run tests for all packages
yarn build # Build all packages
yarn lint # Lint all packages
yarn lerna:version[:no-push] # Run lerna version with or without pushing to git
yarn lerna:publish # Publish all public packages (package.json: "private": false)
yarn docker:build # Build the docker-compose file in the root composing the packages
yarn template:generic # Create a package from a template on GitHub
yarn template:hardhat # Create a contract package from @DeFiFoFum/hardhat-template
```
