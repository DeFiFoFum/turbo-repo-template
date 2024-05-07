const readline = require('readline');
const { cloneAndSetupPackage, getWorkspaceDirs } = require('./cloneAndSetupPackage');
const fs = require('fs');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function checkIfGitHubRepoExists(url, callback) {
    exec(`git ls-remote ${url}`, (err) => {
        callback(err == null);
    });
}

function validateDirectoryExists(directory, callback) {
    fs.access(directory, fs.constants.F_OK, (err) => {
        callback(!err);
    });
}

function askForGitHubUrl(callback) {
    rl.question('Enter the GitHub URL for the template: ', (gitHubUrl) => {
        checkIfGitHubRepoExists(gitHubUrl, (exists) => {
            if (!exists) {
                console.error('The provided GitHub repository URL does not exist or is inaccessible.');
                rl.close();
            } else {
                callback(gitHubUrl);
            }
        });
    });
}

function askForWorkspaceDirectory(callback) {
    getWorkspaceDirs((err, workspaceDirs) => {
        if (err) {
            console.error(`An error occurred while fetching the workspace directory: ${err.message}`);
            rl.close();
            return;
        }

        rl.question(`Enter a valid workspace from the following options: ${workspaceDirs.join(', ')}: `, (inputWorkspaceDir) => {
            const trimmedInput = inputWorkspaceDir.trim();
            if (workspaceDirs.includes(trimmedInput)) {
                validateDirectoryExists(trimmedInput, (exists) => {
                    if (!exists) {
                        console.error(`Directory "${trimmedInput}" does not exist`);
                        rl.close();
                    } else {
                        callback(trimmedInput);
                    }
                });
            } else {
                console.error(`"${trimmedInput}" is not a valid workspace. Please choose from the following options: ${workspaceDirs.join(', ')}`);
                rl.close();
            }
        });
    });
}

function askForPackageName(callback) {
    rl.question('Enter the name for the new package: ', (packageName) => {
        callback(packageName.trim());
    });
}

function main() {
    askForGitHubUrl((gitHubUrl) => {
        askForWorkspaceDirectory((workspaceDir) => {
            askForPackageName((packageName) => {
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
        });
    });
}

main();