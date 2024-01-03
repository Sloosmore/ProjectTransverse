import sys
from celeryConfig import app
import os
from contentFunc import doc_content, update
from genFunc import gen_file



@app.task(name='my_app.autogen_Create')
def createDoc(arg):
    [task, id] = arg
    thread_id, output = doc_content(task)
    update(id, output, thread_id)
    gen_file(output)
    

if __name__ == "__main__":
    import sys
    tscript = sys.argv[1]
    createDoc.delay(tscript)

 