$.ajaxSetup({
	async: false
});



$("document").ready(function () {
	$("body").css("cursor","progress");
	seasonChange("1680-1681");
// <<<<<<< HEAD
	drawInitial();
// =======
	$(".season").css("visibility","visible");
	$("#season1").val("1680");
	$("#season2").val("1681");
	$("body").css("cursor","default");
	$("body").css("opacity","1");
// >>>>>>> e7a06ed236dd91b3412765c318b3648a81ac65b0
});
$(function () {
	getSeasonMinMax('1680-1681');
	$("#season1").on("change", function (e) {

		if (e.originalEvent) {
			if(parseInt($("#season1").val()) < 1680 || isNaN(parseInt($("#season1").val()))) {
				$("#season1").val("1680");
			}
			if(parseInt($("#season1").val()) > 1792) {
				$("#season1").val("1792");
			}
			$("html").css("cursor", "progress");
			$("#season2").val(parseInt($("#season1").val())+1);
			seasonChange($("#season1").val() + "-" + $("#season2").val());
		}
	});
	$("#season2").on("change", function (e) {
		if (e.originalEvent) {
			if(parseInt($("#season2").val()) < 1681 || isNaN(parseInt($("#season2").val()))) {
				$("#season2").val("1681");
			}
			if(parseInt($("#season2").val()) > 1793) {
				$("#season2").val("1793");
			}
			$("html").css("cursor", "progress");
			$("#season1").val(parseInt($("#season2").val())-1);
			seasonChange($("#season1").val() + "-" + $("#season2").val());
		}
	});

	$("#dayDate").on("change", function (e) {
		$("html").css("cursor", "progress");
		if (e.originalEvent) {
			dateChange($("#dayDate").val());
		}

		var validDate=false;
		for (var i = 0; i < current_season_days.length; i++) {
			if (current_season_days[i] == $("#dayDate").val()) {
				validDate = true;
			}
		}

		if (!validDate) {
			$(".play").html("<p> </p>");
			$("#noRep").dialog();

		}
	});

	
});

function drawInitial(){

	var width = $('#heatmap').width();
	var height = $('#heatmap').height();

	var svg = d3.select("#heatmap").append("svg")
		.attr("width", width)
		.attr("height", height);

	var left_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .515)).attr("x", width - (width * .75));
	var left_2 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .50)).attr("x", width - (width * .72));

	var left_3 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .2)).attr("x", width - (width * .69));
	var left_4 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .2)).attr("x", width - (width * .66));



	var right_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .515)).attr("x", width - (width * .28));
	var right_2 = svg.append("rect").attr("width", width * .03).attr("height", height * .6)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .50)).attr("x", width - (width * .31));

	var right_3 = svg.append("rect").attr("width", width * .03).attr("height", height * (1/5))
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .2)).attr("x", width - (width * .34));
	var right_4 = svg.append("rect").attr("width", width * .03).attr("height", height * (1/5))
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .2)).attr("x", width - (width * .37));


	var center = svg.append("rect").attr("x", width - (width * .69)).attr("y", height - (height * .25)).attr("width", width * .38).attr("height", width * .03).attr("class", "map guenegaud line");

	var left_top_1 = svg.append("line").attr("x1", width - (width * .7375)).attr("x2", width - (width * .62)).attr("y1", height - (height * .5)).attr("y2", height - (height * .73)).attr("stroke-width", width * .03).attr("class", "map guenegaud line");
	var left_top_2 = svg.append("line").attr("x1", width - (width * .7075)).attr("x2", width - (width * .60)).attr("y1", height - (height * .48)).attr("y2", height - (height * .69)).attr("stroke-width", width * .03).attr("class", "map guenegaud line");
	var right_top_1 = svg.append("line").attr("x1", width - (width * .2625)).attr("x2", width - (width * .375)).attr("y1", height - (height * .5)).attr("y2", height - (height * .73)).attr("stroke-width", width * .03).attr("class", "map guenegaud line");
	var right_top_2 = svg.append("line").attr("x1", width - (width * .2925)).attr("x2", width - (width * .395)).attr("y1", height - (height * .48)).attr("y2", height - (height * .69)).attr("stroke-width", width * .03).attr("class", "map guenegaud line");

	var arc1 = d3.arc().innerRadius(width * .08).outerRadius(width * .11).startAngle(-.9).endAngle(.9);
	var arc2 = d3.arc().innerRadius(width * .11).outerRadius(width * .14).startAngle(-.9).endAngle(.9);
	var arc3 = d3.arc().innerRadius(width * .14).outerRadius(width * .17).startAngle(-.9).endAngle(.9);


	svg.append("path")
	    .attr("class", "map guenegaud")
	    .attr("d", arc1).attr("transform", "translate(" + width / 2 + "," + height * .40 + ")");
	svg.append("path")
	    .attr("class", "map guenegaud")
	    .attr("d", arc2).attr("transform", "translate(" + width / 2 + "," + height * .39 + ")")
	svg.append("path")
	    .attr("class", "map guenegaud")
	    .attr("d", arc3).attr("transform", "translate(" + width / 2 + "," + height * .38 + ")")

	svg.append("rect").attr("width", width * .25).attr("height", height * (1/5))
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .575)).attr("x", width * .375);

	var left_center_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .45)).attr("x", width - (width * .69));
	var right_center_1 = svg.append("rect").attr("width", width * .03).attr("height", height * .2)
		.attr("stroke", "white").attr("class", "map guenegaud")
		.attr("y", height - (height * .45)).attr("x", width - (width * .34));	

}
