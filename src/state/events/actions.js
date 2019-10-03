import moment from 'moment';

import getData from '../../logics/getData';

import { eventsUrl } from '../constants';

import GlobalXrEvent from './model';

export const setEvents = events => ({
  events,
  type: 'SET_EVENTS',
});

export const setFeaturesHome = featuresHome => ({
  featuresHome,
  type: 'SET_FEATURES_HOME',
});

export const updateColorMap = colorMap => ({
  colorMap,
  type: 'UPDATE_COLORS',
});

export const startSetEvents = () => (dispatch) => {
  const url = `${eventsUrl}/events.json`;
  return getData(url).then((result) => {
    const allevents = result.body;
    console.log(allevents)
    const events = Object.keys(allevents)
      .map(id => new GlobalXrEvent(allevents[id]))
      // .filter(event => moment(event.starts_at).isAfter())
      .sort((a, b) => ((moment(a.starts_at).isSameOrAfter(moment(b.starts_at))) ? 1 : -1));
    return (dispatch(setEvents(events)));
  });
};
