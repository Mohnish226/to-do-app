from flask import Flask, request, jsonify, render_template
import json
import database_handler

app = Flask(__name__)
main_url = 'http://127.0.0.1:5000/'


task_data = {'1': {'task': 'task 1', 'details': None}}

@app.errorhandler(404)
def page_not_found_404(e):
    return f"404 PAGE NOT FOUND<br><br>You will be redirected in 3 seconds</p><script>var timer = setTimeout(function() {{window.location='{main_url}'}}, 3000);</script></body></html>"


@app.errorhandler(Exception)
def page_not_found(e):
    return f"Something went Wrong <br> You will be redirected in 3 seconds</p><script>var timer = setTimeout(function() {{window.location='{main_url}'}}, 3000);</script></body></html>"


@app.route('/api/<api_key>/<task_id>/det',  methods=['GET', 'POST', 'PUT'])
def update_task(api_key, task_id):
    """ update_task

    Args:
        api_key (str): Api Key
        task_id (int): ID of the task for the api

    Returns:
        'ok'    : Task executed
        'error' : Something went wrong
    """
    """
    Data sent in the format
    /api/api-key/task-id/det?d=Extra task details
    example:
    /api/2bca68ef-16ba-4a14-aa47-ea85e1e7dcb6/123/det?d=extra details                 
    """
    details = request.args.get('d', None)
    task_name = request.args.get('t', None)
    print(details, " - ", task_name)
    if details:
        print(details)
        task_data[task_id]["details"] = details
    elif task_name:
        print(task_name)
        task_data[task_id]["task"] = task_name
    else:
        return 'error'
    print(task_data)
    return 'ok'


@app.route('/api/<api_key>/task',  methods=['GET', 'POST', 'PUT'])
def new_task(api_key):
    """ new_task

    Args:
        api_key (str): Api Key

    Returns:
        'ok'    : Task executed
        'error' : Something went wrong
    """
    task_id = request.args.get('id', None)
    task = request.args.get('t', None)
    d = request.args.get('d', '')
    task_data[task_id] = {"task": task, "details": d}

    return 'ok'


@app.route('/api/<api_key>/all', methods=['GET'])
def get_all_tasks(api_key):
    """ get_all_tasks

    Args:
        api_key (str): Api Key

    Returns:
        all_tasks : Json of all tasks available
    """
    return jsonify(task_data)


@app.route('/api/<api_key>/delete/<task_id>',  methods=['GET', 'POST', 'PUT'])
def delete_task(api_key, task_id):
    """ delete_task
    Args:
        api_key (str): Api Key
        task_id (int): ID of the task for the api

    Returns:
        'ok'    : Task executed
        'error' : Something went wrong
    """
    print(task_id)
    print(task_data)
    del task_data[task_id]
    print(task_data)

    return 'ok'

@app.route('/user/<username>/<password>/', methods=['GET'])
def profile(username, password):
    """ Profiles

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        api_key: Api key of the user / Generate api key
    """
    return database_handler.check_generate_api(username, password)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
