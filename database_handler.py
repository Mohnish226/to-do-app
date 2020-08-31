import uuid

task_data = {'1': {'task': 'task 1', 'details': "Detail 1"} }

def check_generate_api(username, password):
    api = validate_user(username, password)
    if api != None:
        return api
    return generate_api_key()


def validate_user(username, password):
    # for any random user
    if username == "" and password == "":
        return None
    # Check if user is present
    return None


def generate_api_key():
    generated_id = str(uuid.uuid4())
    # Check if generated Api is available in database
    while(api_present(generated_id)):
        generated_id = str(uuid.uuid4())
    return str(generated_id) + "|" + str(api_task_id(generated_id))


def api_task_id(api_key):
    # logic to get task id for API key from database
    value = 0
    return value+1


def api_present(api_key):
    # Check database if api key is present
    return False


def get_all_tasks(api_key):
    # Logic to get task database
    print("All Task: ", task_data)
    return task_data


def add_task_details(api_key, task_id, task_main, task_extra=""):
    # Logic to add task into database

    task_data[task_id] = {"task": task_main, "details": task_extra}
    print("Add Task: ", task_data)

    return True


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
        del task_data[task_id]
        print("Delete Task: ", task_data)
        return True
    except Exception as e:
        print(e)
        return False
