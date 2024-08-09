// Function to run on page load
function init() {
  // get user input
  let nationality = d3.select("#selNationality").property("value");
  // might add filters 
    request.then((data) => {
  
      // Get the names field
      let names = data.names;
  
      // Select the dropdown with id of `#selDataset`
      let dropdown = d3.select("#selNationality");
  
      // Use the list of sample names to populate the select options
      for (let i=0; i < names.length; i++){
  
        // Get each individual name (for clarity)
        let name = names[i];
  
        // append the option list to dynamically build the dropdown list
        dropdown.append("option").text(name);
      }
  
      // Get the first sample from the list
      let firstSample = names[0];
  
      // Build charts and metadata panel with the first sample
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
}

function createMap(){
  
}

// Function for event listener
function optionChanged(newNationality) {

    // Build charts and metadata panel each time a new sample is selected
    buildCharts(newNationality);
    buildMetadata(newNationality);
  };
  
  // Initialize the dashboard
  init();
