document.addEventListener('DOMContentLoaded', function() {
  fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json")
    .then(response => response.json())
    .then(data => createMap(data))
});

function createMap(data) {
  const SVG_W = 1200;
  const SVG_H = 560;
  const PADDING_LEFT = 30;
  const PADDING_RIGHT = 30;
  const PADDING_BOT = 10;
  let categories = data.children.map(obj => obj.name);
  let root = d3.hierarchy(data)
               .sum((d) => d.value)
               .sort((a, b) => (b.height - a.height || b.value - a.value));
  d3.treemap()
    .size([SVG_W-PADDING_LEFT-PADDING_RIGHT, SVG_H-PADDING_BOT])
    .paddingInner(4)
    .round(true)
    (root);
  // SVG
  const svg = d3.select("#map")
                .append("svg")
                .attr("id", "mapSVG")
                .attr("width", SVG_W)
                .attr("height", SVG_H);
  // Tooltip
  let tooltip = d3.select("#map")
                  .append("div")
                  .attr("id", "tooltip");
  const tooltipMousemove = function(e, d) {
    let selection = d3.select(this);
    tooltip.style("opacity", 1)
           .attr("data-value", selection.attr("data-value"))
           .style("top", e.layerY + "px")
           .style("left", e.layerX + "px")
           .html("<center>" + selection.attr("data-name") + "</center>" + 
                 "<center>" + selection.attr("data-category") + "</center>" +
                 "<center>" + selection.attr("data-value") + "</center>");
    d3.select(this)
      .style("stroke-width", 3);
  }
  const tooltipMouseleave = function(e) {
    tooltip.style("opacity", 0);
    d3.select(this)
      .style("stroke-width", 1);
  }
  // Color Scale
  let colorRange = [];
  for(var i = 0; i <= 1; i += 1/categories.length) {
    colorRange.push(d3.interpolateSinebow(i));
  }
  let colorScale = d3.scaleOrdinal()
                     .domain(categories)
                     .range(colorRange);
  // Legend (3 rows)
  const LEGEND_W = 100*Math.ceil(categories.length/3);
  const LEGEND_H = 90;
  const legend = d3.select("#map")
                   .append("svg")
                   .attr("id", "legend")
                   .attr("width", LEGEND_W)
                   .attr("height", LEGEND_H);
  legend.selectAll("legend-labels")
        .data(categories)
        .enter()
        .append("text")
        .attr("class", "legend-text")
        .attr("text-anchor", "left")
        .attr("x", (d, i) => {
          var column = i % 6;
          return 20 + 100*column;
        })
        .attr("y", (d, i) => {
          var row = Math.floor(i/6);
          return 20 + 30*row;
        })
        .text((d) => d);
  legend.selectAll("legend-squares")
        .data(categories)
        .enter()
        .append("rect")
        .attr("class", "legend-item")
        .attr("width", 16)
        .attr("height", 16)
        .attr("x", (d, i) => {
          var column = i % 6;
          return 2 + 100*column;
        })
        .attr("y", (d, i) => {
          var row = Math.floor(i/6);
          return 6 + 30*row;
        })
        .style("fill", (d) => colorScale(d));
  // Data
  console.log(root.leaves());
  svg.selectAll("rect")
     .data(root.leaves())
     .enter()
     .append("rect")
     .attr("class", "tile")
     .attr("data-name", (d) => d.data.name)
     .attr("data-category", (d) => d.data.category)
     .attr("data-value", (d) => d.data.value)
     .attr('x', (d) => d.x0 + PADDING_LEFT)
     .attr('y', (d) => d.y0 + 2)
     .attr('width', (d) => d.x1 - d.x0)
     .attr('height', (d) => d.y1 - d.y0)
     .style("stroke", "black")
     .style("fill", (d) => colorScale(d.data.category))
     .on("mousemove", tooltipMousemove)
     .on("mouseleave", tooltipMouseleave);;
  // Text Labels
  svg.selectAll("foreignObject")
     .data(root.leaves())
     .enter()
     .append("foreignObject")
     .attr("pointer-events", "none")
     .attr("x", (d) => d.x0 + PADDING_LEFT + 1)
     .attr("y", (d) => d.y0 + 1)
     .attr("width", (d) => d.x1 - d.x0)
     .attr("height", (d) => d.y1 - d.y0)
     .append("xhtml:div")
     .append("p")
     .attr("class", "label-text")
     .text((d) => d.data.name);
}