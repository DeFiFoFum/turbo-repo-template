const readline = require('readline');
const { cloneAndSetupPackage } = require('./cloneAndSetupPackage');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the name for the new Hardhat contracts package: ', (packageName) => {
  const gitHubUrl = 'https://github.com/DeFiFoFum/hardhat-template.git';
  const workspaceDir = 'contracts'; // Adjust this as necessary

  cloneAndSetupPackage(gitHubUrl, packageName, workspaceDir, (error, message) => {
    if (error) {
      console.error(`An error occurred: ${error.message}`);
    } else {
      console.log(message);
      console.log('Run: yarn install to install dependencies');
      console.log('Happy coding!');
    }
    rl.close();
  });
});