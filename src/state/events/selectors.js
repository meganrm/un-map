import {
  filter,
  includes,
  uniqBy,
} from 'lodash';
import { createSelector } from 'reselect';
import { computeDistanceBetween, LatLng } from 'spherical-geometry-js';

import {
  getDistance,
  getLocation,
  getFilterBy,
  getFilterValue,
  getFilters,
} from '../selections/selectors';

export const getEvents = state => state.events.allEvents;
export const getColorMap = state => state.events.filterColors;
export const getCurrentIssueFocuses = createSelector([getEvents], events => uniqBy(events, 'issueFocus').map(item => item.issueFocus));

const getEventsFilteredByKeywordArray = createSelector(
  [getEvents, getFilters],
  (allEvents, filterArray) => filter(allEvents, o => includes(filterArray, o.issueFocus)),
);

export const getFilteredEvents = createSelector(
  [
    getEventsFilteredByKeywordArray,
    getFilterBy,
    getFilterValue,
  ],
  (
    eventsFilteredByKeywords,
    filterBy,
    filterValue,
  ) => {
    if (!filterValue || filterBy === 'all') {
      return eventsFilteredByKeywords;
    }
    return eventsFilteredByKeywords.filter((currrentEvent) => {
      if (!currrentEvent[filterBy]) {
        return false;
      }
      return currrentEvent[filterBy].toLowerCase().includes(filterValue.toLowerCase());
    }).sort((a, b) => (a.starts_at < b.starts_at ? -1 : 1));
  },
);

export const getVisbleEvents = createSelector(
  [
    getFilteredEvents,
    getDistance,
    getLocation,
  ],
  (
    filteredEvents,
    maxDistance,
    location,
  ) => {
    if (!location.lat) {
      return filteredEvents;
    }
    const lookup = new LatLng(Number(location.lat), Number(location.lng));
    const maxMeters = maxDistance * 1000; // convert kilometers to meters
    return filteredEvents.filter((currentEvent) => {
      const curDistance = computeDistanceBetween(
        lookup,
        new LatLng(Number(currentEvent.lat), Number(currentEvent.lng)),
      );
      return curDistance < maxMeters;
    }).sort((a, b) => {
      const aDistance = computeDistanceBetween(
        lookup,
        new LatLng(Number(a.lat), Number(a.lng)),
      );
      const bDistance = computeDistanceBetween(
        lookup,
        new LatLng(Number(b.lat), Number(b.lng)),
      );
      return aDistance - bDistance;
    });
  },
);

