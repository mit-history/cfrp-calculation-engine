
var w = 140;
var h = 310;

var legendW = $('#legend').width()/4;

var key = d3.select("#legend")
	.append("svg")
	.attr("class", "legendsvg")
	.attr("width", w)
	.attr("height", h);

var legend = key.append("defs")
	.append("svg:linearGradient")
	.attr("id", "gradient")
	.attr("x1", "100%")
	.attr("y1", "0%")
	.attr("x2", "100%")
	.attr("y2", "100%")
	.attr("spreadMethod", "pad");

legend.append("stop")
	.attr("offset", "0%")
	.attr("stop-color", "#FD0000")
	.attr("stop-opacity", 1);

legend.append("stop")
	.attr("offset", "100%")
	.attr("stop-color", "#0100FE")
	.attr("stop-opacity", 1);

key.append("rect")
	.attr("class", "legendrect")
	.attr("width", w - 100)
	.attr("height", h - 10)
	.style("fill", "url(#gradient)")
	.attr("transform", "translate("+legendW+",10)");

var y = d3.scaleLinear().range([300, 0]).domain([1, 100]);
var yAxis = d3.axisRight(y);

key.append("g")
	.attr("class", "y axis")
	.attr("transform", "translate("+(legendW + 41)+",10)")
	.call(yAxis)
	// .append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 30).attr("dy", ".71em")
	.style("text-anchor", "end")
	.text("axis title");
