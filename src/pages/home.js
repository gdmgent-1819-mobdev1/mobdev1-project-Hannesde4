// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, handleSignUp, firebase, database, sidenavFunctie, checkUserStatusForNav} from '../helpers/functies';

// Import the template to use
const homeTemplate = require('../templates/home.handlebars');

export default () => {
  // Data to be passed to the template
  const appName = 'Student@kot';
  // Return the compiled template to the router
  update(compile(homeTemplate)({ appName }));
  checkUserStatusForNav('not');
  let entity = "leeg";


  //if the register button is clicked
  document.getElementById("btn-register-start-submit").addEventListener('click', (e) => {
    e.preventDefault();
    handleSignUp(entity)
  });

  //if the logout button is clicked
  document.getElementById("btn-register-start-logout").addEventListener('click', (e) => {
    e.preventDefault();
    signOutFirebase()
  });

  sidenavFunctie();

  const homeMain = document.getElementById('home-section-main');
  const homeEntity = document.getElementById('home-section-entity');
  const homeRegister = document.getElementById('home-section-register');
  const homeBtnLogout = document.getElementById('btn-register-start-logout');
  const btnRegKot = document.getElementById('btn-register-start-kotbaas');
  const btnRegStu = document.getElementById('btn-register-start-student');
  const btnRegStart = document.getElementById('btn-register-start');
  const hsLabel2 = document.getElementById('register-hogeschoolChoice');

  btnRegStart.onclick = () => {
    homeMain.style.display = 'none';
    homeEntity.style.display = 'block';
  };
  btnRegStu.onclick = () => {
    entity = "student";
    homeEntity.style.display = 'none';
    homeRegister.style.display = 'block';
    hsLabel2.style.display = "block";
  };
  btnRegKot.onclick = () => {
    entity = "kotbaas";
    homeEntity.style.display = 'none';
    homeRegister.style.display = 'block';
    hsLabel2.style.display = "none";
  };


  //checks if a user is logged in, and answers in the console
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      homeMain.style.display = 'none';
      homeRegister.style.display = 'none';
      homeEntity.style.display = 'none';
      homeBtnLogout.style.display = 'block';
      document.getElementsByClassName("login")[0].style.display = 'none';
      //als er is ingelogd, dan wordt je automatisch naar de kotview pagina gebracht
      const ref = database.ref(`users/${ firebaseUser.uid}`);
      ref.on('value', (snapshot) => {
        const data = snapshot.val();
        const entity = data.entity;
        if(entity == 'student'){
          window.location.href="/#/kotView";
        }else if(entity == 'kotbaas'){
          window.location.href="/#/mijnKoten";
        };
      });
    } else {
      console.log('not logged in');
      homeMain.style.display = 'block';
      homeRegister.style.display = 'none';
      homeEntity.style.display = 'none';
      homeBtnLogout.style.display = 'none';
      document.getElementsByClassName("login")[0].style.display = 'block';
    }
  });
};