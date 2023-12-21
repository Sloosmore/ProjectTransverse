import os
import sys
import whisper
import time

model = whisper.load_model("base")

filename = sys.argv[1]
#filename = '5dd5907a-fcff-42e5-b52e-5339dc4040bc'

script_dir = os.path.dirname(os.path.abspath(__file__))

try:
    
    start_time = time.perf_counter()
    audio_path = os.path.join(script_dir, f'../files/audiologs/{filename}.webm')
    result = model.transcribe(audio_path)
    print(result["text"])
    tot_time = time.perf_counter()-start_time
    with open(os.path.join(script_dir, "../logs/timer.txt"), "a") as myfile:
        myfile.write(str(tot_time)+ ',' + '\n')

        
except Exception as e:
    print(f"An error occurred: {e}")

