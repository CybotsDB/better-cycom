import 'react-hot-loader/patch';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const attemptBoot = () => {

  const url = new URL(window.location.href);
  const username = url.searchParams.get('username');
  const password = url.searchParams.get('password');

  const socket = io.connect('http://playcybots.com:2020');

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App
        socket={socket}
        username={username}
        password={password}
      />
    </React.StrictMode>
  )
}

attemptBoot();
