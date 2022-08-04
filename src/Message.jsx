import { hot } from 'react-hot-loader/root';
import { Component } from 'react'

const BANNER_BASE_URI = 'http://playcybots.com/uploads/banners/';
const BANNER_ERROR_URI = 'http://playcybots.com/images/missing.png';

const COLOR_SYSTEM = '#ecb658';
const COLOR_BROADCAST = '#ccff33';

function getUserColor(user) {
  if (user.vetrank == 1) return "#7281ca";
  if (user.rank == 1) return "#ff394b";
  if (user.vetrank <= 25 && user.vetrank > 0) return "#a2cffd";
  if (user.rank <= 25 && user.rank > 0) return "#fc7c85";
  return "#a0e6a0";
}

class Message extends Component {
  render() {
    const { message } = this.props;

    if (message.type === 'system') {
      return (
        <div
          style={{
            color: COLOR_SYSTEM,
          }}
        >
          {message.message}
        </div>
      )
    }

    if (message.type === 'join') {
      return (
        <div
          style={{
            color: COLOR_SYSTEM,
          }}
        >
          {message.username} has arrived.
        </div>
      )
    }

    if (message.type === 'leave') {
      return (
        <div
          style={{
            color: COLOR_SYSTEM,
          }}
        >
          {message.username} left.
        </div>
      )
    }


    if (message.type === 'broadcast') {
      return (
        <div
          style={{
            color: COLOR_BROADCAST,
          }}
        >
          {message.message}
        </div>
      )
    }

    if (message.type === 'channel') {
      return (
        <div>
          <img
            src={message?.user?.bannerURI}
            style={{
              width: '16px',
              height: '12px',
              marginRight: '4px',
            }}
            onError={function (e) {
              e.target.src = BANNER_ERROR_URI;
            }}
          />
          <span
            style={{
              color: getUserColor(
                message?.user,
              )
            }}
          >
            {message?.user?.username}{'> '}
          </span>
          <span>
            {message.message}
          </span>
        </div>
      )
    }

    return (
      <div>
        Unknown message type {message.type}
      </div>
    )
  }
}

export default hot(Message);
