import { useEffect, useState } from 'react';

import DeskBellAudio from './assets/desk-bell.mp3';

const DEFAULTS = {
  shortBreakTime: 5,
  longBreakTime: 15,
  repeatTime: 25,
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

const timeoutMap = {
  [Status.SHORT_BREAK]: DEFAULTS.shortBreakTime,
  [Status.LONG_BREAK]: DEFAULTS.longBreakTime,
  [Status.WORKING]: DEFAULTS.repeatTime,
};

const bellSound = new Audio(DeskBellAudio);

function usePomodoroTimer() {
  const [totalRepeats, setTotalRepeats] = useState(0);
  const [status, setStatus] = useState<Status>(Status.WORKING);
  const [timeLeft, setTimeLeft] = useState(DEFAULTS.repeatTime * 60);

  useEffect(() => {
    const intervalID = setInterval(() => setTimeLeft((state) => state - 1), 1000);
    return () => clearInterval(intervalID);
  }, [status]);

  useEffect(() => {
    const timeout = minutesToMiliseconds(timeoutMap[status]);
    const timeoutId = setTimeout(() => {
      bellSound.play();

      if (status === Status.LONG_BREAK || status === Status.SHORT_BREAK) {
        setTimeLeft(DEFAULTS.repeatTime * 60);
        setStatus(Status.WORKING);
      } else {
        if ((totalRepeats + 1) % 4 === 0) {
          setTimeLeft(DEFAULTS.longBreakTime * 60);
          setStatus(Status.LONG_BREAK);
        } else {
          setTimeLeft(DEFAULTS.shortBreakTime * 60);
          setStatus(Status.SHORT_BREAK);
        }
        setTotalRepeats((r) => r + 1);
      }
    }, timeout);

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
