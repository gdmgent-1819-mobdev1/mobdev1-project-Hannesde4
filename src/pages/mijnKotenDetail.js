// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {checkUserStatusForNav, sidenavFunctie, updateKot, handleFileSelect1, handleFileSelect2, handleFileSelect3, database, sendNotification} from '../helpers/functies';


// Import the template to use
const mijnKotenDetail = require('../templates/mijnKotenDetail.handlebars');

export default () => {
    if (localStorage.kotInDetail == undefined) {
        console.log('geen kot in storage');
        window.location.href = '/';
      }
      
      const currentKot = localStorage.kotInDetail;
      const kot = JSON.parse(localStorage[currentKot]);
      const fotoArray = kot.foto.split(',');
      const fotoArray1 = fotoArray[0];
      const fotoArray2 = fotoArray[1];
      const fotoArray3 = fotoArray[2];

    // Return the compiled template to the router
    update(compile(mijnKotenDetail)({ kot, fotoArray1, fotoArray2, fotoArray3 }));
    checkUserStatusForNav();
    sidenavFunctie();

    /* document.getElementById('file-first').addEventListener('change', handleFileSelect1, false);

    document.getElementById('file-second').addEventListener('change', handleFileSelect2, false);

    document.getElementById('file-third').addEventListener('change', handleFileSelect3, false); */
    
    document.getElementById('btn-kot-update-my-kot').addEventListener('click', (e) => {
        e.preventDefault();
        const price = document.getElementById('register-kot-price').value;
        const extraInfo = document.getElementById('register-kot-info').value;
        const type = document.getElementById('register-kot-type').value;
        const oppervlakte = document.getElementById('register-kot-oppervlakte').value;
        const verdieping = document.getElementById('register-kot-floor').value;
        const maxPersons = document.getElementById('register-kot-maxPersons').value;
        const kotenInPand = document.getElementById('register-kot-kotAmount').value;
        const douche = document.getElementById('register-kot-douche').value;
        const bad = document.getElementById('register-kot-bad').value;
        const toilet = document.getElementById('register-kot-toilet').value;
        const keuken = document.getElementById('register-kot-keuken').value;
        const bemeubeld = document.getElementById('register-kot-bemeubeld').value;
        const street = document.getElementById('register-kot-street').value;
        const extra = document.getElementById('register-kot-extra').value;
        const place = document.getElementById('register-kot-place').value;
        updateKot(localStorage.kotInDetail, place, street, extra, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld, localStorage.currentUserId);
      });
  document.getElementById('btn-kot-delete-my-kot').addEventListener('click', (e) => {
    e.preventDefault();
    database.ref('koten/'+localStorage.kotInDetail).remove();
    let message = 'Uw kot werdt succesvol verwijderd';
    let title = 'Kot verwijderd';
    sendNotification(message, title);
    const ref = database.ref('likes/');
    ref.on('value', (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const likeKey = childSnapshot.key;
        const like = childSnapshot.val();
        console.log(like);
        console.log('storage: ' +localStorage.kotInDetail);
        console.log('like: ' +like.liked);
        if(like.liked == localStorage.kotInDetail){
          console.log('likes/'+likeKey);
          database.ref('likes/'+likeKey).remove();;
        };
        localStorage.removeItem(localStorage.kotInDetail);
      });
    });
    setTimeout(function(){
      window.location.href = '/';
    }, 500);
  });
};