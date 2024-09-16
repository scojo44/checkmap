Visited County Tracker Proposal
===============================

This would be a map showing which counties or county equivalents one has been in.  A lot of people have fun keeping track of states they have visited but avid road trippers may take this to the next level and “collect” counties.  Users would be able to create multiple lists of counties to track other actions.  For me, this will replace a county map image I was using to track this by flood-filling in an image editor.

**Technologies:**  Node/Express, React, React Hook Forms, Prisma, PostgreSQL, RESTful APIs, HTML, CSS, JavaScript. Hosted on Render.com and Aiven.io.  This will be a web site using a mix of backend and frontend.

**Demographic:**  Road trip fans or anyone who wants to keep track of the counties they have visited or done something in.

**Data Source:**  This will use the mapping APIs at MapBox or the Leaflet library for maps from OpenStreetMap.org.  County info and boundaries will come from an API at OpenDataSoft.

## Database Schema

**Counties:**  Name, Full Name, State, Boundary Geoshape, Type
    Holds info about each county.  Type is for Louisiana (parishes) and Alaska (boroughs and census areas)
**States:**  Name, Boundary Geoshape
    Holds info about each state
**Lists:**  Name, Description, Fill Color, User
    A user’s county list
**Lists-Counties:**  List, County
    Association table to linking counties to lists
**Users:**  Username, Password, Image URL
    A user enjoying the app

## Features

- [x] User account signup/login.
- [x] The home screen will simply be the US county map with visited counties filled in for those logged in.
- [x] For guests, it will be a welcome screen that explains what it is and has login/signup buttons.
- [x] The map should be zoomable and pannable like any modern online map.
- [x] A county lists page to manage lists.  Each would have a name, a description and a county color.
- [x] A page for common user account actions.

## Stretch Goals

- [ ] Do this for as many other countries as APIs with subregion info are available
- [ ] A county list page to add/remove counties.
- [x] Counties to be toggled right on the map by clicking/tapping on them.
- [ ] Sharable maps
- [ ] Compare map lists
- [ ] Friend system to allow comparing maps with friends
- [ ] Auto collect counties as you travel using the browser Geolocation API.  This would be more useful if the app was a native mobile app that could run in the background.
