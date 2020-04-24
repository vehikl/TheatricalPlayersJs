
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

    for (let performance of invoice.performances) {
        const play = plays[performance.playID];
        let thisAmount = 0;
        switch (play.type) {
            case "tragedy":
                thisAmount = TRAGEDY_BASE_AMOUNT;
                if (performance.audience > 30) {
                    thisAmount += 1000 * (performance.audience - 30);
                }
                break;
            case "comedy":
                thisAmount = COMEDY_BASE_AMOUNT;
                if (performance.audience > 20) {
                    thisAmount += 10000 + 500 * (performance.audience - 20);
                }
                thisAmount += 300 * performance.audience;
                break;
            default:
                throw new Error(`unknown type: ${play.type}`);
        }

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
