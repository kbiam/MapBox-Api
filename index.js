// mapboxgl.accessToken = 'pk.eyJ1IjoiaGFydmV5LTAwNyIsImEiOiJjbHJtZGxlangwMHh3MmpsZnAyajJsc3hiIn0.c1Jzfxg-H2PyStQD0Kay_A';
// const map = new mapboxgl.Map({
// 	container: 'map', // container ID
// 	style: 'mapbox://styles/mapbox/streets-v12', // style URL
// 	center: [-74.5, 40], // starting position [lng, lat]
// 	zoom: 9, // starting zoom
//     boxZoom: true
// });

// map.addControl(new mapboxgl.NavigationControl());
// map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));
// map.addControl(new mapboxgl.GeolocateControl({
//     positionOptions: {
//         enableHighAccuracy: true
//     },
//     trackUserLocation: true,
//     showAccuracyCircle:true,
//     showUserHeading: true,
//     showUserLocation:true


// }));




mapboxgl.accessToken = 'pk.eyJ1IjoiaGFydmV5LTAwNyIsImEiOiJjbHJtZGxlangwMHh3MmpsZnAyajJsc3hiIn0.c1Jzfxg-H2PyStQD0Kay_A';

let latitude;
let longitude;
let center;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: [0, 0], // Default center before geolocation
    zoom: 9, // starting zoom
    boxZoom: true
});

map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('body') }));
map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true,
    showAccuracyCircle: true,
    showUserHeading: true,
    showUserLocation: true
}));
map.addControl(
    new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    destination:[0,0],
    unit:'metric'
    }),
    'top-right'
    );

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    // Update the center of the map with the geolocation coordinates
    center = [longitude, latitude];
    map.setCenter(center);

    document.getElementById('location').innerHTML = `Latitude: ${latitude}<br>Longitude: ${longitude}`;

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);
    console.log(latitude);
    const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([longitude, latitude])
        // .addTo(map)

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('location').innerHTML = 'Geolocation is not supported by this browser.';
    }
}

function showError(error) {
    document.getElementById('location').innerHTML = `Error: ${error.message}`;
}

// Call getLocation once to initialize the location
getLocation();

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    marker: { color: 'blue' },
    fuzzyMatch:true,
    limit: 7,
    country: "IN",
    bbox: [68.1766451354, 7.96553477623, 97.4025614766, 35.4940095078],
    proximity: center // Use the global variable here
});

document.getElementById('search').appendChild(geocoder.onAdd(map));
// map.addControl(geocoder);

async function fetchData() {
    let distance = document.getElementById("Distance");
    let duration = document.getElementById("Duration");
    const apiUrl = 'https://api.mapbox.com/directions/v5/mapbox/driving/72.649227%2C23.223288%3B72.579707%2C23.021624?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiaGFydmV5LTAwNyIsImEiOiJjbHJtZDkwa2gwb3N0Mm1rMDV0Zm9xZHgxIn0.12EfayFPHw1SL3CUeq4zMQ';
  
    try {
      const response = await fetch(apiUrl);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();

      console.log('Data from the API:', data);
      dist = (data.routes[0].distance/1000);
      dur = (data.routes[0].duration/60);
      distance.innerHTML = `Distance: ${dist} Km`;
      duration.innerHTML = `Duration: ${dur} Min`;

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Call the function
fetchData();

const draw = new MapboxDraw({
    displayControlsDefault: false,
    // Select which mapbox-gl-draw control buttons to add to the map.
    controls: {
    polygon: true,
    trash: true
    },
    // Set mapbox-gl-draw to draw by default.
    // The user does not have to click the polygon control button first.
    defaultMode: 'simple_select'
    });
map.addControl(draw);

function reversegeocoding(){
    let longrev = document.getElementById("longitude").value;
    let latrev = document.getElementById("latitude").value;
    let apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longrev},${latrev}.json?access_token=${mapboxgl.accessToken}`;
    fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
    
  })
  .then(data => {
    console.log('Data from the API:', data);
    document.getElementById('reversegeocoding').innerHTML = "Reverse geocoded address: " + data.features[0].place_name;
    // console.log(data.features[0].place_name);
    // Use the data as needed
    
    map.setCenter([parseFloat(longrev),parseFloat(latrev)]);

  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
}
