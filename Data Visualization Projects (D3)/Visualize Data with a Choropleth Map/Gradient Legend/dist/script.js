const COLOR = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];

document.addEventListener('DOMContentLoaded', function () {
  Promise.all([fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json").
  then(response => response.json()),
  fetch("https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json").
  then(response => response.json())]).
  then(data => {
    createMap(data);
  }).
  catch(error => {
    console.log(error);
  });
});

function createMap(data) {
  let bachelorData = data[0];
  let topoData = data[1];
  const MIN_BACHELOR = d3.min(bachelorData, d => d.bachelorsOrHigher);
  const MAX_BACHELOR = d3.max(bachelorData, d => d.bachelorsOrHigher);
  const SVG_W = 950;
  const SVG_H = 680;
  // SVG
  const svg = d3.select("#map").
  append("svg").
  attr("id", "mapSVG").
  attr("width", SVG_W).
  attr("height", SVG_H);
  // Tooltip
  let tooltip = d3.select("#map").
  append("div").
  attr("id", "tooltip");
  const tooltipMouseover = function (e, d) {
    let selection = d3.select(this);
    let find = bachelorData.find(obj => obj.fips == selection.attr("data-fips"));
    if (find) {
      tooltip.style("opacity", 1).
      attr("data-education", find.bachelorsOrHigher).
      style("top", e.layerY + "px").
      style("left", e.layerX + "px").
      html(find.area_name + " - " + find.state +
      "<center>" + find.bachelorsOrHigher + "%</center>");
      d3.select(this).
      style("stroke", "black").
      style("stroke-width", 2);
    } else
    {
      tooltip.html("DATA NOT FOUND");
    }
  };
  const tooltipMouseleave = function (e) {
    tooltip.style("opacity", 0);
    d3.select(this).
    style("stroke", "none");
  };
  // Legend
  var step = (MAX_BACHELOR - MIN_BACHELOR) / (COLOR.length - 1);
  let legendDomain = d3.range(MIN_BACHELOR, MAX_BACHELOR + step, step);
  let colorScale = d3.scaleLinear().
  domain(legendDomain).
  range(COLOR);
  const LEGEND_X = 100;
  const LEGEND_Y = SVG_H - 60;
  const LEGEND_W = 300;
  const LEGEND_H = 20;
  const legend = d3.select("#mapSVG").
  append("svg").
  attr("id", "legend").
  attr("width", LEGEND_W).
  attr("height", LEGEND_H).
  attr("x", LEGEND_X).
  attr("y", LEGEND_Y);
  svg.append("text").
  attr("font-family", "Arial").
  attr("text-anchor", "middle").
  attr("x", LEGEND_X + LEGEND_W / 2).
  attr("y", LEGEND_Y - 10).
  text("Percent %");
  // Legend X Axis
  const legendScale = d3.scaleLinear().
  domain([MIN_BACHELOR, MAX_BACHELOR]).
  range([LEGEND_X - 1, LEGEND_X + LEGEND_W]);
  const legendTotalTicks = 4;
  var step = (MAX_BACHELOR - MIN_BACHELOR) / legendTotalTicks;
  const legendTicks = d3.range(MIN_BACHELOR, MAX_BACHELOR + step, step);
  const legendxAxis = d3.axisBottom(legendScale).
  tickValues(legendTicks);
  svg.append("g").
  attr("id", "legend-x-axis").
  attr("transform", "translate(0," + (LEGEND_Y + LEGEND_H) + ")").
  call(legendxAxis);
  // Gradient
  let gradient = legend.append("svg:defs").
  append("svg:linearGradient").
  attr("id", "gradient");
  gradient.selectAll("stop").
  data(COLOR).
  enter().
  append("stop").
  attr("offset", (d, i) => i * 100 / (COLOR.length - 1) + "%").
  attr("stop-color", d => d);
  legend.append("rect").
  attr("width", LEGEND_W).
  attr("height", LEGEND_H).
  attr("fill", "url(#gradient)");
  // Topo data
  // D3 draws geoJSON objects, not topoJSON directly
  let geoJSON = topojson.feature(topoData, topoData.objects.counties);
  let geoGenerator = d3.geoPath();
  svg.append("g").
  selectAll("path").
  data(geoJSON.features).
  enter().
  append("path").
  attr("d", geoGenerator).
  attr("class", "county").
  attr("data-fips", d => d.id).
  attr("data-education", d => {
    let find = bachelorData.find(obj => obj.fips == d.id);
    if (find) {
      return find.bachelorsOrHigher;
    }
    return 0;
  }).
  style("fill", function (d) {
    let find = d3.select(this).attr("data-education");
    if (find) {
      return colorScale(find);
    }
    return colorScale(0);
  }).
  on("mouseover", tooltipMouseover).
  on("mouseleave", tooltipMouseleave);
  /* For scaling and padding with projection
    d3.geoPath()
      .projection(d3.geoTransform({
    point: function(x, y) {
      this.stream.point(x + leftPadding, y);
    }
  }))*/
};