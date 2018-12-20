//
// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Get a reference to the database service
var database = firebase.database();


// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');

export default () => {
  // Return the compiled template to the router
  update(compile(profileTemplate)({  }));

  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
        console.log(firebaseUser.uid);
        getCurUserFromDatabase(firebaseUser.uid);
    } else {
        console.log('not logged in');
    }
  });

    function getCurUserFromDatabase(uid){
        const ref = database.ref('users/' + uid);
        ref.on('value', function(snapshot) {
            console.log(snapshot.val());
            const data = snapshot.val();
            console.log(data.firstName);
            profileChangeValues(data.adress.city, data.adress.street, data.adress.extra, data.firstName, data.lastName, data.highschool, data.phone)
        });
    }
    function profileChangeValues(place, street, extra, firstname, lastname, highschool, phone){
    document.getElementById('place').value = place;
    document.getElementById('street').value = street;
    document.getElementById('extra').value = extra;
    document.getElementById('firstname').value = firstname;
    document.getElementById('lastname').value = lastname;
    document.getElementById('hogeschoolChoice').value = highschool;
    document.getElementById('phone').value = phone;
    };

    function writeKotData() {
        // Get a reference to the database service
        const database = firebase.database();
        database.ref('koten/' + kotId).set({
            "kotbaas" : userId ,
            "adress" : {
                "city" : place ,
                "street" : street ,
                "extra" : extra ,
                "coordinates" : {
                    "lattitude" : lattitude ,
                    "longitude" : longitude ,
                },
            },
            "info" : {
                "prijs" : prijs ,
                "extraInfo" : extraInfo ,
                "overzicht" : {
                    "type" : type ,
                    "oppervlakte" : oppervlakte ,
                    "verdieping" : verdieping ,
                    "maxPersonen" : maxPersons ,
                    "kotenInPand" : kotenInPand ,
                },
                "interieur" : {
                    "douche" : douche ,
                    "bad" : bad ,
                    "toilet" : toilet ,
                    "keuken" : keuken ,
                    'bemeubeld' : bemeubeld ,
                }
            }
        });
    }
};