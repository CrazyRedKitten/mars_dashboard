let store = {
    user: { name: "Student" },
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    roverData: {},
    activeRover: "",
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod, roverData } = state

    return `
        <nav class="navbar navbar-light bg-light">
            <div class="container-fluid">
                <span class="navbar-brand mb-0 h1">Mars Dashboard</span>
            </div>
        </nav>
        <header></header>
        <main>
            <div class="d-flex justify-content-center">
                <div id="rover-group" class="btn-group" role="group" aria-label="Basic example">
                    ${ rovers && renderRovers(rovers)}
                </div>
            </div>
            <section>
                ${ImageOfTheDay(apod)}
            </section>
            <section>
                ${RoverInfo(roverData)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

/**
 * 
 * @param {array} rovers - an array of available rovers
 * @returns rovers
 */
const renderRovers = (rovers) => {
    let htmlContent = '';
    rovers.forEach(rover => {htmlContent += `<button type="button" class="btn btn-primary">${rover}</button>`})
    return htmlContent;
}


// TODO: Remove example of pure funxtion
// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }

    // check if the photo of the day is actually type video!
    if (apod) {
        if (apod.media_type === "video") {
            return (`
                <p>See today's featured video <a href="${apod.url}">here</a></p>
                <p>${apod.title}</p>
                <p>${apod.explanation}</p>
            `)
        } else {
            return (`
                <img src="${apod.image.url}" height="350px" width="100%" />
                <p>${apod.image.explanation}</p>
            `)
        }
    }
}

const RoverInfo = (roverData) => {
    const isEmptyRoverData = Object.keys(roverData).length === 0;

    // Handle empty object
    if (isEmptyRoverData) {
        getRoverData('curiosity');
    } else {
        console.log(roverData.latest_photos);
        return(`<code>${roverData.latest_photos}</code>`);
    }
}
// ------------------------------------------------------  API CALLS

// Example API call
// TODO: Remove example
const getImageOfTheDay = () => {
    fetch(`/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))
}

const getRoverData = (roverName) => {
    fetch(`/rover/${roverName}`)
        .then(res => res.json())
        .then(roverData => {
            console.log(roverData);
            updateStore(store, {roverData});
        });
}