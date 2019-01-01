// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {checkUserStatusForNav, database, sidenavFunctie} from '../helpers/functies';


// Import the template to use
const favorites = require('../templates/favorites.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(favorites)({}));
    checkUserStatusForNav();
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
};