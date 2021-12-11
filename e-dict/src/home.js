import {Component} from 'react';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import W from './words.json';

const Words = W.Words; 

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            input: "",
            audio : null,
            audio_is_playing : null,
            audio_path:"",
            word_found:null,
            sentences:[],
            want_keyboard : null,
            layoutName: "default",
            display : {
                'a': '\u2714:Validate (Shift+Enter)', // check mark - same action as accept
                'accept': 'accept (Shift+Enter)',
                'alt': 'Alt:More Characters',
                'b': '\u2190:Backspace',    // Left arrow (same as &larr;)
                'bksp': 'Bksp:Backspace',
                'c': '\u2716:Escape (Esc)', // big X, close - same action as cancel
                'cancel': 'Cancel (Esc)',
                'clear': 'C:Clear',             // clear num pad
                'combo': '\u00f6:Toggle Combo Keys',
                'dec': '.:Decimal point',           // decimal point for num pad (optional), change '.' to ',' for European format
                'e': '\u21b5:Enter',        // down, then left arrow - enter symbol
                'enter': 'Enter:Enter',
                'lock': '\u21ea Lock:Caps Lock', // caps lock
                's': '\u21e7:Shift',        // thick hollow up arrow
                'shift': 'Shift:Shift',
                'sign': '\u00b1:Sign for num pad',  // +/- sign for num pad
                'space': 'Space',
                't': '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
                'tab': '\u21e5 Tab:Tab'
                },
            layout : {
                'default': [
                  /* ா	ி	ீ	ு	ூ	ெ	ே	ை	ொ	ோ	ௌ	ஃ  */
                  "\u0BBE \u0BBF \u0BC0 \u0BC1 \u0BC2 \u0BC6 \u0BC7 \u0BC8 \u0BCA \u0BCB \u0BCC \u0B83 {bksp}",
                  /*      ஆ     ஈ      ஊ     ஐ    ஏ      ள      ற     ன     ட      ண   ச      ஞ   \   */
                  "{tab} \u0b86 \u0b88 \u0b8a \u0b90 \u0b8f \u0bb3 \u0bb1 \u0ba9 \u0b9f \u0ba3 \u0b9a \u0b9e",
                  /*  அ    இ      உ     ்       எ      க      ப    ம      த      ந      ய  */
                  "\u0b85 \u0b87 \u0b89 \u0bcd \u0b8e \u0b95 \u0baa \u0bae \u0ba4 \u0ba8 \u0baf {enter}",
                  /*         ஔ    ஒ      ஓ    வ     ங     ல      ர    , . ழ    */
                  "{shift} \u0b94 \u0b93 \u0b92 \u0bb5 \u0b99 \u0bb2 \u0bb0 , . \u0bb4 {shift}",
                  "{accept} {alt} {space} {alt} {cancel}"
                ],
                'shift': [
                    /* numeric key row */
                    "` 1 2 3 4 5 6 7 8 9 0 - = {bksp}",
                    /* sanskrit row */
                    /*     ஸ      ஷ        ஜ      ஹ           ஶ்ரீ                       க்ஷ                       */
                    "{tab} \u0bb8 \u0bb7 \u0b9c \u0bb9 \u0bb6 \u0bcd \u0bb0 \u0bc0 \u0b95 \u0bcd \u0bb7 [ ] { }",
                    /* ௹     ௺    ௸     ஃ  \u0020 \u0020 \u0020 \" : ; \' {enter} */
                    "\u0bf9 \u0bfa \u0bf8 \u0b83 \" : ; ' {enter}",
                    /* ௳ ௴ ௵ ௶ ௷ */
                    "{shift} \u0bf3 \u0bf4 \u0bf5 \u0bf6 \u0bf7 / {shift}",
                    "{accept} {alt} {space} {alt} {cancel}"
                ]
            }
        }
        this.searchword= this.searchword.bind(this);
        this.togglevirtualkeyboard= this.togglevirtualkeyboard.bind(this);
        this.onChangeInput= this.onChangeInput.bind(this);
        this.resettextbox= this.resettextbox.bind(this);
        this.playpauseaudio= this.playpauseaudio.bind(this);
        this.stopaudio= this.stopaudio.bind(this);
        //this.handleChange = this.handleChange.bind(this);
        //hdhjthis.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({"input":"","want_keyboard":false,"found":false,"audio_is_playing":false});
    }

    onChange = word => {
        this.setState({ "input":word });
        console.log("word changed", word);
    };
    
    onKeyPress = button => {
    console.log("Button pressed", button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
    else if (button === "{enter}") this.handleSubmit();
    };

    onChangeInput = event => {
        const input = event.target.value;
        const want_keyboard = this.state.want_keyboard;
        console.log(input);
        this.setState({ "input":input });
        if (want_keyboard) this.keyboard.setInput(input);
    };

    handleShift = () => {
        const layoutName = this.state.layoutName;
    
        this.setState({
          layoutName: layoutName === "default" ? "shift" : "default"
        });
      };

    searchword() {
        var flag = false;
        var i;
        const keyword = this.state.input;
        console.log(keyword);
        for (i in Words){
            if (Words[i]['word'] === keyword) {
                this.setState({
                    "word_found":true,
                    "audio_path":Words[i].audio,
                    "sentences":Words[i].sentences,
                    "audio":new Audio(Words[i].audio),
                    "audio_is_playing":false
                });
                flag = true;
                break;
            }
        }
        if (flag === false) {
            this.setState({"word_found":false});
        }
        console.log(flag);

    }

    resettextbox() {
        this.setState({"input":"","audio_path":"","sentences":[],"word_found":false});
    }

    togglevirtualkeyboard(){
        var flag = this.state.want_keyboard;
        if (flag === true) {
            flag = false;
        } else {
            flag = true;
        }
        this.setState({"want_keyboard":flag});
    }
    
    playpauseaudio () {
        const flag = this.state.audio_is_playing;
        if (!flag) {
            this.state.audio.play();
            console.log("playing");
        } else {
            this.state.audio.pause();
            console.log("paused");
        }
        this.setState({"audio_is_playing":!flag});
    }

    stopaudio () {
        this.state.audio.load();
        this.setState({"audio_is_playing":false});
    }

    displaySentences() {
        const sentences = this.state.sentences;
        return (
            <>
            <button onClick={this.playpauseaudio} > {this.state.audio_is_playing === true ? "Pause" : "Play"} </button>
            <button onClick={this.stopaudio} > Stop </button>
            <ul>
            {sentences.map((item) => (
                <li> {item} </li>
            ))}
            </ul>
            </>
        )
    }

    render() {
        return(
            <div>
                
                { this.state.input !== ""  ? <h1>{this.state.input}</h1> : "" }
                {this.state.want_keyboard === true ? 
                <div>
                    <input
                        value={this.state.input}
                        placeholder={"Tap on the virtual keyboard to start"}
                        onChange={this.onChangeInput}
                    />
                    <Keyboard
                        keyboardRef={r => (this.keyboard = r)}
                        layout={this.state.layout}
                        layoutName={this.state.layoutName}
                        display={this.state.display}
                        onChange={this.onChange}
                        disableButtonHold = "false"
                        onKeyPress={this.onKeyPress}
                    />
                    <button type="button" onClick={this.togglevirtualkeyboard}>Close Keyboard</button>
                    </div>

                    : <>
                        <input type="text" placeholder="enter a word" value={this.state.input} onChange={this.onChangeInput}></input>
                        <button type="button" onClick={this.togglevirtualkeyboard}>View Keyboard</button>
                        </>
                    }
                <button type="button" onClick={this.searchword}>Search</button>
                <button type="button" onClick={this.resettextbox}>Reset</button>
                
                {this.state.word_found === true ? this.displaySentences() : "" }

            </div>
        )
    }
}

export default Home;