// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {getCurUserFromDatabase, updateUser, signOutFirebase, firebase} from '../helpers/functies'

let myUserId = "";

// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(profileTemplate)({  }));

    //functie om de nav te laten werken
    document.getElementById("sideNav-open").addEventListener('click', function(){
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
      });
      document.getElementById("sideNav-close").addEventListener('click', function(){
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
      });

    //if the logout button is clicked
    document.getElementById("side-nav-logOut").addEventListener('click', function(e){
        e.preventDefault();
        signOutFirebase()
    });

    //checks if a user is logged in, and answers in the console
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser.uid);
        myUserId = firebaseUser.uid;
        console.log(myUserId);
        getCurUserFromDatabase(myUserId);
      document.getElementsByClassName("login")[0].style.display = 'none';
    } else {
      console.log('not logged in');
      document.getElementsByClassName("login")[0].style.display = 'block';
      document.getElementById('side-nav-login').style.display = 'block';
      document.getElementById('side-nav-register').style.display = 'block';
      document.getElementById('side-nav-logOut').style.display = 'none';
      document.getElementById('side-nav-profile').style.display = 'none';
      //als er niet is ingelogd, dan wordt je automatisch naar de homepagina gebracht
      setTimeout('window.location.href="/"', 0)
    }
  });
    document.getElementById('btn-profile-update-user-info').addEventListener('click', function(e){
        e.preventDefault();
        let place = document.getElementById('place').value;
        let lattitude = "test";
        let longitude = "test";
        let street = document.getElementById('street').value;
        let extra = document.getElementById('extra').value;
        let firstName = document.getElementById('firstname').value;
        let lastName = document.getElementById('lastname').value;
        let highschool = document.getElementById('hogeschoolChoice').value;
        let phone = document.getElementById('phone').value;
        updateUser(place, street, extra, lattitude, longitude, firstName, lastName, highschool, phone, myUserId);
      });
};