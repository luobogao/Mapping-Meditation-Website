// Debugging: Log when the script starts
console.log("script.js is loaded and running.");

// === 1. Define Fade-In Threshold ===
const fadeInThreshold = 0.2; // Adjust as needed

// Apply global styles
d3.select("body")
    .style("margin", "0")
    .style("padding", "0")
    .style("background-color", "#121212")
    .style("color", "#ffffff")
    .style("font-family", "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif")
    .style("line-height", "1.6");

// Append styles for fade-in and responsiveness
d3.select("head").append("style").text(`
    .fade-in-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 1s ease-out, transform 1s ease-out;
        will-change: opacity, transform;
    }

    .fade-in-section.visible {
        opacity: 1;
        transform: translateY(0);
    }

    @media (max-width: 768px) {
        .content-container {
            flex-direction: column !important;
        }
        .right-div {
            width: 100% !important;
            margin-top: 20px;
        }
        #svg-container {
            height: 300px;
        }
    }
`);

// Define the main container
const mainContainer = d3.select("#main-container")
    .style("display", "flex")
    .style("flex-direction", "column")
    .style("align-items", "center")
    .style("width", "100%")
    .style("box-sizing", "border-box");

// Function to create sections
function createSection(id, title, content, additionalContent = null, includeGraph = false) {

    console.log("--> Creating section: " + id);

    const section = mainContainer.append("section")
        .attr("id", id)
        .attr("class", "fade-in-section")
        .style("width", "100%")
        .style("max-width", "1200px")
        .style("padding", "60px 20px")
        .style("box-sizing", "border-box")
        .style("border-bottom", "1px solid #333");

    // Title
    section.append("h1")
        .text(title)
        .style("font-size", "48px")
        .style("margin-bottom", "40px")
        .style("text-align", "center");

    // Content container
    const contentContainer = section.append("div")
        .attr("class", "content-container")
        .style("display", "flex")
        .style("flex-direction", "row")
        .style("align-items", "flex-start")
        .style("width", "100%")
        .style("box-sizing", "border-box")
        .style("gap", "40px");

    // Left Div (2/3)
    const leftDiv = contentContainer.append("div")
        .attr("class", "left-div")
        .style("flex", "2")
        .style("max-width", "800px");
    
    const rightDiv = contentContainer.append("div")
                .attr("class", "right-div")
                .style("flex", "1")
                .style("display", "flex")
                .style("justify-content", "center")
                .style("align-items", "center");



    // TEXT
    if (content) {
        leftDiv.append("p")
            .text(content)
            .style("font-size", "20px")
            .style("line-height", "1.6");
    }

    // GRAPH
    if (includeGraph) {
        console.log("ADDING GRAPH")
        rightDiv.append("div")
            .attr("id", "svg-container")
            .style("width", "100%")
            .style("height", "500px") // Adjust height as needed
            .style("margin-top", "40px");
    }

    // IMAGE
    if (additionalContent) {
        if (additionalContent.type === "image") {
            // Right Div (1/3) for image
            

            rightDiv.append("img")
                .attr("src", additionalContent.src)
                .attr("alt", additionalContent.alt)
                .style("width", "100%")
                .style("height", "auto")
                .style("border-radius", "8px")
                .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
        } else if (additionalContent.type === "phases") {
            // Add phases below the main content in leftDiv
            const phasesContainer = leftDiv.append("div")
                .style("display", "flex")
                .style("flex-direction", "column")
                .style("margin-top", "30px");

            additionalContent.phases.forEach(phase => {
                const phaseDiv = phasesContainer.append("div")
                    .style("display", "flex")
                    .style("align-items", "center")
                    .style("margin-bottom", "20px");

                // Add symbol
                phaseDiv.append("div")
                    .html("&#10004;") // Unicode checkmark
                    .style("font-size", "24px")
                    .style("color", phase.completed ? "#27ae60" : "#e74c3c")
                    .style("margin-right", "15px");

                // Add phase text
                phaseDiv.append("div")
                    .html(phase.text)
                    .style("font-size", "18px");
            });
        }
    }

    // Responsive adjustments
    section.append("style").text(`
        @media (max-width: 768px) {
            #${id} .content-container {
                flex-direction: column !important;
            }
            #${id} .right-div {
                width: 100% !important;
                margin-top: 20px;
            }
            #${id} #svg-container {
                height: 300px; /* Adjust for smaller screens */
            }
        }
    `);
}

// Function to create image gallery
function createImageGallery(folderPath, container) {
    console.log("Creating image gallery.");
    const images = [
        "helen1.png",
        "helen2.png"
        // Add more image filenames as needed
    ];

    const gallery = container.append("div")
        .attr("id", "image-gallery")
        .style("display", "grid")
        .style("grid-template-columns", "repeat(auto-fit, minmax(150px, 1fr))")
        .style("gap", "10px")
        .style("padding", "20px")
        .style("width", "100%")
        .style("box-sizing", "border-box")
        .style("background-color", "#1e1e1e");

    images.forEach(image => {
        gallery.append("img")
            .attr("src", `${folderPath}/${image}`)
            .attr("alt", image)
            .style("width", "100%")
            .style("height", "auto")
            .style("border-radius", "8px")
            .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)");
    });

    console.log("Image gallery created.");
}

// Function to initialize Intersection Observer
function initFadeInOnScroll() {
    const faders = d3.selectAll(".fade-in-section").nodes();

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }

            // Initialize graph when "purpose" section is visible
            if (entry.target.id === "purpose" && entry.isIntersecting) {
                initializeGraph();
            }
        });
    }, { threshold: fadeInThreshold });

    faders.forEach(fader => {
        observer.observe(fader);
    });
}

// === 3. Integrate Graph Building Code ===

// Graph variables
let svgGraph = null;
const widthGraph = (window.innerWidth / 2.5);
const heightGraph = (window.innerHeight - 200) * 0.8;
const marginGraph = { top: 20, right: 20, bottom: 30, left: 40 };
const yAxisMarginGraph = 40;

// Example data variables (ensure these are defined in data.js)
let graph1data = [
    loadData1("s1"),
    loadData1("s2"),
    loadData1("s3"),
    loadData1("s4"),
    loadData1("s5"),
    loadData1("s6"),
    loadData1("s7")
];
let graph2data = daniel_gamma_af8_variance; // Ensure this variable exists in data.js
let graph3data = all_users_af8; // Ensure this variable exists in data.js

// Initialize graph when "purpose" section is visible
function initializeGraph() {
    if (svgGraph) return; // Prevent multiple initializations
    buildChartDivs();
    buildGraph1();
}

// Build chart divs
function buildChartDivs() {
    const container = d3.select('#svg-container');
    container.style("position", "relative");

    // Title
    const titleDiv = container.append("div")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("margin-bottom", "10px");

    titleDiv.append("p")
        .attr("id", "graph-title")
        .text("Default Graph Title") // Replace with actual title if available
        .style("font-style", "italic")
        .style("opacity", 0.6)
        .style("font-size", "14px");

    // SVG
    svgGraph = container.append('svg')
        .attr('width', widthGraph)
        .attr('height', heightGraph);
}


// Example loadData1 function
function loadData1(col) {
    var data = [];
    daniel_gamma_af8.map((item, index) => {
        var gamma = item[col];
        if (gamma != 0 && index < 60 * 30) {
            data.push(gamma);
        }
    });

    var firstValue = average(data.slice(0, 10));
    const windowSize = 60;
    var avg = rollingAverage(data, windowSize);
    var relative = avg.map((item, index) => {
        return { y: 100 * ((item / firstValue) - 1), seconds: windowSize + index * (windowSize / 2) };
    });
    // Add zero to the beginning of the array
    relative.unshift({ y: 10, seconds: windowSize / 2 });

    return relative;
}

// Utility functions
function average(arr) {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
}

function rollingAverage(data, windowSize) {
    let result = [];
    for (let i = 0; i < data.length - windowSize + 1; i++) {
        let window = data.slice(i, i + windowSize);
        let avg = average(window);
        result.push(avg);
    }
    return result;
}

// Create Sections
createSection(
    "project-name",
    "Mapping Meditation Project",
    "Exploring the intersection of EEG technology and artificial intelligence to uncover the unique meditation styles of expert practitioners.",
    {
        type: "image",
        src: "images/phones.png",
        alt: "Screenshots of the application"
    }
);

// Section 2: Purpose (with Graph)
createSection(
    "purpose",
    "Purpose",
    "Our goal is to utilize EEG data from experienced meditators and apply AI algorithms to identify distinct meditation styles. By analyzing brainwave patterns, we aim to understand the neural mechanisms underlying different meditation practices.",
    null, // No additional content like images or phases
    true  // Include graph in this section
);

// Section 3: User Examples
createSection(
    "user-examples",
    "User Examples",
    "Here are some insights gathered from our users:",
    {
        type: "image",
        src: "https://via.placeholder.com/800x400.png?text=User+Example+1", // Replace with actual images
        alt: "User Example 1"
    }
);

// Section 4: Project Phases
createSection(
    "project-phases",
    "Project Phases",
    "",
    {
        type: "phases",
        phases: [
            {
                text: "Phase 1: Setting up the application and website, and onboarding users to upload their EEG data.",
                completed: true
            },
            {
                text: "Phase 2: Measuring basic gamma wave behavior in meditators.",
                completed: false
            },
            {
                text: "Phase 3: Analyzing three stages of insight, requiring advanced analysis and extensive retreat-grade data.",
                completed: false
            }
        ]
    }
);

// Add Image Gallery to Footer
createImageGallery("images", mainContainer);

// Initialize fade-in effects
initFadeInOnScroll();

// Check Mobile (optional)
checkMobile();

function checkMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
        document.body.innerHTML = '<div class="header">Please use desktop for full experience</div>';
    }
}
