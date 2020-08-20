/*
This is a temporary made js to work for MSA to-do application 
Author: Mohnish Devadiga
*/

/*
=========================================================================
Init
=========================================================================
*/

//To keep a track of todo lists in a window
// TODO: Check with sessions so that they work crosstab
window.value = 1;

// To keep a task of deleted tasks in the session
// array of array [[id, task details, more details], ...]
var deleted_task_stack = [];

// To keep data of available task_areas
// array to store id of tasks, used in localstorage of extra details
var available_tasks = [];
var session_id = 0;

try {
    if(typeof(Storage) !== "undefined") {
        if (sessionStorage.to_do_app) {
            console.log("Session exists");
            session_id = sessionStorage.to_do_app;
            console.log(session_id);
            // sessionStorage.clear();
        } else {
            // Get from server
            console.log("Session Generted");
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open( "GET", `http://127.0.0.1:5000/user/""/""/`, false);
            xmlHttp.send( null );
            sessionStorage.to_do_app  = xmlHttp.responseText;
            session_id = sessionStorage.to_do_app
            console.log(session_id);
        }
    } else {
        show_toast("Browser not supported");
    }
}
catch(err) {
    console.log(err)
}

/* 
========================================================================= 
Basic Operations
TODO:
1. Add Tasks                                       
    1.1 Press + button to add task                 
    1.2 Press enter to add task                    
2. Remove tasks                                     
    2.1 Press x to delete task                     
    2.2 Erase task to delete task                   
    (delete task only if details of task is empty)
3. Update tasks                                     
=========================================================================
*/

/*
1.   Adding task
1.1. Press + button to add task
*/
// Issue: on adding task, extra details in tasks get deleted
// Solved: using available_tasks , add_text_area_details() and  localStorage 
function add_task(extra_details = null, id = null){
    // added optional parameters in order to accommodate undo feature
    if (id === null){
        // Better alternative would be getting taskid from server
        var i = window.value;
    }
    else{
        var i = id;
    }
    var task = document.getElementById('inp_task').value;
    if (task === ""){
        // Toast message
        show_toast("Task Empty!"+task);
        return;
    }
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
                <div class="col s10">
                `;
    if (extra_details === null) {
        newTask = newTask + `<input id="textarea_`+i+`" class="textbox" styl="border: none !important;" placeholder="Add more details"></input>`;
    }
    else{
        newTask = newTask + `<input id="textarea_`+i+`" class="textbox" styl="border: none !important;" placeholder="Add more details" value="`+extra_details+`"></input>`;
    }               
    newTask = newTask + `
                </div>
                <div class="col s2">
                    extra
                </div>
            </div>
        </div>
    `;
    document.getElementById('task_space').innerHTML = prev + newTask;
    window.value = window.value + 1;
    document.getElementById('inp_task').value = "";
    // Toast message
    show_toast("Added: "+task);
    available_tasks.push(i);
    add_text_area_details();
}

/*
2. Remove tasks
*/
function remove_task(id){
    var task_data = [id, document.getElementById('ip_'+id).value, document.getElementById('textarea_'+id).value];
    deleted_task_stack.unshift(task_data);
    console.log(deleted_task_stack);
    console.log('removing task: '+id);
    // Toast message
    var toast_data = document.getElementById('ip_'+id).value;
    document.getElementById("ip_"+id).classList.toggle("to_strike");
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
        // console.log(elements_2_delete[i]+id);
        document.getElementById(elements_2_delete[i]+id).parentNode.removeChild(document.getElementById(elements_2_delete[i]+id));
    }
}

/* 
3. Update tasks
*/
// Assuming 2 type of events occur
// 'keyup paste' did not work so split them into 2 functions
document.querySelector('body').addEventListener('keyup', function(event) {
    handle_query(event);
});
document.querySelector('body').addEventListener('paste', function(event) {
    handle_query(event);
});

function handle_query(event){
    if (event.target.id.toLowerCase().split("_")[0] === 'ip') {
        task_mods(event.target.id, event.target.value);
    }
    if (event.target.id.toLowerCase().split("_")[0] === 'textarea') {
        task_mods(event.target.id, event.target.value);
        localStorage.setItem(event.target.id, event.target.value);
    }
    // Pressing Enter to add task
    if (event.keyCode === 13 && event.target.id.toLowerCase().split("_")[0] === 'inp') {
        add_task();
    }
}

// Get modifications of tasks
function task_mods(task_id, data){
    // Detecting empty task and details
    if (data == ''){
        var id = String(task_id.split("_")[1]);
        if (document.getElementById('ip_'+id).value === ""){
            if (document.getElementById('textarea_'+id).value === ""){
                remove_task(id);
            }
            else{
                console.log('cannot delete as something in details area');
            }
        }
        else{
            console.log('won\'t delete as something in task area');
        }
    }
    else{
        // update task and data  
        console.log(task_id+' - '+data);
    }
}

/* 
========================================================================= 
Extra features
1. Undo feature
2. Detect control+z pr command + z for undo           
3. Toast popup on changes of text
4. Save data of textarea in browser local storage which caused problem
   during refresh / adding of element [still exists sometimes not sure why]
5. Show or hide extra details area             
=========================================================================
*/

// Undo function
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
    if ((event.keyCode === 90 && event.ctrlKey) || (event.keyCode == 90 && event.metaKey)){
        console.log("previous edited element was: "+deleted_task_stack[0]);
        undo();
    }
});

// toast
function show_toast(text) {
    var toast = document.getElementById("toast");
    toast.innerHTML = text;
    toast.className = "show";
    setTimeout(function(){
        toast.className = toast.className.replace("show", ""); }, 
    4000);
}

// To save text area details
function add_text_area_details(){
    if (available_tasks.length < 1){
        return;
    }
    console.log("tasks :"+ available_tasks)
    var i;
    for (i = 0; i< available_tasks.length; i++){
        console.log(localStorage.getItem('textarea_'+available_tasks[i]));
        document.getElementById('textarea_'+available_tasks[i]).value = localStorage.getItem('textarea_'+available_tasks[i]);
    }
}

// To show or hide content box
function show_details(id){
    var content = document.getElementById("content_"+id);
    if (content.style.display === "none") {
        content.style.display = "block";
        return;
    }
    content.style.display = "none";     
}

// populate task list when getting data from server
function populate() {
    
}

// Save / Send data to verify every 30 seconds
// Not sure if good idea
/*
setInterval(function(){ 
    // function that runs every 30 seconds
    console.log("To be saved");
}, 30000);
*/