import { uniqBy } from 'lodash';

const initialState = {
  distance: 50,
  district: NaN,
  filterBy: 'all',
  filterValue: '',
  filters: [],
  location: {},
  refcode: '',
  sdgFilters: [],
};

const userSelectionsReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'RESET_SELECTIONS':
      return {
        ...state,
        district: initialState.district,
        filterBy: initialState.filterBy,
        filterValue: initialState.filterValue,
        location: initialState.location,
      };
    case 'SET_REFCODE':
      return {
        ...state,
        refcode: payload,
      };
    case 'SET_TEXT_FILTER':
      return {
        ...state,
        filterValue: payload,
      };
    case 'SET_DISTANCE':
      return {
        ...state,
        distance: payload,
      };
    case 'SET_LAT_LNG':
      return {
        ...state,
        location: payload,
      };
    case 'RESET_LAT_LNG':
      return {
        ...state,
        location: {},
      };
    case 'SEARCH_BY_KEY_VALUE':
      return {
        ...state,
        filterBy: payload.filterBy,
        filterValue: payload.filterValue,
      };
    case 'RESET_SEARCH_BY_KEY_VALUE':
      return {
        ...state,
        filterBy: initialState.filterBy,
        filterValue: initialState.filterValue,
      };
    case 'SET_ISSUE_TYPE_FILTERS':
      return {
        ...state,
        filters: payload,
      };
    case 'SET_SDG_FILTERS':
      return {
        ...state,
        sdgFilters: payload,
      };
    case 'SET_INITIAL_FILTERS':
      return {
        ...state,
        filters: uniqBy(payload.events, 'issueFocus')
          .map(item => item.issueFocus),
      };
    default:
      return state;
  }
};

export default userSelectionsReducer;
