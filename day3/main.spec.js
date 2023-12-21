// @ts-check
const fs = require('fs');
const { isSymbol } = require('util');

let input;
let sampleInput;
beforeAll(() => {
    input = fs.readFileSync(__dirname + '/input.txt', 'utf-8')
    sampleInput = fs.readFileSync(__dirname + '/sample.txt', 'utf-8')
});

function isSymbolFactory(data) {
    let maxRow = data.length - 1;
    let maxColumn = data[0].length - 1;
    return (row, column) => {
        if (row < 0 || row > maxRow || column < 0 || column > maxColumn) return false;

        return /[^\d\.]/.test(data[row][column]);
    }
}

// any number adjacent to a symbol, even diagonally, is a "part number" and
// should be included in your sum.
// Example:
// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
function partOne(input) {
    const lines = input.split('\n');
    let currentRow = 0;
    let currentColumn = 0;
    let maxRow = lines.length - 1;
    let maxColumn = lines[0].length - 1;

    let sum = 0;
    let currentNumString = null;
    let currentChar = null;
    let symbolFound = false;

    const isSymbol = isSymbolFactory(lines);

    // let currentWord = '';
    while (currentRow <= maxRow && currentColumn <= maxColumn) {
        currentChar = lines[currentRow][currentColumn];
        // Basically what we're going to do here is collect number digits as we
        // scan left to right and then also check above and below the digit char
        // for symbols to know if we need to include the number in our sum. The
        // two special cases here are that when we we need to also check for
        // diagonals, so when we encounter our first digit we need to scan the
        // previous space and the space above it and below it, unless it's the
        // first character on a line. We have to do something the same thing to
        // the right for the first non-digit character we find after we've been
        // scanning a number. And we need to make sure that if we hit the end of
        // the line and we have a current number value we were processing we
        // handle that case.
        if (/\d/.test(currentChar)) {
            // We have a digit
            if (currentNumString) {
                // We're in the middle or end of a number. If we haven't found a symbol
                // yet, then check above and below.
                if (!symbolFound) {
                    symbolFound = isSymbol(currentRow - 1, currentColumn) || isSymbol(currentRow + 1, currentColumn);
                }
                currentNumString += currentChar;
            } else {
                // This is the first digit encountered, so scan to the left as well
                // as above and below the current coordinate. Note that if symbolFound
                // is true here something isn't working
                if (symbolFound) throw new Error('symbolFound is true when first digit encountered');
                symbolFound =
                    isSymbol(currentRow, currentColumn - 1) ||  // left
                    isSymbol(currentRow - 1, currentColumn - 1) ||  // up left
                    isSymbol(currentRow - 1, currentColumn) ||  // up
                    isSymbol(currentRow + 1, currentColumn) || // down
                    isSymbol(currentRow + 1, currentColumn - 1); // down left
                currentNumString = currentChar;
            }
        } else {
            // We hit a non-digit char 
            if (currentNumString) {
                // We have a num string buffered
                if (symbolFound || isSymbol(currentRow, currentColumn) || isSymbol(currentRow - 1, currentColumn) || isSymbol(currentRow + 1, currentColumn)) {
                    // We hit a symbol during the scan, the current character is
                    // a symbol, or upper right or lower right is a symbol, so
                    // add the number to our sum.
                    sum += parseInt(currentNumString, 10);
                    // Reset 
                    symbolFound = false;
                }
                // Reset 
                currentNumString = null;
            }
        }
        // currentWord += currentChar;
        currentColumn++;
        if (currentColumn > maxColumn) {
            // TODO: This is the same as above, should refactor...
            if (currentNumString) {
                // We have a num string buffered
                if (symbolFound) {
                    // We hit a symbol during the scan, so add the number to our sum.
                    sum += parseInt(currentNumString, 10);
                    // Reset 
                    symbolFound = false;
                }
                // Reset 
                currentNumString = null;
            }
            // End TODO

            // Reset
            currentColumn = 0;
            currentRow++;
        }
    }
    return sum;
}


function parseNums(line) {
    const nums = line.replace(/[^\d]+/g, '|').replace(/^\||\|$/g, '').split('|').filter(n => n).map(n => parseInt(n, 10));
    return nums.reduce((acc, num) => {
        acc.push({
            n: num,
            r: [
                line.indexOf(num),
                line.indexOf(num) + num.toString().length - 1
            ]
        });
        // This is kind of janky and stupid but handles the edge case
        // of having the same number multiple times on a line...
        line = line.replace(num, num.toString().replace(/\d/g, '.'));
        return acc;
    }, []);
}

test('parseNums', () => {
    const line = '...123...456...';
    expect(parseNums(line)).toEqual([
        { n: 123, r: [3, 5] },
        { n: 456, r: [9, 11] }
    ]);
    const sameNum = '..123..123..';
    expect(parseNums(sameNum)).toEqual([
        { n: 123, r: [2, 4] },
        { n: 123, r: [7, 9] }
    ]);

    expect(parseNums('')).toEqual([]);

    const subNum = '.42.2';
    expect(parseNums(subNum)).toEqual([
        { n: 42, r: [1, 2] },
        { n: 2, r: [4, 4] }
    ]);
});

function partTwo(input) {
    const lines = input.split('\n');
    let sum = 0;
    for (let row = 0; row < lines.length; row++) {
        let cline = lines[row];
        let pline = row > 0 ? lines[row - 1] : null;
        let nline = row < lines.length - 1 ? lines[row + 1] : null;

        let possibleGearIndicies = [];
        for (let i = 0; i < cline.length; i++) if (cline[i] == "*") possibleGearIndicies.push(i);

        let nums = [];
        if (pline) nums = nums.concat(parseNums(pline));
        nums = nums.concat(parseNums(cline));
        if (nline) nums = nums.concat(parseNums(nline));
        for (let possibleGearIndex of possibleGearIndicies) {
            const adjacentNums = [];
            for (let n of nums) {
                let [min, max] = n.r;
                if (possibleGearIndex >= min - 1 && possibleGearIndex <= max + 1) {
                    adjacentNums.push(n.n);
                }
            }
            if (adjacentNums.length === 2) {
                sum += adjacentNums[0] * adjacentNums[1];
            }
        }
    }
    return sum;
}

test('isSymbol', () => {
    const lines = sampleInput.split('\n');
    const isSymbol = isSymbolFactory(lines);
    expect(isSymbol(0, 0)).toBe(false);
    expect(lines[1][3]).toBe('*');
    expect(isSymbol(1, 3)).toBe(true);
    expect(lines[3][6]).toBe('#');
    expect(isSymbol(3, 6)).toBe(true);
    expect(lines[8][3]).toBe('$');
    expect(isSymbol(8, 3)).toBe(true);
});

describe('Part one', () => {

    test('Symbols above', () => {
        //...$.*....
        //.664.598..'
        let testInput = '...$.*....\n.664.598..'
        expect(partOne(testInput)).toBe(664 + 598);
    });

    test('Symbols below', () => {
        //.664.598..'
        //...$.*....
        let testInput = '.664.598..\n...$.*....'
        expect(partOne(testInput)).toBe(664 + 598);
    });

    test('Symbols on ends', () => {
        //$664.598*.'
        let testInput = '$664.598*'
        expect(partOne(testInput)).toBe(664 + 598);
    });

    test('Symbols diagonal below', () => {
        //.664.598..'
        //$.......*.
        let testInput = '.664.598..\n$.......*.'
        expect(partOne(testInput)).toBe(664 + 598);
    });

    test('Symbols diagonal above', () => {
        //$.......*.
        //.664.598..'
        let testInput = '$.......*.\n.664.598..'
        expect(partOne(testInput)).toBe(664 + 598);
    });

    test('Sample', () => {
        expect(partOne(sampleInput)).toBe(4361);
    });

    test('Real input', () => {
        expect(partOne(input)).toBe(532445);
    });
});

describe('part two', () => {
    test('No Gear, only adjacent to one num', () => {
        //$.......*.
        //.664.598..
        let testInput = '$.......*.\n.664.598..'
        expect(partTwo(testInput)).toBe(0);
    });

    test('One gear above', () => {
        //$...*...*.
        //.664.598..
        let testInput = '$...*...*.\n.664.598..'
        expect(partTwo(testInput)).toBe(664 * 598);
    });

    test('One gear below', () => {
        //.664.598..
        //$...*...*.
        let testInput = '.664.598..\n$...*...*.'
        expect(partTwo(testInput)).toBe(664 * 598);
    });

    test('One gear between', () => {
        //.664*598...
        let testInput = '.664*598'
        expect(partTwo(testInput)).toBe(664 * 598);
    });

    test('One gear first char', () => {
        //*664.
        //.598.
        let testInput = '*664.\n.598.'
        expect(partTwo(testInput)).toBe(664 * 598);
    });

    test('One gear last char', () => {
        //.664*
        //.598.
        let testInput = '.664*\n.598.'
        expect(partTwo(testInput)).toBe(664 * 598);
    });

    test('No gear because three adjacent nums', () => {
        //.664*123
        //.598....
        let testInput = '.664*123\n.598....'
        expect(partTwo(testInput)).toBe(0);
    });

    test('Same number is part of multiple gears', () => {
        //.664*123*456.
        let testInput = '.664*123*456.'
        expect(partTwo(testInput)).toBe(664 * 123 + 123 * 456);
    });

    test('One digit numbers work', () => {
        //.2*2.
        let testInput = '.2*2.'
        expect(partTwo(testInput)).toBe(4);
    });

    test('Numbers with weird characters parse correctly', () => {
        //.@2*2$.
        let testInput = '.@2*2$.'
        expect(partTwo(testInput)).toBe(4);
    });

    test('Whatever', () => {
        //.862*2..
        // "..................243...927*.........29*293........645*.......862*2...........................=............*.....................*..$......."
        let testInput = '..................243...927*.........29*293........645*.......862*2...........................=............*.....................*..$.......'
        expect(partTwo(testInput)).toBe(29 * 293 + 862 * 2);
    });

    test('Sample', () => {
        expect(partTwo(sampleInput)).toBe(467835);
    });

    test('Real input', () => {
        // 78845357 is too low
        expect(partTwo(input)).toBe(79842967);
    });
});
