import { Component, State } from "@stencil/core";
import { AV_API_KEY } from "../../global/global";

@Component({
  tag: 'ue-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: {symbol: string, name: string}[] = [];

  onFindStocks = async (event: Event) => {
    event.preventDefault();
    const stockName = this.stockNameInput.value;
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${AV_API_KEY}`
      )
      const parsed_response = await response.json()
      this.searchResults = parsed_response['bestMatches'].map(match => {
        return { name: match['2. name'], symbol: match['1. symbol'] };
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return[
      <form onSubmit={this.onFindStocks}>
        <input id="stock-symbol"
          ref={el => this.stockNameInput = el}/>
        <button type="submit">Find!</button>
      </form>,
      <ul>
        {this.searchResults.map(result => (
          <li><strong>{result.symbol}</strong> - {result.name}</li>
        ))}
      </ul>
    ];
  }
}