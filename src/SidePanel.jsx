import { hot } from 'react-hot-loader/root';
import { Component } from 'react';
import { getUserColor, bannerURI } from './utils';
import { BANNER_ERROR_URI } from './constants';

class SidePanel extends Component {
  render() {
    const {
      currentChannel,
      onChannelChange,
      channels,
      users,
    } = this.props;

    return (
      <div className='sidePanel'>
        <div className="channelSelector">
          <select
            defaultValue={currentChannel}
            onChange={onChannelChange}
          >
            {
              channels.map((channel) => {
                return (
                  <option
                    key={channel.channel_name}
                    value={channel.channel_name}
                  >
                    {channel.channel_name} ({channel.user_count})
                  </option>
                )
              })
            }
          </select>
        </div>
        <div className="userList">
          {
            users.map((user) => {
              return (
                <div
                  key={user.username}
                  className='userListUser'
                >
                  <div className="userListUserBanner">
                    <img
                      style={{
                        width: '16px',
                        height: '12px',
                      }}
                      src={bannerURI(user)}
                      onError={function (e) {
                        e.target.src = BANNER_ERROR_URI;
                      }}
                    />
                  </div>
                  <div
                    className="userListUserUsername"
                    style={{
                      color: getUserColor(user),
                    }}
                  >
                    {user.username}
                  </div>
                  <div className="userListUserRank">
                    {user.rank == 0 ? '-' : user.rank}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

export default hot(SidePanel);
