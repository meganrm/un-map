# events-map

## Dev env
`npm i`
`npm run watch` starts the webpack dev server

## Deployment
`npm run build` creates a bundle in `build/` 

## Features:
1. search by address
2. search by clicking on the map
3. displays events that have a lat and lng property

## Available features that aren't currently turn on
1. Color the cards and the events by a param (like eventType)
2. Filter events by eventType

## Event Schema
```JavaScript
  "properties": {
    "address": {
      "description": "Full address (street, city, postal code) location of the event",
      "type": "string",
    },
    "description": {
      "description": "Description of the event",
      "type": "string",
    },
    "location": {
      "description": "Venue name or location description",
      "type": "string",
    },
    "url": {
      "description": "Link to event or group website",
      "type": "string",
    },
    "dateCreated": {
      "description": "Date and time the event was created",
      "type": "string",
    },
    "timeStart": {
      "description": "ISO time at which the event starts",
      "type": "string",
    },
    "timeEnd": {
      "description": "ISO time at which the event ends",
      "type": "string",
    },
    "timeZone": {
      "description": "Time zone abbreviation, ie EST",
      "type": "string",
    },
    "zoneName": {
      "description": "Name of the time zone",
      "type": "string",
    },
    "hostOrganization": {
      "description": "Event host organization",
      "type": "string",
    },
    "id": {
      "description": "firebase event UID or API id",
      "type": "string",
    },
    "lastUpdated": {
      "description": "When the record was last updated in ISO8601 format",
      "type": "string",
    },
    "lat": {
      "description": "Latitude of the event",
      "type": "number",
      "minimum": 0,
      "maximum": 180,
    },
    "lng": {
      "description": "Longitude of the event",
      "type": "number",
      "minimum": -180,
      "maximum": 180,
    },
    "photo": {
      "description": "link to photo",
      "type": "string",
    },
    "title": {
      "description": "title of the event",
      "type": "string",
    },
    "eventType": {
      "description": "What type of event this is",
      "type": "string",
      // "enum": [
      //   "Action",
      //   "Activity/Event",
      //   "Meeting",
      //   "Talk",
        
      // ],
    },
    "organizerContact": {
      "description": "Organizer contact information",
      "type": "string",
    },

    "country": {
      "description": "Country where the event takes place",
      "type": "string",
    },
  },
  "required": [
    "address",
    "dateCreated",
    "description",
    "eventType",
    "id",
    "lat",
    "url",
    "lng",
    "photo",
    "timeEnd",
    "timeStart",
    "timeZone",
    "title",
    "zoneName",
    "country",
  ],
}
```