const { beforeEach, afterEach, describe, test } = require('@jest/globals');
const puppeteer = require('puppeteer');
const fs = require('fs');

let browser, page;
const width = 1280, height = 800;
const path = 'images/';

const bookViewObject = {
    'Book name': 'Harry Potter and the Chamber of Secrets',
    Category: 'FANTASY',
    Author: 'J. K. Rowling',
    'Author from': 'Great Britain - Europe',
    'Number Available Copies': '3'
};
const bookEditObject = {
    'Book name': 'Harry Potter and the Philosopher\'s Stone',
    Category: 'FANTASY',
    Author: 'J. K. Rowling',
    'Number Available Copies': '2'
};
const bookEditObject2 = {
    'Book name': 'Sense and Sensibility',
    Category: 'CLASSICS',
    Author: 'Jane Austen',
    'Number Available Copies': '2'
};
const bookAddObject = {
    'Book name': 'Pride and Prejudice',
    Category: 'CLASSICS',
    Author: 'Jane Austen',
    'Number Available Copies': '2'
};
const bookEmptyObject = {
    'Book name': '',
    Category: 'Choose here',
    Author: 'Choose here',
    'Available Copies': ''
};

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: true
    });
    page = await browser.newPage();
    await page.setViewport({ width: width, height: height })
    await page.goto('http://localhost:3000/books');
});

afterEach(async () => {
    await browser.close();
});


describe('Header', () => {
    test('Left Title', async () => {
        const result = await page.evaluate(() => {
            return document.querySelector('header span').innerText;
        });
        expect(result).toBe('Library');
    });
    test('Right Buttons Text', async () => {
        const result = await page.evaluate(() => {
            return [...document.querySelectorAll('header a')]
                .map(element => element.innerText);
        });
        expect(result).toEqual(['Books', 'Categories']);
    });
    test('Right Buttons Link', async () => {
        await page.click('header .btn.btn-outline-light:last-of-type');
        await page.waitForSelector('.categories');
        const url1 = await page.url();
        expect(url1).toBe('http://localhost:3000/categories');
        await page.click('header .btn.btn-outline-light:first-of-type');
        await page.waitForSelector('.books');
        const url2 = await page.url();
        expect(url2).toBe('http://localhost:3000/books');
    });
    test('Screenshot', async () => {
        screenshot = path + 'header.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 0, 'y': 0, 'width': width, 'height': 55 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
});// end describe 'Header'


describe('Books', () => {
    test('Heading List of Books', async () => {
        const result = await page.evaluate(() => {
            return document.querySelector('.books h1').innerText;
        });
        expect(result).toBe('List of Books');
    });
    test('Table Heading', async () => {
        const result = await page.evaluate(() => {
            return [...document.querySelectorAll('.books table thead th')]
                .map(element => element.innerText);
        });
        expect(result).toEqual(['ID', 'Book Name', 'Book Category', 'Author Name', 'Available Copies', '']);
    });
    test('Table Body First 2 Elements', async () => {
        const result = await page.evaluate(() => {
            return [...document.querySelectorAll('.books table tbody tr')]
                .map(element => {
                    return [...element.querySelectorAll('td')].map(td => td.innerText)
                });
        });
        expect(result).toHaveLength(2);
        expect(result[0]).toHaveLength(6);
        expect(result).toEqual([['9', 'Harry Potter and the Philosopher\'s Stone', 'FANTASY', 'J. K. Rowling', '2', 'ViewEditDelete'], ['10', 'Harry Potter and the Chamber of Secrets', 'FANTASY', 'J. K. Rowling', '3', 'ViewEditDelete']]);
    });
    test('Pagination', async () => {
        const result = await page.evaluate(() => {
            return [...document.querySelectorAll('.pagination li')]
                .map(element => element.querySelector('a').innerText);
        });
        expect(result.length).toBeGreaterThanOrEqual(2);
        expect(result[0]).toEqual('back');
        expect(result[result.length - 1]).toEqual('next');
    });
    test('Screenshot', async () => {
        screenshot = path + 'books.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 0, 'y': 55, 'width': width, 'height': height - 60 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
});// end describe 'Books'


describe('Categories', () => {
    beforeEach(async () => {
        // clicks the first button, first book
        await page.click('.btn.btn-outline-light:last-of-type');
        await page.waitForSelector('.categories');
    });
    test('Heading', async () => {
        const result = await page.evaluate(() => {
            return document.querySelector('.categories h1').innerText;
        });
        expect(result).toBe('List of Categories');
    });
    test('Table Heading', async () => {
        const result = await page.evaluate(() => {
            return document.querySelector('.categories table thead th').innerText;
        });
        expect(result).toBe('Categories');
    });
    test('Elements', async () => {
        const result = await page.evaluate(() => {
            return [...document.querySelectorAll('.categories table tbody tr td')]
                .map(element => element.innerText);
        });
        expect(result).toHaveLength(7);
        expect(result).toEqual(['NOVEL', 'THRILER', 'HISTORY', 'FANTASY', 'BIOGRAPHY', 'CLASSICS', 'DRAMA']);
    });
    test('Screenshot', async () => {
        screenshot = path + 'categories.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 0, 'y': 55, 'width': width, 'height': height - 60 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
});// end describe 'Categories'


describe('View Book', () => {
    beforeEach(async () => {
        // clicks the first button, first book
        await page.click('table tbody tr:last-of-type .view-btn');
        await page.waitForSelector('.book-view');
    });
    test('View Button', async () => {
        const heading = await page.evaluate(() => {
            return document.querySelector('.book-view h1').innerText;
        });
        expect(heading).toBe('Book Info');
    });
    test('View Inputs', async () => {
        const result = await page.evaluate(() => {
            let object = {};
            [...document.querySelectorAll('.book-view .form-group')]
                .forEach(element => {
                    let label = element.querySelector('label').innerText;
                    let input = element.querySelector('input').value;
                    object[label] = input;
                });
            return object;
        });
        expect(result).toMatchObject(bookViewObject);
    });
    test('Back Button', async () => {
        await page.click('.btn.btn-outline-primary');
        await page.waitForSelector('.books');
        const url = await page.url();
        expect(url).toBe('http://localhost:3000/books');
    });
    test('Screenshot Inputs', async () => {
        screenshot = path + 'view-inputs.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 250, 'y': 55, 'width': width - 500, 'height': 600 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
    test('Screenshot Buttons', async () => {
        screenshot = path + 'view-buttons-title.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 0, 'y': 70, 'width': width, 'height': 90 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
    describe('Book Print', () => {
        test('Table Heading', async () => {
            const result = await page.evaluate(() => {
                return [...document.querySelectorAll('.book-view table thead th')]
                    .map(element => element.innerText);
            });
            expect(result).toEqual(['ID', 'Bookprint status', '']);
        });
        test('Elements', async () => {
            const result = await page.evaluate(() => {
                return [...document.querySelectorAll('.book-view table tbody tr')]
                    .map(element => {
                        return [...element.querySelectorAll('td')].map(td => td.innerText)
                    });
            });
            expect(result).toHaveLength(3);
            expect(result[0]).toHaveLength(3);
            expect(result).toEqual([['34', 'AVAILABLE', 'Mark As TakenDelete'], ['35', 'AVAILABLE', 'Mark As TakenDelete'], ['38', 'AVAILABLE', 'Mark As TakenDelete']]);
        });
        test('Mark As Taken/Returned', async () => {
            await page.click('.btn.btn-outline-info');
            await page.waitForSelector('.notification');
            const result1 = await page.evaluate(() => {
                let notification = document.querySelector('.notification');
                let title = notification.querySelector('.notification__title').innerText;
                let message = notification.querySelector('.notification__message').innerText;
                return [title, message];
            });
            expected1 = ['Success!', 'Book Print marked as taken successfully!'];
            expect(result1).toEqual(expect.arrayContaining(expected1));
            await page.waitForTimeout(6000);
            await page.click('.btn.btn-info');
            await page.waitForSelector('.notification');
            const result2 = await page.evaluate(() => {
                let notification = document.querySelector('.notification');
                let title = notification.querySelector('.notification__title').innerText;
                let message = notification.querySelector('.notification__message').innerText;
                return [title, message];
            });
            expected2 = ['Success!', 'Book Print marked as returned successfully!'];
            expect(result2).toEqual(expect.arrayContaining(expected2));
        }, 15000);
        test('Add/Delete Book Print', async () => {
            await page.click('.btn.btn-outline-success');
            await page.waitForSelector('.notification');
            const result1 = await page.evaluate(() => {
                let notification = document.querySelector('.notification');
                let title = notification.querySelector('.notification__title').innerText;
                let message = notification.querySelector('.notification__message').innerText;
                return [title, message];
            });
            expected1 = ['Success!', 'Book Print added successfully!'];
            expect(result1).toEqual(expect.arrayContaining(expected1));
            const result2 = await page.evaluate(() => {
                return document.querySelectorAll('.book-view table tbody tr').length;
            });
            expect(result2).toBe(4);
            await page.waitForTimeout(6000);
            await page.click('table tbody tr:last-of-type .btn-outline-danger');
            await page.waitForSelector('.notification');
            const result3 = await page.evaluate(() => {
                let notification = document.querySelector('.notification');
                let title = notification.querySelector('.notification__title').innerText;
                let message = notification.querySelector('.notification__message').innerText;
                let length = document.querySelectorAll('.book-view table tbody tr').length;
                return [title, message, length];
            });
            expected3 = ['Warning!', 'Book Print deleted successfully!'];
            expect(result3).toEqual(expect.arrayContaining(expected3));
            expect(result3[2]).toEqual(3);
        }, 15000);
        test('Screenshot', async () => {
            screenshot = path + 'view-book-prints.png';
            await page.screenshot({
                path: screenshot,
                'clip': { 'x': 0, 'y': 620, 'width': width, 'height': 300 }
            });
            new Promise((resolve) => {
                fs.access(screenshot, fs.constants.F_OK, (err) => {
                    err ? resolve(false) : resolve(true);
                });
            }).then(screenshotMade => {
                expect(screenshotMade).toBeTruthy();
            });
        });
    }); // end describe 'Book Print'
});// end describe 'View Book'


describe('Edit Book', () => {
    beforeEach(async () => {
        // clicks the first button, first book
        await page.click('.btn.edit-btn');
        await page.waitForSelector('.book-edit');
    });
    test('Edit Button', async () => {
        const heading = await page.evaluate(() => {
            return document.querySelector('.book-edit h1').innerText;
        });
        expect(heading).toBe('Edit Book');
    });
    test('Back Button', async () => {
        await page.click('.btn.btn-outline-primary');
        await page.waitForSelector('.books');
        const url = await page.url();
        expect(url).toBe('http://localhost:3000/books');
    });
    test('Screenshot Inputs', async () => {
        screenshot = path + 'edit-inputs.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 250, 'y': 55, 'width': width - 500, 'height': 550 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
    test('Screenshot Back Button', async () => {
        screenshot = path + 'edit-back-button.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 0, 'y': 70, 'width': width, 'height': 90 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
    test('Submit Edit Data', async () => {
        // Edit Inputs
        const result1 = await page.evaluate(() => {
            let object = {};
            [...document.querySelectorAll('.book-edit .form-group')]
                .forEach(element => {
                    let label = element.querySelector('label').innerText;
                    let input = element.querySelector('input');
                    if (label === 'Book name') {
                        input = input.placeholder;
                    } else if (label === 'Number Available Copies') {
                        input = input.value;
                    } else {
                        input = element.querySelector('select option:checked').innerText;
                    }
                    object[label] = input;
                });
            return object;
        });
        expect(result1).toMatchObject(bookEditObject);
        // Submit Edit Data
        await page.waitForTimeout(5000);
        await page.focus('#name');
        page.keyboard.type(bookEditObject2['Book name']);
        await page.waitForTimeout(1000);
        await page.select('#category', bookEditObject2['Category']);
        await page.waitForTimeout(1000);
        await page.select('#author', '5');
        await page.waitForTimeout(1000);
        await page.click('button[type="submit"]');
        const url = await page.url();
        expect(url).toBe('http://localhost:3000/books');
        await page.waitForTimeout(5000);
        const result2 = await page.evaluate(() => {
            return [...document.querySelectorAll('.books table tbody tr')]
                .map(element => {
                    return [...element.querySelectorAll('td')].map(td => td.innerText)
                });
        });
        await page.waitForTimeout(5000);
        expect(result2).toEqual([['9', 'Sense and Sensibility', 'CLASSICS', 'Jane Austen', '2', 'ViewEditDelete'], ['10', 'Harry Potter and the Chamber of Secrets', 'FANTASY', 'J. K. Rowling', '3', 'ViewEditDelete']]);
        // return data values back
        await page.waitForTimeout(5000);
        await page.click('.btn.edit-btn');
        await page.waitForSelector('.book-edit');
        await page.focus('#name');
        page.keyboard.type(bookEditObject['Book name']);
        await page.select('#category', bookEditObject['Category']);
        await page.select('#author', '4');
        await page.waitForTimeout(1000);
        await page.click('button[type="submit"]');
    }, 30000);
});// end describe 'Edit Book'


describe('Add/Delete Book', () => {
    beforeEach(async () => {
        // clicks the first button, first book
        await page.click('.btn.add-btn');
        await page.waitForSelector('.book-add');
    });
    test('Add Button', async () => {
        const heading = await page.evaluate(() => {
            return document.querySelector('.book-add h1').innerText;
        });
        expect(heading).toBe('Add Book');
    });
    test('Add Inputs', async () => {
        const result = await page.evaluate(() => {
            let object = {};
            [...document.querySelectorAll('.book-add .form-group')]
                .forEach(element => {
                    let label = element.querySelector('label').innerText;
                    let input = element.querySelector('input');
                    if (input != null) {
                        input = input.value;
                    } else {
                        input = element.querySelector('select option:checked').innerText;
                    }
                    object[label] = input;
                });
            return object;
        });
        expect(result).toMatchObject(bookEmptyObject);
    });
    test('Back Button', async () => {
        await page.click('.btn.btn-outline-primary');
        await page.waitForSelector('.books');
        const url = await page.url();
        expect(url).toBe('http://localhost:3000/books');
    });
    test('Screenshot Inputs', async () => {
        screenshot = path + 'add-inputs.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 250, 'y': 55, 'width': width - 500, 'height': 550 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
    test('Screenshot Back Button', async () => {
        screenshot = path + 'add-back-button.png';
        await page.screenshot({
            path: screenshot,
            'clip': { 'x': 0, 'y': 70, 'width': width, 'height': 90 }
        });
        new Promise((resolve) => {
            fs.access(screenshot, fs.constants.F_OK, (err) => {
                err ? resolve(false) : resolve(true);
            });
        }).then(screenshotMade => {
            expect(screenshotMade).toBeTruthy();
        });
    });
    test('Submit and Delete New Data', async () => {
        await page.waitForTimeout(1000);
        await page.focus('#name');
        page.keyboard.type(bookAddObject['Book name']);
        await page.waitForTimeout(1000);
        await page.select('#category', bookAddObject['Category']);
        await page.waitForTimeout(1000);
        await page.select('#author', '5');
        await page.waitForTimeout(1000);
        await page.focus('#availableCopies');
        page.keyboard.type(bookAddObject['Number Available Copies']);
        await page.waitForTimeout(1000);
        await page.click('button[type="submit"]');
        await page.waitForTimeout(1000);
        await page.waitForSelector('.books');
        const url = await page.url();
        expect(url).toBe('http://localhost:3000/books');
        await page.click('.pagination li.next a');
        await page.waitForTimeout(1000);
        const result1 = await page.evaluate(() => {
            return [...document.querySelectorAll('.books table tbody tr')]
                .map(element => {
                    return [...element.querySelectorAll('td')].map(td => td.innerText)
                });
        });
        expected1 = [['11', 'A Long Petal of the Sea', 'NOVEL', 'Isabel Allende', '2', 'ViewEditDelete'],
        [expect.stringMatching(/\d+/), 'Pride and Prejudice', 'CLASSICS', 'Jane Austen', '2', 'ViewEditDelete']];
        expect(result1).toEqual(expected1);
        await page.waitForSelector('.notification');
        const result2 = await page.evaluate(() => {
            let notification = document.querySelector('.notification');
            let title = notification.querySelector('.notification__title').innerText;
            let message = notification.querySelector('.notification__message').innerText;
            return [title, message];
        });
        expected2 = ['Success!', 'Book added successfully!'];
        expect(result2).toEqual(expect.arrayContaining(expected2));
        await page.waitForTimeout(6000);
        await page.click('table tbody tr:last-of-type .btn-outline-danger');
        await page.waitForTimeout(1000);
        const result3 = await page.evaluate(() => {
            return [...document.querySelectorAll('.books table tbody tr')]
                .map(element => {
                    return [...element.querySelectorAll('td')].map(td => td.innerText)
                });
        });
        expected3 = [['11', 'A Long Petal of the Sea', 'NOVEL', 'Isabel Allende', '2', 'ViewEditDelete']];
        expect(result3).toEqual(expected3);
        await page.waitForSelector('.notification');
        const result4 = await page.evaluate(() => {
            let notification = document.querySelector('.notification');
            let title = notification.querySelector('.notification__title').innerText;
            let message = notification.querySelector('.notification__message').innerText;
            return [title, message];
        });
        expected4 = ['Warning!', 'Book deleted successfully!'];
        expect(result4).toEqual(expect.arrayContaining(expected4));
    }, 15000);
});// end describe 'Add/Delete Book'
