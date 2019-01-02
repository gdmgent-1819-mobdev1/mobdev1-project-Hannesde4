// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import { signOutFirebase, startConversation, checkUserStatusForNav, sidenavFunctie} from '../helpers/functies';


// Import the template to use
const kotDetail = require('../templates/kotDetail.handlebars');

export default () => {
  if (localStorage.kotInDetail == undefined) {
    console.log('geen kot in storage');
    window.location.href = '/';
  }
  
  const currentKot = localStorage.kotInDetail;
  const kot = JSON.parse(localStorage[currentKot]);
  console.log(kot.foto);
  const fotoArray = kot.foto.split(',');
  const fotoArray1 = fotoArray[0];
  const fotoArray2 = fotoArray[1];
  const fotoArray3 = fotoArray[2];

  // Return the compiled template to the router
  update(compile(kotDetail)({ currentKot, kot, fotoArray1, fotoArray2, fotoArray3 }));

  //eventlistener, als er geklikt wordt op een element binnen mijn ol
  document.getElementsByClassName('kot-marker-map')[0].addEventListener('click', (e) => {
    console.log('dit werk');
    localStorage['kotOpMap'] = document.getElementsByClassName('kot-marker-map')[0].id;
    setTimeout('window.location.href="/#/map"', 0)
  });

 /*  //eventlistener, als er geklikt wordt op een element binnen mijn ol
  document.getElementById('kotOverviewAll').addEventListener('click', (e) => {
    e.preventDefault();
    //er wordt gekeken of er geklikt is op een i-element
    if(e.target && e.target.nodeName == 'I'){
        console.log('test');
        let userId = localStorage.getItem('currentUserId');
        let key = e.target.id;
        let parts = key.split('likeKey=');
        let likeId = userId+'+++'+parts[1];
        console.log(likeId);
        if( e.target.classList[0] !== 'liked'){
            database.ref('likes/' + likeId).set({
                'liker' : userId ,
                'liked' : parts[1],
            });
        } else {
            database.ref('likes/'+likeId).remove();
        }
        loadAllKoten();
    };
  }); */


  checkUserStatusForNav();
  sidenavFunctie();


  document.getElementById('btn-startConversation-submit').addEventListener('click', (e) => {
    e.preventDefault();
    startConversation();
  });
};
