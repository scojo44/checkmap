CheckMap
========

Many people have fun keeping track of US states they have visited, but avid road trippers take this to the next level and “collect” counties.  This site is a way to track which counties or county equivalents one has visited in the USA by toggling them on an interactive map.  Create multiple lists of counties to track other activities.  For me, this replaces a large county map image I was using to track by flood-filling counties in an image editor.

## How It Works

[CheckMap](https://checkmap-scojo44.onrender.com/) is hosted at Render.com using the free tier so it may take a minute to start up if it hasn't been accessed in a while.  Once you see a map and welcome message, signup and create your first list, giving it name and a fill color.  You can currently choose to track states or counties.  Now you can browse the map and just click or tap a state or county to fill it in to check it off.  You can add more lists with the New List link and edit or delete them from the Your Lists link.

## Under the Hood

The backend is built with Node using

- [Express](https://expressjs.com/) to build the API routes
- [Prisma](https://www.npmjs.com/package/prisma) for database access
- [Bcrypt](https://www.npmjs.com/package/bcrypt) for hashing passwords
- [JSON-Schema](https://json-schema.org/) for validating user input
- [JSON Web Tokens](https://jwt.io/) for authenticating users
- [Jest](https://jestjs.io/) for running tests
- [SuperTest](https://www.npmjs.com/package/supertest) for testing routes

The frontend is built with React using

- [Leaflet](https://leafletjs.com/) for showing the map and rendering states and counties
- [React-Leaflet](https://react-leaflet.js.org/) to use Leaflet objects like React components
- [React-Router](https://reactrouter.com/) to have client-side routing
- [React-Hook-Forms](https://react-hook-form.com/) to easily build forms
- [React-Modal](https://www.npmjs.com/package/react-modal) to show forms on top of the map
- [Axios](https://axios-http.com/) to access the backend API
- [Vite](https://vitejs.dev/) for the development environment
- [Vitest](https://vitest.dev/) for running tests

The data is stored in a PostgreSQL database with state/county boundaries in GeoJSON.

One thing I'd like to highlight is I learned how to leave the map in the background while showing a modal form, yet still have the URL to the form in the browser's address bar.  For example, going to the home page shows a map with all the county boundaries highlighted.  Clicking to sign up shows the signup form in a modal window while the map remains visible around it, though dimmed.  This is possible by essentially having two sets of `<Routes>` as explained at [Building a React modal module with React Router](https://blog.logrocket.com/building-react-modal-module-with-react-router/).  I extended this by adding React-Modal to the mix and used it to create a layout route with `<Outlet/>`.

## Data Source

CheckMap uses the Leaflet library to load maps from OpenStreetMap.org.

County info and boundaries are from GeoJSON files downloaded from OpenDataSoft.  The original file containing boundary polygons for all 3233 counties and county-equivalents comes to almost 184MB!  Fortunately, there are tools available to reduce the boundary detail, reducing the download size.  The highly-detailed version will be useful for checking which county a given geolocation is in, while using the simpler polygons for displaying on a map.

Even better, [geojson-vt](https://www.npmjs.com/package/geojson-vt) by MapBox can use the highly-detailed boundary file as a source and generate polygon data on the fly with level-of-detail determined by zoom level and location.  Zoomed in on Seattle?  You can have all the detail you need for Seattle without downloading the polygons for Florida!  Only drawback is geojson-vt is made to be used on the frontend so the huge source GeoJSON file would have to be downloaded first.  There may be a way to use it on the server end.  [geojson-tile-server](https://www.npmjs.com/package/geojson-tile-server) may be the simplest way to go but it's implemented as a web server with its own REST API.  It uses geojson-vt under the hood.

## Running on a development machine

On a dev machine, start the backend with `npm start` (`nodemon server.js`) and the frontend with `npm run dev`.  If your backend is not `localhost` (elsewhere on your local network, let's say `192.168.1.99`), set the `VITE_BACKEND_URL` environment variable to the URL of your backend, like so:

`VITE_BACKEND_URL=http://192.168.1.99:3000 npm run dev`

## Deploying on Render

### Backend

- Build command: `npm install`
- Run command: `node server.js`

    Render sets the port they want you to use in the PORT environment variable

- Set environment variables:

    `DATABASE_URL` PostgreSQL URI
    `SECRET_KEY` for bcrypt hashes.  Set to anything and don't tell anyone.

### Frontend

- Build command: `npm install; npm run build` (Render might fill this in for you)
- Publish directory: `dist`

- Set environment variables:

    `VITE_BACKEND_URL` As you might guess, this is the backend URL

## Testing

Run `npm test` to run all tests on either end.  For the backend, you can use `jest` to run with specifc test scripts.  For the frontend, use `vitest` for that.  It works like Jest.

## Features

- [x] User account signup/login.
- [x] The home screen will simply be the US county map with visited counties filled in for those logged in.
- [x] For guests, it will be a welcome screen that explains what it is and has login/signup buttons.
- [x] The map should be zoomable and pannable like any modern online map.
- [x] A county lists page to manage lists.  Each would have a name, a description and a county color.
- [x] A page to edit the user's profile.

## Future Enhancements

- [ ] Do this for as many other countries as APIs with subregion info are available
- [x] Counties to be toggled right on the map by clicking/tapping on them.
- [ ] A county list page to add/remove counties.
- [ ] Show county names on the map
- [ ] Add other basemaps like ESRI's World Street Map
- [ ] Set up [geojson-vt](https://www.npmjs.com/package/geojson-vt) on the backend
- [ ] Sharable maps
- [ ] Compare map lists
- [ ] Friend system to allow comparing maps with friends
- [ ] Auto collect counties as you travel using the browser Geolocation API.  This would be more useful if the app was a native mobile app that could run in the background.
