const fs = require('fs');

let input;
beforeAll(() =>
    input = fs.readFileSync(__dirname + '/input.txt', 'utf-8')
);

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
        let secondNumber = allNums[allNums.length-1];
        if (!firstNumber || !secondNumber)
            throw new Error(`could not parse numbers for line ${line}`)

        const value = parseInt(firstNumber + secondNumber)
        return acc + value;
    }, 0)

    expect(answer).toBe(55621)
})
