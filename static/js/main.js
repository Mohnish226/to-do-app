/*
This is a temporary made js to work for MSA to-do application 
Author: Mohnish Devadiga
*/

/*
=========================================================================
ISSUE: 
    1. If any data was present in previous extra details (dropdown) box
       it would get cleared when adding new task
    2. Typing lags
=========================================================================
*/

/*
=========================================================================
1 Initial task
    1.1 window.value       : keep a track of tasks in a window / session
    1.2 deleted_task_stack : Keep a track of deleted tasks [stack of deleted tasks] (used for undo feature)
    1.3 available_tasks    : keep a track of available tasks
    1.4 session_id         : Unique ID generated for every session (used for login feature[Not Yet Implemented]) 
=========================================================================
*/

// To keep a track of todo lists in a window
window.value = 1;

// To keep a task of deleted tasks in the session
// array of array [[id, task details, more details], ...]
var deleted_task_stack = [];

// To keep data of available task_areas
// array to store id of tasks, used in localstorage of extra details
var available_tasks = [];
var session_id = 0;
// Array to save data when server disconnected
var send_when_connected = [];

// Check for session
try {
    if(typeof(Storage) !== "undefined") {
        if (sessionStorage.to_do_app) {
            // Session is present
            session_id = sessionStorage.to_do_app;
            // sessionStorage.clear();
            if (sessionStorage.to_do_app_value){
                window.value = Number(sessionStorage.to_do_app_value);
            }
            get_post_server(type=4);
        } else {
            // Get from server
            // Receive "API-key|next_task_id"
            var api_and_window = get_post_server(1).split("|");
            sessionStorage.to_do_app  = api_and_window[0];
            window.value = Number(api_and_window[1]);
            session_id = sessionStorage.to_do_app;
        }
    } else {
        show_toast("Browser does not support session");
    }
}
catch(err) {
    show_toast('Server Down');
}

/* 
========================================================================= 
2 Basic Operations
    2.1 Add Tasks                                       
        2.1.1 Press + button to add task                 
        2.1.2 Press enter to add task                    
    2.2. Remove tasks                                     
        2.2.1 Press x to delete task                     
        2.2.2 Erase task to delete task                   
        (delete task only if details of task is empty)
    2.3. Update tasks       
=========================================================================
*/


/**
 * Adding a task.
 * Optional parameters used when populating tasks from server and undo feature
 * @param {string} extra_details - Extra details needed for a task 
 * @param {Number} id - ID of the task
 */
function add_task(extra_details=null, id=null){
    if (id === null){
        // Task was given by user
        var i = window.value;
    }
    else{
        // Task was inserted by Undo / received from server
        var i = id;
    }
    // Getting main
    var task = document.getElementById('inp_task').value;
    if (task === ""){
        show_toast("Task Empty!"+task);
        return;
    }
    // Adding new task to html
    var prev = document.getElementById('task_space').innerHTML;
    var newTask = `
        <h3 id="head_`+i+`" class="box_main">
            <div class="row">
                <div class="col s10">
                    <input id="ip_`+i+`" value="`+task+`" class="textbox" style="z-index: -1; border-bottom: none; outline: none;" placeholder="Task has some details remove details to delete">
                </div>
                <div class="col s1">
                    <button class="btn-floating waves-effect waves-light" style="background-color: #006494; margin-right: 10%;" onclick="show_details(`+i+`)"><i class="fa fa-angle-down" aria-hidden="true"></i></button>
                </div>
                <div class="col s1">
                    <button class="btn-floating waves-effect waves-light" style="background-color: red; margin-right: 10%;" onclick="remove_task(`+i+`)">x</button>
                </div>
            </div>
        </h3>
        <div id="content_`+i+`" class="content_box" style="display: none;">
            <div class="row">
                <div class="col s11">
                `;
    if (extra_details === null) {
        newTask = newTask + `<input id="textarea_`+i+`" class="textbox" styl="border: none !important;" placeholder="Add more details"></input>`;
    }
    else{
        newTask = newTask + `<input id="textarea_`+i+`" class="textbox" styl="border: none !important;" placeholder="Add more details" value="`+extra_details+`"></input>`;
    }               
    newTask = newTask + `
                </div>
                <div class="col s1">
                    <button class="btn-floating waves-effect waves-light" style="background-color: #006494;">
                        <i class="fa fa-clock-o"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('task_space').innerHTML = prev + newTask;
    // Sending data to server
    if (extra_details === null){   
        get_post_server(type = 2, id = i, task = task);
    }
    else{
        get_post_server(type = 2, id = i, task = task, task_details = extra_details);
    }
    // Increment counter
    window.value = window.value + 1;
    // Clearing input space
    document.getElementById('inp_task').value = "";
    // Toast message
    show_toast("Added: "+task);
    // Appending current task to available_task list
    available_tasks.push(i);
    // Used to fix ISSUE: 1
    if (extra_details === null){
        localStorage.setItem("textarea_"+i, '');
        add_text_area_details();
    }
    else{
        localStorage.setItem("textarea_"+i, extra_details);
    }
    sessionStorage.to_do_app_value = window.value;
}


/**
 * Removing a task.
 * @param {Number} id - ID of the task
 */
function remove_task(id){
    var task_data = [
                    id, 
                    document.getElementById('ip_'+id).value, 
                    document.getElementById('textarea_'+id).value
                ];
    // Inserting to deleted_task_stack for Undo
    deleted_task_stack.unshift(task_data);
    // Toast message
    var toast_data = document.getElementById('ip_'+id).value;
    /*
    // To Strike the task and add to end of list 
    // Not implemented
    document.getElementById("ip_"+id).classList.toggle("to_strike");
    */
    if (toast_data === ""){
        show_toast("Removing Empty task");
    }
    else{
        show_toast("Removing: " + toast_data);
    }
    // Deleting head and content for the task id
    var elements_2_delete = ["head_", "content_"];
    var i;
    for (i = 0; i< elements_2_delete.length; i++) {
        document.getElementById( elements_2_delete[i]+id ).parentNode.removeChild(document.getElementById(elements_2_delete[i]+id));
    }
    get_post_server(type=5, id=id);
}


/**
 * Event Listner for inputs:
 * 1. Key up 
 * 2. Paste text
 * 'keyup paste' did not work so split them into 2 listners
 */
document.querySelector('body').addEventListener('keyup', function(event) {
    handle_query(event);
});
document.querySelector('body').addEventListener('paste', function(event) {
    handle_query(event);
});


/**
 * Handling input actions.
 */
function handle_query(event){
    if (event.target.id.toLowerCase().split("_")[0] === 'ip') {
        // Input was in the main task area
        task_mods(event.target.id, event.target.value);
    }
    if (event.target.id.toLowerCase().split("_")[0] === 'textarea') {
        // Input was in the extra details for a task
        task_mods(event.target.id, event.target.value);
        // Used to fix ISSUE: 1
        localStorage.setItem(event.target.id, event.target.value);
    }
    // Pressing Enter to add task
    if (event.keyCode === 13 
        && event.target.id.toLowerCase().split("_")[0] === 'inp') {
        add_task();
    }
}


/**
 * Modifying a task.
 * @param {string} task_id - element that has to me modfied with ID
 *                     in the format '<section>_<id>'
 *                     types of <section>:
 *                     'ip' : main task details
 *                     'text_area' : extra task details
 *  @param {string} data - the current data in the input
 */
function task_mods(task_id, data){
    // Detecting empty task and details
    if (data == ''){
        var id = String(task_id.split("_")[1]);
        if (document.getElementById('ip_'+id).value === ""){
            if (document.getElementById('textarea_'+id).value === ""){
                remove_task(id);
            }
            else{
                show_toast('Cannot delete as something in details area');
                // console.log('Cannot delete as something in details area');
            }
        }
        else{
            console.log('won\'t delete as something in task area');
        }
    }
    else{
        // update task and data  
        var id_ = task_id.split("_")[1];
        var task_or_detail = task_id.split("_")[0];
        if (task_or_detail === "textarea"){
            get_post_server(type=3, id=id_, task=null, task_details=data);
        }
        else{
            if (task_or_detail === "ip"){
                get_post_server(type=3, id=id_, task=data);
            }
        }
    }
}


/* 
========================================================================= 
3 Extra features
    3.1. Undo feature
    3.2. Detect control+z pr command + z for undo           
    3.3. Toast popup on changes of text
    3.4. Save data of textarea in browser local storage which caused problem
        during refresh / adding of element [still exists sometimes not sure why]
    3.5. Show or hide extra details area             
=========================================================================
*/


/**
 * Undo deletion of a task.
 */
function undo(){
    if (deleted_task_stack.length === 0) {
        show_toast("No Task to Undo!");
        return;
    }
    // Add task main details in input
    document.getElementById('inp_task').value = deleted_task_stack[0][1];
    // Add task extra details and task id
    add_task(deleted_task_stack[0][2], deleted_task_stack[0][0]);
    // removing detail from deleted_task_stack
    deleted_task_stack.shift()    
}


// Detect control + z or command + z in case of undo
document.querySelector('body').addEventListener('keydown', function(event) {
    // keycode for z is 90 and event.metaKey is true when pressing command key on mac
    if ( (event.keyCode === 90 && event.ctrlKey) 
            || (event.keyCode == 90 && event.metaKey) ) {
        // console.log("previous edited element was: "+deleted_task_stack[0]);
        undo();
    }
});

/**
 * Display a Toast / Notification.
 * @param {string} text - Text in Notification / Toast
 */
function show_toast(text) {
    var toast = document.getElementById("toast");
    toast.innerHTML = text;
    toast.className = "show";
    setTimeout(function(){
        toast.className = toast.className.replace("show", ""); }, 
    4000);
}


/**
 * Keep extra details of task on page
 * Used to solve ISSUE: 1
 */
function add_text_area_details(){
    if (available_tasks.length < 1){
        return;
    }
    var i;
    for (i = 0; i< available_tasks.length; i++){
        // Storing extra details in local browser storage
        document.getElementById('textarea_'+available_tasks[i]).value = localStorage.getItem('textarea_'+available_tasks[i]);
    }
}

/**
 * Show / Hide dropdown details that contain extra details
 * @param {string} id - Task ID to show extra task information
 */
function show_details(id){
    var content = document.getElementById("content_"+id);
    if (content.style.display === "none") {
        content.style.display = "block";
        return;
    }
    content.style.display = "none";     
}

/**
 * Populate Tasks if session data was present
 * @param {Object} all_tasks - Json data of all tasks received 
 *                             server to display on screen
 */
function populate(all_tasks) {
    for (var id_tasks in all_tasks){
        try{
            // check if details available
            var task_name = all_tasks[id_tasks]['task'];
            var details = all_tasks[id_tasks]['details'];
        }
        catch(err){
            var task_name = all_tasks[id_tasks]['task'];
            var details = null;
        }
        // console.log(id_tasks + " " + task_name + " " + details);
        document.getElementById('inp_task').value = task_name;
        add_task(extra_details = details, id = Number(id_tasks));
    }
}

/* 
========================================================================= 
4 Flask Interaction
    4.1 Get session
    4.2 Add Task
    4.3 Modify Task details
    4.4 Get All Tasks in a session
    4.5 Delete Task
=========================================================================
*/


/**
 * Interaction with the server
 * @param {int} type - Operation you want to perform
 *       1 : Get Session from server (Default)
 *       2 : Create Task and send to server (requires id, task and or task_details)
 *       3 : Modify Present task and send to server (requires id, task and or task_details)
 *       4 : Get all task from server in case Login (Not yet implemented)
 *       5 : Delete present task from server (requires id)
 * Optional:
 * @param {int} id - Task ID
 * @param {string} task - Task main details
 * @param {string} task_details - Task extra details
 * 
 * NOTE: Server return codes:
 * 'ok'     : Success
 * 'error'  : Something went wrong (check logs)
 */
function get_post_server(type, id=null, task=null, task_details=null){
    var xmlHttp = new XMLHttpRequest();
    try{
        if (type === 1){
            // Get session details from flask
            xmlHttp.open("GET", "http://127.0.0.1:5000/user/''/''/", false);
            xmlHttp.send(null);
            return xmlHttp.responseText;
        }
        if (type === 2){
            // Send task to flask
            if (task_details === null){
                xmlHttp.open("POST", "http://127.0.0.1:5000/api/"+ sessionStorage.to_do_app +"/task?id=" + id + "&t=" + task, false);
            }
            else{
                xmlHttp.open("POST", "http://127.0.0.1:5000/api/"+ sessionStorage.to_do_app +"/task?id=" + id + "&t=" + task + "&d=" + task_details , false);
            }
            xmlHttp.send(null);
            if (xmlHttp.responseText != 'ok'){
                throw "Server Not Connected";
            }
            // Goes into Infinite Loop if server down / Connection lost
            // if (xmlHttp.responseText !== 'ok'){
            //     // if error send again
            //     //get_post_server(type=type, id=id, task=task);
            // }
        }
        if (type === 3){
            // Modify tasks
            if (task === null && task_details !== null){
                xmlHttp.open("POST", "http://127.0.0.1:5000/api/"+ sessionStorage.to_do_app +"/"+ id + "/det?d=" + task_details, false);
            }
            else{
                if (task !== null && task_details === null){
                    xmlHttp.open("POST", "http://127.0.0.1:5000/api/"+ sessionStorage.to_do_app +"/"+ id + "/det?t=" + task, false);
                }
                else{
                    return ;
                }
            }
            xmlHttp.send(null);
            if (xmlHttp.responseText != 'ok'){
                throw "Server Not Connected";
            }
            // Goes into Infinite Loop if server down / Connection lost
            // if (xmlHttp.responseText !== 'ok'){
            //     // if error send again
            //     send_when_connected.push([type, id, task, task_details]);
            //     //get_post_server(type=type, id=id, task=task, task_details=task_details);
            // }
        }
        if (type === 4){
            // Get all task from flask
            xmlHttp.open("GET", "http://127.0.0.1:5000/api/"+ sessionStorage.to_do_app +"/all", false);
            xmlHttp.send(null);
            try{
                json_obj = JSON.parse(xmlHttp.response);
                populate(json_obj);
            }
            catch(err){
                throw "Server Not Connected";
            }
        }
        if (type === 5){
            // Delete task
            xmlHttp.open("GET", "http://127.0.0.1:5000/api/"+ sessionStorage.to_do_app +"/delete/"+ id, false);
            xmlHttp.send(null);
            if (xmlHttp.responseText != 'ok'){
                throw "Server Not Connected";
            }
            // Goes into Infinite Loop if server down / Connection lost
            // if (xmlHttp.response !== 'ok'){
            //     get_post_server(type=type, id=id);
            // }
        }
    }
    catch(err){
        // console.log(err);
        send_when_connected.push([type, id, task, task_details]);
    }
}

/** 
 * Checks if Server is connected every 30 seconds
 * if disconnected
 */
var displayed_disconn_flag = true;
setInterval(function(){
    try{
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", "http://127.0.0.1:5000/connected", false);
        xmlHttp.send(null);
        if (xmlHttp.responseText === 'ok'){
            if (send_when_connected.length > 1){
                show_toast('Sync <i class="fa fa-refresh fa-spin"></i>');
                while(send_when_connected.length > 0){
                    data_to_send = send_when_connected.shift();
                    get_post_server(type=data_to_send[0], id=data_to_send[1], task=data_to_send[2], task_details=data_to_send[3]);
                }
                // show_toast("Sync Completed !");
                displayed_disconn_flag = true;
            }
        }
        else{
            if (displayed_disconn_flag){
                show_toast("Server Disconnected");
                displayed_disconn_flag = false;
            }
        }
    }
    catch(err){
        show_toast("Server Disconnected<br>Content will not be saved");
    }
}, 30000);