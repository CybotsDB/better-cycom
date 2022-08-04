import { hot } from 'react-hot-loader/root';
import { Component, useState } from 'react'
import './App.css'
import { getUserColor, bannerURI, randomId } from './utils';
import {
  BANNER_BASE_URI,
  BANNER_ERROR_URI,
} from './constants'

import Message from './Message.jsx';
import SidePanel from './Sidepanel';
import MainPanel from './MainPanel';

class App extends Component {
  constructor(props) {
    super(props)

    this.loggingIn = false;
    this.state = {
      booted: false,
      users: [],
      channels: null,
      messages: [],
    };
  }

  onSocketConnect = (event) => {
    const {
      username,
      password,
      socket,
    } = this.props;

    if (!this.loggingIn) {
      socket.emit('login', { username, password });
      this.loggingIn = true;
    }
  }

  onSocketLoginResult = (event) => {
    const { socket } = this.props;
    socket.emit('channel', { type: "join" });
  }

  onSocketChannel = (event) => {
    const data = JSON.parse(event)

    if (data.type === 'join') {
      this.setState({
        booted: true,
        currentChannel: data.channel,
        messages: [
          ...this.state?.messages || [],
          {
            _id: randomId(),
            type: 'system',
            message: 'Welcome to CyCom'
          },
          {
            _id: randomId(),
            type: 'join',
            username: data.username,
          }
        ],
      })
    } else if (data.type === 'leave') {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            type: 'leave',
            username: data.username,
          }
        ],
      })
    } else if (data.type === 'list') {
      this.setState({
        channels: data.channels, //.reverse(),
      })
    } else if (data.type === 'userlist') {
      this.setState({
        users: data.users.sort((a, b) => {
          if (a.rank === 0) {
            return 1;
          } else if (b.rank === 0) {
            return -1;
          } else {
            return a.rank - b.rank;
          }
        }),
      })
    }
  }

  onSocketChat = (event) => {
    const data = JSON.parse(event)

    data._id = randomId();

    if (data.sender) {
      data.user = {
        ...this.state.users.find((u) => u.username == data.sender)
      };

      data.user.bannerURI = bannerURI(data.user);
    }

    this.setState({
      messages: [
        ...this.state.messages,
        data,
      ]
    })
  }

  onChannelChange = (e) => {
    const { socket } = this.props;
    socket.emit('channel', { type: "change", channel_name: e.currentTarget.value });
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on('connect', this.onSocketConnect);
    socket.on('login_result', this.onSocketLoginResult);
    socket.on('channel', this.onSocketChannel);
    socket.on('chat', this.onSocketChat);
  }

  componentWillUnmount() {
    const { socket } = this.props;
    if (socket) {
      socket.off('connect', this.onSocketConnect);
      socket.off('login_result', this.onSocketLoginResult);
      socket.off('channel', this.onSocketChannel);
      socket.off('chat', this.onSocketChat);
    }
  }

  sendMessage = (messageString) => {
    const { socket, username } = this.props;
    const message = { type: 'channel', message: messageString }
    socket.emit('chat', { ...message });

    message.user = {
      ...this.state.users.find((u) => u.username.toLowerCase() === username.toLowerCase())
    };

    message.user.bannerURI = bannerURI(message.user);

    this.setState({
      messages: [
        ...this.state.messages,
        {
          _id: randomId(),
          ...message,
        },
      ]
    })
  }

  render() {
    if (!this.state || !this.state.booted || this.state.channels === null) {
      return <div>Loading...</div>;
    }

    const {
      currentChannel,
      channels,
      users,
      messages,
    } = this.state;

    return (
      <div className='app'>
        <SidePanel
          currentChannel={currentChannel}
          onChannelChange={this.onChannelChange}
          channels={channels}
          users={users}
        />
        <MainPanel
          messages={messages}
          sendMessage={this.sendMessage}
        />
      </div>
    )
  }
}

export default hot(App);
