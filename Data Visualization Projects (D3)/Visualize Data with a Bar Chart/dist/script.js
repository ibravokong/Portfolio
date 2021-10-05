document.addEventListener('DOMContentLoaded', function () {
  let tooltip = d3.select("#chart").
  append("div").
  attr("id", "tooltip");

  var tooltipMouseover = function (m, d) {
    tooltip.style("opacity", 1).
    attr("data-date", d[0]).
    html("Date: " + d[0] + "<br>GDP: $" + d[1] + " Billion");
    d3.select(this).
    style("stroke", "black");
  };

  var tooltipMouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).
    style("stroke", "none");
  };
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json').
  then(response => response.json()).
  then(data => {
    const dataset = data.data;
    const w = 1000;
    const h = 500;
    const wPadding = 60;
    const botPadding = 60;

    dataset.forEach(value => {
      value.push(new Date(value[0]));
    });
    const xScale = d3.scaleTime().
    domain([d3.min(dataset, d => d[2]), d3.max(dataset, d => d[2])]).
    range([wPadding, w - wPadding]);
    const yScale = d3.scaleLinear().
    domain([0, d3.max(dataset, d => d[1])]).
    range([h - botPadding, 0]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const svg = d3.select("#chart").
    append("svg").
    attr("width", w).
    attr("height", h);

    svg.selectAll("rect").
    data(dataset).
    enter().
    append("rect").
    attr("class", "bar").
    attr("data-date", d => d[0]).
    attr("data-gdp", d => d[1]).
    attr("x", d => xScale(d[2])).
    attr("y", d => yScale(d[1])).
    attr("width", 3).
    attr("height", d => h - botPadding - yScale(d[1])).
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