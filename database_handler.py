import uuid
from app import db, User, Tasks

task_data = {}#'1': {'task': 'task 1', 'details': "Detail 1"} }

def check_generate_api(username, password):
    api = validate_user(username, password)
    if api:
        return str(api) +'|'+ str(api_task_id(api))
    return generate_api_key()


def validate_user(username, password):
    # for any random user
    if username == "" and password == "":
        return None
    # Check if user is present
    if len(User.query.filter_by(user=username, paswrd=password).all()) < 1:
        return None
    else:
        user = User.query.filter_by(user=username, paswrd=password).first()
    return str(user.sessn)


def register_user(username, password):
    try:
        if len(User.query.filter_by(user=username, paswrd=password).all()) == 0:
            usr = User(user=username, paswrd=password, sessn=str(generate_api_key().split('|')[0]))
            print(usr)
            db.session.add(usr)
            db.session.commit()
            return 'ok'
        else:
            return 'already_present'
    except Exception as e:
        print(e)
        return 'error'


def generate_api_key():
    generated_id = str(uuid.uuid4())
    # Check if generated Api is available in database
    while not api_not_present(generated_id):
        generated_id = str(uuid.uuid4())
    return str(generated_id) + "|" + str(api_task_id(generated_id))


def api_task_id(api_key):
    # logic to get task id for API key from database
    tsk = Tasks.query.filter_by(sessn=api_key).all()
    if len(tsk) > 0:
        return tsk[-1].id+1
    return 1


def api_not_present(api_key):
    # Check database if api key is present
    return len(User.query.filter_by(sessn=api_key).all()) == 0



def get_all_tasks(api_key):
    # Logic to get task database
    print("All Task: ", task_data)
    return task_data


def add_task_details(api_key, task_id, task_main, task_extra=""):
    # Logic to add task into database
    try:
        tsk = Tasks(id=task_id, task=task_main, details=task_extra, sessn=api_key)
        db.session.add(tsk)
        db.session.commit()
        return True
    except Exception as e:
        print(e)
        return False


def update_task_details(api_key, task_id, task_main=None, task_extra=None):
    # Logic to update task details
    if task_id and task_main:
        task_data[task_id]["task"] = task_main
    elif task_id and task_extra:
        task_data[task_id]["details"] = task_extra
    else:
        print("Error!!!!")
        return False
    print("Update Task: ", task_data)
    return True


def delete_task(api_key, task_id):
    # Logic to delete task

    try:
        print('deleting ', task_id)
        del task_data[task_id]
        print("Delete Task: ", task_data)
        return True
    except Exception as e:
        print(e)
        return False
