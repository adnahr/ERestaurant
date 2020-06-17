import React, { Component } from 'react';
import { HubConnectionBuilder } from '@aspnet/signalr';
import QueryString from 'querystring';
import './publicChat.css'

class PubChat extends Component {


  constructor(props) {
    super(props);
    

    
    this.state = {
      nick: '',
      message: '',
      messages: [],
      hubConnection: new HubConnectionBuilder().withUrl("https://localhost:44342/chat").build()
    };
  }

  componentDidMount() {
      let self = this;

      this.setState({ nick: prompt("Unesite svoj nick: ")})
      
      this.state.hubConnection.start().then(() => console.log("Conected!"));
      this.state.hubConnection.on("ReceiveMessage", (user, message) => {
        
          self.setState({ 
              messages: [...self.state.messages, `${user} :   ${message}`]
            });
      })
  }

  sendMessage =(e) => {
      e.preventDefault();
      this.state.hubConnection.invoke("SendMessage", this.state.nick, this.state.message);
      this.setState({ message: "" });
  }
  render() {
    return (
      <div id="pubChat">
        <div id="chat">
        <br />
        <form onSubmit={this.sendMessage}>
        <input id="mess1"
          required
          type="text"
          value={this.state.message}
          onChange={e => this.setState({ message: e.target.value })}
        />
  
        <button class="w3-button w3-medium" id="send">Send</button>
        </form>
        <div id="messages">
          {this.state.messages.map((message, index) => (
            <span style={{display: 'block'}} key={index} id="mess"> {message} </span>
          ))}
        </div>
      </div>
    </div>
    );
  }
}

export default PubChat;