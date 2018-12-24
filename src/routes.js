// Pages
import HomeView from './pages/home';
import Profile from './pages/profile';
import AddKot from './pages/addKot';
import Login from './pages/login';


export default [
  { path: '/', view: HomeView },
  { path: '/login', view: Login },
  { path: '/profile', view: Profile },
  { path: '/addKot', view: AddKot },
];