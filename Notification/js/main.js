var permission = Notification.permission;

function Permission (){
  if(Notification && Notification.permission == 'default') {
     Notification.requestPermission((permission) => {
         if(!('permission' in Notification)) {
             Notification.permission = permission;
         }
     }) 
  }
}
    function notify(title,text){
      if(Notification.permission === 'granted') {
        let notification = new Notification(title,{
          body: text,
        }); 
        notification.onclick=function(){
          window.open('https://google.com');
        };
        setTimeout(notification.close.blind(notification),3000);
      }
    };

Permission();

document.getElementById("signup").addEventListener('click', signup);
document.getElementById("login").addEventListener('click', login);
document.getElementById("publish").addEventListener('click', publish);

function signup(e){
  let email = document.getElementById("signup_email").value;
  let password = document.getElementById("signup_password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(response){  
    notify('U bent geregistreed!','bedankt voor het aanmaken van uw account')

    })
   
    .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // show errors in console
    document.querySelector('.singup_errorCode').innerHTML = errorMessage;
      
  });
}

function login(e){
  e.preventDefault();
  let email = document.getElementById("login_email").value;
  let password = document.getElementById("login_password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(function(resp){ 
    notify('U bent ingelogd!')
     console.log('ingelogd');
     document.getElementById('userInfo').innerHTML = email;
    })
    .then(function(display){
      document.getElementById("singupform").style.display="none";
      document.getElementById("loginform").style.display="none";
      document.querySelector('.formBoxPost').style.display="block";
      let buttons = document.querySelectorAll(".deleteKnop");
      for(let i = 0; i<buttons.length; i++){
        buttons[i].addEventListener('click', remove);
        buttons[i].style.display="block";
      }
      let editButtons = document.querySelectorAll(".editKnop");
      for(let y = 0; y<editButtons.length; y++){
        editButtons[y].style.display="block";
        editButtons[y].addEventListener('click', edit);
      }
    })
      
    .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // show errors in console
    document.querySelector('.login_errorCode').innerHTML = errorMessage;
    
  });
}

function publish(e){
  e.preventDefault(); 
   
  let email = document.getElementById('userInfo').innerHTML;
  let titel = document.getElementById("titel").value;
  let blog = CKEDITOR.instances.editor1.getData();
  let auteur = email;
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let postedOn = day +' '+month+' '+year;
  
  let articleData = {
    title: titel,
    body: blog,
    auteur:auteur,
    date_added:postedOn,
    date_edited: firebase.database.ServerValue.TIMESTAMP,
    uid: email,
  };
  let key = database.ref('article').push(articleData);
  let updates = {};
  updates['article/' + key];
  return database.ref().update(updates) 
    .then(function(){
      notify('Uw artikel is aangemaakt!')
    })
    .catch(function(error) {
        console.log(error);
        alert(error.message)
    }); 
}
function getValues(){
    document.querySelector('#postList').innerHTML = "";
    ref.on('value', function(snapshot) {
      console.log(snapshot.val());
      snapshot.forEach(function(childSnapshot) {
          data = childSnapshot.val();
          console.log(data);
          document.querySelector('#postList').innerHTML += '<h1>' + data.title + '</h1>';
          document.querySelector('#postList').innerHTML += '<p>' + data.auteur + ' - ' + data.date_added + '</p>';
          document.querySelector('#postList').innerHTML += '<p>' + data.body + '</p><button id="' + childSnapshot.key + '" class="deleteKnop">Remove</button><button id="' + childSnapshot.key + '" class="editKnop">Edit</button>';
      });
    });
  }


function remove(e){
  let articleKey = e.currentTarget.id
  let article = database.ref('article/' + articleKey);
  article.remove();
 }
function edit(e){
  let editform = document.querySelector('.formBoxEdit');
  editform.style.display = "block";
  let articleKey = e.currentTarget.id
  let article = database.ref('article/' + articleKey);
  article.on('value',function(snapshot){
    data = snapshot.val();
    document.getElementById('editTitel').value = data.title;
    document.getElementById('editEditor').value = data.body;
    
  });


}
function errData(err){
  console.log(err);
}