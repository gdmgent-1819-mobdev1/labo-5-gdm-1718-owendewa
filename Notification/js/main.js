function sendNotification(msg) {
  let notif = new Notification(msg);
}

function requestNotificationPermission() {
  if (Notification && Notification.permission === 'default') {
    Notification.requestPermission(function (permission) {
      if (!('permission' in Notification)) {
        Notification.permission = permission;
      }
    });
  }
}
requestNotificationPermission();
document.getElementById("signup").addEventListener('click', signup);
document.getElementById("login").addEventListener('click', login);
document.getElementById("publish").addEventListener('click', publish);

function signup(e){
  e.preventDefault();
  let email = document.getElementById("signup_email").value;
  let password = document.getElementById("signup_password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then(function(response){   
    let thanks = "Bedankt voor uw account te maken bij ons" ;  
     sendNotification(thanks);
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
     console.log('ingelogd');
     document.getElementById('userInfo').innerHTML = email;
    })
    .then(function(display){
      document.getElementById("singupform").style.display="none";
      document.getElementById("loginform").style.display="none";
      document.querySelector('.formBoxPost').style.display="block";
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
  let auteur = document.getElementById("auteur").value;
  let date = new Date();  
  
  let articleData = {
    title: titel,
    body: blog,
    auteur:auteur,
    date_added:date,
    date_edited: firebase.database.ServerValue.TIMESTAMP,
    uid: email,
  };
  let key = firebase.database().ref(
    'article').push().key;
  let updates = {};
  updates['article/' + key] = articleData;
  
  return firebase
    .database()
    .ref()
    .update(updates)
    .then(function(){
        alert('Added ' + titel);

    })
    .catch(function(error) {
        console.log(error);
        alert(error.message)
    }); 
}
function getData(data){
  let articles = data.val();
  let keys = Object.keys(articles);
  console.log(keys);
  for(let i=0; i<keys.length; i++){
    let k = keys[i];
    let titel = articles[k].title;
    let auteur = articles[k].auteur;
    let content = articles[k].body;
    let datum = articles[k].date_added;

    console.log(titel,auteur,content,datum);
    let box = document.getElementById('postList');
    let createTitel = document.createElement('H1');
    createTitel.innerHTML = titel;
    let createContent = document.createElement('p');
    createContent.innerHTML = content;
    let createAuteur = document.createElement('H3');
    createAuteur.innerHTML = auteur;
    let createDatum = document.createElement('H3');
    createDatum.innerHTML = datum;
    let post = document.createElement('div');
    post.appendChild(createTitel);
    post.appendChild(createContent);
    post.appendChild(createAuteur);
    post.appendChild(createDatum);
    box.appendChild(post);
     
  }
}

function errData(err){
  console.log(err);
}
  
