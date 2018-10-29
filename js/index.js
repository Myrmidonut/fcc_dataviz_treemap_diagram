function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} // Kickstarter Pledges: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json
// Movie Sales: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json
// Video Game Sales: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json

var width = 1200;
var height = 700;

var urlKickstarterPledges = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
var urlMovieSales = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
var urlVideoGameSales = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

var svg = d3.select("#graph").
append("svg").
attr("width", width).
attr("height", height);

var fader = function fader(color) {return d3.interpolateRgb(color, "#fff")(0.2);};
var color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));
var format = d3.format(",d");

var treemap = d3.treemap().
size([width, height]).
paddingInner(1);

d3.json(urlKickstarterPledges, function (error, data) {
    if (error) throw error;

    var root = d3.hierarchy(data).
    eachBefore(function (e) {return e.data.id = (e.parent ? e.parent.data.id + "." : "") + e.data.name;}).
    sum(function (e) {return e.value;}).
    sort(function (a, b) {return b.height - a.height || b.value - a.value;});

    treemap(root);

    var cell = svg.selectAll("g").
    data(root.leaves()).
    enter().
    append("g").
    attr("transform", function (e) {return "translate(" + e.x0 + "," + e.y0 + ")";});

    var tooltip = d3.select("#graph").
    append("div").
    attr("id", "tooltip").
    style("opacity", 0);

    cell.append("rect").
    attr("width", function (e) {return e.x1 - e.x0;}).
    attr("height", function (e) {return e.y1 - e.y0;}).
    attr("fill", function (e) {return color(e.parent.data.id);}).
    attr("class", "tile").
    attr("data-name", function (e) {return e.data.name;}).
    attr("data-category", function (e) {return e.data.category;}).
    attr("data-value", function (e) {return e.data.value;}).
    on("mouseover", function (e) {
        tooltip.transition().
        duration(200).
        style("opacity", .9);
        tooltip.html("<span class='tooltipSpan'>Name: </span>" + e.data.name + "<br>" +
        "<span class='tooltipSpan'>Amount: </span>" + format(e.data.value) + "$<br>" +
        "<span class='tooltipSpan'>Category: </span>" + e.data.category + "<br>").
        attr("data-value", e.data.value).
        style("left", d3.event.pageX + "px").
        style("top", d3.event.pageY - 45 + "px");
    }).
    on("mouseout", function () {
        tooltip.transition().
        duration(500).
        style("opacity", 0);
    });

    cell.append("text").
    selectAll("tspan").
    data(function (e) {return e.data.name.split(/(?=[A-Z][^A-Z])/g);}).
    enter().
    append("tspan").
    attr("x", 4).
    attr("y", function (e, i) {return 13 + i * 10;}).
    text(function (e) {return e;}).
    attr("class", "celltext");

    var svg2 = d3.select("#graph2").
    append("svg").
    attr("width", 200).
    attr("height", height);

    var categories = root.leaves().map(function (e) {return e.data.category;});
    var categoriesReduced = [].concat(_toConsumableArray(new Set(categories)));

    var legend = svg2.append("g").
    selectAll("g").
    data(categoriesReduced).
    enter().
    append("g").
    attr("transform", function (e, i) {return "translate(0, " + 30 * i + ")";}).
    attr("id", "legend");

    legend.append("rect").
    attr("width", 25).
    attr("height", 25).
    attr("class", "legend-item").
    attr("fill", function (e) {return color(e);});

    legend.append("text").
    attr("x", 30).
    attr("y", 45).
    text(function (e) {return e;});
});