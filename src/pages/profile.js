// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {getCurUserFromDatabase, updateUser, firebase, checkUserStatusForNav, sidenavFunctie} from '../helpers/functies'

let myUserId = "";

// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(profileTemplate)({  }));

    checkUserStatusForNav();
    sidenavFunctie();

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
    document.getElementById('btn-profile-update-user-info').addEventListener('click', (e) => {
        e.preventDefault();
        let place = document.getElementById('place').value;
        let street = document.getElementById('street').value;
        let extra = document.getElementById('extra').value;
        let firstName = document.getElementById('firstname').value;
        let lastName = document.getElementById('lastname').value;
        let highschool = document.getElementById('hogeschoolChoice').value;
        let phone = document.getElementById('phone').value;
        updateUser(place, street, extra, firstName, lastName, highschool, phone, myUserId);
      });
};