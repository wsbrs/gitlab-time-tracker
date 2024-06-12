const config = require('./../../src/models/time');
const expect = require('chai').expect;

describe('time class', () => {
    it('Formats numbers', () => {
        expect((new Number(1)).padLeft(2, "0")).to.equal('01');
        expect((new Number(12)).padLeft(2, "0")).to.equal('12');
        expect((new Number(123)).padLeft(2, "0")).to.equal('123');
        expect((new Number(1234)).padLeft(2, "0")).to.equal('1234');
    });
});

