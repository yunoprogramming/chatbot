import './App.css';
import React, { Component } from 'react';
import axios from 'axios';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          type: 'bot',
          message: "Assalaamu Alaikum! I'm your AI Muslim Companion. How can I assist you today?"
        },
      ],
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userMessage = event.target.elements.userInput.value;
    this.setState({
      messages: [...this.state.messages, { type: 'user', message: userMessage }],
    });
    event.target.elements.userInput.value = '';
    this.sendMessage(userMessage);
  };

  sendMessage = async (userMessage) => {
    const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
    const model = 'gpt-3.5-turbo';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    };

    const data = {
      model: model,
      messages: [{ role: 'user', content: userMessage }],
    };

    axios
      .post(openaiEndpoint, data, { headers })
      .then((response) => {
        const chatResponse = response.data.choices[0].message.content;
        this.setState({
          messages: [
            ...this.state.messages,
            {
              type: 'bot',
              message: chatResponse,
            },
          ],
        });
        console.log(chatResponse);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    return (
      <div className="chatbot">
        <div className="chat-window">
          {this.state.messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.message}
            </div>
          ))}
        </div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="userInput" placeholder="Type your message here" />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

export default Chatbot;




