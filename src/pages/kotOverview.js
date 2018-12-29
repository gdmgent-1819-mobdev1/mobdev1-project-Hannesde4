// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, firebase, getAllKoten} from '../helpers/functies';


// Import the template to use
const kotOveviewTemplate = require('../templates/kotOverview.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(kotOveviewTemplate)({  }));
    getAllKoten();

    //eventlistener, als er geklikt wordt op een element binnen mijn ol
    document.getElementById("kotOverviewAll").addEventListener("click", function(e) {
        console.log('test');
        //er wordt gekeken of er geklikt is op een i-element
        if(e.target && e.target.nodeName == "DIV"){
            let key = e.target.id;
            console.log(key);
            localStorage['kotInDetail'] = key;
            setTimeout('window.location.href="/#/kotDetail"', 0)
        }
    })

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

    document.getElementById("list-view-icon-list").addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('kotOverview').classList.toggle('list-view');
        document.getElementById("list-view-icon-list").classList.toggle('invisible');
        document.getElementById("list-view-icon-blok").classList.toggle('invisible');
    });
    document.getElementById("list-view-icon-blok").addEventListener('click', function(e){
        e.preventDefault();
        document.getElementById('kotOverview').classList.toggle('list-view');
        document.getElementById("list-view-icon-list").classList.toggle('invisible');
        document.getElementById("list-view-icon-blok").classList.toggle('invisible');
    });

     //checks if a user is logged in, and answers in the console
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      console.log(firebaseUser);
      document.getElementsByClassName("login")[0].style.display = 'none';
      document.getElementById('side-nav-login').style.display = 'none';
      document.getElementById('side-nav-register').style.display = 'none';
      document.getElementById('side-nav-logOut').style.display = 'block';
      document.getElementById('side-nav-logOut').style.display = 'block';
      document.getElementById('side-nav-profile').style.display = 'block';
    } else {
      console.log('not logged in');
      document.getElementsByClassName("login")[0].style.display = 'block';
      document.getElementById('side-nav-login').style.display = 'block';
      document.getElementById('side-nav-register').style.display = 'block';
      document.getElementById('side-nav-logOut').style.display = 'none';
      document.getElementById('side-nav-profile').style.display = 'none';
      //als er niet is ingelogd, dan wordt je automatisch naar de index pagina gebracht
      setTimeout('window.location.href="/"', 0)
    }
  });
};