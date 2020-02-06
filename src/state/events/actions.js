import moment from 'moment';

import getData from '../../logics/getData';

import { eventsUrl } from '../constants';

import SDGEvent from './model';

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
  const url = '../../data/events.json';
  return getData(url).then((result) => {
    const allevents = result.body;
    const events = Object.keys(allevents)
      .map(id => new SDGEvent(allevents[id]))
      // .filter(event => moment(event.timeStart).isAfter())
      .sort((a, b) => ((moment(a.timeStart).isSameOrAfter(moment(b.timeStart))) ? 1 : -1));
    return (dispatch(setEvents(events)));
  });
};
