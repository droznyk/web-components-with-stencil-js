import { Component, State, Prop, Watch } from "@stencil/core";

import { AV_API_KEY } from '../../global/global';

@Component({
  tag: 'ue-stock-price',
  styleUrl: './stock-price.css',
  shadow: true
})

export class StockPrice {
  stockInput: HTMLInputElement;
  // initialStockSymbol: string;

  // @Element() el: HTMLElement;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;

  @Prop({ reflectToAttr: true, mutable: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetchStockPrice(newValue);
    }
  }

  onUserInput = (event: Event) => {
    this.stockUserInput = (event.target as HTMLInputElement).value;
    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  onFetchStockPrice = (event: Event) => {
    event.preventDefault();
    // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol') as HTMLInputElement).value;
    this.stockSymbol = this.stockInput.value;
    // this.fetchStockPrice(stockSymbol);
    // fetch(
    //   `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
    // )
    //   .then(res => {
    //     return res.json();
    //   })
    //   .then(parsedRes => {
    //     if (!parsedRes['Global Quote']['05. price']) {
    //       throw new Error('Invalid symbol!');
    //     }
    //     this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  componentWillLoad() {
    console.log('componentWillLoad');
    console.log(this.stockSymbol);
  }

  componentDidLoad = () => {
    console.log('componentDidLoad');
    if (this.stockSymbol) {
      // this.initialStockSymbol = this.stockSymbol;
      this.stockInputValid = true;
      this.stockUserInput = this.stockSymbol;
      this.fetchStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    console.log('componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('componentDidUpdate');
    // if (this.stockSymbol !== this.initialStockSymbol) {
    //   this.initialStockSymbol = this.stockSymbol;
    //   this.fetchStockPrice(this.stockSymbol);
    // }
  }

  componentDidUnload() {
    console.log('componentDidUnload');
  }

  fetchStockPrice = async (stockSymbol: string) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`
      )

      const parsed_response = await response.json()
      if (!parsed_response['Global Quote']['05. price']) {
        throw new Error('Invalid symbol!');
      }
      this.error = null;
      this.fetchedPrice = + parsed_response['Global Quote']['05. price'];
    } catch (error) {
      this.error = error.message
    }
  }

  render() {
    let dataContent = <p>Please enter a symbol.</p>;
    if (this.error) {
      dataContent = <p>{this.error}</p>
    }
    if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>
    }
    return [
      <form onSubmit={this.onFetchStockPrice}>
        <input id="stock-symbol"
          ref={el => this.stockInput = el}
          value={this.stockUserInput}
          onInput={this.onUserInput} />
        <button type="submit" disabled={!this.stockInputValid}>Fetch</button>
      </form>,
      <div>
        {dataContent}
      </div>
    ];
  }
}
