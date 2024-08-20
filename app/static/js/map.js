// Create a new cluster icon function
//chat gbt
function createClusterIcon(cluster) {
let childCount = cluster.getChildCount();
  let color = "#404E4D";

  return new L.DivIcon({
    html: `<div class="marker-cluster" style="background-color: ${color};">${childCount}</div>`,
    className: 'marker-cluster',
    iconSize: L.point(40, 40)
  });
 }

function createMap(data){
  // create the map html
  let mapContainer = d3.select("#map-container");

  // Empty the map_container div
  mapContainer.html("");

  // Append a div with id "map" inside the map_container div
  mapContainer.append("div").attr("id", "map");

  // base layers
  // street map
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  //Positron - chat gbt
  let positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  });

  // map
  // Create overlay layer
  
  // Clustered Markers
  let markers = L.markerClusterGroup({
    iconCreateFunction: createClusterIcon
  });

  // Non Clusterd Markers
  let nonClusteredMarkers = L.layerGroup();

  let heatArray = [];

  for (let i = 0; i < data.length; i++) {
    // extract coordinates
    let row = data[i];
    let latitude = row.latitude;
    let longitude = row.longitude;    

    let point = [latitude, longitude];

    // make marker
    let marker = L.marker(point, { 
      icon: L.ExtraMarkers.icon({
        shape: 'penta',
        markerColor: "#E10600",
        prefix: 'fa',
        icon: 'fa-spinner',
        iconRotate: 7,
        extraClasses: 'fa-spin',
        svg: true
      })
    });

    let popup = `<h3>${row.circuit_name}</h3><hr><h5>${row.city}, ${row.country}</h5>`;
    marker.bindPopup(popup);

    // Add marker clustered and non-clustered layers
    markers.addLayer(marker);
    nonClusteredMarkers.addLayer(marker);

    // add to heatmap
    heatArray.push(point);

  };
  

  // Create layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 70,
  });

  // Step 3: BUILD the Layer Controls
  // Base Controls
  let baseLayers = {
    Street: street,
    Positron: positron
  };

  // Overlay Controls
  let overlayLayers = {
    "Clustered": markers,
    "Non Clustered": nonClusteredMarkers,
    Heatmap: heatLayer
  };

  // Step 4: INIT the Map
  let myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
    layers: [positron, markers]
  });

  // Step 5: Add the Layer Control filter + legends as needed
  L.control.layers(baseLayers, overlayLayers).addTo(myMap);
}


// function to fetch data and build map
function init() {
  // extract user input
  let country = d3.select("#country_filter").property("value");

  // Assemble the API query URL.
  let url = `/api/v1.0/get_map/${country}`;

  d3.json(url).then(function (data) {
      createMap(data)
  });
}

// Function for event listener
function optionChanged(newCountry) {

  // Build map each time a country is selected
  init();
}
  
init();
