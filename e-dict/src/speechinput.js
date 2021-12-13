import React, { Component } from 'react';

var recognition = new window.webkitSpeechRecognition();
var final_transcript = '';

class Speechinput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            speaking : null,
        }
        this.startButton = this.startButton.bind(this);
        //this.setConfign = this.setConfign.bind(this);
    }

    async componentDidMount() {
        this.setState({'speaking':false});
        recognition.lang='ta-IN';
        recognition.continuous =true;
        recognition.interimResults=true;
    }

    startButton() {
        const is_listening = this.state.speaking;
        this.setState({'speaking':!is_listening});
        if (is_listening ===  true) {
            recognition.stop();
            return;
        }
        recognition.start();
    }

    render() {
        recognition.onresult = function(event) {
            if (typeof(event.results) == 'undefined') {
                recognition.onend = null;
                recognition.stop();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                }
            }
        };
        return(
            <>
                {this.state.speaking ===  true ? "you are speaking..." : "Click button speak to speak"}
                <button type="button" onClick={this.startButton}> {this.state.speaking === true ? "Stop" : "Speak"} </button>
                <>
                    {final_transcript}
                </>
            </>
        )
    }
}
export default Speechinput;