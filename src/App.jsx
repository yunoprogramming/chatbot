import './App.css';
import React, { Component } from 'react';
import axios from 'axios';

class Chatbot extends Component {
  constructor(props) {
    super(props);
    this.state = {
			messages: [], // Initialize state to hold chat messages
		};
  }

  componentDidMount() {
		// Set initial message when component mounts
		this.setState({
			messages: [
				{
					type: 'bot',
					message:
						"Hey! I'm your AI companion. How may I assist you today?",
				},
			],
		});
	}

  handleSubmit = (event) => {
		event.preventDefault();
		// Get user's message from form input
		const userMessage = event.target.elements.userInput.value;
		// Add user's message to state
		this.setState({
			messages: [
				...this.state.messages,
				{ type: 'user', message: userMessage },
			],
		});
		// Clear input field after submitting message
		event.target.elements.userInput.value = '';
		// Call sendMessage function to send user's message to AI
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

		// Send user's message to OpenAI's chat completion endpoint
		axios
			.post(openaiEndpoint, data, { headers })
      .then((response) => {
				// Get response from OpenAI and add it to state as bot's message
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




