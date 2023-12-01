// @ts-check
const fs = require('fs');

let input;
let testInput;
beforeAll(() => {
    input = fs.readFileSync(__dirname + '/input.txt', 'utf-8')
    testInput = fs.readFileSync(__dirname + '/testInput.txt', 'utf-8')
});

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const digitWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/**
 * 
 * @param {string} line 
 * @param {boolean} skipLetters
 * @returns {number}
 */
function getNumbers(line, skipLetters = false) {
    let firstDigit = null;
    let lastDigit = null;
    let minIndex = Infinity;
    let maxIndex = -1;
    for (let digit in digits) {
        let digitIndex = line.indexOf(digit);
        if (digitIndex === -1) continue;

        if (digitIndex < minIndex) {
            minIndex = line.indexOf(digit);
            firstDigit = digit;
        }
        if (line.lastIndexOf(digit) > maxIndex) {
            maxIndex = line.lastIndexOf(digit);
            lastDigit = digit;
        }
    }
    if (!skipLetters) {
        for (let index in digitWords) {
            let digitWord = digitWords[index];
            let digitWordIndex = line.indexOf(digitWord);
            if (digitWordIndex === -1) continue;

            debugger;
            if (digitWordIndex < minIndex) {
                minIndex = digitWordIndex;
                firstDigit = index;
            }

            if (line.lastIndexOf(digitWord) > maxIndex) {
                maxIndex = line.lastIndexOf(digitWord);
                lastDigit = index;
            }
        }
    }

    return parseInt(`${firstDigit}${lastDigit}`);
}


/**
 * @param {string} input
 * @returns {number}
 * */
function partTwo(input) {
    return input.split('\n').reduce((acc, line) => {
        return acc + getNumbers(line);
    }, 0)
}

test('getNumbers', () => {
    debugger;
    expect(getNumbers('one')).toBe(11);
    expect(getNumbers('eightwothree')).toBe(83);
});

test('partOne', () => {
    const answer = input.split('\n').reduce((acc, line) => {
        let firstNumber = /^[^\d]*(\d)/.exec(line);
        let secondNumber = /.*(\d)[^\d]*$/.exec(line);
        if (!firstNumber?.[1] || !secondNumber?.[1])
            throw new Error(`could not parse numbers for line ${line}`)

        const value = parseInt(firstNumber[1] + secondNumber[1])
        return acc + value;
    }, 0)

    expect(answer).toBe(55621)
});

test('partOneAlt', () => {
    const answer = input.split('\n').reduce((acc, line) => {
        const allNums = line.replaceAll(/[^\d]/g, '');
        let firstNumber = allNums[0];
        let secondNumber = allNums[allNums.length - 1];
        if (!firstNumber || !secondNumber)
            throw new Error(`could not parse numbers for line ${line}`)

        const value = parseInt(firstNumber + secondNumber)
        return acc + value;
    }, 0)

    expect(answer).toBe(55621)
})

test('partOneGetNumbers', () => {
    const answer = input.split('\n').reduce((acc, line) => {
        const value = getNumbers(line, true);
        return acc + value;
    }, 0);

    expect(answer).toBe(55621)
});

test('partTwo', () => {
    const answer = partTwo(input);
    expect(answer).toBe(53592)
})

test('partTwoTestInput', () => {
    const answer = partTwo(testInput);
    expect(answer).toBe(281)
})
