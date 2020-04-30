function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format;

  function addVolumeCredits(performance) {
    volumeCredits += Math.max(performance.audience - 30, 0);
  }

  function addExtraCreditForComedy(play, performance) {
    if ("comedy" === play.type) volumeCredits += Math.floor(performance.audience / 5);
  }

  function printLineForOrder(play, thisAmount, performance) {
    result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
  }

  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    let thisAmount = 0;
    switch (play.type) {
      case "tragedy":
        thisAmount = 40000;
        if (performance.audience > 30) {
          thisAmount += 1000 * (performance.audience - 30);
        }
        break;
      case "comedy":
        thisAmount = 30000;
        if (performance.audience > 20) {
          thisAmount += 10000 + 500 * (performance.audience - 20);
        }
        thisAmount += 300 * performance.audience;
        break;
      default:
        throw new Error(`unknown type: ${play.type}`);
    }
    addVolumeCredits(performance);

    addExtraCreditForComedy(play, performance);

    printLineForOrder(play, thisAmount, performance);
    totalAmount += thisAmount;
  }
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

module.exports = statement;
