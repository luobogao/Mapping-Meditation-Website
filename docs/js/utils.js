// utils.js

// Function to calculate average of an array
function average(arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

// Function to calculate rolling average
function rollingAverage(data, windowSize) {
    let result = [];
    for (let i = 0; i < data.length - windowSize + 1; i++) {
        let window = data.slice(i, i + windowSize);
        let avg = average(window);
        result.push(avg);
    }
    return result;
}

// Function to load data for Graph 1
function loadData1(col) {
    var data = [];
    daniel_data.forEach((item, index) => {
        var gamma = item[col];
        if (gamma !== 0 && index < 60 * 30) { // Adjust the condition as needed
            data.push(gamma);
        }
    });

    // console.log(`Loaded data for ${col}:`, data); // Debugging

    var firstValue = average(data.slice(0, 10));
    const windowSize = 60;
    var avg = rollingAverage(data, windowSize);
    var relative = avg.map((item, index) => ({
        y: 100 * ((item / firstValue) - 1),
        seconds: windowSize + index * (windowSize / 2),
    }));

    // Add a zero point at the beginning
    relative.unshift({ y: 10, seconds: windowSize / 2 });
    
    // console.log(`Relative data for ${col}:`, relative); // Debugging
    return relative;
}

// Function to add a checkbox (if needed in future)
function addCheckbox(container, label, checked, id, margin) {
    const labelElement = container.append("label")
        .style("margin-right", margin || "10px");
    
    labelElement.append("input")
        .attr("type", "checkbox")
        .attr("id", id)
        .property("checked", checked);
    
    labelElement.append("span")
        .text(` ${label}`);
}
