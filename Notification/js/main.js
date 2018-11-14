/* Notification */
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
    /*Ask Permission */
Permission();
document.getElementById("signup").addEventListener('click', signup);
document.getElementById("login").addEventListener('click', login);
document.getElementById("publish").addEventListener('click', publish);
/*Signup function*/
function signup(e){
  e.preventDefault();
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
function currentUser(){
  let currentUser = '';

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user.email;
        currentPass = user.password;
    }
});
}
/*Login function*/
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
      document.querySelector('#logoutButton').style.display="block";
      let buttons = document.querySelectorAll(".deleteKnop");
      let editButtons = document.querySelectorAll(".editKnop");
      ref.on('value', function(snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(function(childSnapshot) {
          post = childSnapshot.val();
          currentUser();
          if( post.auteur = currentUser){
            for(let i = 0; i<buttons.length; i++){
                // User is signed in.
                buttons[i].addEventListener('click', remove);
                buttons[i].style.display="block";
              }
            for(let y = 0; y<editButtons.length; y++){
                // User is signed in.
                editButtons[y].style.display="block";
                editButtons[y].addEventListener('click', edit);
              } 
          }
        })
      })
    })
    .catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // show errors in console
    document.querySelector('.login_errorCode').innerHTML = errorMessage;
  });
}
document.getElementById('logoutButton').addEventListener('click',e => {
  firebase.auth().signOut();
  document.getElementById("singupform").style.display="block";
      document.getElementById("loginform").style.display="block";
      document.querySelector('.formBoxPost').style.display="none";
      document.querySelector('#logoutButton').style.display="none";
      document.getElementById('userInfo').innerHTML = "";

      let buttons = document.querySelectorAll(".deleteKnop");
      for(let i = 0; i<buttons.length; i++){
        buttons[i].addEventListener('click', remove);
        buttons[i].style.display="none";
      }
      let editButtons = document.querySelectorAll(".editKnop");
      for(let y = 0; y<editButtons.length; y++){
        editButtons[y].style.display="none";
        editButtons[y].addEventListener('click', edit);
      }

  console.log('uitgelogd');
});

/**Reset funtion */
document.getElementById('forgot').addEventListener('click', reset);
function reset(e){
  e.preventDefault();
  var auth = firebase.auth();
  var emailAddress = document.getElementById("login_email").value;
  auth.sendPasswordResetEmail(emailAddress).then(function() {
  alert('Reset is verzonden naar '+emailAddress);
  }).catch(function(error) {
  // An error happened.
  });
}
/**Publish function*/
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
/**Show values on screen */
function getValues(){
  currentUser();
    document.querySelector('#postList').innerHTML = "";
    ref.on('value', function(snapshot) {
      console.log(snapshot.val());
      snapshot.forEach(function(childSnapshot) {
          post = childSnapshot.val();
          console.log(post);
          document.querySelector('#postList').innerHTML += '<h1>' + post.title + '</h1>';
          document.querySelector('#postList').innerHTML += '<p>' + post.auteur + '   ' + post.date_added + '</p>';
          document.querySelector('#postList').innerHTML += '<p>' + post.body + '</p><button id="' + childSnapshot.key + '" class="deleteKnop">Remove</button><button id="' + childSnapshot.key + '" class="editKnop">Edit</button>';
      });
    });
  }
  /**Remove function */
function remove(e){
  alert('test');
  let articleKey = e.currentTarget.id
  let article = database.ref('article/' + articleKey);
  article.remove();
 }
 /**Edit function */
function edit(e){
  let editform = document.querySelector('.formBoxEdit');
  editform.style.display = "block";
  let articleKey = e.currentTarget.id
  let article = database.ref('article/' + articleKey);
  localStorage.setItem('key', articleKey);
  article.on('value',function(snapshot){
    data = snapshot.val();
    document.getElementById('editTitel').value = data.title;
    document.getElementById('editEditor').value = data.body;
    window.screenX=0;
    window.screenY=50;
  });
}
/**Confirm the edit*/
document.getElementById('confirmEditButton').addEventListener('click', confirm);
function confirm(e){
  e.preventDefault();
  let newKey = localStorage.getItem('key');
  let email = document.getElementById('userInfo').innerHTML;
  let titel = document.getElementById("editTitel").value;
  let blog = document.getElementById("editEditor").value;
  let auteur = email;
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let postedOn = day+' '+month+' '+year;
  let articleData = {
    title: titel,
    body: blog,
    auteur:auteur,
    date_added:postedOn,
    date_edited: firebase.database.ServerValue.TIMESTAMP,
    uid: email,
  };
  var updates = {};
  updates['article/' + newKey] = articleData;
  firebase.database().ref().update(updates);
}
function errData(err){
  console.log(err);
}