class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      timerText: "Session",
      timerInterval: "",
      timerRunning: false };

    this.setButtonFunction = this.setButtonFunction.bind(this);
    this.resetClock = this.resetClock.bind(this);
    this.decreaseTimer = this.decreaseTimer.bind(this);
    this.setNewTimer = this.setNewTimer.bind(this);
    this.toggleTimer = this.toggleTimer.bind(this);
  }
  setButtonFunction(value, operation) {
    return () => {
      this.setState(state => {
        let newValue;
        let newTimer;
        if (operation == "+") {
          newValue = state[value] < 60 ? state[value] + 1 : 60;
          newTimer = value == "sessionLength" ? newValue * 60 : undefined;
        } else
        {
          newValue = state[value] > 1 ? state[value] - 1 : 1;
          newTimer = value == "sessionLength" ? newValue * 60 : undefined;
        }
        let obj = { [value]: newValue };
        if (newTimer != undefined) {
          obj.timeLeft = newTimer;
        }
        return obj;
      });
    };
  }
  resetClock() {
    if (this.state.timerInterval) {
      clearInterval(this.state.timerInterval);
    }
    let audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      timerText: "Session",
      timerInterval: "",
      timerRunning: false });

  }
  decreaseTimer() {
    let newTimeLeft = this.state.timeLeft - 1;

    if (newTimeLeft == -1) {
      this.setNewTimer();
      let audio = document.getElementById("beep");
      audio.volume = 0.2;
      audio.play();
    } else
    {
      this.setState({
        timeLeft: newTimeLeft });

    }
  }
  setNewTimer() {
    clearInterval(this.state.timerInterval);
    this.setState(state => {
      let newTimeLeft;
      let newTimerText;
      let newInterval;
      if (state.timerText == "Session") {
        newTimeLeft = state.breakLength * 60;
        newTimerText = "Break";
      } else
      {
        newTimeLeft = state.sessionLength * 60;
        newTimerText = "Session";
      }
      newInterval = setInterval(this.decreaseTimer, 1000);
      return { timeLeft: newTimeLeft,
        timerText: newTimerText,
        timerInterval: newInterval };
    });
  }
  toggleTimer() {
    this.setState(state => {
      if (state.timerRunning == false) {
        return { timerInterval: setInterval(this.decreaseTimer, 1000),
          timerRunning: true };
      }
      clearInterval(state.timerInterval);
      return { timerInterval: "",
        timerRunning: false };
    });
  }
  showTime() {
    if (this.state.timeLeft == 3600) {
      return "60:00";
    }
    let date = new Date(this.state.timeLeft * 1000).toISOString().substr(14, 5);
    return date;
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "clock" }, /*#__PURE__*/
      React.createElement("div", { id: "labels" }, /*#__PURE__*/
      React.createElement(LengthSelector, { id: "break",
        title: "Break Length",
        value: this.state.breakLength,
        decrementValue: this.setButtonFunction("breakLength", "-"),
        incrementValue: this.setButtonFunction("breakLength", "+"),
        disableButton: this.state.timerRunning }), /*#__PURE__*/
      React.createElement(LengthSelector, { id: "session",
        title: "Session Length",
        value: this.state.sessionLength,
        decrementValue: this.setButtonFunction("sessionLength", "-"),
        incrementValue: this.setButtonFunction("sessionLength", "+"),
        disableButton: this.state.timerRunning })), /*#__PURE__*/

      React.createElement("div", { id: "timer-label" }, /*#__PURE__*/
      React.createElement("h1", null, this.state.timerText), /*#__PURE__*/
      React.createElement("div", { id: "time-left" }, /*#__PURE__*/
      React.createElement("h2", null, this.showTime())), /*#__PURE__*/

      React.createElement("audio", { src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav", id: "beep" }), /*#__PURE__*/
      React.createElement("div", null, /*#__PURE__*/
      React.createElement("button", { id: "start_stop", onClick: this.toggleTimer }, !this.state.timerRunning ? "Start" : "Pause"), /*#__PURE__*/
      React.createElement("button", { id: "reset", onClick: this.resetClock }, "Reset")))));




  }}


class LengthSelector extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: this.props.id + "-label" }, /*#__PURE__*/
      React.createElement("h2", null, this.props.title), /*#__PURE__*/
      React.createElement("div", { className: "button-section" }, /*#__PURE__*/
      React.createElement("button", { id: this.props.id + "-decrement",
        onClick: this.props.decrementValue,
        disabled: this.props.disableButton }, "-"), /*#__PURE__*/
      React.createElement("h3", { id: this.props.id + "-length" }, this.props.value), /*#__PURE__*/
      React.createElement("button", { id: this.props.id + "-increment",
        onClick: this.props.incrementValue,
        disabled: this.props.disableButton }, "+"))));



  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("App"));