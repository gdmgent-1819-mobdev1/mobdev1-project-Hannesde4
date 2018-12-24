// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();


// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

export default () => {
  // Data to be passed to the template
  const appName = 'Student@kot';
  // Return the compiled template to the router
  update(compile(homeTemplate)({ appName }));


  //if the register button is clicked
  document.getElementById("btn-register-start-submit").addEventListener('click', function(e){
    e.preventDefault();
    handleSignUp()
  });

  //if the logout button is clicked
  document.getElementById("btn-register-start-logout").addEventListener('click', function(e){
    e.preventDefault();
    signOutFirebase()
  });

  const homeMain = document.getElementById('home-section-main');
  const homeEntity = document.getElementById('home-section-entity');
  const homeRegister = document.getElementById('home-section-register');
  const homeBtnLogout = document.getElementById('btn-register-start-logout');
  const btnRegKot = document.getElementById('btn-register-start-kotbaas');
  const btnRegStu = document.getElementById('btn-register-start-student');
  const btnRegStart = document.getElementById('btn-register-start');
  const hsLabel2 = document.getElementById('register-hogeschoolChoice');
  let entity = "leeg";

  btnRegStart.onclick = function () {
    homeMain.style.display = 'none';
    homeEntity.style.display = 'block';
  };
  btnRegStu.onclick = function () {
    entity = "student";
    console.log(entity);
    homeEntity.style.display = 'none';
    homeRegister.style.display = 'block';
    hsLabel2.style.display = "block";
  };
  btnRegKot.onclick = function () {
    entity = "kotbaas";
    console.log(entity);
    homeEntity.style.display = 'none';
    homeRegister.style.display = 'block';
    hsLabel2.style.display = "none";
  };


  //checks if a user is logged in, and answers in the console
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
      homeMain.style.display = 'none';
      homeRegister.style.display = 'none';
      homeEntity.style.display = 'none';
      homeBtnLogout.style.display = 'block';
    } else {
      console.log('not logged in');
      homeMain.style.display = 'block';
      homeRegister.style.display = 'none';
      homeEntity.style.display = 'none';
      homeBtnLogout.style.display = 'none';
    }
  });


    //========================================================
    //==================     functions     ===================
    //========================================================
  

  //Handles the sign up button press.
  function handleSignUp() {
    let place = document.getElementById('register-place').value;
    let lattitude = "test";
    let longitude = "test";
    let street = document.getElementById('register-street').value;
    let extra = document.getElementById('register-extra').value;
    let firstName = document.getElementById('register-firstname').value;
    let lastName = document.getElementById('register-lastname').value;
    let hogeschool = document.getElementById('register-hogeschoolChoice').value;
    let phone = document.getElementById('register-phone').value;
    let email = document.getElementById('register-email').value;
    let password = document.getElementById('register-password').value;
    let passwordConfirm = document.getElementById('register-passwordConfirm').value;
    if (email.length < 4) {
        alert('Vul een geldig emailadres in!');
        return;
    }
    if (password.length < 4) {
        alert('Vul een wachtwoord in!');
        return;
    }
    if (password !== passwordConfirm){
      alert('De wachtswoorden zijn niet gelijk!');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(data){
      console.log('uid',data.user.uid);
      writeUserData(data.user.uid, place, lattitude, longitude, street, extra, entity, firstName, lastName, hogeschool, phone);
    
      //Here if you want you can sign in the user
    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
  }

  //function to sign out the current user
  function signOutFirebase() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  };

  // Sends an email verification to the user.
  function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  };

  //functie die de overige data in een object plaatst, en deze in de firebase database gaat opslaan
  function writeUserData(userId, place, lattitude, longitude, street, extra, entity, firstName, lastName, hogeschool, phone) {
    // Get a reference to the database service
    const database = firebase.database();
    database.ref('users/' + userId).set({
      "adress" : {
        "city" : place ,
        "street" : street ,
        "extra" : extra ,
        "coordinates" : {
          "lattitude" : lattitude ,
          "longitude" : longitude ,
        },        
      },
      "entity" : entity ,
      "firstName" : firstName ,
      "lastName" : lastName ,
      "hogeschool" : hogeschool ,
      "phone" : phone
    });
  }
};