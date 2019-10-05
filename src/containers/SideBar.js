import React from 'react';
import PropTypes from 'prop-types';

import Table from '../components/Table';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.renderTotal = this.renderTotal.bind(this);
  }

  renderTotal() {
    const { items, renderTotal } = this.props;
    if (renderTotal) {
      return renderTotal(items);
    }
    return null;
  }

  render() {
    const {
      colorMap,
      items,
      refcode,
      selectItem,
      type,
    } = this.props;
    return (
      <div className="side-bar-container">
        {this.renderTotal()}
        <Table
          colorMap={colorMap}
          items={items}
          refcode={refcode}
          type={type}
          selectItem={selectItem}
        />
      </div>
    );
  }
}

SideBar.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.shape({})),
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  refcode: PropTypes.string,
  renderTotal: PropTypes.func.isRequired,
  selectItem: PropTypes.func,
  type: PropTypes.string.isRequired,
};

SideBar.defaultProps = {
  colorMap: [],
  refcode: '',
  selectItem: () => {},
};
export default SideBar;
