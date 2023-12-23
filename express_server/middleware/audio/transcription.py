#https://github.com/Vaibhavs10/insanely-fast-whisper
import os
import sys
import whisper



model = whisper.load_model("base")

filename = sys.argv[1]

script_dir = os.path.dirname(os.path.abspath(__file__))


try:
    audio_path = os.path.join(script_dir, f'../../files/audiologs/{filename}.webm')
    result = model.transcribe(audio_path)
    print(result["text"])


        
except Exception as e:
    print(f"An error occurred: {e}")


'''
 start_time = time.perf_counter()
 tot_time = time.perf_counter()-start_time
    with open(os.path.join(script_dir, "../logs/timer.txt"), "a") as myfile:
        myfile.write(str(tot_time)+ ',' + '\n')
'''



