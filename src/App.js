import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const initialState = {
  work: 25,
  rest: 5,
  isRunning: false,
  isWorking: true,
}

const initialDisplay = {
  minute: 25,
  second: 0
}

const App = () => {
  const [state, setState] = useState(initialState);
  const [display, setDisplay] = useState(initialDisplay);

  const useInterval = (callback, delay) => {
    const intervalId = useRef(null);
    const savedCallback = useRef(callback);

    useEffect(() => {
      savedCallback.current = callback;
    });

    useEffect(() => {
      const tick = () => savedCallback.current();
      if (typeof delay === 'number') {
        intervalId.current = setInterval(tick, delay);
        return () => clearInterval(intervalId.current);
      }
    }, [delay]);

    return intervalId.current;
  }

  useEffect(() => {
    console.log("useEffect")
    if (state.isWorking) {
      setDisplay({
        minute: state.work,
        second: 0
      })
    } else {
      setDisplay({
        minute: state.rest,
        second: 0
      })
    }
  }, [state.isWorking, state.rest, state.work])

  const padder = (num) => {
    return num.toString().padStart(2, 0);
  }

  useInterval(() => {
    if (state.isRunning) {
      if (display.second > 0) {
        setDisplay(prevState => ({
          ...prevState,
          second: prevState.second - 1
        }))
      }

      if (display.second < 1) {
        if (display.minute > 0) {
          setDisplay(prevState => ({
            ...prevState,
            minute: prevState.minute - 1,
            second: 59
          }))
        }
        else {
          //alert("Timer stopped");
          setTimer()
        }
      }
    }
  }, 1000);

  const setTimer = () => {
    //console.log("setTimer starts!")
    setState(prevState => ({
      ...prevState,
      isWorking: !prevState.isWorking,
      isRunning: true,
    }));
  }

  const resetTimer = () => {
    setState({
      ...initialState
    })
    setDisplay({
      minute: state.work,
      second: 0
    })
  }

  const toggleTimer = () => {
    setState(prevState => ({
      ...prevState,
      isRunning: !prevState.isRunning
    }))
  };

  const checkConstraint = ({ value, type }) => {
    if (type === "up") {
      if (value + 1 > 60) {
        return true;
      } else {
        return false;
      }
    }

    if (type === "down") {
      if (value - 1 <= 0) {
        return true;
      } else {
        return false;
      }
    }
  }

  const handleArrowButton = ({ isWork, direction }) => {
    if (!state.isRunning) {
      if (isWork) {
        switch (direction) {
          case "up":
            if (checkConstraint({ value: state.work, type: "up" })) {
              return;
            }
            setState(prevState => ({
              ...prevState,
              work: prevState.work + 1
            }));
            break;
          case "down":
            if (checkConstraint({ value: state.work, type: "down" })) {
              return;
            }
            setState(prevState => ({
              ...prevState,
              work: prevState.work - 1
            }))
            break;
          default:
        }
      } else {
        switch (direction) {
          case "up":
            if (checkConstraint({ value: state.rest, type: "up" })) {
              return;
            }
            setState(prevState => ({
              ...prevState,
              rest: prevState.rest + 1
            }))
            break;
          case "down":
            if (checkConstraint({ value: state.rest, type: "down" })) {
              return;
            }
            setState(prevState => ({
              ...prevState,
              rest: prevState.rest - 1
            }))
            break;
          default:
        }
      }
      console.log(state);
      setDisplay({
        minute: state.work,
        second: 0
      })
    }
  }
  <button className="down">Down</button>
  const ControlButton = (props) => {
    return (
      <button onClick={props.handler} className={props.className}>{props.name}</button>
    )
  }

  return (
    <div className="App">
      <div id="container">
        <div id="timer">
          <span>{padder(display.minute)}</span>:<span>{padder(display.second)}</span>
        </div>
        <div id="panel">
          <ControlButton handler={toggleTimer} name={state.isRunning ? "Pause" : "Start"} />
          <ControlButton handler={resetTimer} name="Reset" />
          <br />
          <br />
          <span id="work">
            <span>{state.work}</span>
            <ControlButton handler={() => handleArrowButton({ isWork: true, direction: "up" })} name="Up" />
            <ControlButton handler={() => handleArrowButton({ isWork: true, direction: "down" })} name="Down" />
          </span>
          <span id="rest">
            <span>{state.rest}</span>
            <ControlButton handler={() => handleArrowButton({ isWork: false, direction: "up" })} name="Up" />
            <ControlButton handler={() => handleArrowButton({ isWork: false, direction: "down" })} name="Down" />
          </span>
        </div>
      </div>
    </div>
  );
}

// function App() {
//   const [counter, setCounter] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       console.log("Counter: ", counter)
//       setCounter(counter => counter + 1);
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return <h1>{counter}</h1>;
// };

export default App;
