import Head from 'next/head';
import useEventStream from 'hooks/stream';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

// post chat message to server
// returns user id so that we can save it in localStorage (browser/client cache)
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
  // State for signed in user
  const [user, setUser] = useState({ name: '' });
  // State for whether or not user is signed in
  const [isSignedIn, setIsSignedIn] = useState();
  // State for current message typed in chat text field
  const [message, setMessage] = useState('');
  // whenever page loads, get user from local storage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') ?? '{ "name" : "" }');
    setUser(user);
    setIsSignedIn(user.id);
  }, []);
  // get data received from chat streaming server defined in pages/api/chat/index.js
  const data = useEventStream('/api/chat');

  // whenever data changes, scroll to bottom of page
  useEffect(() => {
    if (!isSignedIn) return;
    window.scrollTo({
      top: document.body.scrollHeight * 2,
      behavior: 'smooth',
    });
  }, [data, isSignedIn]);

  return (
    <main>
      <Head>
        <title>Chat App</title>
      </Head>
      {/* If isSignedIn is false/undefined, show elements in parentheses */}

      {isSignedIn && (
        <Button
          onClick={() => {
            localStorage.clear();
            setIsSignedIn(false);
          }}
        >
          Sign Out{' '}
        </Button>
      )}

      {!isSignedIn && (
        <div className="sign-in">
          <TextField
            className="text-field"
            // default value to user.name
            value={user.name}
            onChange={e => {
              // get value from text field
              const value = e.currentTarget.value;
              // set user name to value
              setUser({ ...user, name: value });
            }}
            autoComplete="off"
            label="Enter your name"
            variant="standard"
          />
          <Button
            // button is disabled if user.name is undefined
            disabled={!user.name}
            variant="contained"
            onClick={() => {
              // set user in local storage
              localStorage.setItem('user', JSON.stringify(user));
              // set isSignedIn to true, which hides this button and the text
              setIsSignedIn(true);
            }}
          >
            Submit
          </Button>
        </div>
      )}
      {isSignedIn && (
        <ul>
          {/* Map over data entries  */}
          {Object.entries(data ?? {})
            // sort by timestamp so that most recent messages are at the bottom
            .sort(([_, msg1], [__, msg2]) => msg1.timestamp - msg2.timestamp)
            // render li elements for messages
            .map(([id, msg]) => (
              <li
                key={id}
                // add mine class if the user id attached to the message matches our user id
                className={msg.user.id === user.id ? 'mine' : 'theirs'}
              >
                <div className="msg">{msg.text}</div>
                <div className="msg-info">
                  <strong>{msg.user.name}</strong>
                  <em>
                    {/* Convert timestamp to localized string that shows the time */}
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
      )}
      {/* If isSignedIn is true, show elements in parenthesis */}
      {isSignedIn && (
        <div className="send">
          <TextField
            value={message}
            autoComplete="off"
            className="text-field"
            onChange={e => {
              const value = e.currentTarget.value;
              // set message state whenever text field value changes
              setMessage(value);
            }}
            label="chat!"
            variant="standard"
          />

          <Button
            // button is disabled whenever message is empty
            disabled={!message}
            variant="contained"
            onClick={async () => {
              // send post request with message text and user
              const id = await post({ text: message.trim(), user });
              // clear message from text field by setting message to empty string
              setMessage('');
              // if user id exists, we're done
              if (user.id) return;
              // otherwise save user in local storage and setUser state
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
