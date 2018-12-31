// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, firebase, getAllKoten} from '../helpers/functies';


// Import the template to use
const kotOveviewTemplate = require('../templates/kotOverview.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(kotOveviewTemplate)({  }));

    //eventlistener, als er geklikt wordt op een element binnen mijn ol
    document.getElementById('kotOverviewAll').addEventListener('click', (e) => {
        //er wordt gekeken of er geklikt is op een i-element
        if(e.target && e.target.nodeName == 'DIV' && e.target.classList[1] == 'uniqueKot'){
            let key = e.target.id;
            console.log(key);
            localStorage['kotInDetail'] = key;
            setTimeout('window.location.href="/#/kotDetail"', 0)
        }
    })

    //functie om de nav te laten werken
    let element = document.getElementsByClassName("side-nav")[0];
    document.getElementById("sideNav-open").addEventListener('click', () => {
        element.classList.toggle("invisible");
    });
    document.getElementById("sideNav-close").addEventListener('click', () => {
        element.classList.toggle("invisible");
    });

    //if the logout button is clicked
    document.getElementById("side-nav-logOut").addEventListener('click', (e) => {
        e.preventDefault();
        signOutFirebase()
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
    getAllKoten();
    let fire = document.getElementById('list-view-icon-fire');
    let list = document.getElementById("list-view-icon-list");
    let blok = document.getElementById("list-view-icon-blok");
    let kotOverview =  document.getElementById('kotOverviewAll');
    list.addEventListener('click', (e) => {
        e.preventDefault();
        kotOverview.classList.toggle('list-view');
        list.classList.toggle('invisible');
        blok.classList.toggle('invisible');
    });
    blok.addEventListener('click', (e) => {
        e.preventDefault();
        kotOverview.classList.toggle('list-view');
        list.classList.toggle('invisible');
        blok.classList.toggle('invisible');
    });
    fire.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('fire');
        alert('fire!!!');
    });
};