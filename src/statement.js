function getTragedyAmount(perf) {
    let thisAmountA = 40000;
    if (perf.audience > 30) {
        thisAmountA += 1000 * (perf.audience - 30);
    }
    return thisAmountA;
}

function getComedyAmount(perf) {
    let thisAmount = 30000;
    if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
    }
    thisAmount += 300 * perf.audience;
    return thisAmount;
}

function statement (invoice, plays) {
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;

    function getVolumeCredits(play, perf) {
        let result = 0;
        result += Math.max(perf.audience - 30, 0);
        if ("comedy" === play.type) result += Math.floor(perf.audience / 5);

        return result;
    }

    function getLineItem(play, thisAmount, perf) {
        return ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    }

    function getAmountForPlay(play, perf) {
        switch (play.type) {
            case "tragedy":
                return getTragedyAmount(perf);
            case "comedy":
                return getComedyAmount(perf);
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
    }

    function getTotalVolumeCredits() {
        let volumeCredits = 0;
        for (let perf of invoice.performances) {
            volumeCredits += getVolumeCredits(plays[perf.playID], perf);
        }
        return volumeCredits;
    }

    function getTotalAmount() {
        let totalAmount = 0;
        for (let perf of invoice.performances) {
            const play = plays[perf.playID];
            let thisAmount = getAmountForPlay(play, perf);
            totalAmount += thisAmount;
        }
        return totalAmount;
    }

    function getLineItems() {
        let lineItems = "";
        for (let perf of invoice.performances) {
            const play = plays[perf.playID];
            let thisAmount = getAmountForPlay(play, perf);
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
