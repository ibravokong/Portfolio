const BUTTONS = [
{ key: "0",
  id: "zero",
  gridRow: "4",
  gridColumn: "1/3" },
{ key: "1",
  id: "one",
  gridRow: "3",
  gridColumn: "1" },
{ key: "2",
  id: "two",
  gridRow: "3",
  gridColumn: "2" },
{ key: "3",
  id: "three",
  gridRow: "3",
  gridColumn: "3" },
{ key: "4",
  id: "four",
  gridRow: "2",
  gridColumn: "1" },
{ key: "5",
  id: "five",
  gridRow: "2",
  gridColumn: "2" },
{ key: "6",
  id: "six",
  gridRow: "2",
  gridColumn: "3" },
{ key: "7",
  id: "seven",
  gridRow: "1",
  gridColumn: "1" },
{ key: "8",
  id: "eight",
  gridRow: "1",
  gridColumn: "2" },
{ key: "9",
  id: "nine",
  gridRow: "1",
  gridColumn: "3" },
{ key: "=",
  id: "equals",
  gridRow: "4",
  gridColumn: "4/6" },
{ key: "+",
  id: "add",
  gridRow: "3",
  gridColumn: "4" },
{ key: "-",
  id: "subtract",
  gridRow: "3",
  gridColumn: "5" },
{ key: "*",
  id: "multiply",
  gridRow: "2",
  gridColumn: "4" },
{ key: "/",
  id: "divide",
  gridRow: "2",
  gridColumn: "5" },
{ key: ".",
  id: "decimal",
  gridRow: "4",
  gridColumn: "3" },
{ key: "AC",
  id: "clear",
  gridRow: "1",
  gridColumn: "4/6" }];


function endsWithTwoOperators(value) {
  return /[+\-\/*]{1}-$/.test(value);
}
function endsWithOneOperator(value) {
  return /[+\-\/*]{1}$/.test(value);
}
function evalResult(value) {
  value = value.replace("--", "+");
  return Math.round(100000000000000 * eval(value)) / 100000000000000;
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayText: "0",
      formulaText: "0" };

    this.handleClear = this.handleClear.bind(this);
    this.handleOperation = this.handleOperation.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
    this.handleNumber = this.handleNumber.bind(this);
    this.setButtonFunction = this.setButtonFunction.bind(this);
  }
  handleClear() {
    this.setState({
      displayText: "0",
      formulaText: "0" });

  }
  handleOperation(event) {
    this.setState(state => {
      let newDisplayText;
      let newFormulaText;
      if (endsWithTwoOperators(state.formulaText)) {
        newFormulaText = state.formulaText.slice(0, state.formulaText.length - 2) + event.target.textContent;
      } else
      if (endsWithOneOperator(state.formulaText)) {
        if (event.target.textContent != "-") {
          newFormulaText = state.formulaText.slice(0, state.formulaText.length - 1) + event.target.textContent;
        } else
        {
          newFormulaText = state.formulaText.concat(event.target.textContent);
        }
      } else
      if (state.formulaText.includes("=")) {
        newFormulaText = state.formulaText.split("=")[1] + event.target.textContent;
      } else
      {
        newFormulaText = state.formulaText.concat(event.target.textContent);
      }
      newDisplayText = event.target.textContent;

      return { displayText: newDisplayText,
        formulaText: newFormulaText };
    });
  }
  handleDecimal() {
    this.setState(state => {
      let newDisplayText = state.displayText;
      let newFormulaText = state.formulaText;
      if (endsWithOneOperator(state.displayText)) {
        newDisplayText = "0.";
        newFormulaText = state.formulaText.concat("0.");
      } else
      if (state.formulaText.includes("=")) {
        newDisplayText = "0.";
        newFormulaText = "0.";
      } else
      if (!this.state.displayText.includes(".")) {
        newDisplayText = state.displayText.concat(".");
        newFormulaText = state.formulaText.concat(".");
      }

      return { displayText: newDisplayText,
        formulaText: newFormulaText };
    });
  }
  handleEquals(event) {
    this.setState(state => {
      let newDisplayText;
      let newFormulaText;
      if (endsWithOneOperator(state.formulaText)) {
        let result = evalResult(state.formulaText.slice(0, state.formulaText.length - 1));
        newDisplayText = result;
        newFormulaText = state.formulaText.slice(0, state.formulaText.length - 1) + "=" + result;
      } else
      if (state.formulaText.includes("=")) {
        newDisplayText = state.displayText;
        newFormulaText = state.formulaText;
      } else
      {
        let result = evalResult(state.formulaText);
        newDisplayText = result;
        newFormulaText = state.formulaText + "=" + result;
      }
      return { displayText: newDisplayText,
        formulaText: newFormulaText };
    });
  }
  handleNumber(event) {
    this.setState(state => {
      let newDisplayText;
      let newFormulaText;
      if (state.displayText == "0") {
        newDisplayText = event.target.textContent;
        newFormulaText = event.target.textContent;
      } else
      if ("*/+-".includes(state.displayText)) {
        newDisplayText = event.target.textContent;
        newFormulaText = state.formulaText.concat(event.target.textContent);
      } else
      {
        newDisplayText = state.displayText.concat(event.target.textContent);
        newFormulaText = state.formulaText.concat(event.target.textContent);
      }
      return { displayText: newDisplayText,
        formulaText: newFormulaText };
    });
  }
  setButtonFunction(value) {
    switch (value) {
      case "clear":
        return this.handleClear;
      case "add":
      case "subtract":
      case "multiply":
      case "divide":
        return this.handleOperation;
      case "decimal":
        return this.handleDecimal;
      case "equals":
        return this.handleEquals;
      default:
        return this.handleNumber;}
    ;
  }
  render() {
    const buttons = BUTTONS.map(obj => /*#__PURE__*/React.createElement(CalcButton, { buttonKey: obj.key,
      buttonId: obj.id,
      gridRow: obj.gridRow,
      gridColumn: obj.gridColumn,
      handleFunction: this.setButtonFunction(obj.id) }));
    return /*#__PURE__*/(
      React.createElement("div", { id: "calculator" }, /*#__PURE__*/
      React.createElement("div", { id: "formula" }, /*#__PURE__*/
      React.createElement("h4", null, this.state.formulaText)), /*#__PURE__*/

      React.createElement("div", { id: "display" }, /*#__PURE__*/
      React.createElement("h1", null, this.state.displayText)), /*#__PURE__*/

      React.createElement("div", { id: "buttons" },
      buttons)));



  }}


class CalcButton extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("button", { style: { gridRow: this.props.gridRow, gridColumn: this.props.gridColumn },
        id: this.props.buttonId,
        onClick: this.props.handleFunction }, this.props.buttonKey));

  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("App"));