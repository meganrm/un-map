import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as selectionActions from '../state/selections/actions';

import { getDistance, getLocation, getSDGFilters } from '../state/selections/selectors';

import SearchInput from '../components/SearchInput';
import DistanceFilter from '../components/DistanceSlider';
import SDGCheckBoxes from '../components/SDGCheckBoxes';
// import IssueFilterTags from '../components/IssueFilterTags';

/* eslint-disable */
require('style-loader!css-loader!antd/es/radio/style/index.css');
/* eslint-enable */

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.onTextChange = this.onTextChange.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.distanceHandler = this.distanceHandler.bind(this);
  }

  componentWillMount() {

    // NOTE: this code is for being able to set up query params for the map
    // You can delete it if you aren't going to use this feature.

    // const params = ['location'];
    // const queries = params.reduce((acc, cur) => {
    //   const query = document.location.search.match(new RegExp(`[?&]${cur}[^&]*`));
    //   if (query && query[0].split('=').length > 1) {
    //     acc[cur] = query[0].split('=')[1];
    //   }
    //   return acc;
    // }, {});

    // if (queries.location) {
    //   return this.searchHandler({
    //     query: queries.location,
    //   });
    // }
  }

  onTextChange(e) {
    this.props.setTextFilter(e.target.value);
  }

  searchHandler(value) {
    const { query } = value;
    const {
      resetSelections,
      resetSearchByQueryString,
      searchByAddress,
    } = this.props;

    resetSearchByQueryString();
    if (!query) {
      return resetSelections();
    }
    return searchByAddress({
      query,
    });
  }

  distanceHandler(value) {
    const { setDistance } = this.props;
    return setDistance(value);
  }

  // NOTE: this is a filter component for event types.
  // Can be removed or made to work in the future if we have eventtypes
  // renderFilterBar() {
  //   const {
  //     eventTypes,
  //     selectedFilters,
  //     colorMap,
  //   } = this.props;

  //   return (
  //     <div className="input-group-filters">
  //       <IssueFilterTags
  //         colorMap={colorMap}
  //         issues={eventTypes}
  //         onFilterChanged={onFilterChanged}
  //         selectedFilters={selectedFilters}
  //       />
  //     </div>
  //   );
  // }

  render() {
    const {
      distance,
      mapType,
      sdgFilters,
      setSDGFilters,
    } = this.props;
    return (
      <div className="search-bar">
        <SDGCheckBoxes 
          sdgFilters={sdgFilters}
          setSDGFilters={setSDGFilters}
        />
        <SearchInput
          mapType={mapType}
          submitHandler={this.searchHandler}
        />

        <DistanceFilter
          changeHandler={this.distanceHandler}
          distance={distance}
        />
        {/* NOTE: this has filtering functionality that is currently turned off.
        it was used to filter on event type. We can turn it back on
        if that's a desired feature.  */}
        {/* {this.renderFilterBar()} */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  distance: getDistance(state),
  location: getLocation(state),
  sdgFilters: getSDGFilters(state),
});

const mapDispatchToProps = dispatch => ({
  onFilterChanged: filters => dispatch(selectionActions.setIssueTypeFilters(filters)),
  resetSearchByQueryString: () => dispatch(selectionActions.resetSearchByQueryString()),
  resetSearchByZip: () => dispatch(selectionActions.resetSearchByZip()),
  resetSelections: () => dispatch(selectionActions.resetSelections()),
  searchByAddress: zipcode => dispatch(selectionActions.getLatandLngFromSearch(zipcode)),
  searchByDistrict: district => dispatch(selectionActions.searchByDistrict(district)),
  searchByQueryString: val => dispatch(selectionActions.searchByQueryString(val)),
  searchHandler: (query, searchType, mapType) => (
    dispatch(selectionActions.searchHandler(query, searchType, mapType))),
  setDistance: distance => dispatch(selectionActions.setDistance(distance)),
  setSDGFilters: filters => dispatch(selectionActions.setSDGFilters(filters)),
  setTextFilter: text => dispatch(selectionActions.setTextFilter(text)),
});

SearchBar.propTypes = {
  distance: PropTypes.number.isRequired,
  mapType: PropTypes.string.isRequired,
  resetSearchByQueryString: PropTypes.func.isRequired,
  resetSelections: PropTypes.func.isRequired,
  sdgFilters: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchByAddress: PropTypes.func.isRequired,
  setDistance: PropTypes.func.isRequired,
  setTextFilter: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
