import {Component} from 'react';
import Keyboard from 'react-simple-keyboard';
import "react-simple-keyboard/build/css/index.css";
import W from './words.json';
import './home.css';
import {FaSearch} from 'react-icons/fa';
import logo from './NITK_LOGO.svg';
import Speechinput from './speechinput.js';

const Words = W.Words; 

var recognition = new window.webkitSpeechRecognition();
var final_transcript = '';

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            input: "",
            speech_input: false,
            is_listening :null,
            audio : null,
            audio_is_playing : null,
            audio_path:"",
            image_path:"",
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
        this.startButton = this.startButton.bind(this);
        //this.handleChange = this.handleChange.bind(this);
        //hdhjthis.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({"input":"","want_keyboard":false,"found":false,"audio_is_playing":false,"is_listening":false});
        recognition.lang='ta-IN';
        recognition.continuous =true;
        recognition.interimResults=true;
        final_transcript = '';
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
    //else if (button === "{enter}") this.handleSubmit();
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
                    "audio_is_playing":false,
                    "image_path" : Words[i].image
                });
                flag = true;
                break;
            }
        }
        if (flag === false) {
            this.setState({"word_found":false});
        }
        else{
            this.setState({"want_keyboard":false});
        }
        console.log(flag);
    }

    resettextbox() {
        this.setState({"input":"","audio_path":"","sentences":[],"word_found":null});
        final_transcript = '';
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
        const image_path = this.state.image_path;
        return (
            <>
            <div class="matter-div">
                <div class="sentence-div">
                    {sentences.map((item) => (
                        <div class="sentence">{item} </div>
                    ))}
                </div>
                <div class="image-div">
                        <img src={image_path} alt="image for word"/>
                </div>
            </div>
            <div>
                <div class="wrap">
                    <a class="button"  onClick={this.playpauseaudio} > {this.state.audio_is_playing === true ? "Pause" : "Play"} </a>
                </div>
                <div class="wrap">
                    <a class="button"  onClick={this.stopaudio} > Stop </a>
                </div>
            </div>
            </>
        )
    }



    startButton() {
        const is_listening = this.state.is_listening;
        this.setState({'is_listening':!is_listening,'speech_input':true});
        if (is_listening ===  true) {
            recognition.stop();
            console.log(final_transcript);
            this.setState({'input':final_transcript});
            final_transcript = '';
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
            var length = final_transcript.length;
            if (length>0) {
                let temp = final_transcript.split("");
                let l = temp.length;
                if (temp[l-1] === '.') {
                    temp[l-1] = '';
                    final_transcript = temp.toString();
                    for (let i=0;i< l;i++) {
                        final_transcript = final_transcript.replace(',','');
                    }
                }
            }
        };
        return(
            <div class="container">
                <header>
                    <h1 class="logo">E- Dict</h1>
                </header>
                <script src="https://unpkg.com/ionicons@5.0.0/dist/ionicons.js"></script>
                
                { this.state.input !== ""  ? <h1>{this.state.input}</h1> : <h1 style={{color:"white"}}>_</h1> }
                
                {this.state.want_keyboard === true ? 
                <div>
                    <div class="search-box">
                        <input
                            class = "search-txt2"
                            value={this.state.input}
                            placeholder={"Tap on the virtual keyboard to start"}
                            onChange={this.onChangeInput}
                        />
                        <button type="button" class="search-btn" onClick={this.searchword}>
                            <FaSearch/>
                        </button>
                    </div>
                        <Keyboard
                            keyboardRef={r => (this.keyboard = r)}
                            layout={this.state.layout}
                            layoutName={this.state.layoutName}
                            display={this.state.display}
                            onChange={this.onChange}
                            disableButtonHold = "false"
                            onKeyPress={this.onKeyPress}
                        />
                        <div class="wrap">
                            <a class="button" type="button"  onClick={this.togglevirtualkeyboard}>Close Keyboard</a>
                        </div>
                </div>

                :   <>
                        <div class="search-box">
                            <form onSubmit={this.searchword} action='#'>
                                <input class="search-txt" type="text" placeholder="Enter a word" value={this.state.input} onChange={this.onChangeInput}></input>
                            </form>
                            <button type="button" class="search-btn" onClick={this.searchword}>
                                <FaSearch/>
                            </button>
                            <button type="button" onClick={this.startButton}> {this.state.is_listening === true ? "Click to Stop" : "click to Speak"} </button>

                        </div>
                        <div class="wrap">
                            <a class="button" type="button"  onClick={this.togglevirtualkeyboard}>View Keyboard</a>
                        </div>
                    </>
                }
                <br></br>
                <div>
                    <div class="wrap">
                        <a class="button" type="button"  onClick={this.searchword}>Search</a>
                    </div>
                    <div class="wrap">
                        <a class="button" type="button"  onClick={this.resettextbox}>Reset</a>
                    </div>
                </div>
                {this.state.word_found === true ? this.displaySentences() 
                : this.state.word_found===null?" "
                        : <>
                        <div class="no-results">
                            <div class="search-message-empty-container">
                                <span class="search-message-empty-decal">
                                    <span class="search-message-empty-decal-eyes">:</span>
                                    <span>(</span>
                                </span>
                                <h2 class="search-message-empty-message">
                                    Nope, word not found.
                                </h2>
                            </div>
                        </div>
                        </>
                }

                <div class="watermark">
                    <span>Done by ________</span> <br/>
                    <img src={logo} alt="nitk logo"/>
                </div>

            </div>
        )
    }
}

export default Home;