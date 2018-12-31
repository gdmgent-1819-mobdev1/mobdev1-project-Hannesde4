// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import update from '../helpers/update';
import {} from '../helpers/functies';


// Import the template to use
const favorites = require('../templates/favorites.handlebars');

export default () => {
    // Return the compiled template to the router
    update(compile(favorites)({}));
};