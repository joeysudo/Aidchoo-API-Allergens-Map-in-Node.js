# Aidchoo

This repo houses the assets used to build the Aidchoo API, available at https://aidchoo2.herokuapp.com/

To check our front end repository see https://github.com/simoncoz/aidchoo-fe

You can view the front end here https://aidchoo-fe.herokuapp.com/

## Problem Statement

Hay fever (allergic rhinitis) and pollen sensitivity causes great discomfort and reduction to quality of life. In Melbourne, a city colloquially regarded as an allergy capital, people with the condition run into areas that aggravate their symptoms when getting around the city. Due to limited resources available for sufferers to plan and prepare, they are often blindsided by pollen hotspots and other environmental triggers.

## Features

### 1. Users

A new user will be able to register themselves in order to access an allergen dashboard and get tips based on their specified allergns and the daily readings. Users are stored in a MongoDB Atlas database.

This feature was implemented with the help of the following tutorials:

- The University of Melbourne - 'mylibraryapp' from Tutorial 4 and Tutorial 5 INFO30005 by by Ronal Singh, Steven Tang, Ziad Albkhetan, and Alex Wu.

- DEV.TO - Authentication in NodeJS With Express and Mongo - CodeLab #1 by Deepak Kumar.[source](https://dev.to/dipakkr/implementing-authentication-in-nodejs-with-express-and-jwt-codelab-1-j5i)

* MIT - CRUD Operations with Mongoose and MongoDB Atlas by Joshua Hall. [source](https://alligator.io/nodejs/crud-operations-mongoose-mongodb-atlas/)

#### To register a new user

https://aidchoo2.herokuapp.com/api/user/register

<p>POST request</p>

Saves a new user to the database and logs them in. Username, password, first name and email are mandatory fields. Send well formed JSON in the request body. User.js in 'models' outlines the schema:

```json
{
  "password": "<enter password>",
  "firstName": "<enter firstName>",
  "lastName": "Johnston",
  "email": "<enter email, must be unique>",
  "allergens": [
    "<enter list of allergens, allergens can only be “Tree”, “Grass”, “Weed” or “Pollution”"
  ],
  "severity": "<enter severity, severity can only be “High”, “Medium” or “Low”>"
}
```

Example:

```json
{
  "password": "happy",
  "firstName": "George",
  "lastName": "Amazing",
  "email": "toopositive@waytoopositive.com",
  "allergens": ["Tree", "Grass"],
  "severity": "Medium"
}
```

Upon successful request, this will return a token. Routes that require authentication can be reached by sending this token in the header like so:

```
[key:"Content-Type", "value":"application/json"]
[key:"token", "value":"<retrieved token here>"]

```

##### To authenticate an existing user

https://aidchoo2.herokuapp.com/api/auth/login

<p>POST request</p>

If a user already exists in the database. they are able to log in using their email and un-hashed password. Send a well formed JSON in the body.

Example:

```json
{
  "email": "test@testy.com",
  "password": "54321"
}
```

Upon successful request, this route also returns a token.

#### To view the profile of an authenticated user

https://aidchoo2.herokuapp.com/api/user/profile

<p>GET request</p>

If a user has a valid token, this will return their record.

Authenticated. Pass token as retrieved from a successful request of /user/login in the request header.

#### To update the profile of an authenticated user

https://aidchoo2.herokuapp.com/api/user/profile

<p>PATCH request</p>

If user is logged in they are able to change their profile information. Passwords cannot be updated using this route, see the route below.

Authenticated. Pass token as retrieved from a successful request of /user/login in the request header and send well formed JSON of the desired update in the request body.

Example:

```json
{
  "email": "<new email>"
}
```

#### To update the password of an authenticated user

https://aidchoo2.herokuapp.com/api/auth/password/change

<p>PATCH request</p>

If a user is logged in they are able to update their password.

Authenticated. Pass token as retrieved from a successful request of /user/login in the request header and send well formed JSON of the desired update in the request body.

```json
{
  "password": "<new password>"
}
```

#### To delete an authenticated user

https://aidchoo2.herokuapp.com/api/user/profile

<p>DELETE request</p>

Deletes the currently logged in user from the database altogether.

Authenticated. Pass token as retrieved from a successful request of /user/login in the request header. On the client side, any session storing the token will be destroyed after the profile is deleted so the token will not be used to access authenticated routes after the user is deleted.

#### To get a user by ID

https://aidchoo2.herokuapp.com/api/user/id/:id

<p>GET request</p>

Where :id is the user's MongoDB id.
Simple GET request to return a user by their ID. Implemented to help with API testing.

Example URL:

https://aidchoo2.herokuapp.com/api/user/id/5ea27b1b1af72555d66d6b49

#### To get a user by email

https://aidchoo2.herokuapp.com/api/user/email/:email

<p>GET request</p>

Where :email is the user's email.
As per get user by ID but fetches by their username.

Example URL:

https://aidchoo2.herokuapp.com/api/user/email/test@testy.com

### 2. Dashboard

If users have registered on the site they are able to view a dashboard of overall grass, pollen and pollution measures in Melbourne for the hour, as well as a personalsied "Tip of the day" based on their specified allergens. 

This feature was implemented with the help of the following tutorials:
valentinog - '4 + 1 ways for making HTTP requests with Node.js: async/await edition' by Valentino Gagliardi. [source](https://www.valentinog.com/blog/http-js/)

#### To get the user's dashboard

https://aidchoo2.herokuapp.com/api/dashboard

<p>POST request</p>

Send the user's allergens and severity to return the dashboard information.

Authenticated. Pass token as retrieved from a successful request of /user/login in the request header. Send well formed JSON in the body:

```json
{
  "allergens": "[<user allergens, must be one or many of Tree, Grass, Weeds or Pollution>]",
  "severity": "[<user severity, must be High Medium or Low>]"
}
```

User must be logged in to use this feature. Returns current grass, pollen and pollution values for the user's dashboard pulling data from VIC EPA (https://www.epa.vic.gov.au/EPAAirWatch), OpenWeather APIs (https://openweathermap.org/api) and Melbourne Pollen (https://www.melbournepollen.com.au/). Also returns tip of the day element that responds to user's specified allergens. To verify all tips stored in our database please see the 'resources' directory.

### 3. Tree Allergen Map

Any user can get the location of allergens which affect them by searching the common name of the tree and view which trees are currently in allergen producing season. After the user logs in and and shares their location, the tree map will return all allergen focused trees within in a 200m radius and their season.

The dataset of trees was obtained from Melbourne Open Data and has been filtered for allergen species and stored in the Aidchoo database to help with retrieval speed:
Trees, with species and dimensions (Urban Forest) by City of Melbourne [source](https://data.melbourne.vic.gov.au/Environment/Trees-with-species-and-dimensions-Urban-Forest-/fp38-wiyy)

To verify the trees stored please see the 'resources' directory.

In the future, all trees returned from these routes will be processed on the client side and mapped to an interactive map via Google Maps using their longitude and latitude value.

#### To get all allergen trees

<p>GET request</p>
https://aidchoo2.herokuapp.com/api/map/trees/all

Returns all trees that may trigger an allergen in Melbourne.

#### To get all allergen trees by season

<p>GET request</p>

https://aidchoo2.herokuapp.com/api/map/trees/inSeason

Calculates the current pollen season, which start and end dates differ to our normal seasons, and returns all trees which may be causing more pollen risk at this time. Blooming seasons include: "Summer", "Spring" and "All year". For the purposes of the mockup, trees species have been randomly assigned a blooming season but this will be updated to reflect reality in futue deployments after a greater time doing botanical research.

#### To get allergen trees by location

<p>POST request</p>
https://aidchoo2.herokuapp.com/api/map/trees/nearby

Will return all allergens trees, and whetehr they are in season, within provided distance metres from the provided latitude and longitude. To test the backend functionality of this route, send well formed json of latitude, longitude and distance in the body.

Here is an example request body. The location is Flagstaff Gardnes:

```json
{
  "latitude": -37.811144,
  "longitude": 144.9547,
  "distance": 500
}
```

### To get all allergen trees by a suite of standard locations
<p>GET request</p>

https://aidchoo2.herokuapp.com/api/map/trees/nearby

Will return nearby allergen trees, and whether they are in season, within 500 m of a suite of demo locations in Melbourne. Standard locations are as follows:

```json
{
  "standardLocations": [
    { "name": "Emporium", "lat": -37.8124, "lon": 144.9639 },
    { "name": "Flinders St Station", "lat": -37.8183, "lon": 144.9671 },
    { "name": "The State Library", "lat": -37.8098, "lon": 144.9652 },
    { "name": "NGV", "lat": -37.8226, "lon": 144.9689 },
    { "name": "Southern Cross Station", "lat": -37.8184, "lon": 144.9525 },
    { "name": "Flagstaff Gardens", "lat": -37.8106, "lon": 144.9545 },
    { "name": "Royal Exhbition Building", "lat": -37.8047, "lon": 144.9717 },
    { "name": "Unimelb Babel Building", "lat": -37.797315, "lon": 144.959379 }
  ]
}
```

#### To get tree by searching their common name

<p>GET request</p>

https://aidchoo2.herokuapp.com/api/map/trees/search/:commonName

Where :commonName is the name of the tree recorded in database.

Returns all trees of this common name in Melbourne. For now this an exact search, may update it to a fuzzy search based on common name in the future.

Example URLS:

https://aidchoo2.herokuapp.com/api/map/trees/search/Kermes%20Oak

https://aidchoo2.herokuapp.com/api/map/trees/search/Aleppo%20Pine


### Summary of Main Functions

The main functions of Aidchoo for this API include:

- sign up a new user: https://aidchoo2.herokuapp.com/api/user/register
- view and edit user profile: https://aidchoo2.herokuapp.com/api/user/profile
- user log in: https://aidchoo2.herokuapp.com/api/auth/login

- view the dashboard of general trigger readings and custom tips:
'https://aidchoo2.herokuapp.com/api/dashboard'

- find all allergen trees on the map: https://aidchoo2.herokuapp.com/api/map/trees/all
- find all in season allergen trees: https://aidchoo2.herokuapp.com/api/map/trees/inseason
- find nearby allergen trees or get trees nearby a suite of demo locations : https://aidchoo2.herokuapp.com/api/map/trees/nearby
