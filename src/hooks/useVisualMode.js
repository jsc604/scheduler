import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    replace ? setHistory(prev => [...prev.slice(0, prev.length - 1), newMode])
      : setHistory(prev => [...prev, newMode]);
  };

  function back() {
    if (history.length > 1) {
      setHistory(history.slice(0, -1));
      setMode(history[history.length - 2]);
    }
  };

  return { mode, transition, history, back };
};
