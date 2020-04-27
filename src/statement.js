const format = new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD",
      minimumFractionDigits: 2 }).format;

function getFactory () {
    let instance;
    class ItemFactory {
        constructor () {}

        setPlays(plays) {
            this.plays = plays;
            return this;
        }

        makeItem (performance = null) {
            const play = this.plays[performance.playID];
            switch (play.type) {
                case "tragedy":
                    return new TragedyItem(play, performance);
                case "comedy":
                    return new ComedyItem(play, performance);
                case "history":
                    return new HistoryItem(play, performance);
                case "pastoral":
                    return new PastoralItem(play, performance);
                default:
                    throw new Error(`unknown type: ${play.type}`);
            }
        }
    }

    if (!instance) {
        instance = new ItemFactory();
    }

    return instance;
}

class Item {
    constructor (play, performance) {
        this.play = play;
        this.performance = performance;
    }
    getAmount () {throw new Error ('not implemented')}
    getVolumeCredits () {throw new Error ('not implemented')}
    getLineItemText () {
        return ` ${this.play.name}: ${format(this.getAmount() / 100)} (${this.performance.audience} seats)\n`
    }
    getLineItemHtml () {
        return ` <tr><td>${this.play.name}</td><td>${format(this.getAmount() / 100)}</td><td>${this.performance.audience} seats</td></tr>\n`
    }
}

class HistoryItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmountA = 50000;
        if (audience > 30) {
            thisAmountA += 2000 * (audience - 30);
        }
        return thisAmountA;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 30, 0) + 5;
    }
}

class PastoralItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmountA = 2000;
        if (audience > 30) {
            thisAmountA += 500 * (audience - 10);
        }
        return thisAmountA;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 15, 0) + 50;
    }
}

class TragedyItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmountA = 40000;
        if (audience > 30) {
            thisAmountA += 1000 * (audience - 30);
        }
        return thisAmountA;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class ComedyItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmount = 30000;
        if (audience > 20) {
            thisAmount += 10000 + 500 * (audience - 20);
        }
        thisAmount += 300 * audience;
        return thisAmount;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 30, 0) + Math.floor(this.performance.audience / 5);
    }
}

function statement (invoice, plays, type = 'text') {
    const items = invoice.performances.map(performance => getFactory().setPlays(plays).makeItem(performance));

    function getTotalVolumeCredits() {
        return items.reduce((result, item) => {
            return result + item.getVolumeCredits();
        }, 0);
    }

    function getTotalAmount() {
        return items.reduce((result, item) => {
            return result + item.getAmount();
        }, 0);
    }

    function getLineItems() {
        return items.reduce((result, item) => {
            return result + item.getLineItemText();
        }, '');
    }

    function getHtmlLineItems() {
        return items.reduce((result, item) => {
            return result + item.getLineItemHtml();
        }, '');
    }

    function generateTextReceipt() {
        let result = `Statement for ${invoice.customer}\n`;
        result += getLineItems();
        result += `Amount owed is ${format(getTotalAmount() / 100)}\n`;
        result += `You earned ${(getTotalVolumeCredits())} credits\n`;
        return result;
    }

    function generateHtmlReceipt() {
        let result = `<h1>Statement for ${invoice.customer}</h1>\n`;
        result += ' <table>\n';
        result += ' <th><td>Play</td><td>Cost</td><td>Seats</td></th>\n';
        result += getHtmlLineItems();
        result += ' </table>\n'
        result += `<p>Amount owed is ${format(getTotalAmount() / 100)}</p>\n`;
        result += `<p>You earned ${(getTotalVolumeCredits())} credits</p>\n`;
        return result;
    }

    if (type === 'text') {
        return generateTextReceipt();
    } else if (type === 'html') {
        return generateHtmlReceipt();
    }
}

module.exports = statement;
