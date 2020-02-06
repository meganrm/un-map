import React from 'react';
import PropTypes from 'prop-types';
import superagent from 'superagent';
import moment from 'moment-timezone';
import LazyLoad from 'react-lazy-load';

import {
  Card,
  Icon,
  Typography,
} from 'antd';
import { indivisibleUrl } from '../state/constants';

const {
  Paragraph,
} = Typography;

/* eslint-disable */
require('style-loader!css-loader!antd/es/card/style/index.css');
require('style-loader!css-loader!antd/es/button/style/index.css');
/* eslint-enable */

class TableCell extends React.Component {
  static getEmail(e) {
    e.preventDefault();
    const ele = e.target;
    const { id } = ele;
    const mailto = document.getElementById(`${id}-target`);
    superagent.get(`${indivisibleUrl}/indivisible_group_emails/${id}.json`)
      .then((res) => {
        mailto.innerHTML = res.body;
        mailto.href = `mailto:${res.body}`;
      })
      .then(ele.classList.add('disabled'));
  }

  static handlePanelOpen(e) {
    const ele = document.getElementById(e.target.id);
    if (ele.classList.contains('open')) {
      ele.classList.remove('open');
      ele.classList.add('closed');
    } else {
      ele.classList.remove('closed');
      ele.classList.add('open');
    }
  }

  constructor(props) {
    super(props);
    this.renderEvents = this.renderEvents.bind(this);
  }

  renderEvents() {
    const {
      iconName,
      item,
    } = this.props;
    const actions = [];
    if (item.url) {
      actions.push((<Icon type="link" key="setting" href={item.url} />));
    }
    if (item.hostContact) {
      actions.push((<Icon type="mail" key="edit" />));
    }
    return (
      <Card
        className={`event-cell action-${item.actionType} category-${item.category}`}
        key={`${item.id}`}
        title={item.title}
        cover={
            item.photo && (
            <LazyLoad
              offset={1000}
            >
              <img
                alt="event-logo"
                src={item.photo}
              />
            </LazyLoad>
              )}
        actions={actions}
      >
        {item.host}
        <ul>
          {item.eventType}
        </ul>
        <ul>
          <li className="semi-bold">{item.timeStart}</li>
          <li className="semi-bold">{item.date}</li>

          <li>{item.address}</li>
        </ul>
        <Card.Meta
          title={item.title}
          description={
            <Paragraph ellipsis={{
                expandable: true,
                rows: 3,
                }}
            >
              {item.description}
            </Paragraph>
            }
        />

      </Card>);
  }


  render() {

    return (
      <React.Fragment>
        {
          this.renderEvents()
        }
      </React.Fragment>
    );
  }
}


TableCell.propTypes = {
  iconName: PropTypes.string,
  item: PropTypes.shape({}).isRequired,
};

TableCell.defaultProps = {
  iconName: '',
};

export default TableCell;
