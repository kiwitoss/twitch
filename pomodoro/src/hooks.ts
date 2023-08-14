import { useEffect, useState } from 'react';

const DEFAULTS = {
  shortBreakTime: 1 / 30,
  longBreakTime: 1,
  repeatTime: 1 / 6,
  numberOfRepeats: 4,
};

function minutesToMiliseconds(minutes: number) {
  return minutes * 60 * 1000;
}

enum Status {
  LONG_BREAK = 'Long break',
  SHORT_BREAK = 'Short break',
  WORKING = 'Working',
}

function usePomodoroTimer() {
  const [totalRepeats, setTotalRepeats] = useState(0);
  const [status, setStatus] = useState<Status>(Status.WORKING);
  const [timeLeft, setTimeLeft] = useState(DEFAULTS.repeatTime * 60);

  useEffect(() => {
    const intervalID = setInterval(() => setTimeLeft((state) => state - 1), 1000);
    return () => clearInterval(intervalID);
  }, [status]);

  // long break timeout
  useEffect(() => {
    if (status !== Status.LONG_BREAK) return;
    const timeoutId = setTimeout(() => {
      setTimeLeft(DEFAULTS.repeatTime * 60);
      setStatus(Status.WORKING);
    }, minutesToMiliseconds(DEFAULTS.longBreakTime));

    return () => clearTimeout(timeoutId);
  }, [status]);

  // short break timeout
  useEffect(() => {
    if (status !== Status.SHORT_BREAK) return;
    const timeoutId = setTimeout(() => {
      setTimeLeft(DEFAULTS.repeatTime * 60);
      setStatus(Status.WORKING);
    }, minutesToMiliseconds(DEFAULTS.shortBreakTime));

    return () => clearTimeout(timeoutId);
  }, [status]);

  // working timeout
  useEffect(() => {
    if (status !== Status.WORKING) return;
    const timeoutId = setTimeout(() => {
      if ((totalRepeats + 1) % 4 === 0) {
        setTimeLeft(DEFAULTS.longBreakTime * 60);
        setStatus(Status.LONG_BREAK);
      } else {
        setTimeLeft(DEFAULTS.shortBreakTime * 60);
        setStatus(Status.SHORT_BREAK);
      }
      setTotalRepeats((r) => r + 1);
    }, minutesToMiliseconds(DEFAULTS.repeatTime));

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return {
    status,
    timeLeft,
    totalRepeats,
  };
}

export { usePomodoroTimer };
