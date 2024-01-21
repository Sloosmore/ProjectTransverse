import sys
from celeryConfig import app
from contentFunc import doc_content, update
from genFunc import gen_file
from celeryConfig import app
from celery.utils.log import get_task_logger


logger = get_task_logger(__name__)

@app.task(name='my_app.autogen_Create')
def createDoc(message, id):
    
    thread_id, output = doc_content(message)
    logger.info('gen comp')
    update(id, output, thread_id)
    logger.info('update comp')
    gen_file(output)
    logger.info('doc comp')


if __name__ == "__main__":
    import sys
    tscript = sys.argv[1]
    ID = sys.argv[2]
    createDoc.delay(tscript, ID)

 