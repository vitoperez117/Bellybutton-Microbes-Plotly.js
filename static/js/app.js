// Read in json then parse
d3.json("samples.json").then(data => {
    
    //assign arrays into variables
    var subjectSamples = data.samples;
    var subjectMetadata = data.metadata;
    
    // Create Option tags for the Dropdown Menu
    var dropDown = d3.select("#selDataset");
    dropDown.selectAll("option")
        .data(subjectSamples)
        .enter()
        .append("option")
        // Set value to index for uniform value callback
        .attr("value", (data, index) => index)
        .text(data => data.id);


    // Add event listener
    d3.select("#selDataset").on("change", updatePlotly);

    function updatePlotly() {

        var subject = dropDown.property("value");

        // slice top 10 OTU ids
        var otuIds = subjectSamples[subject]["otu_ids"].slice(0,10);

        // slice top 10 OTU values
        var otuSamples = subjectSamples[subject]["sample_values"].slice(0,10);
 
        //Create Bar Chart
        var dataBar = {
            type: 'bar',
            x: otuSamples,
            y: otuIds,
            orientation: 'h'
          };
        
        var traceBar = [dataBar]
        
          var layoutBar = {
            title: "Microbe Sample Values",
            height: 700,
            width: 650
          };
    
          Plotly.newPlot('bar', traceBar, layoutBar);

        //Create Bubble Chart 
          var traceBubble = {
            x: subjectSamples[subject]["otu_ids"],
            y: subjectSamples[subject]["sample_values"],
            text: subjectSamples[subject]["otu_labels"],
            mode: 'markers',
            marker: {
                size: subjectSamples[subject]["sample_values"],
            }
          };
          
          var dataBubble = [traceBubble];
          
          var layoutBubble = {
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"},
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('bubble', dataBubble, layoutBubble);


        // Step 4:Create Summary Chart

        // Parse metadata object and push to array
        var summaryData = []
        Object.entries(subjectMetadata[subject]).forEach(([key, value]) => {
            summaryData.push(`${key.toString()}: ${value.toString()}`);
        });

        var summaryChart = d3.select("#sample-metadata")

        // reset chart
        summaryChart.selectAll("p")
            .remove();
        
        // append metadata to chart 
        summaryChart.selectAll("p")
            .data(summaryData)
            .enter()
            .append("p")
            .text(d => d);

    }; 

    function init() {
        var subject = dropDown.property("value");

        // slice top 10 OTU ids
        var ids = subjectSamples[subject]["otu_ids"].slice(0,10);
        var otuIds = ids.map(a => a.toString())
        // slice top 10 OTU values
        var otuSamples = subjectSamples[subject]["sample_values"].slice(0,10);

        // slice top 10 OTU labels for each bar
        var otuLabels = subjectSamples[subject]["otu_labels"].slice(0,10)

        //Create Bar Chart
        var dataBar = {
            type: 'bar',
            x: otuSamples.reverse(),
            y: otuIds.reverse(),
            text: otuLabels,
            // width: otuIds.map(x => x/2)
            orientation: 'h'
          };
        
        var traceBar = [dataBar]
        
          var layoutBar = {
            xaxis: {title: "Sample Values"},
            yaxis: {title: "OTU ID"},
            height: 700,
            width: 650
          };
    
          Plotly.newPlot('bar', traceBar, layoutBar);

        //Create Bubble Chart
          var traceBubble = {
            x: subjectSamples[subject]["otu_ids"],
            y: subjectSamples[subject]["sample_values"],
            text: subjectSamples[subject]["otu_labels"],
            mode: 'markers',
            marker: {
                size: subjectSamples[subject]["sample_values"],
            }
          };
          
          var dataBubble = [traceBubble];
          
          var layoutBubble = {
            xaxis: {title: "OTU IDs"},
            yaxis: {title: "Sample Values"},
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot('bubble', dataBubble, layoutBubble, {scrollZoom: true});


        //Create Summary Chart

        // Parse metadata object and push to array
        var summaryData = []
        Object.entries(subjectMetadata[subject]).forEach(([key, value]) => {
            summaryData.push(`${key.toString()}: ${value.toString()}`);
        });

        var summaryChart = d3.select("#sample-metadata")

        // reset chart
        summaryChart.selectAll("p")
            .remove();
        
        // update summary chart
        summaryChart.selectAll("p")
            .data(summaryData)
            .enter()
            .append("p")
            .text(d => d);

    }; 
    init();

});