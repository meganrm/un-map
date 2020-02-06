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
  getActionTypes,
  getSDGFilters,
} from '../selections/selectors';

export const getEvents = state => state.events.allEvents;
export const getColorMap = state => state.events.filterColors;
export const getCurrentIssueFocuses = createSelector([getEvents], events => uniqBy(events, 'issueFocus').map(item => item.issueFocus));

export const getFilteredEvents = createSelector(
  [
    getEvents,
    getSDGFilters,
    getActionTypes,
  ],
  (
    eventsFilteredByKeywords,
    sdgFilters,
    actionTypes,
  ) => {
    let toReturn = eventsFilteredByKeywords;
    if (sdgFilters && sdgFilters.length > 0 ) {
      toReturn = toReturn.filter(currrentEvent => includes(sdgFilters, currrentEvent.category)).sort((a, b) => (a.timeStart < b.timeStart ? -1 : 1));
    }
    if (actionTypes && actionTypes.length > 0) {
      toReturn = toReturn.filter(currrentEvent => includes(actionTypes, currrentEvent.category)).sort((a, b) => (a.timeStart < b.timeStart ? -1 : 1));
    }
    return toReturn;
  },
);

export const getVisibleEvents = createSelector(
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

