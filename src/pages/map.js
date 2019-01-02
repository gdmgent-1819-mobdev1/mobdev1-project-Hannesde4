// Only import the compile function from handlebars instead of the entire library
import { compile } from 'handlebars';
import mapboxgl from 'mapbox-gl';
import config from '../config';
import update from '../helpers/update';
import { signOutFirebase, startConversation, checkUserStatusForNav, sidenavFunctie} from '../helpers/functies';


// Import the template to use
const mapje = require('../templates/map.handlebars');

export default () => {


  // Return the compiled template to the router
  update(compile(mapje)({ }));

  checkUserStatusForNav();
  sidenavFunctie();
    let kotId = localStorage.getItem('kotOpMap');
    let kotRawData = localStorage.getItem(kotId);
    let kotData = JSON.parse(kotRawData);
    let lattitude = kotData.adress.coordinates.lattitude
    let longitude = kotData.adress.coordinates.longitude

  // Mapbox code
  if (config.mapBoxToken) {
    mapboxgl.accessToken = config.mapBoxToken;
    // eslint-disable-next-line no-unused-vars
    const map = new mapboxgl.Map({
      container: 'map',
      center: [lattitude, longitude],
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 14,
    });

    const pointers = JSON.parse(localStorage.getItem('pointers'));
    console.log(pointers);

    //gaat een pijl tekenen op de kaart
    map.on('load', () => {
        pointers.forEach((pointer) => {
          new mapboxgl.Marker()
            .setLngLat([pointer.lattitude, pointer.longitude])
            .setPopup(new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<img class="pointerImage" src="${pointer.image}"></img><p>${pointer.adress}</p><p>Huurprijs: €${pointer.price}</p>`))
            .addTo(map);
        });
      });
  } else {
    console.error('Mapbox will crash the page if no access token is given.');
  }

};