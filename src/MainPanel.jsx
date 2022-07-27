import { hot } from 'react-hot-loader/root';
import { Component, createRef } from 'react';
import { getUserColor, bannerURI } from './utils';

import Message from './Message';

class MainPanel extends Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
    this.historyRef = createRef();
  }

  onKeyUp = (e) => {
    if (!e.shiftKey && e.keyCode == 13) {
      const message = e.target.value.trim();

      if (message.length > 0) {
        this.props.sendMessage(message.replace(/<.*?>/g, ''));
        e.target.value = '';
      }
    }
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  componentDidUpdate() {
    const updatedEl = this?.historyRef?.current;
    if (updatedEl) {
      updatedEl.scrollTop = updatedEl.scrollHeight;
    }
  }

  render() {
    const {
      messages,
    } = this.props;

    return (
      <div className="mainPanel">
        <div
          className="chatHistory"
          ref={this.historyRef}
        >
          <Message message={{ type: 'system', message: 'Welcome to CyCom' }} />
          {
            messages.map((message) => {
              return <Message message={message} />
            })
          }
        </div>
        <div className="messageInput">
          <input
            type="text"
            ref={this.inputRef}
            onKeyUp={this.onKeyUp}
          />
        </div>
      </div>
    );
  }
}

export default hot(MainPanel);
