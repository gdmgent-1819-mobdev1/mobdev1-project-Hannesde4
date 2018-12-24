// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Import the template to use
const loginTemplate = require('../templates/login.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(loginTemplate)({  }));

     //if the login button is clicked
  document.getElementById("btn-login").addEventListener('click', function(e){
    e.preventDefault();
    signInFirebase();
  });
  //function to sign in a user
  function signInFirebase() {
    var email = document.getElementById('email-login').value;
    var password = document.getElementById('password-login').value;

    // Handles the sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  };
};