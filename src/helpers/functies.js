import config from '../config';


const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

const auth = firebase.auth();
const storageRef = firebase.storage().ref();

// Get a reference to the database service
const database = firebase.database();

// functie to sign out the current user
const signOutFirebase = () => {
  auth.signOut().then(() => {
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
  // localstorage wordt gewist
  localStorage.clear();
  // na het outloggen wordt je doorverwezen naar de homepagina
  window.location.href="/";
};

// function to sign in a user
const signInFirebase = () => {
  const email = document.getElementById('email-login').value;
  const password = document.getElementById('password-login').value;

  // Handles the sign in with email and password
  firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });
};

// Sends an email verification to the user.
const sendEmailVerification = () => {
  // [START sendemailverification]
  firebase.auth().currentUser.sendEmailVerification().then(() => {
    // Email Verification sent!
    // [START_EXCLUDE]
    alert('Email Verification Sent!');
    // [END_EXCLUDE]
  });
  // [END sendemailverification]
};

// Handles the sign up button press.
const handleSignUp = (entity) => {
  const place = document.getElementById('register-place').value;
  const street = document.getElementById('register-street').value;
  const extra = document.getElementById('register-extra').value;
  const firstName = document.getElementById('register-firstname').value;
  const lastName = document.getElementById('register-lastname').value;
  const hogeschool = document.getElementById('register-hogeschoolChoice').value;
  const phone = document.getElementById('register-phone').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const passwordConfirm = document.getElementById('register-passwordConfirm').value;
  if (email.length < 4) {
    alert('Vul een geldig emailadres in!');
    return;
  }
  if (password.length < 4) {
    alert('Vul een wachtwoord in!');
    return;
  }
  if (password !== passwordConfirm) {
    alert('De wachtswoorden zijn niet gelijk!');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  auth.createUserWithEmailAndPassword(email, password).then((data) => {
    console.log('uid', data.user.uid);
    const adres = street + ', ' + place;
    const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${adres}.json?access_token=${config.mapBoxToken}&cachebuster=1545701868024&autocomplete=true&limit=1`;

    //data aanroepen uit een APi via fetch
    fetch(URL)
    .then((response) => {
        return response.json();
    }).then((data) =>{
      const lattitude = JSON.stringify(data.features[0].center[0]);
      const longitude = JSON.stringify(data.features[0].center[1]);
      writeUserData(data.user.uid, place, lattitude, longitude, street, extra, entity, firstName, lastName, hogeschool, phone);
    });

    // Here if you want you can sign in the user
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
  getAllKoten();
};

// functie die de overige data in een object plaatst, en deze in de firebase database gaat opslaan
const writeUserData = (userId, place, lattitude, longitude, street, extra, entity, firstName, lastName, hogeschool, phone) => {
  console.log(userId);
  database.ref(`users/${  userId}`).set({
    'adress': {
      'city': place,
      'street': street,
      'extra': extra,
      'coordinates': {
        'lattitude': lattitude,
        'longitude': longitude,
      },
    },
    'entity': entity,
    'firstName': firstName,
    'lastName': lastName,
    'hogeschool': hogeschool,
    'phone': phone,
  });
};

// functie die de gegevens van de huidige ingelogde gebruiker gaat opvragen
let myEntity = '';
const getCurUserFromDatabase = (uid) => {
  console.log(uid);
  const ref = database.ref(`users/${  uid}`);
  console.log(ref);
  ref.on('value', (snapshot) => {
    console.log(snapshot.val());
    const data = snapshot.val();
    console.log(data);
    profileChangeValues(data.adress.city, data.adress.street, data.adress.extra, data.firstName, data.lastName, data.hogeschool, data.phone);
    myEntity = data.entity;
  });
};

// functie die het profiel gaat updaten als er de nieuwe gegevens worden opgeslagen
const profileChangeValues = (place, street, extra, firstname, lastname, highschool, phone) => {
  document.getElementById('place').value = place;
  document.getElementById('street').value = street;
  document.getElementById('extra').value = extra;
  document.getElementById('firstname').value = firstname;
  document.getElementById('lastname').value = lastname;
  document.getElementById('hogeschoolChoice').value = highschool;
  document.getElementById('phone').value = phone;
};

// functie die de aangepaste gegevens van de gebruiker gaat uploaden
const updateUser = (place, street, extra, firstName, lastName, highschool, phone, userId) => {
  const adres = street + ', ' + place;
  const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${adres}.json?access_token=${config.mapBoxToken}&cachebuster=1545701868024&autocomplete=true&limit=1`;

  //data aanroepen uit een APi via fetch
  fetch(URL)
  .then((response) => {
      return response.json();
  }).then((data) =>{
    const lattitude = JSON.stringify(data.features[0].center[0]);
    const longitude = JSON.stringify(data.features[0].center[1]);
    // A post entry.
    const postData = {
      'adress': {
        'city': place,
        'street': street,
        'extra': extra,
        'coordinates': {
          'lattitude': lattitude,
          'longitude': longitude,
        },
      },
      'entity': myEntity,
      'firstName': firstName,
      'lastName': lastName,
      'hogeschool': highschool,
      'phone': phone,
    };
      // Write the new post's data simultaneously in the posts list and the user's post list.
    const updates = {};
    updates[`users/${  userId}`] = postData;

    return firebase.database().ref().update(updates);
  });
};

const generateAndStoreKotId = () => {
  if (!(localStorage.kotIdGenerate)) {
    const kotId = firebase.database().ref().child('koten').push().key;
    localStorage.kotIdGenerate = kotId;
  } else {
    console.log('er is al een kot-id');
  }
};


// functie die nieuwe koten gaat wegschrijven in de database
const newKotToDatabase = (userId) => {
  // Create a new kot reference with an auto-generated id
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

  const adres = street + ', ' + place;
  const URL = `https://api.mapbox.com/geocoding/v5/mapbox.places/${adres}.json?access_token=${config.mapBoxToken}&cachebuster=1545701868024&autocomplete=true&limit=1`;

  //data aanroepen uit een APi via fetch
  fetch(URL)
  .then((response) => {
      return response.json();
  }).then((data) =>{
    const lattitude = JSON.stringify(data.features[0].center[0]);
    const longitude = JSON.stringify(data.features[0].center[1]);
    // gaat effectief de data verwerken naar firebase
    writeKotData(localStorage.kotIdGenerate, place, street, extra, lattitude, longitude, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld, userId);
    // na het opslaan wordt er een nieuwe kotKey gegenereerd
    generateAndStoreKotId();
    //window.location.href="/";
  });
};

// functie die koten gaaat opslaan in de database
const writeKotData = (kotId, place, street, extra, lattitude, longitude, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld, userId) => {
  // Get a reference to the database service
  const foto = [];
  if (localStorage['kot-image-first'] !== 'undefind') {
    foto.push(localStorage['kot-image-first']);
  }
    
    if (localStorage['kot-image-second'] !== 'undefind') {
    foto.push(localStorage['kot-image-second']);
  }
    if (localStorage['kot-image-third'] !== 'undefind') {
    foto.push(localStorage['kot-image-third']);
  }
    console.log(foto);
    let fotos = foto.toString();
  database.ref(`koten/${  kotId}`).set({
    'kotbaas': userId,
    'adress': {
      'city': place,
      'street': street,
      'extra': extra,
      'coordinates': {
        'lattitude': lattitude,
        'longitude': longitude,
      },
    },
    'info': {
      'prijs': price,
      'extraInfo': extraInfo,
      'overzicht': {
        'type': type,
        'oppervlakte': oppervlakte,
        'verdieping': verdieping,
        'maxPersonen': maxPersons,
        'kotenInPand': kotenInPand,
      },
      'interieur': {
        'douche': douche,
        'bad': bad,
        'toilet': toilet,
        'keuken': keuken,
        'bemeubeld': bemeubeld,
      },
    },
    'foto': fotos,
  });
  localStorage.removeItem('kotIdGenerate');
  localStorage.removeItem('kot-image-first');
  localStorage.removeItem('kot-image-second');
  localStorage.removeItem('kot-image-third');
};

const handleFileSelect1 = (evt) => {
  console.log(evt);
  evt.stopPropagation();
  evt.preventDefault();
  let file = evt.target.files[0];
  let metadata = {
    contentType: file.type,
    'customMetadata': {
      'kotbaas': firebase.auth().currentUser.uid,
      'kotId': localStorage.kotIdGenerate,
    },
  };
  fileUpload(file, metadata, 'kot-image-first');
};

const handleFileSelect2 = (evt) => {
  console.log(evt);
  evt.stopPropagation();
  evt.preventDefault();
  let file = evt.target.files[0];
  let metadata = {
    contentType: file.type,
    'customMetadata': {
      'kotbaas': firebase.auth().currentUser.uid,
      'kotId': localStorage.kotIdGenerate,
    },
  };
  fileUpload(file, metadata, 'kot-image-second');
};

const handleFileSelect3 = (evt) => {
  console.log(evt);
  evt.stopPropagation();
  evt.preventDefault();
  let file = evt.target.files[0];
  let metadata = {
    contentType: file.type,
    'customMetadata': {
      'kotbaas': firebase.auth().currentUser.uid,
      'kotId': localStorage.kotIdGenerate,
    },
  };
  fileUpload(file, metadata, 'kot-image-third');
};

const fileUpload = (file, metadata, box) => {
  // Push to child path.
  // [START oncomplete]
  storageRef.child(`kot_images/${  localStorage['kotIdGenerate']  }/${  file.name}`).put(file, metadata).then((snapshot) => {
    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
    console.log('File metadata:', snapshot.metadata);
    // Let's get a download URL for the file.
    snapshot.ref.getDownloadURL().then((url) => {
      console.log('File available at', url);
      // [START_EXCLUDE]
      document.getElementById(box).innerHTML = '';
      document.getElementById(box).style.backgroundImage = `url('${  url  }')`;
      console.log(url);
      localStorage[box] = url;
      //          document.getElementById(box).innerHTML = '<img src="' +  url + '">';
      // [END_EXCLUDE]
    });
  }).catch((error) => {
    // [START onfailure]
    console.error('Upload failed:', error);
    // [END onfailure]
  });
  // [END oncomplete]
};

const storeKotenInLocalStorage = () => {
  return new Promise((resolve, reject) =>{
    console.log('first method completed');
    resolve({data: '123'});
    const ref = database.ref('koten/');
    ref.on('value', (snapshot) => {
      // maakt een array waarin ik elke kot-key ga opslaan
      const keys = [];
      // counter om te tellen hoeveel keys er zijn
      let i = 0;
      snapshot.forEach((childSnapshot) => {
        const childKey = childSnapshot.key;
        const childData = childSnapshot.val();
        // elk kot wordt opgeslagen als string op met zijn key in de localstorage
        localStorage[childKey] = JSON.stringify(childData);
        // gaat de key van het kot in mijn array steken
        keys[i] = childKey;
        // telt telkens op met 1
        i++;
      });
      // gaat mijn array met keys opslaan in localstorage als string
      localStorage.kotKeys = keys;
    });
  });
};

const checkIfKotenFromLocStorAreLoaded = () => {
  return new Promise(function(resolve, reject){
    console.log('second method completed');
    console.log(localStorage.getItem('kotKeys'));
    //fix zodat bij login de koten juist geladen worden uit de localstorage en er geen witte pagina tevoorschijn komt
    if( localStorage.getItem('kotKeys') === null){
    setTimeout(function(){
      loadKotenFromLocStor();
    }, 250);
    }else{
      loadKotenFromLocStor();
    }
    resolve({newData: + ' some more data'});
  });
};

const loadKotenFromLocStor = () => {
  let kotKeysAll = localStorage.getItem('kotKeys');
  console.log(kotKeysAll);
  // het element kotOverview uit mijn overzichtpagina in een var steken
  // var die de string met al mijn kotKeys gaat inladen
  const kotKeys = kotKeysAll.split(',');
  const koten = document.getElementById('kotOverviewAll');
  // voor elke key dat er in kotKeys zit wordt onderstaande dingen overlopen
  kotKeys.forEach((key) => {
  // gaat de string uit localstorage omzetten in een object en in een var steken
  const kot = JSON.parse(localStorage[key]);
  // gaat per kot een div aanmaken en aan de html toevoegen
  const fotoArray = kot.foto.split(',');
  koten.innerHTML += `<div class="kotOverview uniqueKot" id="${  key  }"><span class="price">${  kot.info.prijs  }</span></div>`;
  document.getElementById(key).style.backgroundImage = `url('${  fotoArray[0]  }')`;
  });
}

const startConversation = () => {
  let keyer = localStorage.kotInDetail;
  const kot = JSON.parse(localStorage[keyer]);
  const studentId = firebase.auth().currentUser.uid;
  const kotbaasId = kot.kotbaas;
  const message = document.getElementById('message').value;
  if(studentId == kotbaasId){
    alert('U kunt niet met uzelf chatten');
  } else {
    // create chatId with studentId, kotbaasId and kotKey
    const chatId = `${studentId}+${kotbaasId}+${keyer}`;
    database.ref(`conversations/messages/${  chatId}`).once('value', (snap) => {
      let i = snap.numChildren()+1000000000000001;
      if(i > 1000000000000001){
        //doorverwijzing naar chat indien er al een eerdere conversatie is
        localStorage['conversationDetail'] = chatId;
        window.location.href = '/#/singleChat';
      }else{
        sendMessage(chatId, studentId, message);
      }
    });
  }
};

const sendMessage = (chatId, currentUser, message) => {
  const date = new Date();
  const sendDate = date.toTimeString();
  database.ref(`conversations/messages/${  chatId}`).once('value', (snap) => {
    let i = snap.numChildren()+1000000000000001;
    let messageId = "m" + i;
    database.ref('conversations/messages/' + chatId + '/' + messageId).set({
        'from' : currentUser ,
        'date' : sendDate ,
        'message' : message ,
    });
  });
};

const getAllMessagesFromCurrentUser = () => {
  const ref = database.ref('conversations/messages/');
  const element = document.getElementById('chat-collection-all');
  //gets the database of al the conversation/messages = conversations
  ref.on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const childKey = childSnapshot.key;
      const childKeyArray = childKey.split('+');
      //als de eerste waarde van de chatId gelijk is aan de huidige gebruiker
      if (childKeyArray[0] == firebase.auth().currentUser.uid) {
        //maakt verbinding naar de users van de database waar de tweede waarde van de chatId de kotbaas aangeeft
        const refer = database.ref('users/' + childKeyArray[1]);
        //dit gaat de waarden van de kotbaas uit de database halen
        refer.on('value', (snapshot) => {
          const kotbaas = snapshot.val();
          const refere = database.ref('koten/' + childKeyArray[2]);
          refere.on('value', (snapshot) =>{
            const kot = snapshot.val();
            let fotoArray1 = kot.foto.split(',');
            let reference = database.ref('conversations/messages/' + childKey)
            reference.orderByKey().limitToLast(1).on("child_added", (snapshot) => {
              let message = snapshot.val();
              let previousMessage = message.message;
              let adresExtra = '';
              if(kot.adress.extra){
                adresExtra = ' ' + kot.adress.extra; 
              };
              element.innerHTML
                  += `<div class="message" id="${childKey}"><div class="chat-kotInfo"> <div class="chat-image"> <img src="${ fotoArray1[0] } " alt=""> </div> <strong class="chat-kot-adress">` + kot.adress.street + adresExtra + ', ' + kot.adress.city +`</strong><br> <strong class="chat-kot-price"> ` + kot.info.prijs + ` </strong> </div> <div class="chat-messageInfo"> <h4 class="chat-person-name"> ` + kotbaas.firstName + ` ` + kotbaas.lastName + `</h4> <p class="chat-last-message-preview"> ` + previousMessage + ` </p> </div> </div>`;
            });
          });
        });
      };
    });
  });
};


const checkUserStatusForNav = (status) => {
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if(firebaseUser) {
      const uid = firebaseUser.uid;
      const ref = database.ref(`users/${ uid}`);
      ref.on('value', (snapshot) => {
        const data = snapshot.val();
        const entity = data.entity;
        //gaat kijken of er een student of kotbaas is ingelogd
        if (entity == 'student'){
          document.getElementById('side-nav-favorieten').style.display = 'block';
          document.getElementById('main-nav-favorites').style.display = 'block';
        } else if (entity == 'kotbaas'){
          document.getElementById('side-nav-addKot').style.display = 'block';
          document.getElementById('side-nav-mijnKoten').style.display = 'block';
        }
        //gaat de entity van de huidige gebruiker opslaan in de local storage
        localStorage['currentUserEntity'] = entity;
      });
      document.getElementsByClassName("login")[0].style.display = 'none';
      document.getElementById('side-nav-login').style.display = 'none';
      document.getElementById('side-nav-register').style.display = 'none';
      document.getElementById('side-nav-logOut').style.display = 'block';
      document.getElementById('side-nav-logOut').style.display = 'block';
      document.getElementById('side-nav-profile').style.display = 'block';
      document.getElementById('main-nav-messages').style.display = 'block';
    } else {
      console.log('not logged in');
      document.getElementsByClassName("login")[0].style.display = 'block';
      document.getElementById('side-nav-login').style.display = 'block';
      document.getElementById('side-nav-register').style.display = 'block';
      document.getElementById('side-nav-logOut').style.display = 'none';
      document.getElementById('side-nav-profile').style.display = 'none';
      //als er niet is ingelogd, dan wordt je automatisch naar de index pagina gebracht
      if(status !== 'not'){
        window.location.href="/";
      }
    }
  });
};

const loadSingleChat = () => {
  const chatId = localStorage['conversationDetail'].trim();
  const ref = database.ref('conversations/messages/'+chatId+'/'
  );
  const element = document.getElementById('chat-collection-all-messages');
  element.innerHTML = '';
  ref.on('value', (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      let data = childSnapshot.val();
      let classType = ''
      if(data.from == auth.currentUser.uid){
        classType = 'chat-mine';
      }else{
        classType = 'chat-other';
      }
      element.innerHTML += `<div class="chat-message ${classType}"><p class="message-value">${data.message}</p></div>`;
    });    
  });
  setTimeout(function(){
    window.scroll(0,findPos(document.getElementById("elementID")));
  }, 1000)
  
};

//Finds y value of given object
const findPos = (obj) => {
  var curtop = 0;
  if (obj.offsetParent) {
      do {
          curtop += obj.offsetTop;
      } while (obj = obj.offsetParent);
  return [curtop];
  }
};

const sidenavFunctie = () => {
  //if the logout button is clicked
  document.getElementById("side-nav-logOut").addEventListener('click', (e) => {
    e.preventDefault();
    signOutFirebase()
  });
  

  //functie om de nav te laten werken
  document.getElementById("sideNav-open").addEventListener('click', () => {
    let element = document.getElementsByClassName("side-nav")[0];
    element.classList.toggle("invisible");
  });
  document.getElementById("sideNav-close").addEventListener('click', () => {
    let element = document.getElementsByClassName("side-nav")[0];
    element.classList.toggle("invisible");
  });
};

const loadMyKoten = () => {
  const koten = document.getElementById('collectionMyKoten');
  // gaat per kot van de huidige kotbaas een div aanmaken en aan de html toevoegen
  koten.innerHTML += `<div class="myKot uniqueKot" id="${  key  }"><span class="price">${  kot.info.prijs  }</span></div>`;
  document.getElementById(key).style.backgroundImage = `url('${  fotoArray[0]  }')`;
};

export {
  signOutFirebase,
  signInFirebase,
  handleSignUp,
  getCurUserFromDatabase,
  updateUser,
  firebase,
  newKotToDatabase,
  handleFileSelect1,
  handleFileSelect2,
  handleFileSelect3,
  generateAndStoreKotId,
  storeKotenInLocalStorage,
  checkIfKotenFromLocStorAreLoaded,
  auth,
  startConversation,
  getAllMessagesFromCurrentUser,
  checkUserStatusForNav,
  database,
  loadSingleChat,
  sendMessage,
  sidenavFunctie,
  loadMyKoten,
};
