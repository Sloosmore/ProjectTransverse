import React, { useState, useEffect, useRef } from "react";
import testAudio from "../../../../../assets/testAudio.wav";
import "./stream.css";
import { useAuth } from "@/hooks/auth";
import { fetchURLs } from "@/components/appPages/services/audio/streamAudio";
import { getMaxTime } from "@/components/appPages/services/audio/playback";
import { Howl } from "howler";

const TestAudioControls = ({ currentNote, mode }) => {
  const { session } = useAuth();
  const [playing, setPlaying] = useState(false);
  const [globalSeek, setglobalSeek] = useState(0.0);
  const [duration, setDuration] = useState(0.0);

  //loaded audio
  const [audio, setAudio] = useState([]);

  //audio data
  const [audioData, setAudioData] = useState([]);

  //audio index
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);

  const requestRef = useRef();

  // Fetch the audio urls and set states
  useEffect(() => {
    if (currentNote.note_id === undefined) return;
    const fetchAudio = async () => {
      const segData = await fetchURLs(session, currentNote.note_id);
      const urls = segData.map((seg) => seg.url);
      console.log("loaded urls", urls);
      const sounds = urls.map(
        (url, index) =>
          new Howl({
            src: [url],
            preload: true,
            html5: true,
            buffer: true,
          })
      );
      console.log("sounds", sounds);
      setAudioData(segData);
      setAudio(sounds);
      const { totTime } = getMaxTime(segData);
      setDuration(totTime / 1000);
    };
    fetchAudio();
  }, [currentNote]);

  useEffect(() => {
    if (audio) {
      audio.forEach((sound, index) => {
        sound.on("end", () => {
          const nextIndex = index + 1;
          if (nextIndex < audio.length) {
            audio[nextIndex].play();
            setCurrentSoundIndex(nextIndex);
          }
        });
      });
    }
  }, [audio]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateSeek);
    return () => cancelAnimationFrame(requestRef.current);
  }, [currentSoundIndex, audio]);

  const updateSeek = () => {
    if (audio[currentSoundIndex] && audio[currentSoundIndex].playing()) {
      const newSeek =
        audio[currentSoundIndex].seek() +
        (audioData[currentSoundIndex].end_time -
          audioData[currentSoundIndex].duration) /
          1000;
      setglobalSeek(newSeek);
    }
    requestRef.current = requestAnimationFrame(updateSeek);
  };

  const TOLERANCE_RANGE = 5;

  const handleSliderChange = (e) => {
    const newSeek = parseFloat(e.target.value);
    setglobalSeek(newSeek);
  };

  const handleToggle = () => {
    if (audio[currentSoundIndex]) {
      if (audio[currentSoundIndex].playing()) {
        audio[currentSoundIndex].pause();
      } else {
        audio[currentSoundIndex].play();
      }
    }
    setPlaying(!playing);
  };

  useEffect(() => {
    // loop through audioData to find the current index for the new seek
    for (let i = 0; i < audioData.length; i++) {
      // this will trigger when the new seek is less than the end time of the current audioData
      // which means the new seek is within the current audioData
      if (globalSeek < audioData[i].end_time / 1000) {
        const audioStart =
          (audioData[i].end_time - audioData[i].duration) / 1000;
        // first check if the index is the same as the currentSoundIndex
        // if it is, then we don't need to do anything
        if (i === currentSoundIndex) {
          const currentSeek = audio[currentSoundIndex].seek() + audioStart;

          // Check if the seek change is within the tolerance range

          if (Math.abs(globalSeek - currentSeek) > TOLERANCE_RANGE) {
            audio[currentSoundIndex].seek(globalSeek - audioStart);
          }
          return;
        }

        // if it is not and the audio is not playing, then we just need to set the currentSoundIndex to i
        // we also need to set the seek to the new seek
        else if (!audio[currentSoundIndex].playing()) {
          console.log("setting index", i);
          setCurrentSoundIndex(i);
          // this seek is relitive to the start of this audio instead of the start of the entire audio

          audio[i].seek(globalSeek - audioStart);
          return;
        }
        // if it is not and the audio is playing, then we need to pause the current audio and play the new audio
        else {
          audio[currentSoundIndex].pause();
          setCurrentSoundIndex(i);
          audio[i].play();
          return;
        }
      }
    }
  }, [globalSeek]);

  useEffect(() => {
    console.log("currentSoundIndex", currentSoundIndex);
  }, [currentSoundIndex]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-col">
        <div className=" flex justify-center mt-3.5 gap-x-5">
          <button
            className="mt-1"
            onClick={() => {
              // Calculate the new seek time, ensuring it does not exceed the duration
              let newSeek;
              if (globalSeek - 30 < 0) {
                newSeek = 0;
              } else {
                newSeek = Math.min(globalSeek - 30, duration);
              }

              setglobalSeek(newSeek);
            }}
          >
            <i
              className="bi bi-arrow-counterclockwise"
              style={{ fontSize: "1.1rem", marginTop: "10px" }}
            ></i>
          </button>
          {/*

          <button>
          If in the middle of a section, go to the start of the section (set index)
          If at the start of a section, go to the start of the previous section (set index-1)
         
            <i
              className="bi bi-skip-start-fill"
              style={{ fontSize: "1.25rem" }}
            ></i>
          </button>
           */}
          <button onClick={() => handleToggle()}>
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
          {/* 
          <button>
      
          Set index+1
      
            <i
              className="bi bi-skip-end-fill"
              style={{ fontSize: "1.25rem" }}
            ></i>{" "}
          </button>
              */}
          <button
            className="mt-1"
            onClick={() => {
              // Calculate the new seek time, ensuring it does not exceed the duration
              const newSeek = Math.min(globalSeek + 30, duration);
              setglobalSeek(newSeek);
            }}
          >
            <i
              className="bi bi-arrow-clockwise"
              style={{ fontSize: "1.1rem", marginTop: "10px" }}
            ></i>
          </button>
        </div>

        <div className="w-full flex-row flex justify-center mt-2.5 slider-container items-center">
          <div className="playback-bar__progress-time-elapsed">
            {formatTime(globalSeek)}
          </div>
          <div className=" md:w-4/12 w-5/12 my-auto mx-2 flex">
            <input
              type="range"
              min="0"
              step=".001"
              value={globalSeek}
              max={duration}
              onChange={handleSliderChange}
              className="slider self-center flex-none"
              style={{
                "--c": "lightgray", // Change the color based on value
              }}
            />
            <div
              className="progress-bar-background"
              style={{ width: `${(globalSeek / duration) * 100}%` }}
            ></div>
          </div>
          <div className="playback-bar__duration">
            {formatTime(duration) || "00:00"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAudioControls;
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
  /*
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
  }, [seek, audioUrls, section, chunk]);*/
}
