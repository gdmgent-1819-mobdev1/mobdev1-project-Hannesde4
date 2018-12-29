// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {signOutFirebase, firebase, getCurrentKot} from '../helpers/functies';


// Import the template to use
const kotDetail = require('../templates/kotDetail.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(kotDetail)({  }));

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
        let currentKot = localStorage['kotInDetail'];
        console.log(localStorage[currentKot]);
        let kot = JSON.parse(localStorage[currentKot]);
        console.log(kot);
        let fotoArray = kot.foto.split(',');
        image1.style.backgroundImage = "url('" + fotoArray[0] + "')";
        image2.style.backgroundImage = "url('" + fotoArray[1] + "')";
        image3.style.backgroundImage = "url('" + fotoArray[2] + "')";
        price.innerHTML = '€' + kot.info.prijs
        info.innerHTML = kot.info.extraInfo;
        type.innerHTML = kot.info.overzicht.type;
        oppervlakte.innerHTML = kot.info.overzicht.oppervlakte + 'm2';
        verdieping.innerHTML = kot.info.overzicht.verdieping;
        maxPersons.innerHTML = kot.info.overzicht.maxPersonen;
        kotenInPand.innerHTML = kot.info.overzicht.kotenInPand;
        douche.innerHTML = kot.info.interieur.douche;
        bad.innerHTML = kot.info.interieur.bad;
        toilet.innerHTML = kot.info.interieur.toilet;
        keuken.innerHTML = kot.info.interieur.keuken;
        bemeubeld.innerHTML = kot.info.interieur.bemeubeld;
    }
}