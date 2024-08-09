// Function to run on page load
function init() {
  // get user input
  let nationality = d3.select("#selNationality").property("value");
  // might add filters 
    d3.json("/api/v1.0/get_dropdown").then((data) => {
  
      // Get the names field
      let names = data.map(x => x.Nationality);
  
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
// function to build both charts
function buildCharts(sample) {
  d3.json("/api/v1.0/get_dashboard/<nationality>").then((data) => {

    // Get the samples field
    let nationality_data = data.Nationality; 

    // Filter the samples for the object with the desired sample number
    let sample_info = sample_data.filter(x => x.id === sample)[0];
    console.log(sample_info);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_info.otu_ids;
    let otu_labels = sample_info.otu_labels;
    let sample_values = sample_info.sample_values;

    // Build a Bubble Chart
    let bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
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
      paper_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      plot_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      title: {
        text: 'Bacteria Cultures Per Sample',
        font: {
          color: 'white',
          size: 28
        }},
      xaxis: {
        title: 'OTU ID',
        color: "white"
        },
      yaxis: {
        title: 'Number of Bacteria',
        color: "white"
        },
      showlegend: false
    }

    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", bubble_traces, bubble_layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let y_bar_val = otu_ids.map(x => `OTU: ${x}`);
    //console log
    console.log(y_bar_val);

    // Build a Bar Chart
    // slice and reverse the input 
    let bar_trace = {
      x: sample_values.slice(0,10).reverse(),
      y: y_bar_val.slice(0,10).reverse(),
      type: 'bar',
      marker: {
        colorscale: 'YlOrRd',
        color: sample_values.slice(0,10).reverse()
      },
      text: otu_labels.slice(0,10).reverse(),
      orientation: 'h'
    }

    // Render the Bar Chart
    // Create data array
    let bar_traces = [bar_trace];

    // Bar Chart Layout
    // Apply a title to the layout
    let bar_layout = {
      //background color, code from chat gbt
      paper_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      plot_bgcolor: 'rgba(47, 47, 47, 0.8)', // dark gray
      font: {
          color: 'white'
        },
      title: {
        text: "Top 10 Bacteria Cultures Found",
        font: {
          color: 'white',
          size: 28
        }},
      xaxis: {
        title: 'Number of Bacteria'
        }
    }
    
    // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bar", bar_traces, bar_layout);
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
