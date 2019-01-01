// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {checkUserStatusForNav, loadSingleChat, firebase, sendMessage, sidenavFunctie} from '../helpers/functies';


// Import the template to use
const singleChat = require('../templates/singleChat.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(singleChat)({}));
    checkUserStatusForNav();
    loadSingleChat();
    sidenavFunctie();

    if( !(localStorage['conversationDetail'])){
        window.location.href = '/#/chat';
    }

    const submit = document.getElementById('submit-new-message');
    
    submit.onclick = ((e) => {
        e.preventDefault();
        const element = document.getElementById('value-new-message');
        let message = element.value;
        sendMessage(localStorage['conversationDetail'], firebase.auth().currentUser.uid, message);
        element.value = '';
        loadSingleChat();
    });
};