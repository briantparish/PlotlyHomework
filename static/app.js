//Function to display the demographic information for selected value in dropdown
function displayDemographics(name) {
    
    d3.json("samples.json").then(json_data => {
        
        var metadata = json_data.metadata;
        //console.log(metadata);

        //filter the metadata to match the ID in metadata to the name selected 
        var filtered = metadata.filter(meta => meta.id.toString() == name)[0];
        var demographicData = d3.select("#sample-metadata");
        
        demographicData.html(""); //Clear all html in #sample-metadata id
        demographicData.append("ul");
        Object.entries(filtered).forEach((key) => { 
            demographicData.append("li").text(`${key[0]}:  ${key[1]}`);    
        });
    });
}

//generage the plots
function genPlots(id) {
    //open json file then generate plots when it opens
    d3.json("samples.json").then (json_data =>{
        //Filter json data by patient id
        filtered =  json_data.samples.filter(patient => patient.id == id)[0];
        console.log(filtered);
        
        //slice first 10 otu ids
        var top10ids = filtered.otu_ids.slice(0,10).reverse();
        
        console.log("IDs: " + top10ids);
        //slice first 10 otu values
        var top10values =  filtered.sample_values.slice(0,10).reverse();
        console.log("Values: " + top10values);
        
        //slice first 10 otu labels
        var top10labels =  filtered.otu_labels.slice(0,10).reverse();
        console.log ("labels: "  + top10labels);
        
        //Bar Chart
        //trace
        var tracebar = {
            x: top10values,
            y: top10ids.map(l => "OTU " + l), //Add "OTU" text to label,
            text: top10labels,
            marker: {
            color: "#337ab7"},
            type:"bar",
            orientation: "h",
        };
        //data
        var dataBar = [tracebar];
        //layout
        var layoutBar = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: { t: 25, r: 25, l: 25, b: 25 }
        };
        //plot
        Plotly.newPlot("bar", dataBar, layoutBar);

        //Gauge plot
        //data
        var wfreq = json_data.metadata.filter(patient => patient.id == id)[0];
        wfreq = wfreq.wfreq;
        var dataGauge = [{
            type: "indicator",
            mode: "gauge+number+delta",
            value: wfreq,
            title: { text: "Belly Button Washes Per Week", font: { size: 24 } },
            delta: { reference: 3, increasing: { color: "orange" } },
            gauge: {
              axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
              bar: { color: "darkblue" },
              bgcolor: "white",
              borderwidth: 2,
              bordercolor: "gray",
              steps: [
                { range: [0, 2], color: "cyan" },
                { range: [0, 10], color: "LightBlue" }
              ],
              threshold: {
                line: { color: "Green", width: 4 },
                thickness: 0.75,
                value: 3
              }
            }
          }
        ];
        //layout
        var layoutGauge = { 
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white"
        };
        Plotly.newPlot('gauge', dataGauge, layoutGauge);

        // Bubble Chart
        //Trace
        var traceBubble = {
            x: filtered.otu_ids,
            y: filtered.sample_values,
            mode: "markers",
            marker: {
                size: filtered.sample_values,
                color: filtered.sample_values,
                sizeref: 1.4
            },
            text:  filtered.otu_labels
        };

        // Data 
        var dataBubble = [traceBubble];

        // Layout
        var layoutBubble = {
            xaxis:{title: "OTU ID"},
            margin: { t: 25, r: 25, l: 25, b: 25 }
        };

        //Plot
        Plotly.newPlot("bubble", dataBubble, layoutBubble); 
    });
}
 

//On event "optionChanged" in html, update the demographic information for selected value
function optionChanged(name) {
    console.log(`Fetching data and plots for Test Subject: ${name}`);
    displayDemographics(name);
    genPlots(name);
}

function initialize() {
    var dropdown = d3.select("#selDataset");
    
    //Use a promise to wait for the json file to open, then process data
    d3.json("samples.json").then((data) => {
        
        //SelectAll "option" in "select" tag, which is none
        dropdown.selectAll("option")
            .data(data.names) //use the names list in the json file to populate names
            .enter()
            .append("option")
            .attr("value", name => {
                return name;
            })
            .text(name => {
                return name;
            });

        //display the demographics of the first name in json file by index 0
        displayDemographics(data.names[0]);
        genPlots(data.names[0]);
    });
}

initialize();
