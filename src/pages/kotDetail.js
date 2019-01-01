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
  checkUserStatusForNav();
  sidenavFunctie();
  
  const currentKot = localStorage.kotInDetail;
  const kot = JSON.parse(localStorage[currentKot]);
  console.log(kot.foto);
  const fotoArray = kot.foto.split(',');
  const fotoArray1 = fotoArray[0];
  const fotoArray2 = fotoArray[1];
  const fotoArray3 = fotoArray[2];


  // Return the compiled template to the router
  update(compile(kotDetail)({ kot, fotoArray1, fotoArray2, fotoArray3 }));


  document.getElementById('btn-startConversation-submit').addEventListener('click', (e) => {
    e.preventDefault();
    startConversation();
  });
};
