//
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, firebase} from '../helpers/functies';


// Import the template to use
const aboutTemplate = require('../templates/about.handlebars');

export default () => {
  // Data to be passed to the template
  const name = 'Test inc.';
  // Return the compiled template to the router
  update(compile(aboutTemplate)({ name }));

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        document.getElementById('side-nav-login').style.display = 'none';
        document.getElementById('side-nav-register').style.display = 'none';
        document.getElementById('side-nav-logOut').style.display = 'block';
        document.getElementById('side-nav-logOut').style.display = 'block';
        document.getElementById('side-nav-profile').style.display = 'block';
    } else {
        console.log('not logged in');
        document.getElementById('side-nav-login').style.display = 'block';
        document.getElementById('side-nav-register').style.display = 'block';
        document.getElementById('side-nav-logOut').style.display = 'none';
        document.getElementById('side-nav-profile').style.display = 'none';
    }
});


  //functie om de nav te laten werken
  document.getElementById("sideNav-open").addEventListener('click', () =>{
    let element = document.getElementsByClassName("side-nav")[0];
    element.classList.toggle("invisible");
  });
  document.getElementById("sideNav-close").addEventListener('click', () =>{
    let element = document.getElementsByClassName("side-nav")[0];
    element.classList.toggle("invisible");
  });

  //if the logout button is clicked
  document.getElementById("side-nav-logOut").addEventListener('click', (e) =>{
    e.preventDefault();
    signOutFirebase()
  });

};