/* eslint-disable camelcase */
/* eslint-disable new-cap */
/* eslint-disable valid-jsdoc */

const store = {
  app: Immutable.Map({name: 'Mars Dashboard'}),
  rovers: Immutable.List(['Curiosity', 'Opportunity', 'Spirit']),
  roverData: {},
  activeRover: undefined,
};

// add our markup to the page
const root = document.getElementById('root');

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};


// create content
const App = (state) => {
  const {rovers} = state;
  return `
        ${renderNavbar(state)}
        <main>
            <div class="d-flex justify-content-center">
                <div id="rover-group" class="btn-group" role="group" 
                aria-label="Basic example">
                    ${ rovers && renderRovers(rovers)}
                </div>
            </div>
            <section id='roverInfo'></section>
            <section class='image-container' id='photos'>
            </section>
        </main>
    `;
};

/**
 * Renders navbar
 * @param {object} state Application state
 * @return {string} Navbar HTML Markup
 */
const renderNavbar = (state) => {
  const {app} = state;
  return (`
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">${app.get('name')}</span>
            </div>
        </nav>
    `);
};

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
  render(root, store);
});

// eslint-disable-next-line no-unused-vars
const setRover = (roverName) => {
  const roverIndexes = {
    Curiosity: 0,
    Opportunity: 1,
    Spirit: 2,
  };

  switch (roverName) {
    case 'Curiosity':
      getRoverData('curiosity');
      updateStore(store, {activeRover: roverIndexes.Curiosity});
      break;
    case 'Opportunity':
      getRoverData('opportunity');
      updateStore(store, {activeRover: roverIndexes.Opportunity});
      break;
    case 'Spirit':
      getRoverData('spirit');
      updateStore(store, {activeRover: roverIndexes.Spirit});
      break;
    default:
      return null;
  }
};

// ------------------------------------------------------  COMPONENTS

/**
 *
 * @param {array} rovers - an array of available rovers
 * @return rovers
 */
const renderRovers = (rovers) => {
  let htmlContent = '';
  rovers.forEach((rover) => {
    htmlContent += `<button type="button"
    onclick="setRover('${rover}')" 
    id="${rover + 'Button'}"
    class="btn btn-primary">${rover}</button>`;
  });
  return htmlContent;
};

// ------------------------------------------------------  API CALLS

const getRoverData = (roverName) => {
  fetch(`/rover/${roverName}`)
      .then((res) => res.json())
      .then((roverData) => {
        updateStore(store, {roverData});
        // Call render method
        renderTable(roverData)();
        renderPhotos(roverData);
      }).catch((error) => {
        console.error(error);
      });
};


// TODO: Remove side effects
const renderPhotos = (roverData) => {
  const photoSection = document.getElementById('photos');

  // Clean DOM
  // Use loading component instead
  while (photoSection.firstChild) {
    photoSection.removeChild(photoSection.lastChild);
  }

  // Add photos to DOM
  // TODO: Add photos to array of DOM elements
  const photosNodeArray = [];

  roverData.latest_photos.map((photo) => {
    const photoNode = createImageCard(photo)(photo.img_src);
    photosNodeArray.push(photoNode);
    photoSection.appendChild(photoNode);
  });
  return photosNodeArray;
};

//  HOF
const createImageCard = (data) => {
  const card = document.createElement('div');
  const cardClasslist = ['card', 'bg-dark', 'text-white', 'col', 'image-card'];
  cardClasslist.forEach((element) => card.classList.add(element));
  card.appendChild(createImageNode(data.img_src));
  card.appendChild(createCardContent(data));

  // return card;
  return createImageNode;
};

const createCardContent = (data) => {
  const cardContent = document.createElement('div');
  cardContent.classList.add('card-img-overlay');
  const header = document.createElement('h5');
  header.textContent = 'header';
  header.classList.add('card-title');

  // https://stackoverflow.com/questions/29546550/flexbox-4-items-per-row
  cardContent.appendChild(header);

  return cardContent;
};

const createImageNode = (data) => {
  const image = document.createElement('img');
  image.src = data;
  // TODO: Photo taken by camera name of rover_name rover
  image.alt = `Photo taken by rover_name rover`;
  image.classList.add('image-card');
  return image;
};

const createRoverDataTable = (data) => {
  const {name, landing_date, launch_date, status,
  } = data.latest_photos[0].rover;


  const tableString = `
    <table class="table">
    <tbody>
      <tr>
        <th scope="row">Rover name</th>
        <td>${name}</td>
      </tr>
      <tr>
        <th scope="row">Status</th>
        <td>${status}</td>
      </tr>
      <tr>
        <th scope="row">Launch date</th>
        <td>${launch_date}</td>
      </tr>
            <tr>
        <th scope="row">Landing date</th>
        <td>${landing_date}</td>
      </tr>
    </tbody>
  </table>
  `;

  return document.createRange()
      .createContextualFragment(tableString);
};

// HOF
const renderTable = (data) => {
  const section = document.getElementById('roverInfo');

  while (section.firstChild) {
    section.removeChild(section.lastChild);
  };

  const render = () => {
    section.appendChild(createRoverDataTable(data));
  };

  return render;
};
