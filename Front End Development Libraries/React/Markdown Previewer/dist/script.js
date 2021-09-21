marked.setOptions({
  gfm: true,
  breaks: true });


const INITIAL_INPUT = "# h1 text\n## h2 text\n[link](https://www.freecodecamp.org)\n\nInline code: `<div></div>`\n\n```\n// code block:\n\nfunction myFunction(number) {\n  return number*number;\n}\n```\n\nUnordered list:\n- Item ul1\n- Item ul2\n  - Item ul2a\n- Item ul3\n\nOrdered list:\n1. Item ol1\n1. Item ol2\n1. Item ol3\n\n> Block quote\n\nImage:\n\n![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)\n\n**Bold text**";

class Markdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: INITIAL_INPUT };

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  handleInputChange(event) {
    this.setState({
      input: event.target.value });

  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "columns" }, /*#__PURE__*/
      React.createElement("div", { id: "column-editor" }, /*#__PURE__*/
      React.createElement("div", { className: "section-title" }, "Editor"), /*#__PURE__*/
      React.createElement("textarea", { id: "editor", value: this.state.input, onChange: this.handleInputChange })), /*#__PURE__*/

      React.createElement("div", { id: "column-preview" }, /*#__PURE__*/
      React.createElement("div", { className: "section-title" }, "Preview"), /*#__PURE__*/
      React.createElement("div", { id: "preview", dangerouslySetInnerHTML: { __html: marked(this.state.input) } }))));




  }}


ReactDOM.render( /*#__PURE__*/React.createElement(Markdown, null), document.getElementById("markdown"));