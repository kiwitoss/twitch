import './App.css';
import { usePomodoroTimer } from './hooks.ts';

function App() {
  const { timeLeft, status, totalRepeats } = usePomodoroTimer();
  const secondsLeft = String(timeLeft % 60).padStart(2, '0');
  const minutesLeft = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  return (
    <>
      <h1>{status}</h1>
      <h1>{totalRepeats}</h1>
      <h1>{`${minutesLeft}:${secondsLeft}`}</h1>
    </>
  );
}

export default App;
