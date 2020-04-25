const format = new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD",
      minimumFractionDigits: 2 }).format;

class InvoiceItemFactory {
    static makeItem (play, performance = null) {
        switch (play.type) {
            case "tragedy":
                return new TragedyPlay(play, performance);
            case "comedy":
                return new ComedyPlay(play, performance);
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
    }
}

class Play {
    constructor (play, performance) {
        this.play = play;
        this.performance = performance;
    }
    getAmount () {throw new Error ('not implemented')}
    getVolumeCredits () {throw new Error ('not implemented')}
    getLineItem () {
        return ` ${this.play.name}: ${format(this.getAmount() / 100)} (${this.performance.audience} seats)\n`
    }
}

class TragedyPlay extends Play {
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

class ComedyPlay extends Play {
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
    const items = invoice.performances.map(performance => InvoiceItemFactory.makeItem(plays[performance.playID], performance));

    function getTotalVolumeCredits() {
        return items.reduce((totalCredits, performance) => {
            return totalCredits + performance.getVolumeCredits();
        }, 0);
    }

    function getTotalAmount() {
        return items.reduce((total, performance) => {
            return total + performance.getAmount();
        }, 0);
    }

    function getLineItems() {
        return items.reduce((lineItems, performance) => {
            return lineItems + performance.getLineItem();
        }, '');
    }

    let result = `Statement for ${invoice.customer}\n`;
    result += getLineItems();
    result += `Amount owed is ${format(getTotalAmount()/100)}\n`;
    result += `You earned ${(getTotalVolumeCredits())} credits\n`;
    return result;
}

module.exports = statement;
