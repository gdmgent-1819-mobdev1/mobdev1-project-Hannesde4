// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, firebase, checkIfKotenFromLocStorAreLoaded, storeKotenInLocalStorage, checkUserStatusForNav, database, sidenavFunctie} from '../helpers/functies';


// Import the template to use
const kotOveviewTemplate = require('../templates/kotOverview.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(kotOveviewTemplate)({  }));
    sidenavFunctie();

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            const ref = database.ref(`users/${ firebaseUser.uid}`);
            ref.on('value', (snapshot) => {
                const data = snapshot.val();
                const entity = data.entity;
                if(entity == 'kotbaas'){
                    window.location.href="/";
                }
            });
        } else {
            //als er niet is ingelogd, dan wordt je automatisch naar de homepagina gebracht
            window.location.href="/";
        }
    });

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

    checkUserStatusForNav();
     //checks if a user is logged in, and answers in the console
    (() => {
        storeKotenInLocalStorage()
        .then(checkIfKotenFromLocStorAreLoaded)
        .then(loadMyCode)
    })();
};

function loadMyCode(){
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
}