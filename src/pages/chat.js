// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {getAllMessagesFromCurrentUser} from '../helpers/functies';


// Import the template to use
const chat = require('../templates/chat.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(chat)({}));

    getAllMessagesFromCurrentUser();

    console.log(document.getElementById('chat-collection-all'));
    //eventlistener, als er geklikt wordt op een element binnen mijn ol
    document.getElementById('chat-collection-all').addEventListener('click', (e) => {
        console.log('hallo!');
        //er wordt gekeken of er geklikt is op een i-element
        if(e.target && e.target.nodeName == 'DIV'){
            let key = e.target.id;
            console.log(key);
            //localStorage['kotInDetail'] = key;
            //setTimeout('window.location.href="/#/kotDetail"', 0)
        }
    });
};