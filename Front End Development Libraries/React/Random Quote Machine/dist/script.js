const QUOTES = [
["Let's make this fun.", "Warwick the Blood Hunter"],
["Teach them to fear us", "Aatrox, Darken Blade"],
["Cut them from this world.", "Nocturne, Eternal Nightmare"],
["Justice, will be served.", "Kassadin, Void Walker"],
["Who want's the piece of the champ.", "Jax, Grandmaster at Arms"],
["House, always wins.", "Twisted Fate, Card Master"]];


function getRandomIndex() {
  return Math.floor(Math.random() * QUOTES.length);
}

class QuoteBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: getRandomIndex() };

    this.getNewQuote = this.getNewQuote.bind(this);
  }
  getNewQuote() {
    this.setState(state => {
      let newIndex = getRandomIndex();
      while (newIndex == state.index)
      {
        newIndex = getRandomIndex();
      }
      return { index: newIndex };
    });
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("div", { id: "text" }, QUOTES[this.state.index][0]), /*#__PURE__*/
      React.createElement("div", { id: "author" }, "- " + QUOTES[this.state.index][1]), /*#__PURE__*/
      React.createElement("div", { id: "button-bar" }, /*#__PURE__*/
      React.createElement("a", { id: "tweet-quote", target: "_blank", href: "http://twitter.com/intent/tweet?text=" + QUOTES[this.state.index] }, "Twitter"), /*#__PURE__*/
      React.createElement("button", { id: "new-quote", onClick: this.getNewQuote }, "New Quote"))));



  }}


ReactDOM.render( /*#__PURE__*/React.createElement(QuoteBox, null), document.getElementById("quote-box"));