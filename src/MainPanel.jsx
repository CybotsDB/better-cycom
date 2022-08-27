import { hot } from 'react-hot-loader/root';
import { Component, createRef } from 'react';
import { getUserColor, bannerURI, randomId } from './utils';

import Message from './Message';

class MainPanel extends Component {
  constructor(props) {
    super(props);
    this.inputRef = createRef();
    this.historyRef = createRef();
    this.userScrolled = false;
    this.state = {
      historicMessages: [],
    };
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
    const updatedEl = this?.historyRef?.current;
    if (updatedEl) {
      updatedEl.scrollTop = updatedEl.scrollHeight;
    }

    if (!this.loadingHistory) {
      this.loadingHistory = true;
      fetch('https://cycom-logger.fly.dev/api/message-history')
        .then(res => res.json())
        .then((response) => {
          this.loadingHistory = false;

          this.setState({
            historicMessages: response.data.reverse(),
            nextCursor: response.pagination.next_cursor,
          });
        });
    }
  }

  componentDidUpdate() {
    const updatedEl = this?.historyRef?.current;
    if (updatedEl) {
      if (!this.userScrolled) {
        updatedEl.scrollTop = updatedEl.scrollHeight;
      }
    }
  }

  onScroll = (e) => {
    const updatedEl = e.currentTarget;

    const scroll = updatedEl.scrollTop;
    const maxScroll = updatedEl.scrollHeight - updatedEl.clientHeight;

    const threshold = 50;
    const isScrollBottomedOut = maxScroll - scroll < threshold;

    this.userScrolled = !isScrollBottomedOut;

    if (scroll === 0) {
      this.setState({
        historicMessages: [
          ...this.state.historicMessages,
        ]
      });

      if (!this.loadingHistory) {
        this.loadingHistory = true;
        fetch(`https://cycom-logger.fly.dev/api/message-history?cursor=${this.state.nextCursor}`)
          .then(res => res.json())
          .then((response) => {
            this.loadingHistory = false;

            this.setState({
              historicMessages: [
                ...response.data.reverse(),
                ...this.state.historicMessages,
              ],
              nextCursor: response.pagination.next_cursor,
            });
          });
      }
    }
  }

  render() {
    const {
      messages,
    } = this.props;

    const {
      historicMessages,
    } = this.state;

    return (
      <div className="mainPanel">
        <div
          className="chatHistory"
          ref={this.historyRef}
          onScroll={this.onScroll}
        >
          {
            historicMessages.map((message) => {
              return <Message key={message._id} message={message} />
            })
          }
          {
            messages.map((message) => {
              return <Message key={message._id} message={message} />
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
