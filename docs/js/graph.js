// graph.js

// Graph dimensions and margins
const widthGraph = window.innerWidth / 2.5;
const heightGraph = (window.innerHeight - 200) * 0.8;
const marginGraph = { top: 20, right: 20, bottom: 30, left: 40 };
const yAxisMarginGraph = 40;

// SVG container for graphs
let svgGraph = null;

// Only Graph 1 data is needed
let graph1data = [
    loadData1("s1"),
    loadData1("s2"),
    loadData1("s3"),
    loadData1("s4"),
    loadData1("s5"),
    loadData1("s6"),
    loadData1("s7")
];

// Build the graph container
function buildChartDivs() {
    const container = d3.select('#svg-container');
    container.style("position", "relative");

    // Title for the graph
    const titleDiv = container.append("div")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("margin-bottom", "10px");

    titleDiv.append("p")
        .attr("id", "graph-title")
        .text("Meditation Metrics Over Time") // Replace with your desired title
        .style("font-style", "italic")
        .style("opacity", 0.6)
        .style("font-size", "14px");

    // Append the SVG for the graph
    svgGraph = container.append('svg')
        .attr('width', widthGraph)
        .attr('height', heightGraph);
}

function buildGraph1() {
    const colors = ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#ff00ff", "#ff69b4"];
    svgGraph.selectAll("*").remove(); // Clear any existing content
    d3.selectAll(".legend").remove(); // Remove any legends if present

    console.log("BUILDING GRAPH")

    var dates = ["March 6", "March 17", "March 21", "April 13", "April 16"];

    // Add graph info (if applicable)
    var info = d3.select("#info");
    if (!info.empty()) {
        info.selectAll("*").remove();
        info.style("display", "flex").style("justify-content", "space-around").style("width", widthGraph);
        graph1data.forEach((data, index) => {
            if (index < dates.length) { // Ensure dates align with data
                info.append("span")
                    .text(dates[index])
                    .style("color", colors[index])
                    .style("margin-right", "10px");
            }
        });
    }

    var dataSets = graph1data; // All datasets for Graph 1

    // Determine the maximum 'seconds' value across all datasets for the x-axis domain
    const maxSeconds = d3.max(dataSets, dataset => d3.max(dataset, d => d.seconds)) || 60 * 30;

    const x = d3.scaleLinear()
        .domain([0, maxSeconds])
        .range([marginGraph.left, widthGraph - marginGraph.right - yAxisMarginGraph]);

    // Determine the y-axis range to include negative and positive values
    const maxY = d3.max(dataSets, dataset => d3.max(dataset, d => d.y)) || 500;
    const minY = -50

    const y = d3.scaleLog() // Changed to a linear scale
        .domain([10, maxY])
        .range([heightGraph - marginGraph.bottom - 30, marginGraph.top]);

    const line = d3.line()
        .x(d => x(d.seconds))
        .y(d => y(d.y))
        //.defined(d => d.y > 10) // Exclude points where y = 0
        .curve(d3.curveMonotoneX);

    const xAxis = g => g
        .attr('transform', `translate(0,${heightGraph - marginGraph.bottom - 30})`)
        .call(d3.axisBottom(x).tickFormat(d => `${Math.round(d / 60)}m`))
        .call(g => g.select(".domain").remove());

    const yAxis = g => g
        .attr('transform', `translate(${widthGraph - marginGraph.right - 30},0)`)
        .call(d3.axisRight(y).ticks(5).tickFormat(d => `${d}%`))
        .call(g => g.select(".domain").remove());

    // Append x-axis
    svgGraph.append('g').call(xAxis)
        .append('text')
        .attr('x', widthGraph / 2)
        .attr('y', 30)
        .attr('fill', "#b8d7ff")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text('Minutes of Meditation');

    // Append y-axis
    svgGraph.append('g').call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -heightGraph / 2)
        .attr('y', -35)
        .attr('fill', "#b8d7ff")
        .style("font-size", "16px")
        .style("text-anchor", "middle")
        .text('Variance (%)');

    // Append paths for each dataset
    svgGraph.selectAll(".line")
        .data(dataSets)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", (d, i) => colors[i % colors.length])
        .attr("stroke-width", "3px")
        .attr("d", line)
        .each(function (d, i) {
            const totalLength = this.getTotalLength();
            d3.select(this)
                .attr("stroke-dasharray", totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2000) // Fixed duration; adjust as needed
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        });

    // Optional: Style text elements
    svgGraph.selectAll("text").style("font-size", "12px");
}



// Initialize the graph
function initializeGraph() {
    if (!svgGraph) {
        console.log("Initializing graph...");
        buildChartDivs(); // Prepare the container for the graph
        buildGraph1();     // Render the first graph
    }
}

// Export the initializeGraph function if needed elsewhere
// window.initializeGraph = initializeGraph;
