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
    checkUserStatusForNav,
    database,
    sidenavFunctie,
} from '../helpers/functies';


// Import the template to use
const addKotTemplate = require('../templates/addKot.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(addKotTemplate)({  }));
    checkUserStatusForNav();
    generateAndStoreKotId();
    sidenavFunctie();
    
    document.getElementById('file-first').addEventListener('change', handleFileSelect1, false);

    document.getElementById('file-second').addEventListener('change', handleFileSelect2, false);

    document.getElementById('file-third').addEventListener('change', handleFileSelect3, false);

    let userId = "";

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            const ref = database.ref(`users/${ firebaseUser.uid}`);
            ref.on('value', (snapshot) => {
                const data = snapshot.val();
                const entity = data.entity;
                if(entity == 'student'){
                    //window.location.href="/";
                }else {
                    userId = firebaseUser.uid;  
                };
            });
        } else {
            //als er niet is ingelogd, dan wordt je automatisch naar de homepagina gebracht
            //window.location.href="/";
        }
    });
    
    //if the login button is clicked
    document.getElementById("btn-addKot-submit").addEventListener('click', (e) => {
        const form = document.getElementById('submit-new-kot');
        if (form.checkValidity()) {
            e.preventDefault();
            console.log(userId);
            newKotToDatabase(userId);
          };
    });
};