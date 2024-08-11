// Function to create bubble charts
function buildBubble(newData) {
  // get user input
  let nationality = d3.select("#selNationality");

    // Filter the samples for the object with the desired sample number
    //THIS FIELD
    console.log(newData)
    let driver_info = newData.filter(x => x.nationality === nationality);
    console.log(driver_info);


    // Get the otu_ids, otu_labels, and sample_values
    let drivers_name = driver_info.last_name;
    let avg_finish = driver_info.avg_finish;
    let number_races = driver_info.number_races;

   // Build a Bubble Chart
   let bubble_trace = {
    x: avg_finish,
    y: number_races,
    text: drivers_name,
    mode: 'markers',
    marker: {
      color: number_races,
      size: avg_finish,
      colorscale: 'YlOrRd',
      type: 'heatmap'
    }
  }
  // Render the Bubble Chart
  // Create data array
  let bubble_traces = [bubble_trace];
  // Bubble Chart Layout
  let bubble_layout = {
    //background color, code from chat gbt
    // paper_bgcolor: 'rgba(64, 78, 77, 1)',    // Outerspace 
    // plot_bgcolor: 'rgba(64, 78, 77, 1)',      // Outerspace
    title: {
      text: 'Wins and Average Finish',
      font: {
        color: 'black',
        size: 28
      }},
    xaxis: {
      title: 'Drivers',
      color: 'black'
      },
    yaxis: {
      title: 'Average Finish',
      color: 'black'
      },
    showlegend: false
  }
  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bubble", bubble_traces, bubble_layout);
};

// function buildBar(data) {
//     // For the Bar Chart, map the otu_ids to a list of strings for your yticks
//     let y_bar_val = otu_ids.map(x => `OTU: ${x}`);
//     //console log
//     console.log(y_bar_val);

//     // Build a Bar Chart
//     // slice and reverse the input 
//     let bar_trace = {
//       x: number_races.slice(0,10).reverse(),
//       y: drivers_name.slice(0,10).reverse(),
//       type: 'bar',
//       marker: {
//         colorscale: 'YlOrRd',
//         color: sample_values.slice(0,10).reverse()
//       },
//       text: drivers_name.slice(0,10).reverse(),
//       orientation: 'h'
//     }

//     // Render the Bar Chart
//     // Create data array
//     let bar_traces = [bar_trace];

//     // Bar Chart Layout
//     // Apply a title to the layout
//     let bar_layout = {
//       //background color, code from chat gbt
//       // paper_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
//       // plot_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
//       font: {
//           color: 'white'
//         },
//       title: {
//         text: "Driver Wins by Nationality",
//         font: {
//           color: 'white',
//           size: 28
//         }},
//       xaxis: {
//         title: 'Driver'
//         }
//     }
    
//     // Render the plot to the div tag with id "plot"
//     Plotly.newPlot("bar", bar_traces, bar_layout);
//   }
  
  function createMap(){
  
}

// function to run on page load
function init_dashboard() {
  // might add filters 
    d3.json("/api/v1.0/get_dropdown").then((data) => {

      //print received data
      console.log(data);
  
      // Get the nationality field
      let names = data.map(x => x.nationality);
  
      // Select the dropdown with id of `#selNationality`
      let dropdown = d3.select("#selNationality");
  
      // Use the list of nationalities to populate the select options
      for (let i=0; i < names.length; i++){
  
        // Get each individual nationality (for clarity)
        let name = names[i];
  
        // append the option list to dynamically build the dropdown list
        dropdown.append("option").text(name);
      }
  
      // Get the first nationality from the list
      let allNationality = names;
  
      // Build charts and metadata panel with the first nationality
      // buildBar(allNationality);
      buildBubble(allNationality);
      // buildMetadata(firstSample);
    });
}


// Function for event listener
function optionChanged(newNationality) {
  // get user input
  let nationality = d3.select("#selNationality").property("value");

  let url_dash = `/api/v1.0/get_dashboard/${nationality}`

  d3.json(url_dash).then(function(data){

    // Build charts and metadata panel each time a new sample is selected
    // buildBar(data.bar_data);
    buildBubble(data.bubble_data)
    buildMetadata(newNationality);
  })
}

// Initialize the dashboard
init_dashboard();
