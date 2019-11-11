import React from 'react';
import Constants from '../../../../constants';

const DateMap = ({ placeIds }) => {
  let mapSrc = 'https://www.google.com/maps/embed/v1/directions?';
  mapSrc += `origin=place_id:${placeIds[0]}&`;
  mapSrc += `destination=place_id:${placeIds[1]}&`;
  mapSrc += 'mode=walking&';
  mapSrc += `key=${Constants.KEYS.MAPS_API_KEY}`;
  return (
    <iframe
      title="Date Directions"
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0, minHeight: '300px' }}
      src={mapSrc}
      allowFullScreen
    ></iframe>
  );
};

export default DateMap;
