import realtime from 'firebase/admin';

export default (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.flushHeaders();

  function write(data, event = 'message') {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    res.flush();
  }

  function error(error) {
    write({ error }, 'error');
  }

  realtime.ref('chat').on('value', (snap, e) => {
    return e ? error(e.toString()) : write(snap);
  });
};
