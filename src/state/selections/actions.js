import superagent from 'superagent';

import {
  firebaseUrl,
  geocodingToken,
  geoCodingApiUrl,
} from '../constants';

export const setLatLng = payload => ({
  payload,
  type: 'SET_LAT_LNG',
});

export const resetSelections = () => ({
  type: 'RESET_SELECTIONS',
});

export const resetSearchByZip = () => ({
  type: 'RESET_LAT_LNG',
});

export const setRefCode = (payload = '') => ({
  payload,
  type: 'SET_REFCODE',
});

export const setTextFilter = (payload = '') => ({
  payload,
  type: 'SET_TEXT_FILTER',
});

export const setDistance = (payload = 50) => ({
  payload,
  type: 'SET_DISTANCE',
});

export const searchByQueryString = payload => ({
  payload,
  type: 'SEARCH_BY_KEY_VALUE',
});

export const resetSearchByQueryString = () => ({
  type: 'RESET_SEARCH_BY_KEY_VALUE',
});

export const setIssueTypeFilters = payload => ({
  payload,
  type: 'SET_ISSUE_TYPE_FILTERS',
});

export const setInitialFilters = payload => ({
  payload,
  type: 'SET_INITIAL_FILTERS',
});

export const setSDGFilters = payload => ({
  payload,
  type: 'SET_SDG_FILTERS',
});

export const getLatLngFromZip = payload => (dispatch) => {
  if (!payload.query) {
    return dispatch(setLatLng({}));
  }
  return superagent.get(`${firebaseUrl}/zips/${payload.query}.json`)
    .then((res) => {
      dispatch(setLatLng(res.body));
    })
    .catch();
};

export const getLatandLngFromSearch = payload => (dispatch) => {
  if (!payload.query) {
    return dispatch(setLatLng({}));
  }
  const addressQuery = escape(payload.query);
  const url = `${geoCodingApiUrl}/geocoding/v5/mapbox.places/${addressQuery}.json?access_token=${geocodingToken}`;
  return superagent
    .get(url)
    .then((returned) => {
      const {
        body,
      } = returned;
      if (body.features && body.features.length) {
        const data = body.features[0];

        const newLatLng = {
          lat: data.center[1],
          lng: data.center[0],
        };
        return dispatch(setLatLng(newLatLng));
      }
      return dispatch(setLatLng({}));
    });
};
