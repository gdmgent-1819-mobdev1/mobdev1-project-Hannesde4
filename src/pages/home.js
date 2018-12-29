// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, handleSignUp, firebase} from '../helpers/functies';

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

export default () => {
  // Data to be passed to the template
  const appName = 'Student@kot';
  // Return the compiled template to the router
  update(compile(homeTemplate)({ appName }));
  let entity = "leeg";


  //if the register button is clicked
  document.getElementById("btn-register-start-submit").addEventListener('click', function(e){
    e.preventDefault();
    handleSignUp(entity)
  });

  //if the logout button is clicked
  document.getElementById("btn-register-start-logout").addEventListener('click', function(e){
    e.preventDefault();
    signOutFirebase()
  });

  //if the logout button is clicked
  document.getElementById("side-nav-logOut").addEventListener('click', function(e){
    e.preventDefault();
    signOutFirebase()
  });
  

  //functie om de nav te laten werken
  document.getElementById("sideNav-open").addEventListener('click', function(){
    let element = document.getElementsByClassName("side-nav")[0];
    element.classList.toggle("invisible");
  });
  document.getElementById("sideNav-close").addEventListener('click', function(){
    let element = document.getElementsByClassName("side-nav")[0];
    element.classList.toggle("invisible");
  });

  const homeMain = document.getElementById('home-section-main');
  const homeEntity = document.getElementById('home-section-entity');
  const homeRegister = document.getElementById('home-section-register');
  const homeBtnLogout = document.getElementById('btn-register-start-logout');
  const btnRegKot = document.getElementById('btn-register-start-kotbaas');
  const btnRegStu = document.getElementById('btn-register-start-student');
  const btnRegStart = document.getElementById('btn-register-start');
  const hsLabel2 = document.getElementById('register-hogeschoolChoice');

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
      document.getElementsByClassName("login")[0].style.display = 'none';
      document.getElementById('side-nav-login').style.display = 'none';
      document.getElementById('side-nav-register').style.display = 'none';
      document.getElementById('side-nav-logOut').style.display = 'block';
      document.getElementById('side-nav-logOut').style.display = 'block';
      document.getElementById('side-nav-profile').style.display = 'block';
      //als er is ingelogd, dan wordt je automatisch naar de kotview pagina gebracht
      setTimeout('window.location.href="/#/kotView"', 0)
    } else {
      console.log('not logged in');
      homeMain.style.display = 'block';
      homeRegister.style.display = 'none';
      homeEntity.style.display = 'none';
      homeBtnLogout.style.display = 'none';
      document.getElementsByClassName("login")[0].style.display = 'block';
      document.getElementById('side-nav-login').style.display = 'block';
      document.getElementById('side-nav-register').style.display = 'block';
      document.getElementById('side-nav-logOut').style.display = 'none';
      document.getElementById('side-nav-profile').style.display = 'none';
    }
  });


    //========================================================
    //==================     functions     ===================
    //========================================================
  

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
};