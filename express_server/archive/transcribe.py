from celeryConfig import app
import os
from celery.signals import worker_process_init
from celery.utils.log import get_task_logger
import logging 
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

logger = get_task_logger(__name__)
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI (api_key=api_key)


@app.task(name='my_app.transcribe')
def transcribe(name):




    script_dir = os.path.dirname(os.path.abspath(__file__))
    try:


        logger.info(name) 
           
        #transcribe
        audio_path = os.path.join(script_dir, f'../../files/audiologs/{name}.webm')

        audio_file = open(audio_path, "rb")
        result = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            response_format='text'
        )
            
        
        #delete
        os.remove(audio_path)

        
        #append
        transcript_path = os.path.join(script_dir, f'../../files/transcripts/test.txt')
    
        with open(transcript_path, "a") as file:  # append mode
            file.write(f"{result} \n")

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        raise e


if __name__ == "__main__":
    import sys
    filename = sys.argv[1]
    transcribe.delay(filename)



"""
import whisper     
result = model.transcribe(audio_path, fp16=False)
        logger.info(result['text'])"""