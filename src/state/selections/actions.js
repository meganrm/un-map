import superagent from 'superagent';

import { firebaseUrl } from '../constants';

export const setLatLng = payload => ({
  payload,
  type: 'SET_LAT_LNG',
});

export const searchByDistrict = payload => ({
  payload,
  type: 'SEARCH_BY_DISTRICT',
});

export const setUsState = payload => ({
  payload,
  type: 'SET_US_STATE',
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

export const changeSearchType = payload => ({
  payload,
  type: 'SET_SEARCH_TYPE',
});

export const setIssueTypeFilters = payload => ({
  payload,
  type: 'SET_ISSUE_TYPE_FILTERS',
});

export const setInitialFilters = payload => ({
  payload,
  type: 'SET_INITIAL_FILTERS',
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
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressQuery}&key=AIzaSyDP8q2OVisSLyFyOUU6OTgGjNNQCq7Q3rE`;
  return superagent
    .get(url)
    .then((returned) => {
      const {
        results,
      } = returned.body;
      if (results && results.length) {
        const data = results[0];
        const newLatLng = {
          lat: data.geometry.location.lat,
          lng: data.geometry.location.lng,
        };
        //  this.address = data.formatted_address;
        console.log(newLatLng)
        return dispatch(setLatLng(newLatLng));
      }
      return dispatch(setLatLng({}));

    });
};
