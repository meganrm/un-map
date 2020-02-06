/* globals location */
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import mapboxgl from 'mapbox-gl';

import {
  getVisibleEvents,
  getColorMap,
  getEvents,
  getFilteredEvents,
} from '../state/events/selectors';
import {
  startSetEvents,
  updateColorMap,
} from '../state/events/actions';

import {
  getDistance,
  getLocation,
  getRefCode,
  getFilterBy,
  getFilterValue,
  getActionTypes,
} from '../state/selections/selectors';
import * as selectionActions from '../state/selections/actions';

import MapView from '../components/EventMap';
import WebGlError from '../components/WebGlError';

import SearchBar from './SearchBar';
import SideBar from './SideBar';

class EventsDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.renderTotal = this.renderTotal.bind(this);
    this.renderMap = this.renderMap.bind(this);

    this.state = {
      init: true,
    };
  }


  componentDidMount() {
    const {
      getInitialEvents,
      setRefCode,
    } = this.props;


    if (document.location.search) {
      setRefCode(document.location.search);
    }
    getInitialEvents()
      .then((returned) => {
        // if (this.state.issueFilter) {
        //   this.props.setFilters(this.state.issueFilter);
        //   this.setState({ issueFilter: null });
        // } else {
        //   this.props.setInitialFilters(returned);
        // }
        this.setState({ init: false });
      });
  }

  renderTotal(items) {
    const { distance, center } = this.props;
    const eventsOrEvent = items.length === 1 ? 'event' : 'events';
    const isOrAre = items.length === 1 ? 'is' : 'are';
    if (center.lat) {
      return (<p className="event-count">{items.length} {eventsOrEvent} {isOrAre} within {distance} km of your search.</p>);
    }
    return (<p className="event-count">Viewing {items.length} events</p>);
  }

  renderMap() {
    const {
      distance,
      district,
      center,
      colorMap,
      refcode,
      setLatLng,
      resetSelections,
      selectedUsState,
      filterBy,
      filterValue,
      searchByDistrict,
      visibleEvents,
      searchByQueryString,
      onColorMapUpdate,
    } = this.props;


    if (!mapboxgl.supported()) {
      return (<WebGlError />);
    }
    return (<MapView
      items={visibleEvents}
      center={center}
      selectedUsState={selectedUsState}
      colorMap={colorMap}
      onColorMapUpdate={onColorMapUpdate}
      district={district}
      filterByValue={{ [filterBy]: [filterValue] }}
      resetSelections={resetSelections}
      searchByDistrict={searchByDistrict}
      refcode={refcode}
      setLatLng={setLatLng}
      distance={distance}
      searchByQueryString={searchByQueryString}
    />);
  }

  render() {
    const {
      allEvents,
      center,
      visibleEvents,
      colorMap,
      refcode,
      resetSelections,
      filterBy,
    } = this.props;

    if (this.state.init) {
      return null;
    }

    return (
      <div className="events-container main-container">
        <h2 className="dash-title">Event Dashboard</h2>
        <SearchBar items={visibleEvents} />
        <div className="map-and-events-container">
          <SideBar
            renderTotal={this.renderTotal}
            colorMap={colorMap}
            items={visibleEvents}
            allItems={allEvents}
            refcode={refcode}
            type="events"
            resetSelections={resetSelections}
            filterBy={filterBy}
            location={center}
          />
          <div className="side-bar-background" />
          {this.renderMap()}
        </div>
        <div className="footer" />
      </div>

    );
  }
}

const mapStateToProps = state => ({
  allEvents: getEvents(state),
  center: getLocation(state),
  colorMap: getColorMap(state),
  distance: getDistance(state),
  filterBy: getFilterBy(state),
  filterValue: getFilterValue(state),
  filteredEvents: getFilteredEvents(state),
  issueFilters: getActionTypes(state),
  refcode: getRefCode(state),
  visibleEvents: getVisibleEvents(state),
});

const mapDispatchToProps = dispatch => ({
  getInitialEvents: () => dispatch(startSetEvents()),
  onColorMapUpdate: colormap => dispatch(updateColorMap(colormap)),
  resetSearchByQueryString: () => dispatch(selectionActions.resetSearchByQueryString()),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  resetSelectionsExceptState: () => dispatch(selectionActions.resetSelectionsExceptState()),
  searchByAddress: zipcode => dispatch(selectionActions.getLatandLngFromSearch(zipcode)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  setFilters: filters => dispatch(selectionActions.setFilters(filters)),
  setInitialFilters: events => dispatch(selectionActions.setInitialFilters(events)),
  setLatLng: val => dispatch(selectionActions.setLatLng(val)),
  setRefCode: code => dispatch(selectionActions.setRefCode(code)),
});

EventsDashboard.propTypes = {
  allEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  center: PropTypes.shape({ lat: PropTypes.string, lng: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  distance: PropTypes.number.isRequired,
  district: PropTypes.number,
  filterBy: PropTypes.string,
  filterValue: PropTypes.string,
  filteredEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  getInitialEvents: PropTypes.func.isRequired,
  onColorMapUpdate: PropTypes.func.isRequired,
  refcode: PropTypes.string,
  resetSelections: PropTypes.func.isRequired,
  searchByDistrict: PropTypes.func.isRequired,
  searchByQueryString: PropTypes.func.isRequired,
  selectedUsState: PropTypes.string,
  setFilters: PropTypes.func.isRequired,
  setInitialFilters: PropTypes.func.isRequired,
  setLatLng: PropTypes.func.isRequired,
  setRefCode: PropTypes.func.isRequired,
  visibleEvents: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

EventsDashboard.defaultProps = {
  center: null,
  district: null,
  filterBy: 'all',
  filterValue: [],
  refcode: '',
  selectedUsState: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard);
