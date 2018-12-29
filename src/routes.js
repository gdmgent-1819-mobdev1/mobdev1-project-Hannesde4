// Pages
import HomeView from './pages/home';
import Profile from './pages/profile';
import AddKot from './pages/addKot';
import Login from './pages/login';
import About from './pages/about';
import KotOverview from './pages/kotOverview';
import KotDetail from './pages/kotDetail';


export default [
  { path: '/', view: HomeView },
  { path: '/login', view: Login },
  { path: '/profile', view: Profile },
  { path: '/addKot', view: AddKot },
  { path: '/kotView', view: KotOverview },
  { path: '/kotDetail', view: KotDetail },
  { path: '/about', view: About },
];