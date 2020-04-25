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

    function getLineItem(play, thisAmount, perf) {
        return ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    }

    function getTotalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
            const play = plays[perf.playID];
            volumeCredits += PlayFactory.makePlay(play.type).getVolumeCredits(perf);
        }
        return volumeCredits;
    }

    function getTotalAmount() {
        let totalAmount = 0;
        for (let perf of invoice.performances) {
            const play = plays[perf.playID];
            let thisAmount = PlayFactory.makePlay(play.type).getAmount(perf.audience);
            totalAmount += thisAmount;
        }
        return totalAmount;
    }

    function getLineItems() {
        let lineItems = "";
        for (let perf of invoice.performances) {
            const play = plays[perf.playID];
            let thisAmount = PlayFactory.makePlay(play.type).getAmount(perf.audience);
            lineItems += getLineItem(play, thisAmount, perf);
        }
        return lineItems;
    }

    let result = `Statement for ${invoice.customer}\n`;
    result += getLineItems();
    result += `Amount owed is ${format(getTotalAmount()/100)}\n`;
    result += `You earned ${(getTotalVolumeCredits())} credits\n`;
    return result;
}

module.exports = statement;
