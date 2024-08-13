
function buildSunburst(data) {
  let trace = {
    "type": "sunburst",
    "labels": data.map(row => row.label),
    "parents": data.map(row => row.parent),
    "values":  data.map(row => row.num_races),
    "leaf": {"opacity": 0.4},
    "marker": {"line": {"width": 2}},
    "branchvalues": 'total'
  }

  let traces = [trace];

  let layout = {
    "margin": {"l": 0, "r": 0, "b": 0},
    title: `Drivers by Team`,
    colorway: ["#404E4D", "#641211", "#9D948B", "#E10600"]
  }

  Plotly.newPlot("sunburst", traces, layout)
}







function init_sunburst (){
  // get user input
  let min_year = d3.select("#min_year").property("value");
  min_year = parseInt(min_year);

  let max_year = d3.select("#max_year").property("value");
  max_year = parseInt(max_year);

  let url = `/api/v1.0/get_sunburst/${min_year}/${max_year}`

  d3.json(url).then(function(data){

    console.log(data);
    // Build charts and metadata panel each time a new sample is selected
    // buildBar(data.bar_data);
    buildSunburst(data);
  });

}

// event listener for CLICK on Button
d3.select("#filter").on("click", init_sunburst);

init_sunburst()