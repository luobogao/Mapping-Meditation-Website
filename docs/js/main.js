// main.js

// Debugging: Log when the script starts
console.log("main.js is loaded and running.");

// === 1. Fade-In Threshold ===
const fadeInThreshold = 0.2; // Adjust as needed

// Initialize the main container styles
d3.select("#main-container")
  .style("display", "flex")
  .style("flex-direction", "column")
  .style("align-items", "center")
  .style("width", "100%")
  .style("box-sizing", "border-box");

// Function to create sections
function createSection(id, title, content, additionalContent = null, includeGraph = false) {
  const section = d3.select("#main-container").append("section")
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

  // Right Div (1/3)
  const rightDiv = contentContainer.append("div")
    .attr("class", "right-div")
    .style("flex", "1")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("align-items", "center");

  // Add main content to leftDiv
  if (content) {
    leftDiv.append("div")
      .html(content) // Changed to .html to allow for rich text (e.g., lists)
      .style("font-size", "20px")
      .style("line-height", "1.6");
  }

  // If includeGraph is true, append the graph to the leftDiv
  if (includeGraph) {
    rightDiv.append("div")
      .attr("id", "svg-container")
      .style("width", "100%")
      .style("height", "500px") // Adjust height as needed
      .style("margin-top", "40px");
  }

  // Handle additional content
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
    }
    // Additional content types can be handled here
  }
}

// Function to create sub-sections (for Participant Stories)
function createSubSection(parentId, subId, title, content, additionalContent = null) {
  const parentSection = d3.select(`#${parentId}`);

  const subSection = parentSection.append("div")
    .attr("id", subId)
    .attr("class", "sub-section")
    .style("margin-top", "40px");

  // Sub-section Title
  subSection.append("h2")
    .text(title)
    .style("font-size", "36px")
    .style("margin-bottom", "20px");

  // Content
  subSection.append("div")
    .html(content)
    .style("font-size", "20px")
    .style("line-height", "1.6");

  // Additional Content
  if (additionalContent && additionalContent.type === "image-gallery") {
    // Create Image Gallery within the sub-section
    createImageGallery(additionalContent.folderPath, subSection);
  } else if (additionalContent && additionalContent.type === "image") {
    subSection.append("img")
      .attr("src", additionalContent.src)
      .attr("alt", additionalContent.alt)
      .style("width", "100%")
      .style("height", "auto")
      .style("border-radius", "8px")
      .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
      .style("margin-top", "20px");
  }
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

      // Initialize graph when specific section is visible
      if (entry.target.id === "early-results" && entry.isIntersecting) {
        initializeGraph()
      }

      // Add more conditions for other graphs if needed
    });
  }, { threshold: fadeInThreshold });

  faders.forEach(fader => {
    observer.observe(fader);
  });
}

// Create Sections with Updated and New Content

// 1. Mapping Meditation Project
createSection(
  "mapping-meditation-project",
  "Mapping Meditation Project",
  `<p>We are mapping meditation 'space' using consumer EEG (Muse), powered by open-source AI analysis, made free to all meditators to help their journey.</p>
   <p>Early results showed that strong meditators (&gt; 5 years experience) have consistent, large gamma-wave increases at similar parts of their brains. Different meditation traditions targeted different parts of the brain.</p>
   <p>Currently we have an Android app for recording EEG during meditation, paired with a companion website which analyzes the data, highlighting typical changes of strong meditation.</p>
   <p>Long-term participants are thrilled with their results. Simply exploring their data after each meditation, comparing their results with previous results and with other participants, helped them identify important moments during their meditation, increasing their confidence, resulting in rapid progress.</p>
   <p>Various companies are getting onboard with EEG for meditation analysis - but this project is entirely free and open-source, not participating in capitalist incentives or taking any funding whatsoever, in order to preserve the spiritual goals of the project.</p>`,
  {
    type: "image",
    src: "images/phones.png",
    alt: "Screenshots of the application"
  }
);

// 2. Early Results
createSection(
  "early-results",
  "Early Results",
  `<p>Daniel Ingram, a meditation teacher and author, is providing ongoing recordings of his practice, along with phenomenological tags to help demonstrate the potential of this method. This graph shows his gamma-wave results (above the left frontal lobe) during a long retreat. His results are always the same - a massive, immediate increase in gamma waves at this location. These results match dozens of published studies reporting the same results (with better EEG systems), and these results also match the other strong meditators who participate.</p>`,
  null,
  true // Include graph
);

// 3. Project Stages
createSection(
  "project-stages",
  "Project Stages",
  `<p>Our long-term goal is to provide a free app with useful metrics to anyone who already has a Muse EEG. This app is ready for any eager beta-testers or meditation participants, but we are still working on defining feedback metrics which are genuinely useful to the most number of people. In the meantime, current participants are taking a much more individualistic approach, working with their own data.</p>
   <ul>
     <li><strong>1) Develop App + Website</strong> so that participants can easily record, upload, and explore their data &rarr; <em>DONE</em></li>
     <li><strong>2) Define basic metrics for measuring meditation</strong> &rarr; <em>IN PROGRESS</em></li>
     <li><strong>3) Define more advanced metrics for high-powered meditators</strong></li>
     <li><strong>4) Publish all apps with available metrics</strong></li>
   </ul>`
);

// 4. Participant Stories
createSection(
  "participant-stories",
  "Participant Stories",
  `<p>Our participants have shared remarkable experiences and insights through their journey with the Mapping Meditation Project. Below is a story from one of our dedicated participants.</p>`
);

// Sub-Section: Helen
createSubSection(
  "participant-stories",
  "helen-story",
  "Helen",
  `<p>Helen is a relatively new meditator who connected strongly with Daniel's "Stages of Insight" guidance. Her dream is to map out her personal experiences into these stages - a goal that our project is perfect for! She has recorded dozens of sessions so far, including a few on long retreats, with many phenomenological descriptions, allowing for an excellent level of analysis. She takes on the raw data herself, performing her own analysis, looking for patterns. This is a big goal, requiring much more data than a simple gamma-change analysis. We estimate that with 5x more data, with at least a few data points for each 'stage' of insight, we will have a chance to distinguish these stages empirically.</p>`,
  {
    type: "image-gallery",
    folderPath: "images" // Ensure that "helen1.png" and "helen2.png" are in the "images" folder
  }
);



// Add Image Gallery to Helen's Sub-Section (Already handled via createSubSection)

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
