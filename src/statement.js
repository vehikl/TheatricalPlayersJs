
function statement (invoice, plays) {
    const TRAGEDY_BASE_AMOUNT = 40000;
    const COMEDY_BASE_AMOUNT = 30000;

    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US",
        { style: "currency", currency: "USD",
            minimumFractionDigits: 2 }).format;

    function addVolumeCredits(performance) {
        volumeCredits += Math.max(performance.audience - 30, 0);
    }

    function addExtraCreditPerTenComedyAttendees(play, performance) {
        if ('comedy' === play.type) volumeCredits += Math.floor(performance.audience / 5);
    }

    function printLineForThisOrder(play, thisAmount, performance) {
        result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
    }

    function getTragedyAmount(performance) {
        let result = TRAGEDY_BASE_AMOUNT;
        if (performance.audience > 30) {
            result += 1000 * (performance.audience - 30);
        }
        return result;
    }

    function getComedyAmount(performance) {
        let result = COMEDY_BASE_AMOUNT;
        if (performance.audience > 20) {
            result += 10000 + 500 * (performance.audience - 20);
        }
        result += 300 * performance.audience;
        return result;
    }

    function handlePerformanceAmounts(play, performance) {
        switch (play.type) {
            case "tragedy":
                return getTragedyAmount(performance);
            case "comedy":
                return getComedyAmount(performance);
            default:
                throw new Error(`unknown type: ${play.type}`);
        }
    }

    for (let performance of invoice.performances) {
        const play = plays[performance.playID];
        let thisAmount = handlePerformanceAmounts(play, performance);

        addVolumeCredits(performance);
        addExtraCreditPerTenComedyAttendees(play, performance);
        printLineForThisOrder(play, thisAmount, performance);

        totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

module.exports = statement;
