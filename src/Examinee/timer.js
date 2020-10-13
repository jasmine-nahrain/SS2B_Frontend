import React, { Component } from "react";
import "../App.css";
import { withRouter } from "react-router-dom";

class CountDownTimer extends React.Component {
  constructor(props) {
    super(props);
    const duration = localStorage.getItem("exam_duration").split(":");
    this.state = {
      hours: parseInt(duration[0]),
      minutes: parseInt(duration[1]),
      seconds: parseInt(duration[2]),
    };
  }

  componentDidMount() {
    this.myInterval = setInterval(() => {
      const { seconds, minutes, hours } = this.state;

      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1,
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          if (hours === 0) {
            clearInterval(this.myInterval);
          } else {
            this.setState(({ hours }) => ({
              hours: hours - 1,
              minutes: 59,
              seconds: 59,
            }));
          }
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59,
          }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }

  render() {
    const { hours, minutes, seconds } = this.state;
    return (
      <div>
        {hours === 0 && minutes === 0 && seconds === 0 ? (
          (window.location.href = "/examinee/endpage")
        ) : (
          <h1 id="timer">
            Time Remaining: {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </h1>
        )}
      </div>
    );
  }
}
export default withRouter(CountDownTimer);
