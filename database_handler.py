import uuid


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


def api_task_id(api):
    # logic to get task id for API key from database
    value = 0
    return value+1


def api_present(api_key):
    # Check database if api key is present
    return False


def get_all_tasks(api_key):
    return True