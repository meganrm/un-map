import moment from 'moment-timezone';

class Point {
  constructor(event) {
    this.type = 'Feature';
    this.geometry = {
      coordinates: [Number(event.lng), Number(event.lat)],
      type: 'Point',
    };
    this.properties = {
      address: event.address,
      icon: event.icon,
      id: event.id,
      location: event.location || '',
      // socials: event.socials || [],
      startsAt: event.timeStart && event.zoneName ? moment(event.timeStart).tz(event.zoneName).format('MMMM Do YYYY, h:mm a z') : '',
      title: event.title,
      url: event.url || null,
    };
  }
}

export default Point;
