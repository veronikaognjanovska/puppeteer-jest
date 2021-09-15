/*
const { beforeEach, afterEach } = require('@jest/globals');
const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false
    });
    page = await browser.newPage();
    await page.goto('https://www.finki.ukim.mk/mk');
    const result = await page.evaluate(() => {
        const element = [...document.querySelectorAll('.leaf')].map(element => {
            return element.querySelector('a').innerText
        });
        console.log('Inside', element);
        return element;
    });
    console.log(result);
});

afterEach(async () => {
    await browser.close();
});


test('test home page', async () => {
    const url = await page.url();
    expect(url).toBe('https://www.finki.ukim.mk/mk');
});
*/


// const throwAnError = () => {
//     throw new Error('error');
// };
// test('throws an error', () => {
//     expect(() => {
//         throwAnError();
//     }).toThrow();
// });

const zero = () => {
    return 0;
};
test('to be zero', () => {
    expect(zero()).toBe(0);
});

// const add = (a, b) => {
//     return a + b;
// };
// test.concurrent.each([
//     [1, 1, 2],
//     [1, 2, 3],
//     [2, 1, 3],
// ])('add(%i, %i)', async (a, b, expected) => {
//     expect(add(a, b)).toBe(expected);
// });
