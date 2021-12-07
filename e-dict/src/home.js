import {Component} from 'react';

class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            word : ""
        }
        this.handleChange = this.handleChange.bind(this);
        //hdhjthis.handleSubmit = this.handleSubmit.bind(this);
    }

    /*componentDidMount() {
        this.setState({field1:''});
    }
    handleSubmit(event) {
        this.setState({'field1': event.target.elements.word.value});
    }*/
    handleChange(event) {
        this.setState({word:event.target.value});
    }


    render() {
        return(
            <div>
                <form>
                <input type="text" placeholder="word" name = "word" onChange={this.handleChange}></input>
                </form>
                
                { this.state.word !== ""  ? <h1>Hi {this.state.word}</h1> : "" }
            </div>
        )
    }
}

export default Home;