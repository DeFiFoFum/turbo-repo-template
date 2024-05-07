/** 
 * This script automates the process of creating a new package from a github template within a monorepo setup.
 * 
 * Prerequisites:
 * - Node.js must be installed.
 * - The script assumes a monorepo setup with a lerna.json file at the root.
 * 
 * Usage:
 * 1. Ensure the PATH_TO_ROOT variable inside the script correctly points to the root of your monorepo.
 * 
 * Note:
 * - This script does not handle git submodules. It is designed for use in monorepos where all packages share
 *   the same git history.
 */
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const PATH_TO_ROOT = path.resolve(__dirname, '../..'); // Adjust this path as necessary

function getWorkspaceDirs(callback) {
    const packageJsonPath = path.join(PATH_TO_ROOT, 'package.json');
    fs.readFile(packageJsonPath, 'utf8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        try {
            const packageJson = JSON.parse(data);
            const workspaceDirs = packageJson.workspaces;
            if (workspaceDirs && Array.isArray(workspaceDirs)) {
                // Extract the directory names from the workspace patterns
                const dirs = workspaceDirs.map(dir => dir.split('/')[0]);
                // Filter out duplicates by converting to a Set and back to an array
                const uniqueDirs = [...new Set(dirs)];
                return callback(null, uniqueDirs);
            } else {
                return callback(new Error('Workspace directories not found in package.json'), null);
            }
        } catch (parseError) {
            return callback(parseError, null);
        }
    });
}

function cloneAndSetupPackage(gitHubUrl, packageName, workspaceDir, callback) {
    const workspacePath = path.join(PATH_TO_ROOT, workspaceDir);
    const packageDir = path.join(workspacePath, packageName);
    const cloneCommand = `git clone ${gitHubUrl} "${packageDir}"`;

    exec(cloneCommand, (cloneError) => {
        if (cloneError) {
            console.error(`Error cloning repository: ${cloneError}`);
            return callback(cloneError);
        }
        console.log(`Repository cloned into ${packageDir}`);

        // Delete the .git directory
        const gitDirPath = path.join(packageDir, '.git');
        fs.rmSync(gitDirPath, { recursive: true }, (rmError) => {
            if (rmError) {
                console.error('Error removing .git directory:', rmError);
                return callback(rmError);
            }
        });
        console.log('.git directory removed');

        const lernaConfigPath = path.join(PATH_TO_ROOT, 'lerna.json');
        const packageJsonPath = path.join(packageDir, 'package.json');

        if (!fs.existsSync(lernaConfigPath) || !fs.existsSync(packageJsonPath)) {
            const error = 'Error: Could not find lerna.json or package.json. Please check your PATH_TO_ROOT and try again.';
            console.error(error);
            return callback(new Error(error));
        }

        const lernaConfig = JSON.parse(fs.readFileSync(lernaConfigPath, 'utf8'));
        let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

        // Update package.json with the new package name and version
        packageJson.name = packageName;
        packageJson.version = lernaConfig.version;
        packageJson.private = true; // Set private to true by default, change to false if you want to publish

        // Reorder keys to ensure 'private' is under 'version'
        // const { scripts, ...restOfPackageJson } = packageJson;
        packageJson = { name: packageJson.name, version: packageJson.version, private: packageJson.private, ...packageJson };

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

        console.log(`Updated package.json for ${packageName}`);
        console.log('NOTE: Set private to false in package.json if you want to publish the package.');
        callback(null, `${packageName} setup completed successfully.`);
    });
}

module.exports = {
    cloneAndSetupPackage,
    getWorkspaceDirs
};