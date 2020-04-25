const format = new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD",
      minimumFractionDigits: 2 }).format;

class ItemFactory {
    constructor (plays) {
        this.plays = plays;
    }
    static with(plays) {
        return (new ItemFactory(plays));
    }
    makeItem (performance = null) {
        const play = this.plays[performance.playID];
        switch (play.type) {
            case "tragedy":
                return new TragedyItem(play, performance);
            case "comedy":
                return new ComedyItem(play, performance);
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
    }
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

function statement (invoice, plays) {
    const items = invoice.performances.map(performance => ItemFactory.with(plays).makeItem(performance));

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

    function generateTextReceipt() {
        let result = `Statement for ${invoice.customer}\n`;
        result += getLineItems();
        result += `Amount owed is ${format(getTotalAmount() / 100)}\n`;
        result += `You earned ${(getTotalVolumeCredits())} credits\n`;
        return result;
    }

    return generateTextReceipt();
}

module.exports = statement;
