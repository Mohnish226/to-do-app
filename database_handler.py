import uuid
from app import db, User, Tasks
import hashlib
import sys
sys.dont_write_bytecode = True


def encrypt_digest(password):
    return hashlib.md5(password.encode()).hexdigest()


def check_generate_api(username, password):
    """ Check / Generate Api

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        api_key|nextTaskNum (str) : Api key of the user / Generate api key, 
                                    and the next task number, seperated by
                                    '|' ; use .split('|')

    """
    api = validate_user(username, password)
    if api:
        return str(api) +'|'+ str(api_task_id(api))
    return generate_api_key()


def user_present(username, password):
    """ User Present

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        True (bool): User present
        False (bool): user is nor present
    """
    return len(User.query.filter_by(user=username, paswrd=password).all()) > 0


def validate_user(username, password):
    """ Validate User

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        api_key: Api key of the user else None
    """
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
    """ Register User

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        'ok' : User registered
        'already_present' : User already present
        'error' : Database error
    """
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
    """ Generate Api Key

    Returns:
        api_key: Api key using UUID
    """
    generated_id = str(uuid.uuid4())
    # Check if generated Api is available in database
    while not api_not_present(generated_id):
        generated_id = str(uuid.uuid4())
    return str(generated_id) + "|" + str(api_task_id(generated_id))


def api_task_id(api_key):
    """ Api Task ID

    Args:
        api_key (str): Api key of the user

    Returns:
        Task_number : sends last task number + 1,
        1 : If new user  
    """
    # logic to get task id for API key from database
    tsk = Tasks.query.filter_by(sessn=api_key).all()
    if len(tsk) > 0:
        print(tsk[-1].id)
        return int(tsk[-1].id)+1
    return 1


def api_not_present(api_key):
    """ Api Present

    Args:
        api_key (str): Api key generated
        
    Returns:
        True (bool): Api Key is not present
        False (bool): Api Key is present
    """
    # Check database if api key is present
    return len(User.query.filter_by(sessn=api_key).all()) == 0


def get_all_tasks(api_key):
    """ All Tasks

    Args:
        api_key (str): Api key generated
        
    Returns:
        all_tasks (json): All tasks from an Api key
    """
    # Logic to get task database
    task_data = Tasks.query.filter_by(sessn=api_key).all()
    tsk = {} 
    for task in task_data:
        tsk[str(task.id)] = {'task': task.task, 'details': task.details}
    return tsk


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
    """ Update task details

    Args:
        api_key (str): Api key generated
        task_id (str): Task ID to be modified
    
    optional:
        task_main (str): Task main text
        task_extra (str): Task Extra text
        
    Returns:
        True (bool): Successful
        False (bool): Error
    """
    # Logic to update task details
    if task_id and task_extra and task_main:
        if len(Tasks.query.filter_by(id=task_id, sessn=api_key).all()) == 1:
            tsk = Tasks.query.filter_by(id=task_id, sessn=api_key).first()
            tsk.task = task_main
            tsk.details = task_extra
            db.session.commit()
        else:
            # Requests from requesting all
            return True
    elif task_id and task_main:
        if len(Tasks.query.filter_by(id=task_id, sessn=api_key).all()) == 1:
            tsk = Tasks.query.filter_by(id=task_id, sessn=api_key).first()
            tsk.task = task_main
            db.session.commit()
        else:
            return False
    elif task_id and task_extra:
        if len(Tasks.query.filter_by(id=task_id, sessn=api_key).all()) == 1:
            tsk = Tasks.query.filter_by(id=task_id, sessn=api_key).first()
            tsk.details = task_extra
            db.session.commit()
        else:
            return False
    else:
        return False
    return True


def delete_task(api_key, task_id):
    """ Delete Task

    Args:
        api_key (str): Api key generated
        task_id (str): Task ID to be modified

    Returns:
        True (bool): Successful
        False (bool): Error
    """
    # Logic to delete task
    try:
        if len(Tasks.query.filter_by(id=task_id, sessn=api_key).all()) == 1:
            tsk = Tasks.query.filter_by(id=task_id, sessn=api_key).first()
            db.session.delete(tsk)
            db.session.commit()
        return True
    except Exception as e:
        return False
