import React, { Component } from 'react'
import '../App.css';
import { withRouter } from 'react-router-dom';

class CountDownTimer extends React.Component {
    state = {
        minutes: 60,
        seconds: 10,
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            const { seconds, minutes } = this.state

            if (seconds > 0) {
                this.setState(({ seconds }) => ({
                    seconds: seconds - 1
                }))
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(this.myInterval)
                } else {
                    this.setState(({ minutes }) => ({
                        minutes: minutes - 1,   
                        seconds: 59
                    }))
                }
            } 
        },1000)
    }

    componentWillUnmount() {
        clearInterval(this.myInterval)
    }

    render() {
        const { minutes, seconds } = this.state
        return (
            <div>
                { minutes === 0 && seconds === 0
                    ? window.location.href ='/examinee/login'
                    : <h1 id='timer'>Time Remaining: {minutes }:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                }
            </div>
        )
    }
} export default withRouter(CountDownTimer);