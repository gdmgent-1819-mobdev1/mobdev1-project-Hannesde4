// Pages
import HomeView from './pages/home';
import Profile from './pages/profile';
import AddKot from './pages/addKot';
import Login from './pages/login';
import About from './pages/about';
import KotOverview from './pages/kotOverview';
import KotDetail from './pages/kotDetail';
import Chat from './pages/chat';
import Favorites from './pages/favorites';


export default [
  { path: '/', view: HomeView },
  { path: '/login', view: Login },
  { path: '/profile', view: Profile },
  { path: '/addKot', view: AddKot },
  { path: '/kotView', view: KotOverview },
  { path: '/kotDetail', view: KotDetail },
  { path: '/about', view: About },
  { path: '/chat', view: Chat },
  { path: '/favorites', view: Favorites },
];