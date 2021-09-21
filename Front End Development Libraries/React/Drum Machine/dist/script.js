const PADS = [
{ keyLetter: "Q",
  keyCode: 81,
  id: "Heater-1",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3" },
{ keyLetter: "W",
  keyCode: 87,
  id: "Heater-2",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3" },
{ keyLetter: "E",
  keyCode: 69,
  id: "Heater-3",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3" },
{ keyLetter: "A",
  keyCode: 65,
  id: "Heater-4_1",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3" },
{ keyLetter: "S",
  keyCode: 83,
  id: "Heater-6",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3" },
{ keyLetter: "D",
  keyCode: 68,
  id: "Dsc_Oh",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3" },
{ keyLetter: "Z",
  keyCode: 90,
  id: "Kick_n_Hat",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3" },
{ keyLetter: "X",
  keyCode: 88,
  id: "RP4_KICK_1",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3" },
{ keyLetter: "C",
  keyCode: 67,
  id: "Cev_H2",
  soundURL: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3" }];


class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayText: "Display" };

    this.handleDisplayText = this.handleDisplayText.bind(this);
  }
  handleDisplayText(newText) {
    this.setState({
      displayText: newText });

  }
  render() {
    const drumPads = PADS.map(obj => /*#__PURE__*/React.createElement(DrumPad, { keyLetter: obj.keyLetter,
      id: obj.id,
      soundURL: obj.soundURL,
      keyCode: obj.keyCode,
      setDisplayText: this.handleDisplayText }));

    return /*#__PURE__*/(
      React.createElement("div", { id: "drum-machine" }, /*#__PURE__*/
      React.createElement("div", { id: "drum-pads-grid" },
      drumPads), /*#__PURE__*/

      React.createElement("div", { id: "display-column" }, /*#__PURE__*/
      React.createElement("div", { id: "display" }, /*#__PURE__*/
      React.createElement("h4", null, this.state.displayText)))));




  }}


class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      triggerAnimation: false };

    this.triggerPad = this.triggerPad.bind(this);
    this.playSound = this.playSound.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.endAnimation = this.endAnimation.bind(this);
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }
  playSound() {
    let audio = document.getElementById(this.props.keyLetter);
    audio.volume = 0.2;
    audio.play();
  }
  triggerPad() {
    this.playSound();
    this.props.setDisplayText(this.props.id);
    this.setState({
      triggerAnimation: true });

  }
  handleKeyPress(event) {
    if (event.keyCode === this.props.keyCode) {
      this.triggerPad();
    }
  }
  endAnimation() {
    this.setState({
      triggerAnimation: false });

  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: this.state.triggerAnimation ? "drum-pad drum-pad-anim" : "drum-pad", id: this.props.id,
        onClick: this.triggerPad,
        onAnimationEnd: this.endAnimation }, /*#__PURE__*/
      React.createElement("h1", null, this.props.keyLetter), /*#__PURE__*/
      React.createElement("audio", { className: "clip", src: this.props.soundURL, id: this.props.keyLetter })));


  }}


ReactDOM.render( /*#__PURE__*/React.createElement(DrumMachine, null), document.getElementById("DrumMachine"));