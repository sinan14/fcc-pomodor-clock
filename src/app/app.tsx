// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from 'react';
const defaultPomodoroSession = 25;

export function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(defaultPomodoroSession);
  const [isTimerRunning, setTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(defaultPomodoroSession);

  const breakLengthHandler = (type: 'increment' | 'decrement') => {
    if (isTimerRunning) return;
    const prev = breakLength;
    let updatedVal = 0;
    if (type === 'increment') {
      if (breakLength === 60) return;
      updatedVal = prev + 1;
    } else {
      if (breakLength === 1) return;
      updatedVal = prev - 1;
    }
    setBreakLength(updatedVal);
    if (isBreak) {
      setSeconds(0);
      setMinutes(updatedVal);
    }
  };
  const sessionLengthHandler = (type: 'increment' | 'decrement') => {
    if (isTimerRunning) return;
    const prev = sessionLength;
    let updatedVal = 0;
    if (type === 'increment') {
      if (sessionLength === 60) return;
      updatedVal = prev + 1;
    } else {
      if (sessionLength === 1) return;
      updatedVal = prev - 1;
    }
    setSessionLength(updatedVal);
    if (!isBreak) {
      setSeconds(0);
      setMinutes(updatedVal);
    }
  };
  const resetHandler = () => {
    setTimerRunning(false);
    setSeconds(0);
    setMinutes(25);
    setSessionLength(25);
    setBreakLength(5);
    setIsBreak(false);
    const audio = document.getElementById('beep') as HTMLAudioElement;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    let intervalId: any;
    if (isTimerRunning) {
      intervalId = setInterval(() => {
        if (seconds === 0) {
          if (!minutes) {
            let min = breakLength;
            if (isBreak) {
              setIsBreak(false);
              min = sessionLength;
            } else {
              setIsBreak(true);
            }
            setMinutes(min);
            setSeconds(0);
            playSound();
          } else {
            setSeconds(59);
            setMinutes((prevMinutes) => prevMinutes - 1);
          }
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isTimerRunning, seconds, minutes]);

  const handleStart = () => {
    setTimerRunning(true);
  };

  const handleStop = () => {
    setTimerRunning(false);
  };
  const playSound = () => {
    const audio = document.getElementById('beep') as HTMLAudioElement;
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };
  const timeLeft = `${minutes < 10 ? '0' + minutes : minutes}:${
    seconds < 10 ? '0' + seconds : seconds
  }`;
  return (
    <div className="container">
      <h1 style={{ textTransform: 'uppercase' }}>Pomodoro Timer</h1>
      <div className="length_control-box">
        <div className="length_control">
          <div className="label" id="break-label">
            Break Length
          </div>
          <div className="ctrl_btns">
            <button
              id="break-decrement"
              onClick={() => breakLengthHandler('decrement')}
            >
              <span role="img" aria-label="arrow-down">
                ⬇
              </span>
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-increment"
              onClick={() => breakLengthHandler('increment')}
            >
              <span role="img" aria-label="arrow-up">
                ⬆
              </span>
            </button>
          </div>
        </div>
        <div className="length_control">
          <div className="label" id="session-label">
            Session Length
          </div>
          <div className="ctrl_btns">
            <button
              id="session-decrement"
              onClick={() => sessionLengthHandler('decrement')}
            >
              <span role="img" aria-label="arrow-down">
                ⬇
              </span>
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              id="session-increment"
              onClick={() => sessionLengthHandler('increment')}
            >
              <span role="img" aria-label="arrow-up">
                ⬆
              </span>
            </button>
          </div>
        </div>
      </div>
      <div
        className="timer"
        style={{
          color:
            minutes === 0 && seconds < 60 && seconds > 0
              ? 'rgb(166, 13, 13)'
              : '',
        }}
      >
        <div id="timer-label">{isBreak ? 'Break' : 'Session'}</div>
        <div id="time-left">{timeLeft}</div>
      </div>
      <div className="timer_control">
        <button
          className="pause"
          id="start_stop"
          onClick={isTimerRunning ? handleStop : handleStart}
        >
          {isTimerRunning && (
            <span role="img" aria-label="pause-icon">
              ⏸
            </span>
          )}
          {!isTimerRunning && (
            <span role="img" aria-label="play-icon">
              ▶
            </span>
          )}
        </button>
        <button id="reset" className="reset" onClick={resetHandler}>
          <span role="img" aria-label="reset-icon">
            🔄
          </span>
        </button>
      </div>

      <audio
        id="beep"
        preload="auto"
        src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
      ></audio>
      {/* <div className="author">
        
        Coded by <br />
        <a href="https://goo.gl/6NNLMG">Mohammed sinan</a>
      </div> */}
    </div>
  );
}

export default App;
