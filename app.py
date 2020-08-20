from flask import Flask, request, jsonify, render_template
import json
import database_handler

app = Flask(__name__)
main_url = 'http://127.0.0.1:5000/'


task_data = {}

@app.errorhandler(404)
def page_not_found_404(e):
    return f"404 PAGE NOT FOUND<br><br>You will be redirected in 3 seconds</p><script>var timer = setTimeout(function() {{window.location='{main_url}'}}, 3000);</script></body></html>"


@app.errorhandler(Exception)
def page_not_found(e):
    return f"Something went Wrong <br> You will be redirected in 3 seconds</p><script>var timer = setTimeout(function() {{window.location='{main_url}'}}, 3000);</script></body></html>"


@app.route('/api/<api_key>/<task_id>/det',  methods=['GET', 'POST', 'PUT'])
def update_task(api_key, task_id):
    """
    Data sent in the format
    /api/api-key/task-id/det?m="Main task details"&d="Extra task details"
    example:
    /api/2bca68ef-16ba-4a14-aa47-ea85e1e7dcb6/123/det?m="task1"&d="details1"                  
    """
    main = request.args.get('m', None)
    details = request.args.get('d', None)
    print("Api key: {}\n Task ID: {}\n Task data: {}\n Task Details: {}".format(api_key, task_id, main, details))
    return 'ok'


@app.route('/api/<api_key>/task',  methods=['GET', 'POST', 'PUT'])
def new_task(api_key):
    """ new_task

    Args:
        api_key ([type]): [description]
    """
    task = request.args.get('t', None)
    print("in")
    print(task)
    return 


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
