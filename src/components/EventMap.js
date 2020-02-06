import React from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';
import geoViewport from '@mapbox/geo-viewport';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl';

import Point from '../logics/features';

class MapView extends React.Component {
  constructor(props) {
    super(props);
    this.addPopups = this.addPopups.bind(this);
    this.addClickListener = this.addClickListener.bind(this);
    this.addLayer = this.addLayer.bind(this);
    this.createFeatures = this.createFeatures.bind(this);
    this.updateData = this.updateData.bind(this);
    this.getColorForEvents = this.getColorForEvents.bind(this);
    this.focusMap = this.focusMap.bind(this);
    this.addClusterLayers = this.addClusterLayers.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.makeZoomToNationalButton = this.makeZoomToNationalButton.bind(this);
    this.state = {
      popoverColor: 'popover-general-icon',
    };
  }

  componentDidMount() {
    const { items } = this.props;
    const featuresHome = this.createFeatures(items);
    console.log(featuresHome, items)
    this.initializeMap(featuresHome);
  }

  componentWillReceiveProps(nextProps) {
    const {
      center,
      selectedItem,
    } = nextProps;

    // Highlight selected item
    if (this.props.selectedItem !== selectedItem) {
      this.map.setFilter('unclustered-point-selected', ['==', 'id', selectedItem ? selectedItem.id : false]);
    }

    if (center.lng) {
      return this.map.flyTo({
        center: [Number(center.lng), Number(center.lat)],
        zoom: 6.52,
      });
    }
    return this.map.flyTo({
      center: [-23.470570, 21.844138],
      zoom: 1.35,
    });
  }

  getColorForEvents(indEvent) {
    const {
      colorMap,
      onColorMapUpdate,
    } = this.props;
    let updatedObj = {};
    let colorObj = find(colorMap, { filterBy: indEvent.issueFocus });
    if (colorObj) {
      updatedObj = { ...indEvent, icon: colorObj.icon };
    } else {
      colorObj = find(colorMap, { filterBy: false });
      if (colorObj) {
        colorObj.filterBy = indEvent.issueFocus;
        updatedObj = { ...indEvent, icon: colorObj.icon };
      } else {
        colorObj = {
          color: '#6C9FC2',
          filterBy: indEvent.issueFocus,
          icon: 'marker-11',
        };
        colorMap.push(colorObj);
        updatedObj = {
          ...indEvent,
          icon: colorObj.icon,
        };
      }
      onColorMapUpdate(colorMap);
    }
    return updatedObj;
  }

  focusMap(bb) {
    if (!bb) {
      return;
    }
    const height = window.innerHeight;
    const width = window.innerWidth;
    const view = geoViewport.viewport(bb, [width / 2, height / 2]);
    if (view.zoom < 2.5) {
      view.zoom = 2.5;
    } else {
      view.zoom -= 0.5;
    }
    this.map.flyTo(view);
  }

  updateData(items, layer) {
    const featuresHome = this.createFeatures(items);
    this.map.fitBounds([[-128.8, 23.6], [-65.4, 50.2]]);
    if (!this.map.getSource(layer)) {
      console.log('no layer');
      return;
    }
    this.map.getSource(layer).setData(featuresHome);
  }

  createFeatures(items) {
    const featuresHome = {
      features: [],
      type: 'FeatureCollection',
    };
    console.log('got features', items)
    featuresHome.features = items.map((indEvent) => {
      const colorObject = this.getColorForEvents(indEvent);
      const newFeature = new Point(colorObject);
      return newFeature;
    });
    return featuresHome;
  }

  addPopups(layer) {
    const { map } = this;
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    });

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [layer] });
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

      if (features.length) {
        const feature = features[0];
        const { properties } = feature;
        this.setState({ popoverColor: `popover-${feature.properties.icon}` });

        return popup.setLngLat(feature.geometry.coordinates)
          .setHTML(`
            <h4>${properties.title}</h4>
            <div>${properties.startsAt}</div>
            <div>${properties.location}</div>

            <div>${properties.address}</div>
            `)
          .addTo(map);
      }
      return popup.remove();
    });
  }

  toggleFilters(layer, filterSettings) {
    this.map.setFilter(layer, filterSettings);
    this.map.setLayoutProperty(layer, 'visibility', 'visible');
  }

  addClickListener() {
    const {
      setLatLng,
    } = this.props;
    const { map } = this;

    map.on('click', (e) => {
      // handle proximity
      const points = map.queryRenderedFeatures(e.point, { layers: ['events-points'] });
      // selected a marker
      let formatLatLng;
      if (points.length > 0) {
        const point = points[0];
        formatLatLng = {
          lat: point.geometry.coordinates[1].toString(),
          lng: point.geometry.coordinates[0].toString(),
        };
      } else {
        formatLatLng = {
          lat: e.lngLat.lat.toString(),
          lng: e.lngLat.lng.toString(),
        };
      }
      setLatLng(formatLatLng);
    });
  }

  addLayer(featuresHome) {
    this.map.addLayer({
      id: 'events-points',
      layout: {
        'icon-allow-overlap': true,
        'icon-ignore-placement': true,
        'icon-image': '{icon}',
        'icon-offset': {
          base: 1,
          stops: [
            [0, [0, -15]],
            [10, [0, -10]],
            [12, [0, 0]],
          ],
        },
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      },
      paint: {
        'icon-opacity': 1,
      },
      source: {
        data: featuresHome,
        type: 'geojson',
      },
      type: 'symbol',
    });
  }

  clusterData(featuresHome) {
    this.map.addSource('groups-points', {
      cluster: false,
      data: featuresHome,
      type: 'geojson',
    });
    this.addClusterLayers();
  }

  addClusterLayers() {
    this.map.addLayer({
      filter: ['!has', 'point_count'],
      id: 'unclustered-point',
      paint: {
        'circle-color': '#11b4da',
        'circle-opacity': 0.5,
        'circle-radius': 4,
        'circle-stroke-color': '#fff',
        'circle-stroke-width': 1,
      },
      source: 'groups-points',
      type: 'circle',
    });
  }

  handleReset() {
    const {
      resetSelections,
    } = this.props;
    resetSelections();
  }

  // Creates the button in our zoom controls to go to the national view
  makeZoomToNationalButton() {
    document.querySelector('.mapboxgl-ctrl-compass').remove();
    if (document.querySelector('.mapboxgl-ctrl-globe')) {
      document.querySelector('.mapboxgl-ctrl-globe').remove();
    }
    const globeButton = document.createElement('button');
    globeButton.className = 'mapboxgl-ctrl-icon mapboxgl-ctrl-globe';

    globeButton.innerHTML = '<span class="globe-icon"></span>';
    globeButton.addEventListener('click', this.handleReset);
    document.querySelector('.mapboxgl-ctrl-group').appendChild(globeButton);
  }

  initializeMap(featuresHome) {

    mapboxgl.accessToken =
         'pk.eyJ1IjoieHJnbG9iYWwiLCJhIjoiY2swdndhc205MTNucTNtcXY5bTd3cXg5bCJ9.0GHuJbhIE_SBKoSLoDlI0w';
    const styleUrl = 'mapbox://styles/xrglobal/ck0vwcghg055z1cmr22n4mmsm';

    this.map = new mapboxgl.Map({
      container: 'map',
      style: styleUrl,
    });

    // Set Mapbox map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.scrollZoom.disable();
    this.map.dragRotate.disable();
    this.map.touchZoomRotate.disableRotation();
    this.makeZoomToNationalButton();
    // map on 'load'
    this.map.on('load', () => {
      this.addLayer(featuresHome);
      this.addPopups('events-points');
      this.addClickListener();
      this.map.getSource('events-points').setData(featuresHome);

      this.handleReset();
    });
  }

  render() {
    return (
      <React.Fragment>
        <div id="map" className={this.state.popoverColor}>
          <div className="map-overlay" id="legend" />
        </div>

      </React.Fragment>
    );
  }
}

MapView.propTypes = {
  center: PropTypes.shape({ lat: PropTypes.string, lng: PropTypes.string }),
  colorMap: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onColorMapUpdate: PropTypes.func.isRequired,
  resetSelections: PropTypes.func.isRequired,
  selectedItem: PropTypes.shape({}),
  setLatLng: PropTypes.func.isRequired,
};

MapView.defaultProps = {
  center: {},
  selectedItem: null,
};

export default MapView;
