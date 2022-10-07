import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    if (replace === false) {
      setHistory((prev) => [...prev, newMode]);
    } else {
      setHistory((prev) => {
        prev.slice(0, -1, newMode);
        return history;
      });
    }
  }

  const back = () => {
    if (history.length > 1) {
      history.pop();
      setHistory([...history]);
      setMode(history[history.length - 1]);
    }
  };

  return { mode, transition, back };
}
