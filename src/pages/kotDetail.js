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

    const image1 = document.getElementById('kotDetail-image1');
    const image2 = document.getElementById('kotDetail-image2');
    const image3 = document.getElementById('kotDetail-image3');
    const price = document.getElementById('kotDetail-price-value');
    const info = document.getElementById('kotDetail-info-value');
    const type = document.getElementById('kotDetail-studio-type-value');
    const oppervlakte = document.getElementById('kotDetail-oppervlakte-value');
    const verdieping = document.getElementById('kotDetail-verdieping-value');
    const maxPersons = document.getElementById('kotDetail-maxPersonen-value');
    const kotenInPand = document.getElementById('kotDetail-kotenInPand-value');
    const douche = document.getElementById('kotDetail-douche-value');
    const bad = document.getElementById('kotDetail-bad-value');
    const toilet = document.getElementById('kotDetail-toilet-value');
    const keuken = document.getElementById('kotDetail-keuken-value');
    const bemeubeld = document.getElementById('kotDetail-bemeubeld-value');

    if (localStorage['kotInDetail'] == undefined){
        setTimeout('window.location.href="/"', 0)
        console.log('geen kot in storage');
    }else{
        loadCurrentKot();
    }
}