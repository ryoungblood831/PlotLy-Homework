function init() {
    // creating a variable to use dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Use the D3 library to read in samples.json to fill menu with "names"
    d3.json("samples.json").then((data) => {
        console.log(data);
        var names = data.names;
       data =  fetch("samples.json")

        names.forEach((sample) => {
            dropdownMenu.append("option")
                .text(sample)
                .property("value", sample);    
        });
        
        var FirstDisplay = names[0];
        build_barchart( FirstDisplay);
        build_bubble(FirstDisplay);
        build_meta(FirstDisplay);
    });
}

function optionChanged(new_name) {
    //plotting charts when changing the dropdown menu
    build_barchart(new_name);
    build_bubble(new_name);
    build_meta(new_name);
}

function build_barchart(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data);
        //  JSON file from selected "name" 
        var samples = data.samples;
        var miniJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = miniJSON[0];

        // VAR used to select object
        var otu_ids = object.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        // create variable barchart and data
        var BARchart_layout = {
            title: "Top 10 Bacterial Cultures in the Belly Button Biodiversity",
            margin: {t: 40, l: 140}
        };

        // .splice() => cut out data and .reverse() => . This is to organize from the smallest number
        var BARchart_trace1 = [
            {
                y: otu_ids.splice(0, 10).map(otuID => `OTU ID: ${otuID}`).reverse(),
                x: sample_values.splice(0, 10).reverse(), 
                text: otu_labels.splice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        // show bar chart
        Plotly.newPlot("bar", BARchart_trace1, BARchart_layout);
    }); 
} 

function build_bubble(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data);
        // pull one object from JSON for dropdown selected 
        var samples = data.samples;
        var smallJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = smallJSON[0];

        // create variables and hold from one objecxt
        var otu_ids = object.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        // Variable is created in bar chart
        var bubblechart_layout = {
            title: "OTUs Occurance",
            showlegend: false,
            height: 500,
            width: 1200
        };

        // layout of bubble chart
        
        var bubblechart_trace1 = [
            {
                y: sample_values,
                x: otu_ids,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                }
            }
        ];
        // Show barchart function
        Plotly.newPlot("bubble", bubblechart_trace1, bubblechart_layout);

    });
}

function build_meta(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data);
        var metadata = data.metadata;
        var smallJSON2 = metadata.filter(sampleID => sampleID.id == sample);
        var object2 = smallJSON2[0];

        // display the selection code
        var Display = d3.select("#sample-metadata");

        // clear display area
        Display.html("");

        // use Object.entries to create new row
        Object.entries(object2).forEach(([key, value]) => {
            Display.append("p").text(`${key}:${value}`);
        });
    }); 
} 


init()