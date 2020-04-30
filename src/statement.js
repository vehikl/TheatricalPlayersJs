function statement(invoice, plays) {

  const format = new Intl.NumberFormat("en-US",
    {
      style: "currency", currency: "USD",
      minimumFractionDigits: 2
    }).format;

  function addVolumeCredits(performance, play) {
    let credits =  Math.max(performance.audience - 30, 0);
    credits += addExtraCreditForComedy(play, performance);

    return credits;
  }

  function addExtraCreditForComedy(play, performance) {
    return ("comedy" === play.type) ? Math.floor(performance.audience / 5) : 0;
  }

  function printLineForOrder(play, thisAmount, performance) {
    result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
  }

  function getAmount(play, performance) {
    let thisAmount = 0
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
    return thisAmount
  }

  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;

  function getTotalAmount() {
    let result = 0;
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      const thisAmount = getAmount(play, performance);
      result += thisAmount;
    }
    return result;
  }

  const totalAmount = getTotalAmount();

  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    volumeCredits += addVolumeCredits(performance, play);
  }

  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    const thisAmount = getAmount(play, performance);
    printLineForOrder(play, thisAmount, performance);
  }

  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits\n`;
  return result;
}

module.exports = statement;
