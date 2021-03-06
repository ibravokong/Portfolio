document.addEventListener('DOMContentLoaded', function () {
  let legend = d3.select("#chart").
  append("svg").
  attr("id", "legend");
  legend.append("circle").attr("cx", 10).attr("cy", 20).attr("r", 5).style("fill", "#69b3a2");
  legend.append("circle").attr("cx", 10).attr("cy", 50).attr("r", 5).style("fill", "#404080");
  legend.append("text").attr("x", 20).attr("y", 24).text("No doping allegations").style("font-size", "12px");
  legend.append("text").attr("x", 20).attr("y", 54).text("Riders with doping allegations").style("font-size", "12px");

  let tooltip = d3.select("#chart").
  append("div").
  attr("id", "tooltip");

  var tooltipMouseover = function (m, d) {
    tooltip.style("opacity", 1).
    attr("data-year", d.Year).
    style("top", d3.select(this).attr("cy") + "px").
    style("left", d3.select(this).attr("cx") + "px").
    html("Name: " + d.Name + " - Nationality: " + d.Nationality +
    "<br>Year: " + d.Year + " - Time " + d.Time + (
    d.Doping != "" ? "<br>" + d.Doping : ""));
    d3.select(this).
    style("stroke", "black");
  };

  var tooltipMouseleave = function (m) {
    tooltip.style("opacity", 0);
    d3.select(this).
    style("stroke", "none");
  };

  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json').
  then(response => response.json()).
  then(data => {
    const w = 1000;
    const h = 500;
    const wPadding = 60;
    const botPadding = 60;
    data.forEach(value => {
      let [minutes, seconds] = value.Time.split(":");
      value.TimeDate = new Date(2000, 0, 1, 0, minutes, seconds);
    });
    //console.log(data);
    const xScale = d3.scaleLinear().
    domain([d3.min(data, d => d.Year) - 1, d3.max(data, d => d.Year) + 1]).
    range([wPadding, w - wPadding]);
    const yScale = d3.scaleTime().
    domain([new Date(d3.max(data, d => d.TimeDate).getTime() + 7000), new Date(d3.min(data, d => d.TimeDate).getTime() - 7000)]).
    range([h - botPadding, 0]);
    const xAxis = d3.axisBottom(xScale).
    tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(yScale).
    tickFormat(d3.timeFormat('%M:%S'));

    const svg = d3.select("#chart").
    append("svg").
    attr("width", w).
    attr("height", h);

    svg.selectAll("circle").
    data(data).
    enter().
    append("circle").
    attr("class", "dot").
    attr("data-xvalue", d => d.Year).
    attr("data-yvalue", d => d.TimeDate).
    attr("cx", d => xScale(d.Year)).
    attr("cy", d => yScale(d.TimeDate)).
    attr("r", 5).
    attr("fill", d => d.Doping == "" ? "#69b3a2" : "#404080").
    on("mouseover", tooltipMouseover).
    on("mouseleave", tooltipMouseleave);

    svg.append("g").
    attr("id", "x-axis").
    attr("transform", "translate(0," + (h - botPadding) + ")").
    call(xAxis);

    svg.append("g").
    attr("id", "y-axis").
    attr("transform", "translate(" + wPadding + ",0)").
    call(yAxis);
  });
});