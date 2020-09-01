# to-do-app
### Built for MSA Program
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<style>
   .toast {
     background-color: #333;
     color: #fff;
     border-radius: 10px;
     text-align: center;
     z-index: 1;
     font-size: 15px;
     max-width: 200px;
   }
   .box_main {
     background-color: #E5E5E5;
     padding: 2%;
     height: 80px;
     width: 55%;
     border-radius: 20px;
     opacity: 0.9;
   }
   ::placeholder {
     color: #777;
   }
   .content_box {
     background-color: #E5E5E5;
     padding: 5%;
     border-radius: 10px;
     margin-bottom: 10px;
     width: 50%;
     opacity: 1;
   }
</style>

### Features:

<ol>
   <li>
      <h4> Modify Tasks on the go !! (No need to refresh)</h4>
      <ul>
         <li>
            <h3 id="head_" class="box_main">
               <div class="row">
                  <div class="col 10">
                     <input id="ip_" value="Task 1" class="textbox" style="z-index: -1; border-bottom: none; outline: none;" placeholder="Task has some details remove details to delete">
                  </div>
                  <div class="col 1">
                     <button class="btn-floating waves-effect waves-light" style="background-color: #006494; margin-right: 10%;"><i class="fa fa-angle-down" aria-hidden="true"></i></button>
                  </div>
                  <div class="col 1">
                     <button class="btn-floating waves-effect waves-light" style="background-color: red; margin-right: 10%;">x</button>
                  </div>
               </div>
            </h3>
         </li>
         <li>To Cancel click on <button class="btn-floating waves-effect waves-light" style="background-color: red; margin-right: 10%;">x</button></li>
         <li>
            To Add more details click on <button class="btn-floating waves-effect waves-light" style="background-color: #006494; margin-right: 10%;"><i class="fa fa-angle-down" aria-hidden="true"></i></button><br>
            <ul>
               <li>
                  More details box will appear
                  <div id="content_" class="content_box">
                     <div class="row">
                        <div class="col 11">
                           <input id="textarea_" class="textbox" styl="border: none !important;" placeholder="Add more details" value="More Details"></input>
                        </div>
                        <div class="col 1">
                           <button class="btn-floating waves-effect waves-light" style="background-color: #006494;">
                           <i class="fa fa-clock-o"></i>
                           </button>
                        </div>
                     </div>
                  </div>
               <li>
            </ul>
         </li>
      </ul>
   </li>
   <li>
      <h4>Toasts !! </h4>
      <ul>
         <li>
            <div class="toast">Adding Task Title</div>
         </li>
         <li>
            <div class="toast">Removing Empty task</div>
         </li>
         <li>
            <div class="toast">Removing Task Title</div>
         </li>
         <li>
            <div class="toast">Sync <i class="fa fa-refresh fa-spin"></i></div>
         </li>
         <li>
            <div class="toast">Server Disconnected<br>Content will not be saved</div>
         </li>
      </ul>
   </li>
   <br>
   <li>
      <h4> Undo !! </h4>
      <ul>
         <li> Click on <button class="btn-floating waves-effect waves-light" style="background-color: #051923; "><i class="fa fa-undo"></i></button></li>
         <li> OR <br><kbd>Ctrl</kbd> + <kbd>Z</kbd> <i class="fa fa-windows"></i> / <i class="fa fa-linux"></i> <br><kbd>Cmd</kbd> + <kbd>Z</kbd> <i class="fa fa-apple"></i></li>
      </ul>
   </li>
   <li> <h4>Works Offline !!</h4><b>DO NOT CLOSE THE TAB</b><br><p>In case if your device gets disconnected the application will sync with the server once connection is established<br> you will see <div style='background-color: #333; border-radius: 10px; padding: 2%; color: #fff; width: 90px'>Sync <i class="fa fa-refresh fa-spin"></i></div> which will indicate that your tasks are being synced with the server</p>
   
   </li>
</ol>
