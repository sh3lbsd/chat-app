import { useState, useEffect, useCallback } from "react";

const Streams = {};

function Stream(path) {
  if (Streams[path]) return Streams[path];
  const src = new EventSource(path);
  const callbacks = {
    message: {},
    error: {}
  };
  function handler(e) {
    const funcs = callbacks[e.type];
    for (const k in funcs) funcs[k](e);
  }
  return {
    add: function (name, callback) {
      const index = Object.keys(callbacks[name]).length;
      callbacks[name][index] = callback;
      if (index === 0) {
        src.addEventListener(name, handler);
        Streams[path] = this;
      }
      return index;
    },
    remove: function (name, index) {
      delete callbacks[name][index];
      if (!Object.keys(callbacks[name]).length) {
        src.removeEventListener(name, handler);
        src.close();
        delete Streams[path];
      }
    }
  };
}

export default function useEventStream(path) {
  const [[messages, loading, errors], set] = useState([[], true, []]);

  const setData = useCallback(
    (e) =>
      set(([old, _, errors]) => [
        old.concat(JSON.parse(e.data)),
        false,
        errors
      ]),
    []
  );

  const setErrors = useCallback(
    (e) =>
      set(([messages, _, errors]) => [
        messages,
        false,
        errors.concat(JSON.parse(e.data))
      ]),
    []
  );

  useEffect(() => {
    const stream = Stream(path);
    const id = stream.add("message", setData);
    const errorId = stream.add("error", setErrors);
    return () => {
      stream.remove("message", id);
      stream.remove("error", errorId);
    };
  }, [path, setData, setErrors]);
  return {
    data: messages[messages.length - 1],
    error: errors[errors.length - 1],
    messages,
    loading,
    errors
  };
}
