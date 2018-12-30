// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, sendMessage, loadCurrentKot, firebase, getCurrentKot} from '../helpers/functies';


// Import the template to use
const kotDetail = require('../templates/kotDetail.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(kotDetail)({  }));

    //if the logout button is clicked
    document.getElementById("side-nav-logOut").addEventListener('click', (e) => {
        e.preventDefault();
        signOutFirebase()
    });

    document.getElementById('btn-startConversation-submit').addEventListener('click', (e) => {
        e.preventDefault();
        sendMessage();
    });
    

    //functie om de nav te laten werken
    document.getElementById("sideNav-open").addEventListener('click', () => {
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
    });
    document.getElementById("sideNav-close").addEventListener('click', () =>{
        let element = document.getElementsByClassName("side-nav")[0];
        element.classList.toggle("invisible");
    });

    if (localStorage['kotInDetail'] == undefined){
        setTimeout('window.location.href="/"', 0)
        console.log('geen kot in storage');
    }else{
        loadCurrentKot();
    }
}