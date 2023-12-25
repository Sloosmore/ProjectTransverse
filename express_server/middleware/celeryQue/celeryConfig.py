from celery import Celery

username = 'sloosmore'
password = 'transverse'
vhost = 't-vhost'

app = Celery('my_app', broker=f'pyamqp://{username}:{password}@localhost/{vhost}', include=['createDoc','transcribe'])

app.conf.task_routes = {
    'my_app.transcribe': {'queue': 'whisper_queue'},
    'my_app.autogen_Create': {'queue': 'agCreate_queue'},
}

#celery -A celeryConfig worker --loglevel=info -Q whisper_queue
#celery -A celeryConfig worker --loglevel=info -Q agCreate_queue