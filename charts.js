function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var dataSamples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var desSamples = dataSamples.filter(sampleObj => sampleObj.id == sample); 


    //  5. Create a variable that holds the first sample in the array.
    var first = desSamples[0];


    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = first.otu_ids;
    var otuLabels = first.otu_labels;
    var otuValues = first.sample_values;


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var barValues = otuValues.slice(0,10).reverse();

    var yticks = otuIds.map(name =>"OTU " + name).slice(0,10).reverse();

    // 8. Create the trace for the bar chart. 
    var barData = [{
      
      x: barValues,
      y: yticks,

      type: "bar",
      orientation: "h"
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
     
    };

    
    Plotly.newPlot("bar", barData, barLayout);

    var bubbleData = [{
      x: otuIds,
      y: otuValues,
      text: otuLabels,
      hovermode: "closest",
      type: 'scatter',
      mode: 'markers',
      
      marker:{
        color: otuIds,
        size: otuValues,
        colorscale: "YlGnBu"
      }

    }]

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    }
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    

    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var sampleMetadata = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    var wFreq = sampleMetadata.wfreq

    var gaugeData = [
      {
        type:"indicator",
        mode:"gauge+number",
        value: wFreq,
        title: {text: "<b> Belly Button Washing Frequency </b> <br> Scrubs Per Week"},
        gauge: { 
          axis: {range: [0, 10], dtick: "2"}, 
          bar: {color: "black"},
          steps:[
            {range: [0,2], color:"red"},
            {range: [2, 4], color: "orange"},
            {range: [4, 6], color: "yellow"},
            {range: [6, 8], color: "greenyellow"},
            {range: [8, 10], color: "green"},
          ],
        },
      }
    ]

    var gaugeLayout = [{

    }]

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
  });
}
