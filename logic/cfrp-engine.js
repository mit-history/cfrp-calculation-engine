//gloabal variables
var current_season;
var current_season_min;
var current_season_max;
var current_season_days;

var current_season_seating_profile_ids;
var current_season_seating_profile_max;
var current_season_seating_profile_min;
var current_season_seating_profile_avg;

var current_theater = 'Odéon';
var prev_theater;


//UI actions

function dateChange(newDate) {
	$.getJSON('http://api2.cfregisters.org/registers?date=eq.' + newDate, function(data) {
		if (data.length > 0) {
			season = data[0].season;
			if (newDate < current_season_min || newDate > current_season_max) {
				seasonChange(seasonFinder(newDate));
			}
			setInfos(newDate);
			setDate(newDate);
			$("html").css("cursor", "default");
	//setDate(newDate);
		} else {
			drawTheater(current_theater);
		}	
	});
}

function seasonChange(newSeason) {
	//need input control
	$("html").css("cursor", "wait");
	getSeason(newSeason);
	dateChange(current_season_min);
	$("#dayDate").val(current_season_min);
	$("html").css("cursor", "default");
}


//private functions

function getSeasonDays(newSeason) {
	$.getJSON('http://api2.cfregisters.org/registers?select=season,date&season=eq.' + newSeason + '&order=date.asc', function(data) {
		current_season_min=new Date(data[0].date).toISOString().split('T')[0];
		current_season_max=new Date(data[data.length-1].date).toISOString().split('T')[0];
		current_season=newSeason;
	});
}

function getSeasonMinMax() {

}

function seasonFinder(newDate) {
	var season;
	$.getJSON('http://api2.cfregisters.org/registers?date=eq.' + newDate, function(data) {
		season = data[0].season;

	});

	$("#season1").val(season.substr(0,4));
	$("#season2").val(season.substr(5,8));

	return season;
}

function heatmapFireworks(evening_totals) {
	//Get an array of JSON object and summons the magic.
}

function loadSlider() {
	var seasonDays = new Array();
	var prevDate="";
	$.getJSON('http://api2.cfregisters.org/performances?season=eq.' + current_season + '&order=date.asc', function(data) {
		$.each(data, function (i, item) {
			if (prevDate != item.date) {
				seasonDays.push(item.date);
			}
		});
	});
	current_season_days = seasonDays;

	/*$("#slider").slider({

		max:current_season_days.length,
		change: function(event,ui) {
			dateChange(current_season_days[ui.value]);
			$("#dayDate").val(current_season_days[ui.value]);
		}

	});*/

	var slider = document.getElementById('slider');

	slider.noUiSlider.destroy();

	noUiSlider.create(slider, {
		start: 0,
		step: 1,
		connect: true,
		range: {
			'min': 0,
			'max': current_season_days.length
		}
	});

	slider.noUiSlider.on('change', function(){
		dateChange(current_season_days[parseInt(slider.noUiSlider.get())]);
		$("#dayDate").val(current_season_days[parseInt(slider.noUiSlider.get())]);
	});
}

function renumberScales() {

}

function setInfos(newDate) {
	//set the name of the theater, and the name of the plays. 
	$(".heatmap-infodis .theater").html(current_theater);
	var count = 0;
	$.getJSON('http://api2.cfregisters.org/performances?date=eq.' + newDate, function(data) {
		$.each(data, function (i, item) {
			count++;
			if (i == 0) {
				$(".play").html(item.author_name + ", <i>" + item.title + "</i>");
			} else if (data.length == 2 || i==2) {
				$(".play").append(" et " + item.author_name + ", <i>" + item.title + "</i>");
			} else {
				$(".play").append(", " + item.author_name + ", <i>" + item.title + "</i>");
			}
		});
	});
	
}

function getSeasonSeatingProfile() {
	current_season_seating_profile_ids = new Array();
	$.getJSON('http://api2.cfregisters.org/seating_category_profile?start_date=lte.' + current_season_min + '&end_date=gte.' + current_season_max + '&order=id.asc', function(data) {
		prev_theater=current_theater;
		current_theater=data[0].period;
		$.each(data, function (i, item) {
			current_season_seating_profile_ids.push(data[i].id);
		});
	});
}

function getSeason(newSeason) {
	
	getSeasonDays(newSeason);
	getSeasonSeatingProfile();
	getSeasonMinMax();
	loadSlider();
	//setMaximum();
	console.log("Cur th: " + prev_theater + " – NEw th : " + current_theater);
	if(prev_theater != current_theater) {
		drawTheater(current_theater);
	}
}

function setDate(date) {
	var evening_totals = new Array();
	for (var i = 0; i < current_season_seating_profile_ids.length; i++) {
		var temp_obj = new Object();
		temp_obj.id = current_season_seating_profile_ids[i];
		temp_obj.total = 0;
		evening_totals.push(temp_obj);
	}
	var prev_id = 0;

	$.getJSON('http://api2.cfregisters.org/ticket_sales_by_profile?date=eq.' + date + '&order=seating_category_profile_id.asc', function(data) {
		$.each(data, function (i, item) {
			for (var j = 0; j < evening_totals.length; j++) {

				if (evening_totals[j].id == parseInt(data[i].seating_category_profile_id)) {
					evening_totals[j].total += parseInt(data[i].recorded_total_l);
					evening_totals[j].name = data[i].category;
				}
			}
		});
	});
	
	/*
	Calculation
	for (var j = 0; j < evening_totals.length; j++) {
		evening_totals[j].total_perc = evening_totals[j].total/current_season_seating_profile_max.id[evening_totals[j].id].total;
	}*/

	heatmapFireworks(JSON.stringify(evening_totals));
	
}

function setScale() {

}

function drawTheater(theater){

	if (theater === 'Guénégaud I' || theater === 'Guénégaud II') {
		guenegaud();
	}
	if (theater === 'Rue des Fossés St-Germain I' || theater === 'Rue des Fossés St-Germain II') {
		stgermain();
	}
	if (theater === 'Odéon'){
		odeon();
	}

}

function guenegaud(){

	$('#heatmap').html('');

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

function stgermain(){

	$('#heatmap').html('');

	var width = $('#heatmap').width();
	var height = $('#heatmap').height();

	var pi = Math.PI;
	var svg = d3.select('#heatmap').append("svg")
	.attr("width", width)
	.attr("height", height);


	var inner_arc = d3.arc()
	.innerRadius(Math.min(width, height) * .2)
	.outerRadius(Math.min(width, height) * .25)
	.startAngle(0 * (pi/180))
	.endAngle(180 * (pi/180));

	var outer_arc = d3.arc()
	.innerRadius(Math.min(width, height) * .26)
	.outerRadius(Math.min(width, height) * .31)
	.startAngle(0 * (pi/180))
	.endAngle(180 * (pi/180));

	svg.append("path")
	.attr("d", inner_arc)
	.attr("class", "map stgermain")
	.attr("transform", "translate("+(width/1.667 + 25) +","+ (height/2) +")");

	svg.append("path")
	.attr("d", outer_arc)
	.attr("class", "map stgermain")
	.attr("transform", "translate("+(width/1.667 + 25)+","+ (height/2) +")");

	var inner_btm = svg.append("rect").attr("class", "map stgermain").attr("width", width * .35).attr("height", Math.min(width,height) * .05)
	.attr("y", (height/2) + Math.min(width, height) * .2).attr("x", (width / 1.6667 - (width*.35) + 24)).attr("fill", "blue");
	var outer_btm = svg.append("rect").attr("class", "map stgermain").attr("width", width * .35).attr("height", Math.min(width,height) * .05)
	.attr("y", (height/2) + Math.min(width, height) * .26).attr("x", (width / 1.6667 - (width*.35) + 24)).attr("fill", "blue");

	var inner_btm = svg.append("rect").attr("class", "map stgermain").attr("width", width * .35).attr("height", Math.min(width,height) * .05)
	.attr("y", (height/2) - Math.min(width, height) * .25).attr("x", (width / 1.6667 - (width*.35) + 24)).attr("fill", "blue");
	var outer_btm = svg.append("rect").attr("class", "map stgermain").attr("width", width * .35).attr("height", Math.min(width,height) * .05)
	.attr("y", (height/2) - Math.min(width, height) * .31).attr("x", (width / 1.6667 - (width*.35) + 24)).attr("fill", "blue");

	var firsts_1 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .01).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + 24)).attr("fill", "blue");
	var firsts_2 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .01).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015))).attr("fill", "blue");
	var firsts_3 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .01).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015)).attr("fill", "blue");

	var parterre = svg.append("rect").attr("class", "map stgermain").attr("width", width * .2).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015)).attr("fill", "blue");

	var amp_1 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .205)).attr("fill", "blue");
	var amp_2 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .23)).attr("fill", "blue");
	var amp_3 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .255)).attr("fill", "blue");
	var amp_4 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .3)
	.attr("y", (height/2) - Math.min(width, height) * .15).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .28)).attr("fill", "blue");
	var amp_5 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .25)
	.attr("y", (height/2) - Math.min(width, height) * .125).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .305)).attr("fill", "blue");
	var amp_6 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .25)
	.attr("y", (height/2) - Math.min(width, height) * .125).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .33)).attr("fill", "blue");
	var amp_7 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .25)
	.attr("y", (height/2) - Math.min(width, height) * .125).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .355)).attr("fill", "blue");
	var amp_8 = svg.append("rect").attr("class", "map stgermain").attr("width", width * .02).attr("height", Math.min(width,height) * .2)
	.attr("y", (height/2) - Math.min(width, height) * .1).attr("x", (width / 1.6667 - (width*.35) + (24 + width * .015) + width * .015 + width * .015 + width * .38)).attr("fill", "blue");

}

function odeon(){

	$('#heatmap').html('');
	var width = $('#heatmap').width();
	var height = $(window).height() - 25;
	var svg = d3.select("#heatmap").append("svg").attr("width", width).attr("height", height);

	var coords = [
	{ "inner": 0, "outer": .13, "color": "#A0D5D2", "offset": 15, "place": "Parterre Assis"},
	{ "inner": .15, "outer": .17, "color": "#ECE7E1", "offset": 0, "place": "Galerie"},
	{ "inner": .17, "outer": .22, "color": "#2F1330", "offset": 0, "place": "Prémier_Loge"},
	{ "inner": .24, "outer": .29, "color": "#4B4360", "offset": 0, "place": "Deuxième_Loge"},
	{ "inner": .31, "outer": .35, "color": "#627291", "offset": 0, "place": "Troisième_Loge"},
	{ "inner": .37, "outer": .42, "color": "#8AB0C0", "offset": 0, "place": "Paradis"}
	];

	var pi = Math.PI;

	$(coords).each(function(x,y){

		var arc = d3.arc()
		.innerRadius(Math.min(width,height) * y.inner)
		.outerRadius(Math.min(width,height) * y.outer)
		    .startAngle(-90 * (pi/180)) //converting from degs to radians
		    .endAngle(90 * (pi/180)) //just radians

		    svg.append("path")
		    .attr("d", arc)
		    .attr("class", "map")
		    .attr("stroke-width", "1px")
		    .attr("transform", "translate("+width/2+","+ (height/2 + y.offset) +")");

		});

}

