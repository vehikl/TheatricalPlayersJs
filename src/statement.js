class PlayFactory {
    static makePlay (type) {
        switch (type) {
            case "tragedy":
                return new TragedyPlay(type);
            case "comedy":
                return new ComedyPlay(type);
            default:
                throw new Error(`unknown type: ${type}`);
        }
    }
}

class Play {
    constructor (type) {
        this.type = type;
    }
    getAmount (audience) {throw new Error ('not implemented')}
    getVolumeCredits (perf) {throw new Error ('not implemented')}
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
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;

    function getTotalVolumeCredits() {
        return invoice.performances.reduce((totalCredits, performance) => {
            return totalCredits + PlayFactory.makePlay(plays[performance.playID].type).getVolumeCredits(performance);
        }, 0);
    }

    function getTotalAmount() {
        return invoice.performances.reduce((total, performance) => {
            let thisAmount = PlayFactory.makePlay(plays[performance.playID].type).getAmount(performance.audience);
            return total + thisAmount;
        }, 0);
    }

    function getLineItems() {
        return invoice.performances.reduce((lineItems, performance) => {
            let thisAmount = PlayFactory.makePlay(plays[performance.playID].type).getAmount(performance.audience);
            return lineItems + ` ${plays[performance.playID].name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
        }, '');
    }

    let result = `Statement for ${invoice.customer}\n`;
    result += getLineItems();
    result += `Amount owed is ${format(getTotalAmount()/100)}\n`;
    result += `You earned ${(getTotalVolumeCredits())} credits\n`;
    return result;
}

module.exports = statement;
