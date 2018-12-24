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
    let userId = "";

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log(firebaseUser.uid);
            userId = firebaseUser.uid;
        } else {
            console.log('not logged in');
        }
    });
    
    //if the login button is clicked
    document.getElementById("btn-addKot-submit").addEventListener('click', function(e){
        e.preventDefault();
        newKotToDatabase();
    });

    //functie die nieuwe koten gaat wegschrijven in de database
    function newKotToDatabase(){
        // Create a new kot reference with an auto-generated id
        // Get a key for a new Post.
        let kotId = firebase.database().ref().child('koten').push().key;

        let price = document.getElementById('register-kot-price').value;
        let extraInfo = document.getElementById('register-kot-info').value;
        let type = document.getElementById('register-kot-type').value;
        let oppervlakte = document.getElementById('register-kot-oppervlakte').value;
        let verdieping = document.getElementById('register-kot-floor').value;
        let maxPersons = document.getElementById('register-kot-maxPersons').value;
        let kotenInPand = document.getElementById('register-kot-kotAmount').value;
        let douche = document.getElementById('register-kot-douche').value;
        let bad = document.getElementById('register-kot-bad').value;
        let toilet = document.getElementById('register-kot-toilet').value;
        let keuken = document.getElementById('register-kot-keuken').value;
        let bemeubeld = document.getElementById('register-kot-bemeubeld').value;
        let street = document.getElementById('register-kot-street').value;
        let extra = document.getElementById('register-kot-extra').value;
        let place = document.getElementById('register-kot-place').value;

        let lattitude = "test";
        let longitude = "test";
        


        writeKotData(kotId, place, street, extra, lattitude, longitude, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld);
    };

    //functie die koten gaaat opslaan in de database
    function writeKotData(kotId, place, street, extra, lattitude, longitude, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld) {
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