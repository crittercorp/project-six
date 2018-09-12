const google = window.google;

const userLocation = () => {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(function(position) {
      const userLatitude = parseFloat(position.coords.latitude);
      const userLongitude = parseFloat(position.coords.longitude);
      const latlng = {
        lat: userLatitude,
        lng: userLongitude
      };
      getLocation(latlng).then(resolve);
    });
  })
}

const getLocation = (latlng) => {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({
    'location': latlng
    }, (res, err) => {
    if (err === 'OK') {
      let userCity = res.filter((location) => {
        return location.address_components[0].types[0] === 'locality';
      })
      const userAddress = userCity[0].formatted_address;
      resolve(userAddress);
    } else {
      window.alert('Geocoder failed due to: ' + err);
      }
    });
  })

}



export default userLocation;