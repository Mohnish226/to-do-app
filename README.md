# to-do-app
### Built for MSA Program

Website: [todo.datascience.app](https://todo.datascience.app)
Status: ![status](https://img.shields.io/static/v1?style=flat&logo=microsoft-edge&label=Website:&message=UP&color=success) ![https](https://img.shields.io/static/v1?style=flat&label=HTTPS:&message=Enabled&color=success) ![python](https://img.shields.io/static/v1?style=flat&logo=python&label=Python:&message=3.7.2&color=success)

- ### Features

    1. #### Modify Tasks on the go !! (No need to refresh)
        * Type your task at<br>
        <img src="images/add_task.png" width="700"><br>
        Click on `+` sign or just press <kbd>Enter</kbd>

        * Task will look like
        <img src="images/task.png" width="700">

        * To delete a task 
            * press on <img src="images/close.png" width="35"> Or 
            * just erase the task contents
            <img src="images/del_task.gif" width="700">

        * To Add details to a task press on <img src="images/down_arrow.png" width="35">

            * Add extra details in the dropdown box
            <img src="images/task_details.png" width="700">

    1. #### Toasts !!
        * <img src="images/toast_0.png" width="200" height="55"/>
        * <img src="images/toast_1.png" width="200" height="55"/>
        * <img src="images/toast_2.png" width="200" height="55"/>
        * <img src="images/sync_toast.gif" width="200"/>
        * <img src="images/toast_3.png" width="210"/>

    1. #### Undo !!
        Deleted Task reappears (current session)

        * Click on <img src="images/undo.png" width="30"/>

        * <kbd>Ctrl</kbd> + <kbd>Z</kbd> <img src="images/windows_linux.png" width="55"/>

        * <kbd>Cmd</kbd> + <kbd>Z</kbd> <img src="images/apple.png" width="25"/>

    1. #### Works Offline !!
        ##### DO NOT CLOSE THE TAB
        In case if your device gets disconnected the application will sync with the server once connection is established you will see <img src="images/sync_toast.gif" width="150"/> which will indicate that your tasks are being synced with the server</p>

    1. #### Secure
        * All passwords are stored encrypted
        For example : 'Admin' &rarr; 'e6afed0047b01059d0fada10f400c1e5'
        * ![HTTPS: Enabled](https://img.shields.io/static/v1?style=flat&label=HTTPS:&message=Enabled&color=success)

    1. #### Sync across all devices
        All task get synchronized (Might need to refresh / login again)

- ### Tech Used
    | Tech | Use |
    | ------ | ------ |
    | HTML + CSS  | Front End |
    | JS | Front End & Send Requests |
    | Python (flask) | Works as an API |

- ### Dependency (UI)

    - [Materialize Css](https://materializecss.com/) - Material Design & Responsive Design
    - [Font Awesome](https://fontawesome.com/v4.7.0/) - Icons

- ### Requirements

|Package| Version|
|----|----|
| gunicorn | 19.7.1| 
| Flask | 0.12.2 |
| flask-sqlalchemy | 2.4.4 |

- ### How to run (local)
    1. Install all required python packages 
        ```bash
        cd to-do-app/
        pip install -r requirements.txt
        ```
    1. To run the app (locally)
        ```bash
        cd to-do-app/
        python app.py
        ```
    1. To run the app (VPS / Hosting)
    Please follow hosting providers method to host flask apps. 
    use command 
        ```bash
        gunicorn --bind 0.0.0.:$PORT app:app
        ```

- ### Use app via terminal / Postman
    ##### Requires 
    [cURL](https://www.booleanworld.com/curl-command-tutorial-examples/) or [Postman](https://www.postman.com/)

    1. To check if server is online run
        * Terminal
            ```bash
            curl 'https://todo.datascience.app/connected'
            ```
        * Postman
            `GET` request to `https://todo.datascience.app/connected`
        If it returns `ok` means server is UP
    1. Create / Get user API and next task  number
        (please replace `<username>` with your username and `<password>` with your password)
        * Terminal
            ```bash
            curl 'https://todo.datascience.app/user/<username>/<password>/'
            ```
        * Postman
            `GET` request to `https://todo.datascience.app/user/<username>/<password>/`

        returns data in the form `<api-key>|<next-task-id>`
        Example:
        ```bash
        cabd6c91-0baa-4a55-99d7-1b8f1d15c1e7|1
        ```
    1. To get all task from a user
        * Terminal
            ```bash
            curl 'https://todo.datascience.app/api/<api-key>/all'
            ```
        * Postman
            `GET` request to `https://todo.datascience.app/api/<api-key>/all`

        It will return all tasks in json in the format 
        ```bash
        {'<task_id>' : {
            'task': '<your task>',
            'details': '<task details>'
            }
        }
        ```
        Example
        ```bash
        {'1':
            {
            'task': 'Call Work', 
            'details': 'Remember to ask about project XYZ'
            }
        }
        ```
    1. To add task for a user
        Keys
        `id` : Task Id 
        `t` : Main task text 
        `d` : Task details (Optional)
        * Terminal
            ```bash
            curl --data "id=<task_id>&t=<task_main_detail>&d=<extra_task_details>" "https://todo.datascience.app/api/<api-key>/task"
            ```
        * Postman
            `Post` request to `https://todo.datascience.app/api/<api-key>/task` with above the mentioned key and their values
            

        Will return 
        `ok` : Executed successfully
        `error` : Did not execute

    1. To Modify task
        Keys (include atleast 1)
        `t` : Main task text 
        `d` : Task details
        (please replace `<api-key>` with your api and `<task-id>` with your task ID)
        * Terminal
            ```bash
            curl --data "t=<task_main_detail>&d=<extra_task_details>" "https://todo.datascience.app/api/<api-key>/<task-id>/det"
            ```
        * Postman
            `POST` request to `https://todo.datascience.app/api/<api-key>/<task-id>/det` with above the mentioned key and their values

        Will return 
        `ok` : Executed successfully
        `error` : Did not execute
    
    1. To delete task
        (please replace `<api-key>` with your api and `<task-id>` with your task ID)
        * Terminal
            ```bash
            curl "https://todo.datascience.app/api/<api-key>/delete/<task-id>"
            ```
        * Postman
            `POST` request to `https://todo.datascience.app/api/<api-key>/delete/<task-id>`

- ### Known Issues
    - Typing can get slow if server gets overloaded
    - Extra task details get cleared sometimes (may be due to different browsers) when working offline