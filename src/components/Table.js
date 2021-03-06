import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';
import { find } from 'lodash';

import TableCell from './TableCell';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.getColor = this.getColor.bind(this);
    this.getIconName = this.getIconName.bind(this);
  }

  getColor(issueFocus) {
    const { colorMap } = this.props;
    const colorObj = find(colorMap, { filterBy: issueFocus });
    if (colorObj) {
      return colorObj.color;
    }
    return '';
  }

  getIconName(issueFocus) {
    const { colorMap } = this.props;
    const colorObj = find(colorMap, { filterBy: issueFocus });
    if (colorObj) {
      return colorObj.icon;
    }
    return '';
  }

  render() {
    const {
      items,
      refcode,
      selectItem,
    } = this.props;
    if (items.length === 0) {
      return (
        <div id="events-list">
          <p className="no-results">Looks like there are no events near you right now.
          </p>
        </div>
      );
    }

    return (
      <List
        id="event-list"
        itemLayout="vertical"
        dataSource={items}
        renderItem={item =>
          (
            <List.Item key={item.id}>
              <TableCell
                key={`${item.id}-cell`}
                item={item}
                refcode={refcode}
                color={this.getColor(item.issueFocus)}
                iconName={this.getIconName(item.issueFocus)}
                selectItem={selectItem}
              />
            </List.Item>
          )}
      />
    );
  }
}

Table.propTypes = {
  colorMap: PropTypes.arrayOf(PropTypes.object),
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  refcode: PropTypes.string,
  selectItem: PropTypes.func,
};

Table.defaultProps = {
  colorMap: [],
  refcode: '',
  selectItem: () => {},
};

export default Table;
