// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {getAllMessagesFromCurrentUser, checkUserStatusForNav, sidenavFunctie} from '../helpers/functies';


// Import the template to use
const chat = require('../templates/chat.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(chat)({}));
    checkUserStatusForNav();
    getAllMessagesFromCurrentUser();
    sidenavFunctie();
    //eventlistener, als er geklikt wordt op een element binnen mijn ol
    document.getElementById('chat-collection-all').addEventListener('click', (e) => {
        //er wordt gekeken of er geklikt is op een i-element
        if(e.target && e.target.nodeName == 'DIV' && e.target.classList[0] == 'message'){
            let key = e.target.id;
            localStorage['conversationDetail'] = key;
            window.location.href="/#/singleChat";
        }
    });
};