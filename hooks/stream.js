import { useState, useEffect } from 'react';

// A react hook for managing state of data received from an EventSource
export default function useEventStream(url) {
  const [data, setData] = useState();
  //update state
  useEffect(() => {
    //EventSource is a js API for responding to Server Sent Events
    const stream = new EventSource(url);
    // callback for setting state from data received from EventSource
    // error handling
    const send = e => {
      try {
        const data = JSON.parse(e?.data);
        setData(data);
      } catch (e) {
        console.error(e);
      }
    };
    // listen for "message" event and call "send" when received
    stream.addEventListener('message', send);
    // clean up function
    return () => {
      // whenever this hook is no longer used, remove event listener
      stream.removeEventListener('message', send);
    };
    // what we put in this array determines when this effect runs
  }, [url]);
  //return state
  return data;
}
