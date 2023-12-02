// @ts-check
const fs = require('fs');

let input;
let sampleInput;
beforeAll(() => {
    input = fs.readFileSync(__dirname + '/input.txt', 'utf-8')
    sampleInput = fs.readFileSync(__dirname + '/sample.txt', 'utf-8')
});

/**
 * 
 * @param {string} line 
 * @returns Object[]
 */
function parseLine(line) {
    line = line.replace(/^Game \d+: /, '');
    let subsets = line.split(';');
    return subsets.map(subset => {
        const redMatch = /(\d+) red/.exec(subset)?.[1];
        const greenMatch = /(\d+) green/.exec(subset)?.[1];
        const blueMatch = /(\d+) blue/.exec(subset)?.[1];
        return {
            red: redMatch ? parseInt(redMatch) : 0,
            green: greenMatch ? parseInt(greenMatch) : 0,
            blue: blueMatch ? parseInt(blueMatch) : 0,
        };
    });
}

test('parseLine', () => {
    expect(parseLine('Game 1: 3 red, 4 blue; 1 green, 2 red, 2 blue')).toStrictEqual([{
        red: 3,
        green: 0,
        blue: 4,
    }, {
        red: 2,
        green: 1,
        blue: 2,
    }]);
});

// Sum of games that are possible with only 12 red cubes, 13 green cubes, and 14 blue cubes
// Sample Game:
// Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
function partOne(input) {
    let numRed = 12;
    let numGreen = 13;
    let numBlue = 14;
    const lines = input.split('\n');
    let games = lines.map(parseLine);
    let sum = 0;
    games.forEach((game, i) => {
        for (let index in game) {
            let subset = game[index];
            if (subset.red > numRed || subset.green > numGreen || subset.blue > numBlue) {
                return false;
            }
        }
        sum += i + 1;
    });
    return sum;
}

// What is the fewest number of cubes of each color that could have been in the
// bag to make the game possible?
//
// The power of a set of cubes is equal to the numbers of red, green, and blue
// cubes multiplied together. The power of the minimum set of cubes in game 1 is
// 48. In games 2-5 it was 12, 1560, 630, and 36, respectively. Adding up these
// five powers produces the sum 2286.
function partTwo(input) {
    const lines = input.split('\n');
    let games = lines.map(parseLine);

    let sum = games.reduce((acc, game) => {
        let maxRed = 0;
        let maxGreen = 0;
        let maxBlue = 0;
        for (let index in game) {
            let subset = game[index];
            if (subset.red > maxRed) {
                maxRed = subset.red;
            }
            if (subset.blue > maxBlue) {
                maxBlue = subset.blue;
            }
            if (subset.green > maxGreen) {
                maxGreen = subset.green;
            }
        }

        return acc + maxRed * maxGreen * maxBlue;
    }, 0);

    return sum;
}

test('partOneSample', () => {
    expect(partOne(sampleInput)).toBe(8);
});

test('partOne', () => {
    expect(partOne(input)).toBe(2528);
});

test('partTwoSample', () => {
    expect(partTwo(sampleInput)).toBe(2286);
});

test('partTwo', () => {
    expect(partTwo(input)).toBe(67363);
});