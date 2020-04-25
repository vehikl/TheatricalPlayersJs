const format = new Intl.NumberFormat("en-US",
  { style: "currency", currency: "USD",
      minimumFractionDigits: 2 }).format;

class PlayFactory {
    static makePlay (play) {
        switch (play.type) {
            case "tragedy":
                return new TragedyPlay(play);
            case "comedy":
                return new ComedyPlay(play);
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
    }
}

class Play {
    constructor (play) {
        this.play = play;
    }
    getAmount (audience) {throw new Error ('not implemented')}
    getVolumeCredits (perf) {throw new Error ('not implemented')}
    getLineItem (audience) {
        return ` ${this.play.name}: ${format(this.getAmount(audience) / 100)} (${audience} seats)\n`
    }
}

class TragedyPlay extends Play {
    getAmount(audience) {
        let thisAmountA = 40000;
        if (audience > 30) {
            thisAmountA += 1000 * (audience - 30);
        }
        return thisAmountA;
    }

    getVolumeCredits(perf) {
        return Math.max(perf.audience - 30, 0);
    }
}

class ComedyPlay extends Play {
    getAmount(audience) {
        let thisAmount = 30000;
        if (audience > 20) {
            thisAmount += 10000 + 500 * (audience - 20);
        }
        thisAmount += 300 * audience;
        return thisAmount;
    }

    getVolumeCredits(perf) {
        return Math.max(perf.audience - 30, 0) + Math.floor(perf.audience / 5);
    }
}

function statement (invoice, plays) {
    function getTotalVolumeCredits() {
        return invoice.performances.reduce((totalCredits, performance) => {
            return totalCredits + PlayFactory.makePlay(plays[performance.playID]).getVolumeCredits(performance);
        }, 0);
    }

    function getTotalAmount() {
        return invoice.performances.reduce((total, performance) => {
            return total + PlayFactory.makePlay(plays[performance.playID]).getAmount(performance.audience);
        }, 0);
    }

    function getLineItems() {
        return invoice.performances.reduce((lineItems, performance) => {
            return lineItems + PlayFactory.makePlay(plays[performance.playID]).getLineItem(performance.audience);
        }, '');
    }

    let result = `Statement for ${invoice.customer}\n`;
    result += getLineItems();
    result += `Amount owed is ${format(getTotalAmount()/100)}\n`;
    result += `You earned ${(getTotalVolumeCredits())} credits\n`;
    return result;
}

module.exports = statement;
