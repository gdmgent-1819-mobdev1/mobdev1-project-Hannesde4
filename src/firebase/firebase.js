const firebaseInstance = require('firebase');

// Initialize Firebase
// TODO: Replace with your project's config
const config = {
  apiKey: "AIzaSyCTXqlu_Z8A__JrVuzyDOIDOdikdO7uTVw",
  authDomain: "webdev1-project-mijnkotapp.firebaseapp.com",
  databaseURL: "https://webdev1-project-mijnkotapp.firebaseio.com",
  projectId: "webdev1-project-mijnkotapp",
  storageBucket: "webdev1-project-mijnkotapp.appspot.com",
  messagingSenderId: "843386494391"
};

let instance = null;

const initFirebase = () => {
  instance = firebaseInstance.initializeApp(config);
};

const getInstance = () => {
  if (!instance) {
    initFirebase();
  }
  return instance;
};
export {
  initFirebase,
  getInstance,
};