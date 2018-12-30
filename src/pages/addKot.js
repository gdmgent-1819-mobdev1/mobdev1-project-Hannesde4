// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {
    signOutFirebase , 
    newKotToDatabase , 
    handleFileSelect1 ,
    handleFileSelect2 ,
    handleFileSelect3 ,
    generateAndStoreKotId ,
    firebase , 
    auth ,
} from '../helpers/functies';


// Import the template to use
const addKotTemplate = require('../templates/addKot.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(addKotTemplate)({  }));

    generateAndStoreKotId();
    console.log(generateAndStoreKotId());

    //functie om de nav te laten werken
    document.getElementById("sideNav-open").addEventListener('click', () => {
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
    });
    document.getElementById("sideNav-close").addEventListener('click', () => {
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
    });

    //if the logout button is clicked
    document.getElementById("side-nav-logOut").addEventListener('click', (e) => {
        e.preventDefault();
        signOutFirebase()
    });
    document.getElementById('file-first').addEventListener('change', handleFileSelect1, false);

    document.getElementById('file-second').addEventListener('change', handleFileSelect2, false);

    document.getElementById('file-third').addEventListener('change', handleFileSelect3, false);

    let userId = "";

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log('Anonymous user signed-in.');
            console.log(firebaseUser.uid);
            userId = firebaseUser.uid;
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
            console.log('There was no anonymous session. Creating a new anonymous user.');
            // Sign the user in anonymously since accessing Storage requires the user to be authorized.
            auth.signInAnonymously().catch((error) => {
            if (error.code === 'auth/operation-not-allowed') {
                window.alert('Anonymous Sign-in failed. Please make sure that you have enabled anonymous ' +
                    'sign-in on your Firebase project.');
            }
            });
            //als er niet is ingelogd, dan wordt je automatisch naar de homepagina gebracht
            setTimeout('window.location.href="/"', 0)
        }
    });
    
    //if the login button is clicked
    document.getElementById("btn-addKot-submit").addEventListener('click', (e) => {
        e.preventDefault();
        console.log(userId);
        newKotToDatabase(userId);
    });
};