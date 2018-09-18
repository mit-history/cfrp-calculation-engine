

var width = $('#guenegaud').width();
var height = $('#guenegaud').height();

var svg = d3.select("#guenegaud").append("svg")
	.attr("width", width)
	.attr("height", height);

var left_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .515)).attr("x", width - (width * .75));
var left_2 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .50)).attr("x", width - (width * .72));

var left_3 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .2)).attr("x", width - (width * .69));
var left_4 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .2)).attr("x", width - (width * .66));



var right_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .515)).attr("x", width - (width * .28));
var right_2 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .50)).attr("x", width - (width * .31));

var right_3 = svg.append("rect").attr("width", width * .03).attr("height", height * (1/5))
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .2)).attr("x", width - (width * .34));
var right_4 = svg.append("rect").attr("width", width * .03).attr("height", height * (1/5))
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .2)).attr("x", width - (width * .37));


var center = svg.append("rect").attr("x", width - (width * .69)).attr("y", height - (height * .25)).attr("width", width * .38).attr("height", width * .03).attr("class", "loge");

var left_top_1 = svg.append("line").attr("x1", width - (width * .7375)).attr("x2", width - (width * .62)).attr("y1", height - (height * .5)).attr("y2", height - (height * .73)).attr("stroke-width", width * .03).attr("stroke", "#159489").attr("class", "loge curved");
var left_top_2 = svg.append("line").attr("x1", width - (width * .7075)).attr("x2", width - (width * .60)).attr("y1", height - (height * .48)).attr("y2", height - (height * .69)).attr("stroke-width", width * .03).attr("stroke", "#159489").attr("class", "loge curved");
var right_top_1 = svg.append("line").attr("x1", width - (width * .2625)).attr("x2", width - (width * .375)).attr("y1", height - (height * .5)).attr("y2", height - (height * .73)).attr("stroke-width", width * .03).attr("stroke", "#159489").attr("class", "loge curved");
var right_top_2 = svg.append("line").attr("x1", width - (width * .2925)).attr("x2", width - (width * .395)).attr("y1", height - (height * .48)).attr("y2", height - (height * .69)).attr("stroke-width", width * .03).attr("stroke", "#159489").attr("class", "loge curved");

var arc1 = d3.arc().innerRadius(width * .08).outerRadius(width * .11).startAngle(-.9).endAngle(.9);
var arc2 = d3.arc().innerRadius(width * .11).outerRadius(width * .14).startAngle(-.9).endAngle(.9);
var arc3 = d3.arc().innerRadius(width * .14).outerRadius(width * .17).startAngle(-.9).endAngle(.9);

svg.append("path")
    .attr("class", "arc")
    .attr("d", arc1).attr("transform", "translate(" + width / 2 + "," + height * .40 + ")");
svg.append("path")
    .attr("class", "arc")
    .attr("d", arc2).attr("transform", "translate(" + width / 2 + "," + height * .39 + ")")
svg.append("path")
    .attr("class", "arc")
    .attr("d", arc3).attr("transform", "translate(" + width / 2 + "," + height * .38 + ")")

svg.append("rect").attr("width", width * .25).attr("height", height * (1/5))
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .575)).attr("x", width * .375);

var left_center_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .45)).attr("x", width - (width * .69));
var right_center_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
	.attr("stroke", "white").attr("class", "loge left")
	.attr("y", height - (height * .45)).attr("x", width - (width * .34));