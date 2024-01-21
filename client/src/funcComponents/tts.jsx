import React, { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import "./tts.css";

const TextToSpeech = ({ text, modeKit }) => {
  const [speaking, setSpeaking] = useState(false);
  const [speechRate, setSpeechRate] = useState(1);
  const [started, setStarted] = useState(false);
  const utterance = new SpeechSynthesisUtterance(text);
  const { mode, setMode } = modeKit;
  const [voicedText, setVoiceText] = useState("");

  useEffect(() => {
    utterance.rate = speechRate;
    utterance.onend = () => {
      setSpeaking(false);
      setStarted(false);
    };
  }, [speechRate, text]);

  useEffect(() => {
    if (mode === "note") {
      handleReset();
    }
  }, [mode]);

  const handlePlayPause = () => {
    if (speaking) {
      setMode("default");
      speechSynthesis.pause();
      setSpeaking(false);
    } else {
      if (!started) {
        setMode("playback");
        setVoiceText(text);
        speechSynthesis.speak(utterance);
        setStarted(true);
      } else {
        speechSynthesis.resume();
      }
      setSpeaking(true);
    }
  };

  useEffect(() => {
    if (text !== voicedText) {
      handleReset();
    }
  }, [text]);

  const handleReset = () => {
    speechSynthesis.cancel();
    setSpeaking(false);
    setStarted(false);
  };

  const handleRateChange = (e) => {
    setSpeechRate(e.target.value);
  };

  return (
    <>
      {mode !== "note" && (
        <div className="container my-3">
          <div className="d-flex justify-content-end align-items-center">
            {started && !speaking && (
              <button className="text-secondary btn" onClick={handleReset}>
                <i
                  className="bi bi-skip-backward-fill"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              </button>
            )}
            <button
              className="btn me-2 text-secondary"
              onClick={handlePlayPause}
              style={{
                border: "none",
                width: "50px",
                boxSizing: "border-box",
                margin: "2px",
              }}
            >
              {speaking ? (
                <i
                  className="bi bi-pause-fill"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              ) : (
                <i
                  className="bi bi-play-fill"
                  style={{ fontSize: "1.5rem" }}
                ></i>
              )}
            </button>

            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="dropdown-basic"
                className="dropdown-toggle"
              >
                <i className="bi bi-gear" style={{ fontSize: "1.25rem" }}></i>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.ItemText>
                  <label htmlFor="rateSelect" className="form-label">
                    Speed:
                  </label>
                  <select
                    className="form-select"
                    value={speechRate}
                    onChange={handleRateChange}
                    id="rateSelect"
                  >
                    <option value="0.5">0.5x</option>
                    <option value="1">1x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                    <option value="1.75">1.75x</option>
                    <option value="2">2x</option>
                  </select>
                </Dropdown.ItemText>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      )}
    </>
  );
};

export default TextToSpeech;
