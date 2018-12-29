// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, firebase} from '../helpers/functies';


// Import the template to use
const loginTemplate = require('../templates/login.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(loginTemplate)({  }));

    firebase.auth().onAuthStateChanged(firebaseUser => {
      if(firebaseUser) {
          document.getElementById('side-nav-login').style.display = 'none';
          document.getElementById('side-nav-register').style.display = 'none';
          document.getElementById('side-nav-logOut').style.display = 'block';
          document.getElementById('side-nav-logOut').style.display = 'block';
          document.getElementById('side-nav-profile').style.display = 'block';
          //als er is ingelogd, dan wordt je automatisch naar de kotview pagina gebracht
          setTimeout('window.location.href="/#/kotView"', 0)
      } else {
          console.log('not logged in');
          document.getElementById('side-nav-login').style.display = 'block';
          document.getElementById('side-nav-register').style.display = 'block';
          document.getElementById('side-nav-logOut').style.display = 'none';
          document.getElementById('side-nav-profile').style.display = 'none';
      }
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

     //if the login button is clicked
  document.getElementById("btn-login").addEventListener('click', function(e){
    e.preventDefault();
    signInFirebase();
  });
  //function to sign in a user
  function signInFirebase() {
    let email = document.getElementById('email-login').value;
    let password = document.getElementById('password-login').value;

    // Handles the sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // ...
    });
  };
};