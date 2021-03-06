const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Turbo color scheme
const COLOR = ["#23171b", "#271a28", "#2b1c33", "#2f1e3f", "#32204a", "#362354", "#39255f", "#3b2768", "#3e2a72", "#402c7b", "#422f83", "#44318b", "#453493", "#46369b", "#4839a2", "#493ca8", "#493eaf", "#4a41b5", "#4a44bb", "#4b46c0", "#4b49c5", "#4b4cca", "#4b4ecf", "#4b51d3", "#4a54d7", "#4a56db", "#4959de", "#495ce2", "#485fe5", "#4761e7", "#4664ea", "#4567ec", "#446aee", "#446df0", "#426ff2", "#4172f3", "#4075f5", "#3f78f6", "#3e7af7", "#3d7df7", "#3c80f8", "#3a83f9", "#3985f9", "#3888f9", "#378bf9", "#368df9", "#3590f8", "#3393f8", "#3295f7", "#3198f7", "#309bf6", "#2f9df5", "#2ea0f4", "#2da2f3", "#2ca5f1", "#2ba7f0", "#2aaaef", "#2aaced", "#29afec", "#28b1ea", "#28b4e8", "#27b6e6", "#27b8e5", "#26bbe3", "#26bde1", "#26bfdf", "#25c1dc", "#25c3da", "#25c6d8", "#25c8d6", "#25cad3", "#25ccd1", "#25cecf", "#26d0cc", "#26d2ca", "#26d4c8", "#27d6c5", "#27d8c3", "#28d9c0", "#29dbbe", "#29ddbb", "#2adfb8", "#2be0b6", "#2ce2b3", "#2de3b1", "#2ee5ae", "#30e6ac", "#31e8a9", "#32e9a6", "#34eba4", "#35eca1", "#37ed9f", "#39ef9c", "#3af09a", "#3cf197", "#3ef295", "#40f392", "#42f490", "#44f58d", "#46f68b", "#48f788", "#4af786", "#4df884", "#4ff981", "#51fa7f", "#54fa7d", "#56fb7a", "#59fb78", "#5cfc76", "#5efc74", "#61fd71", "#64fd6f", "#66fd6d", "#69fd6b", "#6cfd69", "#6ffe67", "#72fe65", "#75fe63", "#78fe61", "#7bfe5f", "#7efd5d", "#81fd5c", "#84fd5a", "#87fd58", "#8afc56", "#8dfc55", "#90fb53", "#93fb51", "#96fa50", "#99fa4e", "#9cf94d", "#9ff84b", "#a2f84a", "#a6f748", "#a9f647", "#acf546", "#aff444", "#b2f343", "#b5f242", "#b8f141", "#bbf03f", "#beef3e", "#c1ed3d", "#c3ec3c", "#c6eb3b", "#c9e93a", "#cce839", "#cfe738", "#d1e537", "#d4e336", "#d7e235", "#d9e034", "#dcdf33", "#dedd32", "#e0db32", "#e3d931", "#e5d730", "#e7d52f", "#e9d42f", "#ecd22e", "#eed02d", "#f0ce2c", "#f1cb2c", "#f3c92b", "#f5c72b", "#f7c52a", "#f8c329", "#fac029", "#fbbe28", "#fdbc28", "#feb927", "#ffb727", "#ffb526", "#ffb226", "#ffb025", "#ffad25", "#ffab24", "#ffa824", "#ffa623", "#ffa323", "#ffa022", "#ff9e22", "#ff9b21", "#ff9921", "#ff9621", "#ff9320", "#ff9020", "#ff8e1f", "#ff8b1f", "#ff881e", "#ff851e", "#ff831d", "#ff801d", "#ff7d1d", "#ff7a1c", "#ff781c", "#ff751b", "#ff721b", "#ff6f1a", "#fd6c1a", "#fc6a19", "#fa6719", "#f96418", "#f76118", "#f65f18", "#f45c17", "#f25916", "#f05716", "#ee5415", "#ec5115", "#ea4f14", "#e84c14", "#e64913", "#e44713", "#e24412", "#df4212", "#dd3f11", "#da3d10", "#d83a10", "#d5380f", "#d3360f", "#d0330e", "#ce310d", "#cb2f0d", "#c92d0c", "#c62a0b", "#c3280b", "#c1260a", "#be2409", "#bb2309", "#b92108", "#b61f07", "#b41d07", "#b11b06", "#af1a05", "#ac1805", "#aa1704", "#a81604", "#a51403", "#a31302", "#a11202", "#9f1101", "#9d1000", "#9b0f00", "#9a0e00", "#980e00", "#960d00", "#950c00", "#940c00", "#930c00", "#920c00", "#910b00", "#910c00", "#900c00", "#900c00", "#900c00"];

document.addEventListener('DOMContentLoaded', function () {
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json').
  then(response => response.json()).
  then(data => {
    const BASE_TEMP = data.baseTemperature;
    const dataset = data.monthlyVariance;
    const MIN_TEMP = d3.min(dataset, d => d.variance + BASE_TEMP);
    const MAX_TEMP = d3.max(dataset, d => d.variance + BASE_TEMP);
    // Tooltip
    let tooltip = d3.select("#map").
    append("div").
    attr("id", "tooltip");

    const tooltipMouseover = function (m, d) {
      tooltip.style("opacity", 1).
      attr("data-year", d.year).
      style("top", d3.select(this).attr("y") + "px").
      style("left", d3.select(this).attr("x") + "px").
      style("transform", "translate(-50%, -100%)").
      html(months[d.month - 1] + " " + d.year +
      "<center>" + (BASE_TEMP + d.variance).toFixed(2) + "??C</center>" +
      "<center>" + d.variance.toFixed(2) + "??C</center>");
      d3.select(this).
      style("stroke", "black").
      style("stroke-width", 2);
    };

    const tooltipMouseleave = function (m) {
      tooltip.style("opacity", 0);
      d3.select(this).
      style("stroke", "none");
    };

    document.getElementById("description").innerHTML = "Base Temperature: " + BASE_TEMP + "??C";
    const w = 1300;
    const h = 560; /* (h - botPadding) Multiple of 12 for align*/
    const leftPadding = 120;
    const rightPadding = 40;
    const botPadding = 140;

    const svg = d3.select("#map").
    append("svg").
    attr("id", "mapSVG").
    attr("width", w).
    attr("height", h);

    // x Scale
    const xScale = d3.scaleBand().
    domain(dataset.map(d => d.year)).
    range([leftPadding, w - rightPadding]);
    const xAxis = d3.axisBottom(xScale).
    tickValues(xScale.domain().filter(value => value % 20 == 0));
    svg.append("text").
    attr("font-family", "Arial").
    attr("text-anchor", "middle").
    attr("x", leftPadding + (w - leftPadding - rightPadding) / 2).
    attr("y", h - botPadding + 40).
    text("Year");

    // y Scale
    const yScale = d3.scaleBand().
    domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).
    range([0, h - botPadding]);
    const yAxis = d3.axisLeft(yScale).
    tickFormat(monthIndex => months[monthIndex]);
    svg.append("text").
    attr("font-family", "Arial").
    attr("text-anchor", "middle").
    attr("transform", "rotate(-90)").
    attr("y", leftPadding - 90).
    attr("x", -((h - botPadding) / 2)).
    text("Month");

    // Legend
    let step = (MAX_TEMP - MIN_TEMP) / (COLOR.length - 1);
    let legendDomain = d3.range(MIN_TEMP, MAX_TEMP + step, step);
    let colorScale = d3.scaleLinear().
    domain(legendDomain).
    range(COLOR);
    const LEGEND_W = 300;
    const LEGEND_H = 20;
    const breaks = 100;
    const legend = d3.select("#mapSVG").
    append("svg").
    attr("id", "legend").
    attr("width", LEGEND_W).
    attr("height", LEGEND_H).
    attr("x", leftPadding).
    attr("y", h - botPadding + 60);
    legend.selectAll("rect").
    data(d3.range(MIN_TEMP, MAX_TEMP, (MAX_TEMP - MIN_TEMP) / breaks)).
    enter().
    append("rect").
    attr("x", (d, i) => i * (LEGEND_W / breaks)).
    attr("y", 0).
    attr("width", LEGEND_W / breaks).
    attr("height", "100%").
    style("fill", d => colorScale(d));
    svg.append("text").
    attr("font-family", "Arial").
    attr("text-anchor", "middle").
    attr("x", leftPadding + LEGEND_W / 2).
    attr("y", h - botPadding + 50).
    text("Temperature ??C");
    // Legend X Axis
    const legendScale = d3.scaleLinear().
    domain([MIN_TEMP, MAX_TEMP]).
    range([leftPadding - 1, leftPadding + LEGEND_W]); // (leftPadding-1) for pixel alignment
    const legendTotalTicks = 4;
    const legendTicks = d3.range(MIN_TEMP, MAX_TEMP + (MAX_TEMP - MIN_TEMP) / legendTotalTicks, (MAX_TEMP - MIN_TEMP) / legendTotalTicks);
    const legendxAxis = d3.axisBottom(legendScale).
    tickValues(legendTicks).
    tickFormat(d3.format(".2f"));
    svg.append("g").
    attr("id", "legend-x-axis").
    attr("transform", "translate(0," + (h - botPadding + 80) + ")").
    call(legendxAxis);

    // Data
    svg.selectAll("#cell").
    data(dataset).
    enter().
    append("rect").
    attr("class", "cell").
    attr("data-month", d => d.month - 1).
    attr("data-year", d => d.year).
    attr("data-temp", d => BASE_TEMP + d.variance).
    attr("x", d => xScale(d.year)).
    attr("y", d => yScale(d.month - 1)).
    attr("width", xScale.bandwidth()).
    attr("height", d => yScale.bandwidth()).
    style("fill", d => colorScale(BASE_TEMP + d.variance)).
    on("mouseover", tooltipMouseover).
    on("mouseleave", tooltipMouseleave);

    // Call axis
    svg.append("g").
    attr("id", "x-axis").
    attr("transform", "translate(0," + (h - botPadding) + ")").
    call(xAxis);
    svg.append("g").
    attr("id", "y-axis").
    attr("transform", "translate(" + leftPadding + ",0)").
    call(yAxis);
  });
});