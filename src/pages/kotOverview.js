// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, firebase, checkUserStatusForNav, database, sidenavFunctie, loadAllKoten, allKotenToMap, loadTinder} from '../helpers/functies';

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
        if(e.target && e.target.nodeName == 'A' && e.target.classList[1] == 'uniqueKot'){
            let key = e.target.id;
            //localStorage['urlKey'] = e.target.id;
            console.log(key);
            localStorage['kotInDetail'] = key;
            setTimeout('window.location.href="/#/kotDetail"', 0)
        }
    })

    //eventlistener, als er geklikt wordt op een element binnen mijn ol
    document.getElementById('kotOverviewAll').addEventListener('click', (e) => {
        e.preventDefault();
        //er wordt gekeken of er geklikt is op een i-element
        if(e.target && e.target.nodeName == 'I'){
            let userId = localStorage.getItem('currentUserId');
            let key = e.target.id;
            let parts = key.split('likeKey=');
            let likeId = userId+'+++'+parts[1];
            if( e.target.classList[0] !== 'liked'){
                database.ref('likes/' + likeId).set({
                    'liker' : userId ,
                    'liked' : parts[1],
                });
            } else {
                database.ref('likes/'+likeId).remove();
            }
            loadAllKoten();
        };
    });

    checkUserStatusForNav();
     //checks if a user is logged in, and answers in the console
     loadAllKoten();
     loadMyCode();
};

function loadMyCode(){
    let fire = document.getElementById('list-view-icon-fire');
    let list = document.getElementById("list-view-icon-list");
    let blok = document.getElementById("list-view-icon-blok");
    let kotOverview =  document.getElementById('kotOverviewAll');
    let map = document.getElementById("list-view-icon-map");
    let mapbox = document.getElementById("map");
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
        loadTinder();
    });
    map.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('map');
        kotOverview.classList.toggle('invisible');
        mapbox.classList.toggle('invisible');
        allKotenToMap();
    });
    let filter = document.getElementById('chose-sorting-method');
    filter.onchange = () =>{
        console.log(filter.value);
        loadAllKoten(filter.value);
    };
}