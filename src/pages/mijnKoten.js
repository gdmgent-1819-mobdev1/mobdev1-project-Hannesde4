// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {checkUserStatusForNav, sidenavFunctie, loadMyKoten, loadMyCode} from '../helpers/functies';


// Import the template to use
const mijnKoten = require('../templates/mijnKoten.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(mijnKoten)({}));
    checkUserStatusForNav();
    sidenavFunctie();

    loadMyKoten();
    loadMyCode('baas');

    //eventlistener, als er geklikt wordt op een element binnen mijn ol
    document.getElementById('kotOverviewAll').addEventListener('click', (e) => {
        //er wordt gekeken of er geklikt is op een i-element
        if(e.target && e.target.nodeName == 'A' && e.target.classList[1] == 'uniqueKot'){
            let key = e.target.id;
            localStorage['kotInDetail'] = key;
            window.location.href="/#/mijnKotenDetail";
            console.log(key);
        }
    })
};