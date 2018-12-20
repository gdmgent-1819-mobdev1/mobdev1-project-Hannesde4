// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Get a reference to the database service
const database = firebase.database();


// Import the template to use
const addKotTemplate = require('../templates/addKot.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(addKotTemplate)({  }));
    

    //functie die nieuwe koten gaat wegschrijven in de database
    function newKotToDatabase(){
        // Create a new kot reference with an auto-generated id
        var newPostRef = database.push();
        newPostRef.set({
            // ...
        });
    }

};