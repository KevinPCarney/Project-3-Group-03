function createMap(data){
    // create the map html
    let mapContainer = d3.select("#map");

    // Empty the map_container div
    mapContainer.html("");

    // Append a div with id "map" inside the map_container div
    mapContainer.append("div").attr("id", "map");

    // base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
    
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // map
    // Create overlay layer
    let markers = L.markerClusterGroup();
    let heatArray = [];
  
    for (let i = 0; i < data.length; i++) {
      // extract coordinates
      let row = data[i];
      let latitude = row.latitude;
      let longitude = row.longitude;    

      let point = [latitude, longitude];

      // make marker
      let marker = L.marker(point);
      let popup = `<h3>${row.circuit_name}</h3><hr><h5>${row.city}, ${row.country}</h5>`;
      marker.bindPopup(popup);
      markers.addLayer(marker);

      // add to heatmap
      heatArray.push(point);
      }
  
    // Create layer
    let heatLayer = L.heatLayer(heatArray);
    
    // // Create the overlay layer
    // let geoLayer = L.geoJSON(geoData, {
    //   style: function(feature){
    //     return {
    //       color: '#1B1B1B',
    //     //   fillColor: chooseColor(feature.properties.borough),
    //       fillOpacity: .5,
    //       weight: 1.5
    //   }}
    // });
    
    // Step 3: BUILD the Layer Controls
  
    // Only one base layer can be shown at a time.
    let baseLayers = {
      Street: street,
      Topography: topo
    };
  
    let overlayLayers = {
      Markers: markers,
      Heatmap: heatLayer
    }
  
  
    // Step 4: INIT the Map
    let myMap = L.map("map", {
      center: [40.7128, -74.0059],
      zoom: 11,
      layers: [street, markers]
    });
  
  
    // Step 5: Add the Layer Control filter + legends as needed
    L.control.layers(baseLayers, overlayLayers).addTo(myMap);
  }

function init() {

  // Assemble the API query URL.
  let url = `/api/v1.0/get_map`;

  d3.json(url).then(function (data) {
      createMap(data)
  });
}

// function if we are doing it 
// function init() {
//   // extract user input
//   let country = d3.select("#country_filter").property("value");

//   // Assemble the API query URL.
//   let url = `/api/v1.0/get_map/${country}`;

//   d3.json(url).then(function (data) {
//       createMap(data)
//   });
// }

//   // Function for event listener
// function optionChanged(newCountry) {

//   // Build map each time a country is selected
//   createMap(newCountry);
// };
  
init();