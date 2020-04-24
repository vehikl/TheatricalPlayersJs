
const format = new Intl.NumberFormat("en-US",{
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
}).format;

class InvoiceFactory {
  static toInvoice(performance, play) {
    switch(play.type) {
    case 'tragedy':
      return new TragedyPerformanceInvoice(performance, play);
    case 'comedy':
      return new ComedyPerformanceInvoice(performance, play);
    default:
      throw new Error(`unknown type: ${play.type}`);
    }
  }
}

class PerformanceInvoice {
  constructor(performance, play) {
    this.performance = performance;
    this.play = play;
  }

  audienceAmount() { throw new Error('not implemented'); }
  volumeCredits() { throw new Error('not implemented'); }
  recieptLine() {
    return ` ${this.play.name}: ${format(this.audienceAmount()/100)} (${this.performance.audience} seats)\n`;
  }
}

class TragedyPerformanceInvoice extends PerformanceInvoice {
  audienceAmount() {
    let amount = 40000;
    if (this.performance.audience > 30) {
      amount += 1000 * (this.performance.audience - 30);
    }
    return amount;
  }

  volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

class ComedyPerformanceInvoice extends PerformanceInvoice {
  audienceAmount() {
    let amount = 30000;
    if (this.performance.audience > 20) {
      amount += 10000 + 500 * (this.performance.audience - 20);
    }
    amount += 300 * this.performance.audience;

    return amount;
  }

  volumeCredits() {
    let volumeCredits = Math.max(this.performance.audience - 30, 0);
    volumeCredits += Math.floor(this.performance.audience / 5);
    return volumeCredits;
  }
}


function statement (invoice, plays) {
    const generated = invoice.performances.map(performance => InvoiceFactory.toInvoice(performance, plays[performance.playID]));
    const totalAmount = generated.reduce((acc, i) => acc + i.audienceAmount(), 0);
    const volumeCredits = generated.reduce((acc, i) => acc + i.volumeCredits(), 0);

    let result = `Statement for ${invoice.customer}\n`;
    generated.forEach(i => {
      result += i.recieptLine();
    });

    result += `Amount owed is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

module.exports = statement;
