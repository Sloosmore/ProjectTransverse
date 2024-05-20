import React, { useState, useEffect, useRef } from "react";
import "./stream.css";
import { useAuth } from "@/hooks/userHooks/auth";
import { fetchURLs } from "@/components/appPages/services/audio/streamAudio";
import { getMaxTime } from "@/components/appPages/services/audio/playback";
import { Howl } from "howler";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const inDevelopment = import.meta.env.VITE_NODE_ENV === "development";

const AudioControls = ({ currentNote, mode, globalSeek, setglobalSeek }) => {
  const { session } = useAuth();

  const [missing, setMissing] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0.0);
  const [disabled, setDisabled] = useState(true);
  //const [globalSeek, setglobalSeek] = useState(0.0);

  //loaded audio
  const [audio, setAudio] = useState([]);

  //audio data
  const [audioData, setAudioData] = useState([]);

  //audio index
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);

  const requestRef = useRef();

  const globalSeekRef = useRef(globalSeek);

  useEffect(() => {
    globalSeekRef.current = globalSeek;
  }, [globalSeek]);

  // Fetch the audio urls and set states
  useEffect(() => {
    if (currentNote?.note_id === undefined) return;
    const fetchAudio = async () => {
      if (
        audio.length === 0 ||
        audio[0]?._src.length === 0 ||
        !audio[0]._src[0]
      ) {
        const segData = await fetchURLs(session, currentNote.note_id);
        if (segData) {
          const urls = segData.map((seg) => seg.url);
          const sounds = urls.map(
            (url, index) =>
              new Howl({
                src: [url],
                preload: true,
                html5: true,
                buffer: true,
                onload: function () {
                  let newSeek = globalSeekRef.current;
                  console.log("okay the problem has been idetified");
                  if (index !== 0) {
                    if (inDevelopment) {
                      console.log("loaded data");
                      console.log(segData[index - 1].end_time / 1000);
                      console.log(globalSeekRef.current);
                    }
                    newSeek -= segData[index - 1].end_time / 1000;
                  }
                  this.seek(newSeek);
                },
                onend: function () {
                  if (index === sounds.length - 1) {
                    setPlaying(false);
                  }
                },
              })
          );
          console.log("sounds", sounds);
          setAudioData(segData);
          setAudio(sounds);
          const { totTime } = getMaxTime(segData);
          setDuration(totTime / 1000);
        } else setMissing(true);
      }
    };
    fetchAudio();
  }, [currentNote, audio, session, mode, playing]);

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
    if (audio[currentSoundIndex].playing()) {
      audio[currentSoundIndex].pause();
      setPlaying(false);
    }
  };

  const handleToggle = () => {
    console.log("okay quick test");
    if (audio[currentSoundIndex] && audio.length > 0) {
      console.log("in audio sound index");
      if (audio[currentSoundIndex].playing()) {
        audio[currentSoundIndex].pause();
      } else {
        console.log("trying to start");
        const audioStart =
          (audioData[currentSoundIndex].end_time -
            audioData[currentSoundIndex].duration) /
          1000;
        audio[currentSoundIndex].seek(globalSeek - audioStart);
        audio[currentSoundIndex].play();
      }
    } else {
      toast.error("something has gone wrong try again");
    }
    setPlaying(!playing);
  };

  const skipToNext = () => {
    if (currentSoundIndex < audio.length - 1) {
      const wasPlaying = audio[currentSoundIndex].playing();
      audio[currentSoundIndex].pause();
      setglobalSeek(audioData[currentSoundIndex].end_time / 1000);
      setCurrentSoundIndex(currentSoundIndex + 1);
      if (wasPlaying) {
        audio[currentSoundIndex + 1].play();
      }
    }
  };

  const skipToPrevious = () => {
    const wasPlaying = audio[currentSoundIndex].playing();

    if (currentSoundIndex > 0) {
      const threshold = audioData[currentSoundIndex - 1].end_time / 1000;
      if (globalSeek > threshold + 3) {
        audio[currentSoundIndex].pause();
        audio[currentSoundIndex].seek(0);
        setglobalSeek(threshold);
      } else {
        audio[currentSoundIndex].pause();
        const newSeek =
          (audioData[currentSoundIndex - 1].end_time -
            audioData[currentSoundIndex - 1].duration) /
          1000;
        setCurrentSoundIndex(currentSoundIndex - 1);
        setglobalSeek(newSeek);
      }
      if (wasPlaying) {
        audio[currentSoundIndex - 1].play();
      }
    } else {
      audio[currentSoundIndex].pause();
      setglobalSeek(0);
      setCurrentSoundIndex(0);
      if (wasPlaying) {
        audio[0].play();
      }
    }
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
          if (inDevelopment) console.log("setting index", i);
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
    if (inDevelopment) console.log("currentSoundIndex", currentSoundIndex);
  }, [currentSoundIndex]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    return `${hours > 0 ? `${hours}:` : ""}${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisabled(
        audio.length === 0 || audio[0]?._src.length === 0 || !audio[0]._src[0]
      );
    }, 500); // 500 milliseconds = 0.5 seconds

    return () => clearTimeout(timer);
  }, [audio]);

  const benchTime = () => {
    if (Math.ceil(globalSeek) === Math.floor(duration)) {
      return duration;
    } else {
      return globalSeek;
    }
  };

  return (
    <div className="w-full flex flex-col">
      {!missing ? (
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

            <button onClick={() => skipToPrevious()}>
              <i
                className="bi bi-skip-start-fill"
                style={{ fontSize: "1.25rem" }}
              ></i>
            </button>
            <Button
              onClick={() => handleToggle()}
              className="w-8 h-8 rounded-full flex justify-center items-center bg-gray-500 hover:bg-gray-400"
              disabled={disabled}
            >
              <div className="mt-[.125rem]">
                {playing ? (
                  <i
                    className="bi bi-pause-fill text-white"
                    style={{ fontSize: "1.2rem" }}
                  ></i>
                ) : (
                  <i
                    className="bi bi-play-fill text-white"
                    style={{ marginLeft: "1.5px", fontSize: "1.2rem" }}
                  ></i>
                )}
              </div>
            </Button>
            <button onClick={() => skipToNext()}>
              <i
                className="bi bi-skip-end-fill"
                style={{ fontSize: "1.25rem" }}
              ></i>{" "}
            </button>
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
              {formatTime(benchTime(globalSeek))}
            </div>
            <div className=" md:w-4/12 w-5/12 my-auto mx-2 flex bg-transparent	">
              <input
                type="range"
                min="0"
                step=".001"
                value={globalSeek}
                max={duration}
                onChange={handleSliderChange}
                className="slider self-center flex-none bg-transparent	"
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
              {!duration ? "Loading..." : formatTime(duration)}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center my-auto">
          audio playback will go here after recording
        </div>
      )}
    </div>
  );
};

export default AudioControls;
