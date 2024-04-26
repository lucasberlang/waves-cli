#! /usr/bin/env node
const chalk = require('chalk')
const boxen = require('boxen')
const yargs = require("yargs");
const { exec } = require('child_process');

const usage = chalk.keyword('violet')("\nUsage: waves <command> \n"
    + boxen(chalk.green("\n" + "Make your commands a lot more fun" + "\n"), { padding: 1, borderColor: 'green', dimBorder: true }) + "\n");

const args = process.argv.slice(2);
const command = args.join(' ');
if (args[0] === 'tsunami') {
    const numWaves = parseInt(args[1]) || 1;
    const height = 10;
    const length = 100;
    const amplitude = 5;
    const delay = 100;

    let waveCounter = 0;

    function executeNextWave() {
        if (waveCounter < numWaves) {
            const wave = createWave(height, length, amplitude);
            console.log('\n');
            animateWave(wave, delay, executeNextWave);
            waveCounter++;
        }
    }

    executeNextWave();
} else if (args[0] === 'help') { 
    yargs
        .usage(usage)
        .epilogue('For more information, visit https://github.com/lucasberlang/waves-cli.git')
        .version('version', 'Display the current version', 'Display the current version')
        .command('tsunami [numWaves]', 'Display an ASCII tsunami')
        .command('[command]', 'Any command you want to execute')
        .help(true)
        .argv;
} 
else if (command) {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        const height = 10;
        const length = 100;
        const amplitude = 5;
        const delay = 100;
        const wave = createWave(height, length, amplitude);
        animateWave(wave, delay, () => {
            console.log(chalk.green.bold('Command output: ') + stdout);
        });
    });
}  
else {
    const options = yargs
        .usage(usage)
        .help(true)
        .argv;

    console.log(usage);
}

function createWave(height, length, amplitude) {
    let wave = '';
    for (let i = 0; i < height; i++) {
        let waveLine = '';
        for (let j = 0; j < length; j++) {
            const y = Math.floor(amplitude * Math.sin((2 * Math.PI * j) / length) + amplitude);
            if (y === i) {
                waveLine += '~';
            } else {
                waveLine += ' ';
            }
        }
        wave += waveLine + '\n';
    }
    return wave;
}

function showUsage() {
    console.log(usage);
}

function animateWave(wave, delay, callback) {
    const lines = wave.split('\n');
    let counter = 0;
    const intervalId = setInterval(() => {
        if (counter >= lines.length) {
            clearInterval(intervalId);
            callback();
        } else {
            process.stdout.write(lines[counter] + '\n');
            counter++;
        }
    }, delay * 2);
    console.log(
        `
                                                                    O
                                                                   /|\\
                                                                   / \\
                                                                 --------
                                                                    `
      );
}