import React from "react";
import {LinkContainer} from 'react-router-bootstrap';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/cjs/Button";
import Container from "react-bootstrap/cjs/Container";
import Row from "react-bootstrap/cjs/Row";
import Card from "react-bootstrap/cjs/Card";
import Form from 'react-bootstrap/cjs/Form';

import 'bootstrap/dist/css/bootstrap.min.css';
import VideoPlayer from "./VideoPlayer";

let messages = [



]

class ChatRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'chat': messages,
            'cur_msg':"",
            "database": props.database,
            'name': props.name
        };
        this.chatRef = React.createRef();
        this.renderAllMessages = this.renderAllMessages.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);

        setInterval(()=>{
            this.state.database.state.ref.onSnapshot(doc => {
                let data = doc.data();
                this.setState({"chat":data['chats']});
            })

        },2000)
    }

    displayMessage(msg,isLast){
        if(!isLast) {
            return (
                <Container>
                    <Card bg={'info'} text={'white'}>
                        <Card.Header>{msg.from}</Card.Header>
                        <Card.Body>{msg.text}</Card.Body>
                    </Card>
                    <br/>

                </Container>
            );
        } else {
            return (
                <div ref={this.chatRef}>
                <Container>
                    <Card bg={'info'} text={'white'}>
                        <Card.Header>{msg.from}</Card.Header>
                        <Card.Body>{msg.text}</Card.Body>
                    </Card>
                    <br/>

                </Container>
                </div>
            );

        }
    }

    renderAllMessages(){
        let rendered = [];

        this.state.chat.forEach((msg,idx) => {
            rendered.push(this.displayMessage(msg,(idx == (this.state.chat.length - 1))));
        })

        console.log(this.chatRef);

        return rendered;//(<div id="chat_div" style={{"overflow-y":"scroll","height": "400px"}} >{rendered}</div>);

    }

    componentDidMount () {
        console.log("Component mounted");
        setTimeout(this.scrollToBottom,1500)
    }
    componentDidUpdate () {
        console.log("Component updated");
        setTimeout(this.scrollToBottom,1500)
    }
    scrollToBottom = () => {
        console.log("Scroll to bottom invoked")

        if(this.state.chat != [] && this.chatRef.current != null) {
            this.chatRef.current.scrollIntoView({behavior: "smooth"})
        }
    }

    render() {
        return(
            <div>
                <Container>
                    <div style={{"overflow-y":"scroll","height": "400px"}} >{this.renderAllMessages()}</div>
                        <Form>
                            <Form.Group>
                                <Form.Control as={'textarea'} rows={'2'}
                                              placeHolder={'Enter Text to send to chat'}
                                              onChange={(evt)=>this.state.cur_msg = evt.target.value}
                                />
                            </Form.Group>
                        </Form>
                    <Button onClick={()=>{
                        //let msgs = this.state.chat;
                        //msgs.push({"from":this.state.name,"text":this.state.cur_msg});
                        this.state.database.addChat({"from":this.state.name,"text":this.state.cur_msg});
                        //this.setState({"chat":msgs});
                    }}>Send</Button>

                </Container>

            </div>
        );
    }
}

export default ChatRoom;