import Head from 'next/head';
import useEventStream from 'hooks/stream';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

// post chat message to server
// returns user id so that we can save it in localStorage (browser cache)
function post(message) {
  return fetch('/api/chat/message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/text',
    },
    body: JSON.stringify(message),
  }).then(r => r.text());
}

const Home = () => {
  const [user, setUser] = useState({ name: '' });
  const [isSignedIn, setIsSignedIn] = useState();
  const [message, setMessage] = useState('');
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') ?? '{ "name" : "" }');
    setUser(user);
    setIsSignedIn(user.id);
  }, []);
  const data = useEventStream('/api/chat');
  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  }, [data]);
  return (
    <main>
      <Head>
        <title>Chat App</title>
      </Head>
      {!isSignedIn && (
        <div className="sign-in">
          <TextField
            className="text-field"
            value={user.name}
            onChange={e => {
              const value = e.currentTarget.value;
              setUser({ ...user, name: value });
            }}
            label="Enter your name"
            variant="standard"
          />

          <Button
            disabled={!user.name}
            variant="contained"
            onClick={() => {
              localStorage.setItem('user', JSON.stringify(user));
              setIsSignedIn(true);
            }}
          >
            Submit
          </Button>
        </div>
      )}
      <ul>
        {Object.entries(data ?? {})
          .sort(([_, msg1], [__, msg2]) => msg1.timestamp - msg2.timestamp)
          .map(([id, msg]) => (
            <li
              key={id}
              className={msg.user.id === user.id ? 'mine' : 'theirs'}
            >
              <div className="msg">{msg.text}</div>
              <div className="msg-info">
                <strong>{msg.user.name}</strong>
                <em>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </em>
              </div>
            </li>
          ))}
      </ul>
      {isSignedIn && (
        <div className="send">
          <TextField
            value={message}
            className="text-field"
            onChange={e => {
              const value = e.currentTarget.value;
              setMessage(value);
            }}
            label="chat!"
            variant="standard"
          />

          <Button
            disabled={!message}
            variant="contained"
            onClick={async () => {
              const id = await post({ text: message.trim(), user });
              setMessage('');
              if (user.id) return;
              user.id = id;
              localStorage.setItem('user', JSON.stringify(user));
              setUser(user);
            }}
          >
            Send
          </Button>
        </div>
      )}
    </main>
  );
};

export default Home;
