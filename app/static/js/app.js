// Function to create bubble charts
function buildBubble(data) {
  // get user input
  // let nationality = d3.select("#selNationality").property("value");

    // Filter the samples for the object with the desired sample number
    //THIS FIELD
    // console.log("**")
    // console.log(d3.map(data.bubble_data).values())
    // console.log("**")
    // let driver_info = newData.map(x => x.nationality);
    // console.log(driver_info);


    // Get the otu_ids, otu_labels, and sample_values
    let drivers_last = data.bubble_data.map(row => row.last_name);
    let drivers_first = data.bubble_data.map(row => row.first_name);
    let avg_finish = data.bubble_data.map(row => row.avg_finish);
    let number_races = data.bubble_data.map(row => row.number_races);

    let drivers_name = `${drivers_first} ${drivers_last}`

   // Build a Bubble Chart
   let bubble_trace = {
    x: avg_finish,
    y: number_races,
    text: drivers_last,
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

// // function to create a horizontal bar chart
// function buildBar(data) {

//     // For the Bar Chart, map the otu_ids to a list of strings for your yticks
//     let winner_info = data.map(x => x.nationality);
//     //console log
//     console.log(winner_info);

//     // Build a Bar Chart
//     // slice and reverse the input 
//     // Horizontal bar chart where the y is Drivers Name and x is the number of 1st place finishes
//     let driversName = `${winner_info.first_name} ${winner_info.last_name}`

//     let bar_trace = {
//       x: winNumber.slice(0,10).reverse(),
//       y: driversName.slice(0,10).reverse(),
//       type: 'bar',
//       marker: {
//         colorscale: 'YlOrRd',
//         color: sample_values.slice(0,10).reverse()
//       },
//       text: driversName.slice(0,10).reverse(),
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

// function to run on page load
function init_dropdown() {
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
      let allNationality = names[0];
  
      // Build charts and metadata panel with the first nationality
      // buildBar(allNationality);
      buildBubble(allNationality);
      // buildMetadata(firstSample);
    });
}

function init_dashboard(){
  // get user input
  let nationality = d3.select("#selNationality").property("value");

  let url_dash = `/api/v1.0/get_dashboard/${nationality}`

  d3.json(url_dash).then(function(data){

    // Build charts and metadata panel each time a new sample is selected
    // buildBar(data.bar_data);
    buildBubble(data);
  })


}

// event listener
function optionChanged() {
  let nationality = d3.select("#selNationality");

  let url_dash = `/api/v1.0/get_dashboard/${nationality}`

  d3.json(url_dash).then(function(data){

    // Build charts and metadata panel each time a new sample is selected
    init_dashboard(data)
  })

}

// Initialize the dashboard
init_dashboard();
init_dropdown()
