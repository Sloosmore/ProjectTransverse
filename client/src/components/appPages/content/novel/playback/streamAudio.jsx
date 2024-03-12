import React, { useState, useEffect, useRef } from "react";
import ReactHowler from "react-howler";
import raf from "raf"; // requestAnimationFrame polyfill
import testAudio from "../../../../../assets/testAudio.wav";
import "./stream.css";
import { useAuth } from "@/hooks/auth";
import { fetchURLs } from "@/components/appPages/services/audio/streamAudio";
import { createUrlArray } from "@/components/appPages/services/audio/playback";
import { Howl } from "howler";

const AudioControls = ({ currentNote, mode }) => {
  const { session } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [seek, setSeek] = useState(0.0);
  const [rate, setRate] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [audioUrls, setAudioUrls] = useState(null);
  const playerRef = useRef(null);
  const rafId = useRef(null);
  const [section, setSection] = useState(0);
  const [chunk, setChunk] = useState(0);

  // Fetch the audio urls and set states
  useEffect(() => {
    if (currentNote.note_id === undefined) return;
    const fetchAudio = async () => {
      const urls = await fetchURLs(session, currentNote.note_id);
      const { urlArray, totTime } = createUrlArray(currentNote, urls);
      setDuration(totTime);
      setAudioUrls(urlArray);
    };
    fetchAudio();
  }, [currentNote]);
  // Playing the audio

  useEffect(() => {
    return () => {
      raf.cancel(rafId.current);
    };
  }, []);

  useEffect(() => {
    if (playing) {
      renderSeekPos();
    } else {
      raf.cancel(rafId.current);
    }
    return () => {
      raf.cancel(rafId.current);
    };
  }, [playing]);

  useEffect(() => {
    if (playing && Array.isArray(audioUrls) && audioUrls.length > 0) {
      // Calculate the new section based on the current seek position
      const newSection = audioUrls.findIndex((u) => seek < u.time);

      // Set the current section and chunk if the section has changed
      if (newSection !== section) {
        setSection(newSection);
        setChunk(0); // Reset chunk to the start of the new section

        // Preload the next section if it exists and hasn't been preloaded
        if (
          newSection + 1 < audioUrls.length &&
          !audioUrls[newSection + 1].howl
        ) {
          const nextUrls = audioUrls[newSection + 1].urls;
          // Assuming we preload the first URL of the next section
          audioUrls[newSection + 1].howl = new Howl({
            src: [nextUrls[0]],
            preload: true,
          });
        }
      }

      // Calculate the new chunk within the current section
      const pastSectionTime =
        newSection === 0 ? 0 : audioUrls[newSection - 1].time;
      const newChunk =
        newSection === section
          ? audioUrls[section].urls.findIndex(
              (url, index) => seek < pastSectionTime + (index + 1) * 30
            )
          : 0;

      if (newChunk !== chunk) {
        setChunk(newChunk);
      }
    }
  }, [seek, audioUrls, section, chunk]);

  //future use effect

  const handleToggle = () => setPlaying(!playing);

  const handleOnLoad = () => {
    setLoaded(true);
  };

  const handleOnPlay = () => {
    setPlaying(true);
    renderSeekPos();
  };

  const handleOnEnd = () => {
    setPlaying(false);
    raf.cancel(rafId.current);
  };

  const handleMouseDownSeek = () => {
    setIsSeeking(true);
    setPlaying(false);
  };

  const handleMouseUpSeek = () => {
    setIsSeeking(false);
    setPlaying(true);
  };

  const handleSeekingChange = (e) => {
    const newSeek = parseFloat(e.target.value);
    setSeek(newSeek);
    setShouldPlay(true);
    playerRef.current.seek(newSeek);
  };

  const renderSeekPos = () => {
    if (!isSeeking) {
      setSeek(playerRef.current.seek());
    }
    rafId.current = raf(renderSeekPos);
  };

  const handleRate = (e) => {
    const rate = parseFloat(e.target.value);
    playerRef.current.rate(rate);
    setRate(rate);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full flex flex-col">
      <ReactHowler
        src={
          (audioUrls &&
            audioUrls[section] &&
            audioUrls[section]["urls"][chunk]) ||
          testAudio
        }
        playing={playing}
        onLoad={handleOnLoad}
        onPlay={handleOnPlay}
        onEnd={handleOnEnd}
        ref={playerRef}
        format={["wav"]}
      />

      <div className=" flex justify-center mt-3.5 gap-x-5">
        <button
          onClick={() => {
            const newSeek = Math.max(seek - 5, 0);
            setSeek(newSeek);
            if (playerRef.current) {
              playerRef.current.seek(newSeek);
            }
          }}
        >
          <i
            className="bi bi-arrow-counterclockwise"
            style={{ fontSize: "1.25rem" }}
          ></i>
        </button>
        <button onClick={handleToggle}>
          <div className="w-8 h-8 rounded-full flex justify-center items-center bg-gray-500 hover:bg-gray-400">
            {playing ? (
              <i
                className="bi bi-pause-fill text-white"
                style={{ fontSize: "1.25rem" }}
              ></i>
            ) : (
              <i
                className="bi bi-play-fill text-white"
                style={{ marginLeft: "1.5px", fontSize: "1.25rem" }}
              ></i>
            )}
          </div>
        </button>
        <button
          onClick={() => {
            const newSeek = Math.max(seek + 5, 0);
            setSeek(newSeek);
            if (playerRef.current) {
              playerRef.current.seek(newSeek);
            }
          }}
        >
          <i
            className="bi bi-arrow-clockwise"
            style={{ fontSize: "1.25rem" }}
          ></i>
        </button>
      </div>

      <div className="w-full flex-row flex justify-center mt-2.5 slider-container items-center">
        <div className="playback-bar__progress-time-elapsed">
          {formatTime(seek / 1000)}
        </div>
        <div className=" w-1/2 my-auto mx-2 flex">
          <input
            type="range"
            min="0"
            max={duration ? duration.toFixed(2) : 0}
            step=".01"
            value={seek}
            onChange={handleSeekingChange}
            onMouseDown={handleMouseDownSeek}
            onMouseUp={handleMouseUpSeek}
            className="slider self-center flex-none"
            style={{
              "--c": seek >= 50 ? "darkgray" : "lightgray", // Change the color based on value
            }}
          />
          <div
            className="progress-bar-background"
            style={{ width: `${(seek / duration) * 100}%` }}
          ></div>
        </div>
        <div className="playback-bar__duration">
          {formatTime(duration / 1000)}
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
{
  /*
          <p>{loaded ? "Loaded" : "Loading"}</p>

<div className="rate">
  <label>
    Rate:
    <span className="slider-container">
      <input
        type="range"
        min="0.1"
        max="3"
        step=".01"
        value={rate}
        onChange={handleRate}
      />
    </span>
    {rate.toFixed(2)}
  </label>
</div>;
<button onClick={handleStop}>Stop</button>;

  const handleStop = () => {
    playerRef.current.stop();
    setPlaying(false);
    renderSeekPos();
  };*/
}
