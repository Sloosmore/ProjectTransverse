import os
import sys
import whisper
from celery import Celery

app = Celery('my_app', broker='pyamqp://[username]:[password]@localhost/[vhost_name]')


model = whisper.load_model("base")

filename = sys.argv[1]

def transcribe(name):

    script_dir = os.path.dirname(os.path.abspath(__file__))

    try:
        audio_path = os.path.join(script_dir, f'../../files/audiologs/{name}.webm')
        result = model.transcribe(audio_path)
        print(result["text"])

            
    except Exception as e:
        print(f"An error occurred: {e}")


transcribe(filename)

'''
 start_time = time.perf_counter()
 tot_time = time.perf_counter()-start_time
    with open(os.path.join(script_dir, "../logs/timer.txt"), "a") as myfile:
        myfile.write(str(tot_time)+ ',' + '\n')
'''



