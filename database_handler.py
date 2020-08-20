import uuid


def check_generate_api(username, password):
    api = validate_user(username, password)
    if api != None:
        # return the api key of the user
        pass
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
    return generated_id


def api_present(api_key):
    # Check database if api key is present
    return False