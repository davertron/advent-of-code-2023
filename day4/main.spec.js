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
 * @param {string[]} winningNums 
 * @param {string[]} cardNums 
 * @returns number
 */
function getMatches(winningNums, cardNums) {
    let matches = 0;
    for (let winningNum of winningNums) {
        if (cardNums.indexOf(winningNum) !== -1) {
            matches++;
        }
    }
    return matches;
}

function getCardPoints(winningNums, cardNums) {
    const matches = getMatches(winningNums, cardNums);
    let points = 0;
    if (matches > 0) {
        points += Math.pow(2, matches - 1);
    }
    return points;
}

function partOne(input) {
    const lines = input.split('\n');
    let points = 0;

    for (let line of lines) {
        let [winningNumString, cardNumString] = line.split(' | ');
        winningNumString = winningNumString.replace(/Card\s+\d+\:\s+/, '');
        const winningNums = winningNumString.split(/\s+/);
        const cardNums = cardNumString.split(/\s+/);

        points += getCardPoints(winningNums, cardNums);
    }

    return points;
}

describe('Part one', () => {
    test('card points', () => {
        expect(getCardPoints([], [])).toBe(0);
        expect(getCardPoints([1], [])).toBe(0);
        expect(getCardPoints([], [1])).toBe(0);
        expect(getCardPoints([1], [1])).toBe(1);
    });

    test('Sample', () => {
        expect(partOne(sampleInput)).toBe(13);
    });

    test('Input', () => {
        expect(partOne(input)).toBe(28538);
    });
});

function getCard(line) {
    // @ts-ignore I'm not sure why JS doesn't think there will be a groups field here but there is...
    const { groups } = /Card\s+(?<cardNum>\d+)\:\s+(?<winningNumString>[^|]+)\s+\|\s+(?<cardNumString>.*)$/.exec(line);
    const winning = groups.winningNumString.split(/\s+/);
    const nums = groups.cardNumString.split(/\s+/);

    return {
        card: groups.cardNum,
        matches: getMatches(winning, nums),
        nums,
        winning,
    }
}

/**
 * 
 * @param {string} input 
 * @returns number
 */
function partTwo(input) {
    const lines = input.split('\n');
    const processedCards = [];
    const originalCardStack = [];
    for (let line of lines) {
        originalCardStack.push(getCard(line));
    }
    const cardsToProcess = [...originalCardStack];

    let nextCard;
    debugger;
    while (cardsToProcess.length > 0) {
        nextCard = cardsToProcess.pop();
        if (nextCard && nextCard.matches > 0) {
            for (let i = 0; i < nextCard.matches; i++) {
                cardsToProcess.push(originalCardStack[i + parseInt(nextCard.card, 10)]);
            }
        }
        processedCards.push(nextCard);
    }

    return processedCards.length;
};

describe('Part two', () => {
    test('getCard', () => {
        expect(getCard('Card 1: 1 | 1')).toEqual({ card: '1', winning: ['1'], nums: ['1'], matches: 1 });
        expect(getCard('Card 1: 1 10 | 1 10')).toEqual({ card: '1', winning: ['1', '10'], nums: ['1', '10'], matches: 2 });
    });

    test('Sample', () => {
        expect(partTwo(sampleInput)).toBe(30);
    });

    test('Input', () => {
        expect(partTwo(input)).toBe(9425061);
    });
});