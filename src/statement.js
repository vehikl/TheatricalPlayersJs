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
    return ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
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

  function getTotalAmount() {
    let result = 0;
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      const thisAmount = getAmount(play, performance);
      result += thisAmount;
    }
    return result;
  }

  function getVolumeCredits() {
    let credits = 0;
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      credits += addVolumeCredits(performance, play);
    }

    return credits;
  }

  function getLineItems() {
    let result = '';
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      const thisAmount = getAmount(play, performance);
      result += printLineForOrder(play, thisAmount, performance);
    }
    return result;
  }

  function getTextReceipt() {
    let result = `Statement for ${invoice.customer}\n`;
    result += getLineItems();
    result += `Amount owed is ${format(getTotalAmount() / 100)}\n`;
    result += `You earned ${(getVolumeCredits())} credits\n`;
    return result;
  }

  return getTextReceipt();
}

function htmlStatement(invoice, plays) {

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
    return ` <b>${play.name}:</b> ${format(thisAmount / 100)} (${performance.audience} seats)<br>\n`;
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

  function getTotalAmount() {
    let result = 0;
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      const thisAmount = getAmount(play, performance);
      result += thisAmount;
    }
    return result;
  }

  function getVolumeCredits() {
    let credits = 0;
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      credits += addVolumeCredits(performance, play);
    }

    return credits;
  }

  function getLineItems() {
    let result = '';
    for (let performance of invoice.performances) {
      const play = plays[performance.playID];
      const thisAmount = getAmount(play, performance);
      result += printLineForOrder(play, thisAmount, performance);
    }
    return result;
  }

  function getHtmlReceipt() {
    let result = `<div>\n<h1>Statement for ${invoice.customer}</h1>\n`;
    result += getLineItems();
    result += `Amount owed is ${format(getTotalAmount() / 100)}<br>\n`;
    result += `You earned ${(getVolumeCredits())} credits\n</div>`;
    return result;
  }

  return getHtmlReceipt();
}


module.exports = {
  statement,
  htmlStatement
};
