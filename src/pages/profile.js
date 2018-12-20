// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

// Get a reference to the database service
const database = firebase.database();


// Import the template to use
const profileTemplate = require('../templates/profile.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(profileTemplate)({  }));

    let userId = "";

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log(firebaseUser.uid);
            getCurUserFromDatabase(firebaseUser.uid);
            userId = firebaseUser.uid;
        } else {
            console.log('not logged in');
        }
    });

    let entity = "";
    document.getElementById('btn-profile-update-user-info').addEventListener('click', function(e){
        e.preventDefault();
        let place = document.getElementById('place').value;
        let lattitude = "test";
        let longitude = "test";
        let street = document.getElementById('street').value;
        let extra = document.getElementById('extra').value;
        let firstName = document.getElementById('firstname').value;
        let lastName = document.getElementById('lastname').value;
        let highschool = document.getElementById('hogeschoolChoice').value;
        let phone = document.getElementById('phone').value;
        updateUser(place, street, extra, lattitude, longitude, firstName, lastName, highschool, phone);
      });

    //========================================================
    //==================     functions     ===================
    //========================================================


    //functie die de gegevens van de huidige ingelogde gebruiker gaat opvragen
    function getCurUserFromDatabase(uid){
        const ref = database.ref('users/' + uid);
        ref.on('value', function(snapshot) {
            console.log(snapshot.val());
            const data = snapshot.val();
            console.log(data.firstName);
            profileChangeValues(data.adress.city, data.adress.street, data.adress.extra, data.firstName, data.lastName, data.hogeschool, data.phone)
            entity = data.entity;
        });
    }

    //functie die het profiel gaat updaten als er de nieuwe gegevens worden opgeslagen
    function profileChangeValues(place, street, extra, firstname, lastname, highschool, phone){
        document.getElementById('place').value = place;
        document.getElementById('street').value = street;
        document.getElementById('extra').value = extra;
        document.getElementById('firstname').value = firstname;
        document.getElementById('lastname').value = lastname;
        document.getElementById('hogeschoolChoice').value = highschool;
        document.getElementById('phone').value = phone;
    };

    function updateUser(place, street, extra, lattitude, longitude, firstName, lastName, highschool, phone) {
        // A post entry.
        var postData = {
            "adress" : {
                "city" : place ,
                "street" : street ,
                "extra" : extra ,
                "coordinates" : {
                    "lattitude" : lattitude ,
                    "longitude" : longitude ,
                },        
            },
            "entity" : entity ,
            "firstName" : firstName ,
            "lastName" : lastName ,
            "hogeschool" : highschool ,
            "phone" : phone
        };
      
      
        // Write the new post's data simultaneously in the posts list and the user's post list.
        var updates = {};
        updates['users/' + userId] = postData;
      
        return firebase.database().ref().update(updates);
    }

    //functie die koten gaaat opslaan in de database
    function writeKotData(userId, place, street, extra, lattitude, longitude, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld) {
        // Get a reference to the database service
        const database = firebase.database();
        let kotId = 1;
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
                "prijs" : price ,
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