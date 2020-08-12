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

// deleting keydown as it conflicts when putting space in newly added accordian element
delete($.ui.accordion.prototype._keydown);
// Accordion init
$( function() {
    $( "#accordion" ).accordion({
      heightStyle: "content",
      active: false,
      autoHeight: false,
      navigation: true,
      collapsible: true
    });
});

// sidenav bar
$(document).ready(function(){
    $('.sidenav').sidenav();
});

/* 
========================================================================= 
Basic Operations
TODO:
1. Add Tasks                                        -done   11/Aug/2020
    1.1 Press + button to add task                  -done   11/Aug/2020
    1.2 Press enter to add task                     -done   11/Aug/2020
2. Remove tasks                                     -done   11/Aug/2020
    2.1 Press x to delete task                      -done   12/Aug/2020
    2.2 Erase task to delete task                   -done   12/Aug/2020
    (delete task only if details of task is empty)
3. Update tasks                                     -done   12/Aug/2020
=========================================================================
*/

/*
1.   Adding task
1.1. Press + button to add task
*/
function add_task(){
    var i = window.value;
    var task = document.getElementById('inp_task').value;
    if (task === ""){
        // Toast message
        M.toast({html: "Task Empty!"+task});
        return;
    }
    var prev = document.getElementById('accordion').innerHTML;
    var newTask = `
        <h3 id="head_`+i+`">
            <div class="row">
                <div class="col s11">
                    <input id="ip_`+i+`" value="`+task+`" class="textbox" style="z-index: -1; border-bottom: none; outline: none;" placeholder="Task has some details remove details to delete">
                </div>
                <div class="col s1">
                    <button class="btn-floating waves-effect waves-light" style="background-color: red; margin-right: 10%;" onclick="remove_task(`+i+`)">x</button>
                </div>
            </div>
        </h3>
        <div id="content_`+i+`">
            <div class="row">
                <div class="col s10">
                    <input id="textarea_`+i+`" styl="border: none !important;" placeholder="Add more details"></input>
                </div>
                <div class="col s2">
                    extra
                </div>
            </div>
        </div>
    `;
    document.getElementById('accordion').innerHTML = prev + newTask;
    window.value = window.value + 1;
    document.getElementById('inp_task').value = "";
    // Toast message
    M.toast({html: "Added: "+task});
    $("#accordion" ).accordion("refresh");
}

/*
1.2. Press ENTER to add task
*/
$("#inp_task").on( "propertychange change keyup paste input", function(e) {
    if (e.key === 'Enter' || e.keyCode === 13) {
      add_task();
    }
});

/*
2. Remove tasks
*/
function remove_task(id){
    console.log('removing task: '+id);
    // Toast message
    var toast_data = document.getElementById('ip_'+id).value;
    document.getElementById("ip_"+id).classList.toggle("to_strike");
    sleep(200000000000);
    if (toast_data === ""){
        M.toast({html: "Removing Empty task"});
    }
    else{
        M.toast({html: "Removing: " + toast_data});
    }
    $("h3[id*=head_"+id+"]").remove();
    $("div[id*=content_"+id+"]").remove();
    $("#accordion").accordion("refresh");   
}

/* 
3. Update tasks
*/
// Assuming 2 type of events occur
// 'keyup paste' did not work
document.querySelector('body').addEventListener('keyup', function(event) {
    if (event.target.id.toLowerCase().split("_")[0] === 'ip' || event.target.id.toLowerCase().split("_")[0] === 'textarea') {
        task_mods(event.target.id, event.target.value);
    }
});
document.querySelector('body').addEventListener('paste', function(event) {
    if (event.target.id.toLowerCase().split("_")[0] === 'ip' || event.target.id.toLowerCase().split("_")[0] === 'textarea') {
        task_mods(event.target.id, event.target.value);
    }
});


// Get modifications of tasks
function task_mods(task_id, data){
    // Detecting empty task and details
    if (data == ''){
        var id = String(task_id.split("_")[1]);
        if (document.getElementById('ip_'+id).value === ""){
            if (document.getElementById('textarea_'+id).value === ""){
                console.log('deleting '+ id);
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
        // Nothing   
    }
}


/*
Extras
*/

function sleep(ms) {
    return new Promise(
        resolve => setTimeout(resolve, ms)
    );
}
