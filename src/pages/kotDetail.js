// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, sendMessage, loadCurrentKot, firebase, getCurrentKot} from '../helpers/functies';


// Import the template to use
const kotDetail = require('../templates/kotDetail.handlebars');

export default () => {
    let currentKot = localStorage['kotInDetail'];
    let kot = JSON.parse(localStorage[currentKot]);
    console.log(kot.foto);
    let fotoArray = kot.foto.split(',');
    let fotoArray1 = fotoArray[0];
    let fotoArray2 = fotoArray[1];
    let fotoArray3 = fotoArray[2];


    // Return the compiled template to the router
    update(compile(kotDetail)({ kot, fotoArray1, fotoArray2, fotoArray3 }));

    //functie om de nav te laten werken
    document.getElementById("sideNav-open").addEventListener('click', () => {
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
    });
    document.getElementById("sideNav-close").addEventListener('click', () =>{
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
    });

    //if the logout button is clicked
    document.getElementById("side-nav-logOut").addEventListener('click', (e) =>{
        e.preventDefault();
        signOutFirebase()
    });

    document.getElementById('btn-startConversation-submit').addEventListener('click', (e) => {
        e.preventDefault();
        sendMessage();
    });
    
    if (localStorage['kotInDetail'] == undefined){
        setTimeout('window.location.href="/"', 0)
        console.log('geen kot in storage');
    }
}