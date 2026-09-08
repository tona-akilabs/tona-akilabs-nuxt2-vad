import * as process from 'node:process';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { execSync } from 'node:child_process';
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

const MAYOR_VERSION = pkg.version.split('.')[0];

// Paths for ESLint to check. Converted to string for convenience.
const ESLINT_PATHS = [
    'eslint.config.mjs',
    'jest.config.mjs',
    'npm-scripts.mjs',
    'src',
].join(' ');

// Paths for ESLint to ignore. Converted to string argument for convenience.
const ESLINT_IGNORE_PATTERN_ARGS = []
    .map(entry => `--ignore-pattern ${entry}`)
    .join(' ');

// Paths for Prettier to check/write. Converted to string for convenience.
const PRETTIER_PATHS = [
    'README.md',
    'eslint.config.mjs',
    'jest.config.mjs',
    'npm-scripts.mjs',
    'package.json',
    'tsconfig.json',
    'src',
].join(' ');

const task = process.argv[2];
const taskArgs = process.argv.slice(3).join(' ');

run();

async function run() {
    logInfo(taskArgs ? `[args:"${taskArgs}"]` : '');

    switch (task) {
        // As per NPM documentation (https://docs.npmjs.com/cli/v9/using-npm/scripts)
        // `prepare` script:
        //
        // - Runs BEFORE the package is packed, i.e. during `npm publish` and
        //   `npm pack`.
        // - Runs on local `npm install` without any arguments.
        // - NOTE: If a package being installed through git contains a `prepare`
        //   script, its dependencies and devDependencies will be installed, and
        //   the `prepare` script will be run, before the package is packaged and
        //   installed.
        //
        // So here we compile TypeScript to JavaScript.
        case 'prepare': {
            buildRollup({ force: false });
            replaceVersion();

            break;
        }

        case 'rollup:build': {
            buildRollup({ force: true });
            replaceVersion();

            break;
        }

        case 'release': {
            release();

            break;
        }

        default: {
            logError('unknown task');

            exitWithError();
        }
    }
}

function replaceVersion() {
    logInfo('replaceVersion()');

    const files = fs.readdirSync('dist', {
        withFileTypes: true,
        recursive: true,
    });

    for (const file of files) {
        if (!file.isFile()) {
            continue;
        }

        // NOTE: dirent.path is only available in Node >= 20.
        const filePath = path.join(file.parentPath ?? 'dist', file.name);
        const text = fs.readFileSync(filePath, { encoding: 'utf8' });
        const result = text.replace(/__MEDIASOUP_CLIENT_VERSION__/g, pkg.version);

        fs.writeFileSync(filePath, result, { encoding: 'utf8' });
    }
}

function deleteLib() {
    if (!fs.existsSync('dist')) {
        return;
    }

    logInfo('deleteLib()');

    fs.rmSync('dist', { recursive: true, force: true });
}

function buildRollup(force) {
    if (!force && fs.existsSync('dist')) {
        return;
    }
    logInfo('buildRollup()')

    deleteLib();

    executeCmd('rollup -c')
}

function release() {
    logInfo('release()');

    executeCmd(`git commit -am '${pkg.version}'`);
    executeCmd(`git tag -a ${pkg.version} -m '${pkg.version}'`);
    executeCmd(`git push origin v${MAYOR_VERSION}`);
    executeCmd(`git push origin '${pkg.version}'`);
    executeInteractiveCmd('npm publish');
}

function executeCmd(command) {
    logInfo(`executeCmd(): ${command}`);

    try {
        execSync(command, { stdio: ['ignore', process.stdout, process.stderr] });
    } catch (error) {
        logError(`executeCmd() failed, exiting: ${error}`);

        exitWithError();
    }
}

function executeInteractiveCmd(command) {
    logInfo(`executeInteractiveCmd(): ${command}`);

    try {
        execSync(command, { stdio: 'inherit', env: process.env });
    } catch (error) {
        logError(`executeInteractiveCmd() failed, exiting: ${error}`);

        exitWithError();
    }
}

function logInfo(...args) {
    // eslint-disable-next-line no-undef
    console.log(`npm-scripts.mjs \x1b[36m[INFO] [${task}]\x1b[0m`, ...args);
}

// eslint-disable-next-line no-unused-vars
function logWarn(...args) {
    // eslint-disable-next-line no-undef
    console.warn(`npm-scripts.mjs \x1b[33m[WARN] [${task}]\x1b\0m`, ...args);
}

function logError(...args) {
    // eslint-disable-next-line no-undef
    console.error(`npm-scripts.mjs \x1b[31m[ERROR] [${task}]\x1b[0m`, ...args);
}

function exitWithError() {
    process.exit(1);
}