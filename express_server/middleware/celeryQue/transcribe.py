import os
import whisper
from celeryConfig import app
from celery.signals import worker_process_init
from celery.utils.log import get_task_logger

logger = get_task_logger(__name__)
model = None


model = whisper.load_model("small")

@app.task(name='my_app.transcribe')
def transcribe(name):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    try:
        #transcribe
        audio_path = os.path.join(script_dir, f'../../files/audiologs/{name}.webm')
        result = model.transcribe(audio_path)
        
        #delete
        os.remove(audio_path)
        
        #append
        transcript_path = os.path.join(script_dir, f'../../files/transcripts/test.txt')
    
        with open(transcript_path, "a") as file:  # append mode
            file.write(f"{result['text']} \n")

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        raise


if __name__ == "__main__":
    import sys
    filename = sys.argv[1]
    transcribe.delay(filename)



