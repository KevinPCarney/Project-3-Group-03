// Function to create bubble charts
function buildBubble(data) {


    // Get the driver first and last name, average finish, and number of races they've driven
    let drivers_name = data.bubble_data.map(row => row.first_name + " " + row.last_name);
    let avg_finish = data.bubble_data.map(row => row.avg_finish);
    let number_races = data.bubble_data.map(row => row.number_races);

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
  };

  // Render the Bubble Chart
  // Create data array
  let bubble_traces = [bubble_trace];
  // Bubble Chart Layout
  let bubble_layout = {
    //background color, code from chat gbt
    // paper_bgcolor: 'rgba(64, 78, 77, 1)',    // Outerspace 
    // plot_bgcolor: 'rgba(64, 78, 77, 1)',      // Outerspace
    title: {
      text: 'Races Driven and Average Finish',
      font: {
        color: 'black',
        size: 28
      }},
    xaxis: {
      title: 'Average Finish',
      color: 'black'
      },
    yaxis: {
      title: 'Number of Races Driven',
      color: 'black'
      },
    showlegend: false
  }
  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bubble", bubble_traces, bubble_layout);
};

// function to create a horizontal bar chart
function buildBar(data) {
    // Build a Bar Chart
    // slice and reverse the input 
    // Horizontal bar chart where the y is Drivers Name and x is the number of 1st place finishes
    let drivers_name = data.bar_data.map(row => row.first_name + " " + row.last_name);
    let drivers_last = data.bar_data.map(row => row.last_name);
    let winNumber = data.bar_data.map(row => row.wins)

    let bar_trace = {
      x: winNumber.slice(0,10).reverse(),
      y: drivers_last.slice(0,10).reverse(),
      type: 'bar',
      marker: {
        colorscale: 'YlOrRd',
        color: "#641211"
      },
      text: drivers_name.slice(0,10).reverse(),
      orientation: 'h'
    }

    // Render the Bar Chart
    // Create data array
    let bar_traces = [bar_trace];

    // Bar Chart Layout
    // Apply a title to the layout
    let bar_layout = {
      font: {
          color: 'black'
        },
      title: {
        text: "Driver Wins by Nationality",
        font: {
          color: 'black',
          size: 28
        }},
      xaxis: {
        title: 'Driver'
        }
    }
    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", bar_traces, bar_layout);
  }

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
      buildBar(allNationality);
      buildBubble(allNationality);
    });
}

function init_dashboard(){
  // get user input
  let nationality = d3.select("#selNationality").property("value");

  let url_dash = `/api/v1.0/get_dashboard/${nationality}`

  d3.json(url_dash).then(function(data){

    // Build charts each time a new nationality is selected
    buildBar(data);
    buildBubble(data);
    buildBar(data);
  })


}

// event listener
function optionChanged() {
  let nationality = d3.select("#selNationality");

  let url_dash = `/api/v1.0/get_dashboard/${nationality}`

  d3.json(url_dash).then(function(data){

    // Build charts each time a new nationality is selected
    init_dashboard(data)
  })

}

// Initialize the dashboards
init_dashboard();
init_dropdown();
