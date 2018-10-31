// Kickstarter Pledges: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json
// Movie Sales: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json
// Video Game Sales: https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json

const width = 1200;
const height = 700;

const urlKickstarterPledges = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
const urlMovieSales = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const urlVideoGameSales = "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

const svg = d3.select("#graph")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

const fader = function fader(color) {
  return d3.interpolateRgb(color, "#fff")(0.2);
};

const color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

const format = d3.format(",d");

const treemap = d3.treemap()
                  .size([width, height])
                  .paddingInner(1);

d3.json(urlKickstarterPledges, (error, data) => {
  if (error) throw error;

  const root = d3.hierarchy(data)
                 .eachBefore(e => e.data.id = (e.parent ? e.parent.data.id + "." : "") + e.data.name)
                 .sum(e => e.value)
                 .sort((a, b) => b.height - a.height || b.value - a.value);

  treemap(root);

  const cell = svg.selectAll("g")
                  .data(root.leaves())
                  .enter()
                  .append("g")
                  .attr("transform", e => `translate(${e.x0}, ${e.y0})`);

  const tooltip = d3.select("#graph")
                    .append("div")
                    .attr("id", "tooltip")
                    .style("opacity", 0);

  cell.append("rect")
      .attr("width", e => e.x1 - e.x0)
      .attr("height", e => e.y1 - e.y0)
      .attr("fill", e => color(e.parent.data.id))
      .attr("class", "tile")
      .attr("data-name", e => e.data.name)
      .attr("data-category", e => e.data.category)
      .attr("data-value", e => e.data.value)
      .on("mouseover", e => {
        tooltip.transition()
               .duration(200)
               .style("opacity", .9);
        tooltip.html(`<span class='tooltipSpan'>Name: </span>${e.data.name} <br>` +
                     `<span class='tooltipSpan'>Amount: </span>${format(e.data.value)}$ <br>` +
                     `<span class='tooltipSpan'>Category: </span>${e.data.category} <br>`)
               .attr("data-value", e.data.value)
               .style("left", d3.event.pageX + "px")
               .style("top", d3.event.pageY - 45 + "px");
  }).
  on("mouseout", () => {
    tooltip.transition()
           .duration(500)
           .style("opacity", 0);
  });

  cell.append("text")
      .selectAll("tspan")
      .data(e => e.data.name.split(/(?=[A-Z][^A-Z])/g))
      .enter()
      .append("tspan")
      .attr("x", 4)
      .attr("y", (e, i) => 13 + i * 10)
      .text(e => e)
      .attr("class", "celltext");

  const svg2 = d3.select("#graph2")
                 .append("svg")
                 .attr("width", 200)
                 .attr("height", height);

  const categories = root.leaves()
                         .map(e => e.data.category);
  
  const categoriesReduced = [...new Set(categories)];

  const legend = svg2.append("g")
                     .selectAll("g")
                     .data(categoriesReduced)
                     .enter()
                     .append("g")
                     .attr("transform", (e, i) => `translate(0, ${30 * i})`)
                     .attr("id", "legend");

  legend.append("rect")
        .attr("width", 25)
        .attr("height", 25)
        .attr("class", "legend-item")
        .attr("fill", e => color(e));

  legend.append("text")
        .attr("x", 30)
        .attr("y", 45)
        .text(e => e);
});