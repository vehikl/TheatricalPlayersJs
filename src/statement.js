const format = new Intl.NumberFormat('en-US',
  { style: 'currency', currency: 'USD',
      minimumFractionDigits: 2 }).format;

function getFactory (plays) {
    let instance;
    class ItemFactory {
        constructor (plays) {
            this.plays = plays;
        }

        makeItem (performance = null) {
            const play = this.plays[performance.playID];
            switch (play.type) {
                case 'tragedy':
                    return new TragedyItem(play, performance);
                case 'comedy':
                    return new ComedyItem(play, performance);
                case 'history':
                    return new HistoryItem(play, performance);
                case 'pastoral':
                    return new PastoralItem(play, performance);
                default:
                    throw new Error(`unknown type: ${play.type}`);
            }
        }
    }

    if (!instance) {
        instance = new ItemFactory(plays);
    }

    return instance;
}

class InvoiceCollection {
  constructor(customer, items) {
    this.items = items;
    this.customer = customer;
  }

  _sum(fnName, init = 0) {
    return this.items.reduce((result, item) => {
      return result + item[fnName]();
    }, init);
  }

  volumeCredits() {
    return this._sum('getVolumeCredits');
  }

  totalAmount() {
    return this._sum('getAmount');
  }

  lineItems() {
    return this._sum('getLineItemText', '');
  }
  htmlLineItems() {
    return this._sum('getLineItemHtml', '');
  }

  toText() {
    let result = `Statement for ${this.customer}\n`;
    result += this.lineItems();
    result += `Amount owed is ${format(this.totalAmount() / 100)}\n`;
    result += `You earned ${(this.volumeCredits())} credits\n`;
    return result;
  }

  toHtml() {
    let result = `<h1>Statement for ${this.customer}</h1>\n`;
    result += ' <table>\n';
    result += ' <th><td>Play</td><td>Cost</td><td>Seats</td></th>\n';
    result += this.htmlLineItems();
    result += ' </table>\n';
    result += `<p>Amount owed is ${format(this.totalAmount() / 100)}</p>\n`;
    result += `<p>You earned ${(this.volumeCredits())} credits</p>\n`;
    return result;
  }
}

class Item {
    constructor (play, performance) {
        this.play = play;
        this.performance = performance;
    }
    getAmount () {throw new Error ('not implemented')}
    getVolumeCredits () {throw new Error ('not implemented')}
    getLineItemText () {
        return ` ${this.play.name}: ${format(this.getAmount() / 100)} (${this.performance.audience} seats)\n`
    }
    getLineItemHtml () {
        return ` <tr><td>${this.play.name}</td><td>${format(this.getAmount() / 100)}</td><td>${this.performance.audience} seats</td></tr>\n`
    }
}

class HistoryItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmountA = 50000;
        if (audience > 30) {
            thisAmountA += 2000 * (audience - 30);
        }
        return thisAmountA;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 30, 0) + 5;
    }
}

class PastoralItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmountA = 2000;
        if (audience > 30) {
            thisAmountA += 500 * (audience - 10);
        }
        return thisAmountA;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 15, 0) + 50;
    }
}

class TragedyItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmountA = 40000;
        if (audience > 30) {
            thisAmountA += 1000 * (audience - 30);
        }
        return thisAmountA;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 30, 0);
    }
}

class ComedyItem extends Item {
    getAmount() {
        const audience = this.performance.audience;
        let thisAmount = 30000;
        if (audience > 20) {
            thisAmount += 10000 + 500 * (audience - 20);
        }
        thisAmount += 300 * audience;
        return thisAmount;
    }

    getVolumeCredits() {
        return Math.max(this.performance.audience - 30, 0) + Math.floor(this.performance.audience / 5);
    }
}

function statement (invoice, plays, type = 'text') {
  const invoices = invoice.performances.map(performance => getFactory(plays).makeItem(performance));
  const performances = new InvoiceCollection(invoice.customer, invoices);
  return type === 'text' ? performances.toText() : performances.toHtml();
}

module.exports = statement;
