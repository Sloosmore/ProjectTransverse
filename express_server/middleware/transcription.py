import os
import sys
import whisper
import fcntl

model = whisper.load_model("base")

filename = sys.argv[1]
#filename = '5dd5907a-fcff-42e5-b52e-5339dc4040bc'

script_dir = os.path.dirname(os.path.abspath(__file__))

print(filename)
try:
    audio_path = os.path.join(script_dir, f'../files/audiologs/{filename}.webm')
    result = model.transcribe(audio_path)
    print(result["text"])

    #append new audio to filepath
    """transcript_path = os.path.join(script_dir, "../files/transcripts/test.txt")
    with open(transcript_path, "a") as myfile:
        fcntl.flock(myfile, fcntl.LOCK_EX)  # Exclusive lock
        myfile.write(result["text"] + 'this is test'+ '\n')
        fcntl.flock(myfile, fcntl.LOCK_UN)  # Unlock"""
        
except Exception as e:
    print(f"An error occurred: {e}")

