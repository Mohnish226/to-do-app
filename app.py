from flask import Flask, request, jsonify, render_template
import json
import os
from flask_sqlalchemy import SQLAlchemy
import sys
sys.dont_write_bytecode = True

main_url = 'http://127.0.0.1:5000/'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db?check_same_thread=False'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column('id', db.Integer, primary_key=True)
    user = db.Column('user', db.String(30), unique=True, nullable=False)
    paswrd = db.Column('paswrd', db.String(120), unique=True, nullable=False)
    sessn = db.Column('sessn', db.String(150), nullable=False)

    def __repr__(self):
        return '{} {} {} {}'.format(self.id, self.user, self.paswrd, self.sessn)


class Tasks(db.Model):
    ttl = db.Column('total', db.Integer, primary_key=True)
    id = db.Column('id', db.Integer, nullable=False)
    task = db.Column('task', db.String(150), nullable=False)
    details = db.Column('details', db.String(150), nullable=False)
    sessn = db.Column('sessn', db.String(150), nullable=False)

    def __repr__(self):
        return '{} {} {} {}'.format(self.id, self.sessn, self.task, self.details)


if not os.path.exists('users.sqlite'):
    db.create_all()

import database_handler


@app.errorhandler(404)
def page_not_found_404(e):
    return f"404 PAGE NOT FOUND<br><br>You will be redirected in 3 seconds</p><script>var timer = setTimeout(function() {{window.location='{main_url}'}}, 3000);</script></body></html>"


@app.errorhandler(Exception)
def page_not_found(e):
    return f"Something went Wrong <br> You will be redirected in 3 seconds</p><script>var timer = setTimeout(function() {{window.location='{main_url}'}}, 3000);</script></body></html>"


@app.route('/api/<api_key>/<task_id>/det',  methods=['POST'])
def update_task(api_key, task_id):
    """ update_task

    Args:
        api_key (str): Api Key
        task_id (int): ID of the task for the api

    Returns:
        'ok'    : Task executed
        'error' : Something went wrong
    """
    details = request.args.get('d', None)
    task_name = request.args.get('t', None)
    if details:
        database_handler.update_task_details(api_key, task_id, task_extra=details)
    elif task_name:
        database_handler.update_task_details(api_key, task_id, task_main=task_name)
    else:
        return 'error'
    return 'ok'


@app.route('/api/<api_key>/task',  methods=['POST'])
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
    if task_id and task and d:
        database_handler.add_task_details(api_key, task_id, task, task_extra=d)
        return 'ok'
    elif task_id and task:
        database_handler.add_task_details(api_key, task_id, task)
        return 'ok'
    return 'error'


@app.route('/api/<api_key>/all', methods=['GET'])
def get_all_tasks(api_key):
    """ get_all_tasks

    Args:
        api_key (str): Api Key

    Returns:
        all_tasks : Json of all tasks available
    """
    all_task = database_handler.get_all_tasks(api_key)
    return jsonify(all_task)


@app.route('/api/<api_key>/delete/<task_id>',  methods=['GET'])
def delete_task(api_key, task_id):
    """ delete_task
    Args:
        api_key (str): Api Key
        task_id (int): ID of the task for the api

    Returns:
        'ok'    : Task executed
        'error' : Something went wrong
    """
    if (database_handler.delete_task(api_key, task_id)):
        return 'ok'
    else:
        return 'error'


@app.route('/user/<username>/<password>/', methods=['GET'])
def profile(username, password):
    """ Profiles

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        api_key: Api key of the user / Generate api key
    """
    password = database_handler.encrypt_digest(password)
    return database_handler.check_generate_api(username, password)


@app.route('/login')
def login():
    """ login

    Returns:
        redirects to login.html
    """
    return render_template('login.html')


@app.route('/login/<username>/<password>/', methods=['GET'])
def create_session(username, password):
    """ Create Session

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        Script that initiates session on your browser
    """
    password = database_handler.encrypt_digest(password)
    present = database_handler.user_present(username, password)
    if present:
        sessn = database_handler.check_generate_api(username, password)
        print(sessn)
        data = sessn.split('|')
        return f"""
            Loading
            <script>
            sessionStorage.clear();
            sessionStorage.to_do_app =  '{data[0]}' ;
            sessionStorage.to_do_app_value = Number( '{int(data[1])}');
            window.value=Number( '{int(data[1])}' )
            var timer = setTimeout(function() 
                {{window.location='{main_url}'}}, 300);
            </script>"""
    else:
        return f"Error"


@app.route('/logout')
def logout():
    """ Logout

    Returns:
        Script that cleares session from browser
    """
    return f"""
            Logging off
            <script>
            sessionStorage.clear();
            var timer = setTimeout(function() 
                {{window.location='{main_url}'}}, 300);
            </script>"""


@app.route('/signup/<username>/<password>/')
def create_user(username, password):
    """ Create user

    Args:
        username (str): plain text username
        password (str): plain text password

    Returns:
        Script to redirect to login page
    """
    opassword = password
    password = database_handler.encrypt_digest(password)
    response = database_handler.register_user(username, password)
    if response == 'ok':
        return f"""
            <script>var timer = setTimeout(function() 
            {{window.location='{main_url+'login/'+username+'/'+opassword+'/'}'}}, 300);
            </script>"""
    else:
        f"""
        <script>var timer = setTimeout(function() 
        {{window.location='{main_url+'login'}'}}, 300);
        </script>"""


@app.route('/connected', methods=['GET'])
def connected():
    """ Check if frontend is connected to flask app

    Returns:
        'ok' : Server is up and ready to process
    """
    return 'ok'


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)