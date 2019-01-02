import Navigo from 'navigo';
import handlebars, { compile } from 'handlebars';
import './styles/main.sass';

import routes from './routes';

// Partials
const header = require('./partials/header.handlebars');
const footer = require('./partials/footer.handlebars');

// Register the partial components
handlebars.registerPartial('header', compile(header)({ title: 'My epic student@kot webapp' }));
handlebars.registerPartial('footer', compile(footer)({ text: 'Template made with love by GDM Ghent and edited with frustration by Hannes De Baere' }));

// Router logic to load the correct template when needed
const router = new Navigo(window.location.origin, true);

routes.forEach((route) => {
  router.on(route.path, () => {
    route.view();
    router.updatePageLinks();
  });
});

/* router.on('/kotDetail?', function (key) {
    // If we have http://site.com/user/42/save as a url then
    key = localStorage.getItem('urlKey');
    //window.location.href="/#/kotDetail?"+key;
}).resolve(); */

// This catches all non-existing routes and redirects back to the home
router.notFound(() => {
  router.navigate('/');
})

router.resolve();