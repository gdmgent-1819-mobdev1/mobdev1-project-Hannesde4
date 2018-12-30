const { getInstance } = require('../firebase/firebase');

const firebase = getInstance();

const auth = firebase.auth();
const storageRef = firebase.storage().ref();

// Get a reference to the database service
const database = firebase.database();

//functie to sign out the current user
const signOutFirebase = () => {
    auth.signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
    //localstorage wordt gewist
    localStorage.clear();
    //na het outloggen wordt je doorverwezen naar de homepagina
    setTimeout('window.location.href="/"', 0);
};

//function to sign in a user
const signInFirebase = () => {
    let email = document.getElementById('email-login').value;
    let password = document.getElementById('password-login').value;

    // Handles the sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
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

//Handles the sign up button press.
const handleSignUp = (entity) => {
    let place = document.getElementById('register-place').value;
    let lattitude = "test";
    let longitude = "test";
    let street = document.getElementById('register-street').value;
    let extra = document.getElementById('register-extra').value;
    let firstName = document.getElementById('register-firstname').value;
    let lastName = document.getElementById('register-lastname').value;
    let hogeschool = document.getElementById('register-hogeschoolChoice').value;
    let phone = document.getElementById('register-phone').value;
    let email = document.getElementById('register-email').value;
    let password = document.getElementById('register-password').value;
    let passwordConfirm = document.getElementById('register-passwordConfirm').value;
    if (email.length < 4) {
        alert('Vul een geldig emailadres in!');
        return;
    }
    if (password.length < 4) {
        alert('Vul een wachtwoord in!');
        return;
    }
    if (password !== passwordConfirm){
      alert('De wachtswoorden zijn niet gelijk!');
        return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    auth.createUserWithEmailAndPassword(email, password).then((data) => {
      console.log('uid',data.user.uid);
      writeUserData(data.user.uid, place, lattitude, longitude, street, extra, entity, firstName, lastName, hogeschool, phone);
    
      //Here if you want you can sign in the user
    }).catch((error) => {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
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


//functie die de overige data in een object plaatst, en deze in de firebase database gaat opslaan
const writeUserData = (userId, place, lattitude, longitude, street, extra, entity, firstName, lastName, hogeschool, phone) => {
    console.log(userId);
    database.ref('users/' + userId).set({
      "adress" : {
        "city" : place ,
        "street" : street ,
        "extra" : extra ,
        "coordinates" : {
          "lattitude" : lattitude ,
          "longitude" : longitude ,
        },        
      },
      "entity" : entity ,
      "firstName" : firstName ,
      "lastName" : lastName ,
      "hogeschool" : hogeschool ,
      "phone" : phone
    });
};

//functie die de gegevens van de huidige ingelogde gebruiker gaat opvragen
let myEntity = "";
const getCurUserFromDatabase = (uid) => {
    console.log(uid);
    const ref = database.ref('users/' + uid);
    console.log(ref );
    ref.on('value', (snapshot) => {
        console.log(snapshot.val());
        const data = snapshot.val();
        console.log(data);
        profileChangeValues(data.adress.city, data.adress.street, data.adress.extra, data.firstName, data.lastName, data.hogeschool, data.phone)
        myEntity = data.entity;
    });
};

//functie die het profiel gaat updaten als er de nieuwe gegevens worden opgeslagen
const profileChangeValues = (place, street, extra, firstname, lastname, highschool, phone) => {
    document.getElementById('place').value = place;
    document.getElementById('street').value = street;
    document.getElementById('extra').value = extra;
    document.getElementById('firstname').value = firstname;
    document.getElementById('lastname').value = lastname;
    document.getElementById('hogeschoolChoice').value = highschool;
    document.getElementById('phone').value = phone;
};

const updateUser = (place, street, extra, lattitude, longitude, firstName, lastName, highschool, phone, userId) => {
    // A post entry.
    let postData = {
        "adress" : {
            "city" : place ,
            "street" : street ,
            "extra" : extra ,
            "coordinates" : {
                "lattitude" : lattitude ,
                "longitude" : longitude ,
            },        
        },
        "entity" : myEntity ,
        "firstName" : firstName ,
        "lastName" : lastName ,
        "hogeschool" : highschool ,
        "phone" : phone
    };
    // Write the new post's data simultaneously in the posts list and the user's post list.
    let updates = {};
    updates['users/' + userId] = postData;
  
    return firebase.database().ref().update(updates);
};

const generateAndStoreKotId = () => {
    if (!(localStorage['kotIdGenerate'])){
        let kotId = firebase.database().ref().child('koten').push().key;
        localStorage['kotIdGenerate'] = kotId;
    } else {
        console.log('er is al een kot-id');
    }
};

const generateAndStoreMessageId = () => {
    if (!(localStorage['messageId'])){
        let messageId = firebase.database().ref().child('conversations/chatInfo').push().key;
        localStorage['messageId'] = messageId;
    } else {
        console.log('er is al een message-id');
    }
};

//functie die nieuwe koten gaat wegschrijven in de database
const newKotToDatabase = (userId) => {
    // Create a new kot reference with an auto-generated id
    let price = document.getElementById('register-kot-price').value;
    let extraInfo = document.getElementById('register-kot-info').value;
    let type = document.getElementById('register-kot-type').value;
    let oppervlakte = document.getElementById('register-kot-oppervlakte').value;
    let verdieping = document.getElementById('register-kot-floor').value;
    let maxPersons = document.getElementById('register-kot-maxPersons').value;
    let kotenInPand = document.getElementById('register-kot-kotAmount').value;
    let douche = document.getElementById('register-kot-douche').value;
    let bad = document.getElementById('register-kot-bad').value;
    let toilet = document.getElementById('register-kot-toilet').value;
    let keuken = document.getElementById('register-kot-keuken').value;
    let bemeubeld = document.getElementById('register-kot-bemeubeld').value;
    let street = document.getElementById('register-kot-street').value;
    let extra = document.getElementById('register-kot-extra').value;
    let place = document.getElementById('register-kot-place').value;

    let lattitude = "test";
    let longitude = "test";
    
    //gaat effectief de data verwerken naar firebase
    writeKotData(localStorage['kotIdGenerate'], place, street, extra, lattitude, longitude, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld, userId);
    //na het opslaan wordt er een nieuwe kotKey gegenereerd
    generateAndStoreKotId();
    setTimeout('window.location.href="/"', 0)
};

//functie die koten gaaat opslaan in de database
const writeKotData = (kotId, place, street, extra, lattitude, longitude, price, extraInfo, type, oppervlakte, verdieping, maxPersons, kotenInPand, douche, bad, toilet, keuken, bemeubeld, userId) => {
    // Get a reference to the database service
    let foto = [];
    if (localStorage['kot-image-first'] !== 'undefind'){
        foto.push(localStorage['kot-image-first']);
    };
    
    if (localStorage['kot-image-second'] !== 'undefind'){
        foto.push(localStorage['kot-image-second']);
    };
    if (localStorage['kot-image-third'] !== 'undefind'){
        foto.push(localStorage['kot-image-third']);
    };
    console.log(foto);
    database.ref('koten/' + kotId).set({
        "kotbaas" : userId ,
        "adress" : {
            "city" : place ,
            "street" : street ,
            "extra" : extra ,
            "coordinates" : {
                "lattitude" : lattitude ,
                "longitude" : longitude ,
            },
        },
        "info" : {
            "prijs" : price ,
            "extraInfo" : extraInfo ,
            "overzicht" : {
                "type" : type ,
                "oppervlakte" : oppervlakte ,
                "verdieping" : verdieping ,
                "maxPersonen" : maxPersons ,
                "kotenInPand" : kotenInPand ,
            },
            "interieur" : {
                "douche" : douche ,
                "bad" : bad ,
                "toilet" : toilet ,
                "keuken" : keuken ,
                'bemeubeld' : bemeubeld ,
            }
        },
        "foto" : foto.toString() ,
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
    var file = evt.target.files[0];
    var metadata = {
      'contentType': file.type ,
      'customMetadata' : {
        'kotbaas' : firebase.auth().currentUser.uid ,
        'kotId' : localStorage['kotIdGenerate'] ,
      },
    };
    fileUpload(file, metadata, 'kot-image-first');
};

const handleFileSelect2 = (evt) => {
    console.log(evt);
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];
    var metadata = {
      'contentType': file.type ,
      'customMetadata' : {
        'kotbaas' : firebase.auth().currentUser.uid ,
        'kotId' : localStorage['kotIdGenerate'] ,
      },
    };
    fileUpload(file, metadata, 'kot-image-second');
};

const handleFileSelect3 = (evt) => {
    console.log(evt);
    evt.stopPropagation();
    evt.preventDefault();
    var file = evt.target.files[0];
    var metadata = {
      'contentType': file.type ,
      'customMetadata' : {
        'kotbaas' : firebase.auth().currentUser.uid ,
        'kotId' : localStorage['kotIdGenerate'] ,
      },
    };
    fileUpload(file, metadata, 'kot-image-third');
};

const fileUpload = (file, metadata, box) => {
    // Push to child path.
    // [START oncomplete]
    storageRef.child('kot_images/' + localStorage['kotIdGenerate'] + '/' + file.name).put(file, metadata).then((snapshot) => {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        // Let's get a download URL for the file.
        snapshot.ref.getDownloadURL().then((url) => {
          console.log('File available at', url);
          // [START_EXCLUDE]
          document.getElementById(box).innerHTML = "";
          document.getElementById(box).style.backgroundImage = "url('" + url + "')";
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

const getAllKoten = () => {
    const ref = database.ref('koten/');
    ref.on("value", (snapshot) => {
        //maakt een array waarin ik elke kot-key ga opslaan
        let keys = [];
        //counter om te tellen hoeveel keys er zijn
        let i = 0;
        snapshot.forEach((childSnapshot) => {
            let childKey = childSnapshot.key;
            let childData = childSnapshot.val();
            //elk kot wordt opgeslagen als string op met zijn key in de localstorage
            localStorage[childKey] = JSON.stringify(childData);
            //gaat de key van het kot in mijn array steken
            keys[i] = childKey ;
            //telt telkens op met 1
            i++;
        });
        //gaat mijn array met keys opslaan in localstorage als string
        localStorage['kotKeys'] = keys;
    });
    //functie die de koten gaat laden uit localstorage
    loadKotenFromLocStor();
};

const loadKotenFromLocStor = () => {
    //var die de string met al mijn kotKeys gaat inladen
    let kotKeysString = localStorage.getItem('kotKeys');
    //var die de string met keys omzet naar array
    let kotKeys = kotKeysString.split(",");
    //het element kotOverview uit mijn overzichtpagina in een var steken
    const koten = document.getElementById('kotOverviewAll');
    //voor elke key dat er in kotKeys zit wordt onderstaande dingen overlopen
    kotKeys.forEach((key) => {
        //gaat de string uit localstorage omzetten in een object en in een var steken
        let kot = JSON.parse(localStorage[key]);
        //gaat per kot een div aanmaken en aan de html toevoegen
        let fotoArray = kot.foto.split(',');
        koten.innerHTML += '<div class="kotOverview uniqueKot" id="' + key + '"><span class="price">' + kot.info.prijs + '</span></div>';
        document.getElementById(key).style.backgroundImage = "url('" + fotoArray[0] + "')";
    });
};

const sendMessage = () => {
    console.log('message sent!');
    startConversation();
};

const startConversation = () => {
    let currentKot = localStorage['kotInDetail'];
    let kot = JSON.parse(localStorage[currentKot]);
    let studentId = firebase.auth().currentUser.uid;
    let kotbaasId = kot.kotbaas;
    //create chatId with studentId and kotbaasId
    let chatId = studentId + "+" + kotbaasId;
    checkIfConversationExist(chatId);
    if(localStorage['chatExist'] == true){
        newConversationToDatabase(chatId, studentId);
    } else {
        database.ref('conversations/chatInfo/' + chatId).set({
            "student" : 'student' ,
            "kotbaas" : 'kotbaas' ,
            "kotId" : 'kotId' ,
        });
        newConversationToDatabase(chatId, studentId);
    }
};

const checkIfConversationExist = (chatId) => {
    let ref = database.ref('conversations/chatInfo/');
    ref.child(chatId).once('value', function(snapshot) {
        let exists = (snapshot.val() !== null);
        userExistsCallback(chatId, exists);
    });
};

const userExistsCallback = (chatId, exists) => {
    if (exists) {
        console.log('chat ' + chatId + ' exists!');
        localStorage['chatExist'] = true;
    } else {
        console.log('chat ' + chatId + ' does not exist!');
        localStorage['chatEist'] = false;
    }
}

const newConversationToDatabase = (chatId, currentUser) => {
    let date = new Date();
    let sendDate = date.toTimeString();
    console.log(date);
    let message = 'Dit is een testbericht';
    database.ref('conversations/messages/' + chatId).once('value', function (snap) {
        console.log('‘user’', snap.numChildren());
        let i = snap.numChildren();
        let messageId = "m"+ i;
        console.log(messageId);
        database.ref('conversations/messages/' + chatId + '/' + messageId).set({
            "from" : currentUser ,
            "date" : sendDate ,
            "message" : message ,
        });
    });
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
    getAllKoten,
    auth,
    sendMessage,
    loadCurrentKot,
};