import os
from openai import OpenAI
from dotenv import load_dotenv
import time
from datetime import datetime
import json
import uuid
import re


load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI (api_key=api_key)

gen_id = 'asst_5sT5uULFKltTKy26y2mLhSky'

def parse_title(message):
    pattern = r'filename: (.*) -->'
    match = re.search(pattern, message)
    if match:
        return match.group(1)
    else:
        raise ValueError(f"Could not find 'filename: ' followed by ' -->' in message: {message}")
    

def doc_content(task):

    content_thread = client.beta.threads.create(
            messages=[
                {
                "role": "user",
                "content": f"{task}",
                }
            ]
        ) 

    run = client.beta.threads.runs.create(
            thread_id=content_thread.id,
            assistant_id=gen_id
        )
        
    while run.status == 'queued'or run.status == 'in_progress':
            run = client.beta.threads.runs.retrieve(
                thread_id=content_thread.id,
                run_id = run.id
            )
            time.sleep(.5)
            
    if run.status == 'completed':
            messages = client.beta.threads.messages.list(
                thread_id=content_thread.id
            )
            
            first_thread_message = messages.data[0]
            first_message_content_text = first_thread_message.content[0]
            value_parameter = first_message_content_text.text.value
            
            return  content_thread.id, value_parameter

    else: 
            print(f'Status {run.status}, try again')




#TODO this just needs to updates the message of the record given the UUID
def update(id, output, thread_id):
    jsonRecord='fileRecords.json'
    script_dir = os.path.dirname(os.path.abspath(__file__))
    filepath = f'../../../db/{jsonRecord}'
    full_path = os.path.join(script_dir, filepath)

    with open(full_path, 'r+') as file:
            file_data = json.load(file)
            # Join new_data with file_data inside records
            record = next((record for record in file_data["records"] if record['task_id'] == id), None)
            if record:
                # Update the record's parameters
                record['thread_id'] = thread_id
                record['filename'] = parse_title(output)
                record['file'] = f'./files/docs/{parse_title(output)}'
                record['content'] = output
                record['progress'] = 'complete'
                
                now = datetime.now()
                formatted_now = now.strftime("%Y-%m-%d %H:%M:%S.%f")

                record['last_update'] = formatted_now
                # Move the pointer to the beginning of the file
                file.seek(0)
                # Write the updated file_data to the file
                json.dump(file_data, file, indent=4)
            else:
                print(f"Record with ID {id} not found.")
                


prompt = 'make an essay about puppies'
thread_id = 'fodiskljfgalsk=9043'
message = '<!-- filename: Puppies_HELP_ME.docx --><head>{"bold": false, "italicised": false, "underline": false, "highlight": "none", "color": "black", "font": "Times New Roman", "fontSize": 12, "alignment": "justified"}</head><doc> <title>The Joyful World of Puppies</title>'


#thread_id, message = doc_content(prompt)




