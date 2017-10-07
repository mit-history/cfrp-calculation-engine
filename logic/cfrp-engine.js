//gloabal variables
var current_season;
var current_season_min;
var current_season_max;
var current_season_days;

var current_season_seating_figures;

var current_theater = 'Odéon';
var prev_theater;


//UI actions

function dateChange(newDate) {
	$.getJSON('http://api2.cfregisters.org/registers?date=eq.' + newDate, function(data) {
		if (data.length > 0) {
			
			if (newDate < current_season_min || newDate > current_season_max) {
				seasonChange(seasonFinder(newDate));
			}
			setInfos(newDate);
			setDate(newDate);

			$("html").css("cursor", "default");
		} else {
			$(".play").html("<p> </p>");
			alert("No performance given on this evening");
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
	current_season_seating_figures = new Array();
	$.getJSON('logic/seasonsMaxMin.json', function(data) {
		for (var i = data.length - 1; i >= 0; i--) {
			if (data[i].season == current_season) {
				current_season_seating_figures.push(data[i]);
			}
		}
	});
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

	try {
		slider.noUiSlider.destroy();
	} catch(err) {}

	noUiSlider.create(slider, {
		start: 0,
		step: 1,
		connect: true,
		range: {
			'min': 0,
			'max': current_season_days.length-1
		}
	});

	slider.noUiSlider.on('change', function(){
		theLoad();
		dateChange(current_season_days[parseInt(slider.noUiSlider.get())]);
		$("#dayDate").val(current_season_days[parseInt(slider.noUiSlider.get())]);
		theUnload();
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
	if (theater === 'Tuileries'){
		tuileries();
	}
}


var width = $('#heatmap').width();
var height = $('#heatmap').height();
var measure = Math.min(width, height);

$(window).resize(function(){
	width = $('#heatmap').width();
	height = $('#heatmap').height();	
	measure = Math.min(width, height);
});


function guenegaud(){

	$('#heatmap').html('');
	width = $('#heatmap').width();
	height = $('#heatmap').height();
	measure = Math.min(width, height);	

	var heatmap = d3.select('#heatmap').append('svg')
		.attr("width", width)
		.attr("height", height);

	var arc3v = heatmap.append("line")
		.attr("x1", width * .8)
		.attr("y1", height / 2 - (measure * .16))
		.attr("x2", width * .8)
		.attr("y2", height / 2 + (measure * .16))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);
	var arc2v = heatmap.append("line")
		.attr("x1", width * .77)
		.attr("y1", height / 2 - (measure * .15))
		.attr("x2", width * .77)
		.attr("y2", height / 2 + (measure * .15))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);
	var arc1v = heatmap.append("line")
		.attr("x1", width * .74)
		.attr("y1", height / 2 - (measure * .14))
		.attr("x2", width * .74)
		.attr("y2", height / 2 + (measure * .14))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var arc3v_t = heatmap.append("line")
		.attr("x1", width * .73)
		.attr("y1", height / 2 - (measure * .25))
		.attr("x2", width * .8)
		.attr("y2", height / 2 - (measure * .15))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);
	var arc2v_t = heatmap.append("line")
		.attr("x1", width * .715)
		.attr("y1", height / 2 - (measure * .22))
		.attr("x2", width * .77)
		.attr("y2", height / 2 - (measure * .14))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);
	var arc1v_t = heatmap.append("line")
		.attr("x1", width * .7)
		.attr("y1", height / 2 - (measure * .19))
		.attr("x2", width * .74)
		.attr("y2", height / 2 - (measure * .13))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var arc3v_b = heatmap.append("line")
		.attr("x1", width * .73)
		.attr("y1", height / 2 + (measure * .25))
		.attr("x2", width * .8)
		.attr("y2", height / 2 + (measure * .15))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);
	var arc2v_b = heatmap.append("line")
		.attr("x1", width * .715)
		.attr("y1", height / 2 + (measure * .22))
		.attr("x2", width * .77)
		.attr("y2", height / 2 + (measure * .14))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);
	var arc1v_b = heatmap.append("line")
		.attr("x1", width * .7)
		.attr("y1", height / 2 + (measure * .19))
		.attr("x2", width * .74)
		.attr("y2", height / 2 + (measure * .13))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);


	var corner_2rt = heatmap.append("line")
		.attr("x1", width * .57)
		.attr("y1", height / 2 - (measure / 3.33))
		.attr("x2", width * .67)
		.attr("y2", height / 2 - (measure / 3.66))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var corner_1rt = heatmap.append("line")
		.attr("x1", width * .57)
		.attr("y1", height / 2 - (measure / 3.33) + (measure * .04))
		.attr("x2", width * .67)
		.attr("y2", height / 2 - (measure / 3.66) + (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var corner_1rb = heatmap.append("line")
		.attr("x1", width * .57)
		.attr("y1", height / 2 + (measure / 3.33) - (measure * .04))
		.attr("x2", width * .67)
		.attr("y2", height / 2 + (measure / 3.66) - (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var corner_2rb = heatmap.append("line")
		.attr("x1", width * .57)
		.attr("y1", height / 2 + (measure / 3.33))
		.attr("x2", width * .67)
		.attr("y2", height / 2 + (measure / 3.66))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_2rt = heatmap.append("line")
		.attr("x1", width * .5725)
		.attr("y1", height / 2 - (measure / 3.33) + (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 - (measure / 3.33) + (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_1rt = heatmap.append("line")
		.attr("x1", width * .5725)
		.attr("y1", height / 2 - (measure / 2.95) + (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 - (measure / 2.95) + (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_1rb = heatmap.append("line")
		.attr("x1", width * .5725)
		.attr("y1", height / 2 + (measure / 3.33) - (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 + (measure / 3.33) - (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_2rb = heatmap.append("line")
		.attr("x1", width * .5725)
		.attr("y1", height / 2 + (measure / 2.95) - (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 + (measure / 2.95) - (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_floor_2t = heatmap.append("line")
		.attr("x1", width * .5)
		.attr("y1", height / 2 - (measure / 3.81) + (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 - (measure / 3.81) + (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_floor_1t = heatmap.append("line")
		.attr("x1", width * .5)
		.attr("y1", height / 2 - (measure / 4.45) + (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 - (measure / 4.45) + (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_floor_1b = heatmap.append("line")
		.attr("x1", width * .5)
		.attr("y1", height / 2 + (measure / 3.81) - (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 + (measure / 3.81) - (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var box_floor_2b = heatmap.append("line")
		.attr("x1", width * .5)
		.attr("y1", height / 2 + (measure / 4.45) - (measure * .04))
		.attr("x2", width * .17)
		.attr("y2", height / 2 + (measure / 4.45) - (measure * .04))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var floor_vertical = heatmap.append("line")
		.attr("x1", width *  .4915)
		.attr("y1", height / 2 - (measure / 4.05))
		.attr("x2", width * .4915)
		.attr("y2", height / 2 + (measure / 4.05))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var ampitheater_r6 = heatmap.append("line")
		.attr("x1", width *  .68)
		.attr("y1", height / 2 - (measure / 7))
		.attr("x2", width *  .68)
		.attr("y2", height / 2 + (measure / 7))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var ampitheater_r5 = heatmap.append("line")
		.attr("x1", width *  .65)
		.attr("y1", height / 2 - (measure / 6))
		.attr("x2", width *  .65)
		.attr("y2", height / 2 + (measure / 6))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var ampitheater_r4 = heatmap.append("line")
		.attr("x1", width *  .62)
		.attr("y1", height / 2 - (measure / 6))
		.attr("x2", width *  .62)
		.attr("y2", height / 2 + (measure / 6))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var ampitheater_r3 = heatmap.append("line")
		.attr("x1", width *  .59)
		.attr("y1", height / 2 - (measure / 6))
		.attr("x2", width * .59)
		.attr("y2", height / 2 + (measure / 6))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var ampitheater_r2 = heatmap.append("line")
		.attr("x1", width *  .56)
		.attr("y1", height / 2 - (measure / 6))
		.attr("x2", width * .56)
		.attr("y2", height / 2 + (measure / 6))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

	var ampitheater_r1 = heatmap.append("line")
		.attr("x1", width *  .53)
		.attr("y1", height / 2 - (measure / 6))
		.attr("x2", width * .53)
		.attr("y2", height / 2 + (measure / 6))
		.attr("class", "section line")
		.attr("stroke-width", measure * .03);

}


function stgermain(){

	width = $('#heatmap').width();
	height = $('#heatmap').height();
	measure = Math.min(width, height);

	$('#heatmap').html('');

	var heatmap = d3.select('#heatmap').append('svg')
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate(" + width * -.05 + "," + height * 0 + ")");

	var arc_3r = d3.arc()
		.innerRadius(measure * .37)
		.outerRadius(measure * .34)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section troisiemeloge arc")
		.attr("d", arc_3r)
		.attr("transform", "translate(" + width * .625 + "," + height / 2 + ")");

	var arc_2r = d3.arc()
		.innerRadius(measure * .33)
		.outerRadius(measure * .3)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section deuxiemeloge arc")
		.attr("d", arc_2r)
		.attr("transform", "translate(" + width * .625 + "," + height / 2 + ")");

	var arc_1r = d3.arc()
		.innerRadius(measure * .29)
		.outerRadius(measure * .26)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section premiereloge arc")
		.attr("d", arc_1r)
		.attr("transform", "translate(" + width * .625 + "," + height / 2 + ")");

	var loge_3rt = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 - (measure / 2.8175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 - (measure / 2.8175))
		.attr("class", "section troisiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_3rb = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 + (measure / 2.8175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 + (measure / 2.8175))
		.attr("class", "section troisiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_2rt = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 - (measure / 3.175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 - (measure / 3.175))
		.attr("class", "section deuxiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_2rb = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 + (measure / 3.175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 + (measure / 3.175))
		.attr("class", "section deuxiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_1rt = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 - (measure / 3.635))
		.attr("x2", width * .25)
		.attr("y2", height / 2 - (measure / 3.635))
		.attr("class", "section premiereloge line")
		.attr("stroke-width", measure * .03);
	var loge_1rb = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 + (measure / 3.635))
		.attr("x2", width * .25)
		.attr("y2", height / 2 + (measure / 3.635))
		.attr("class", "section premiereloge line")
		.attr("stroke-width", measure * .03);

	var amphitheater_4e = heatmap.append("line")
		.attr("x1", width * .7 + (measure * .04))
		.attr("y1", height / 2 + (measure * .1))
		.attr("x2", width * .7 + (measure * .04))
		.attr("y2", height / 2 - (measure * .1))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);
	var amphitheater_3e = heatmap.append("line")
		.attr("x1", width * .68 + (measure * .03))
		.attr("y1", height / 2 + (measure * .18))
		.attr("x2", width * .68 + (measure * .03))
		.attr("y2", height / 2 - (measure * .18))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);
	var amphitheater_2e = heatmap.append("line")
		.attr("x1", width * .66 + (measure * .02))
		.attr("y1", height / 2 + (measure * .2))
		.attr("x2", width * .66 + (measure * .02))
		.attr("y2", height / 2 - (measure * .2))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);
	var amphitheater_1e = heatmap.append("line")
		.attr("x1", width * .64 + (measure * .01))
		.attr("y1", height / 2 + (measure * .22))
		.attr("x2", width * .64 + (measure * .01))
		.attr("y2", height / 2 - (measure * .22))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);

	var parterre = heatmap.append("rect")
		.attr("x", width * .35)
		.attr("y", height / 2 - (measure * .24))
		.attr("width", width * .245)
		.attr("height", measure / 2 - (measure * .02))
		.attr("class", "section parterre rect");

	var front_3 = heatmap.append("line")
		.attr("x1", width * .31)
		.attr("y1", height / 2 + (measure * .24))
		.attr("x2", width * .31)
		.attr("y2", height / 2 - (measure * .24))
		.attr("class", "section front line")
		.attr("stroke-width", measure * .02);
	var front_2 = heatmap.append("line")
		.attr("x1", width * .29)
		.attr("y1", height / 2 + (measure * .24))
		.attr("x2", width * .29)
		.attr("y2", height / 2 - (measure * .24))
		.attr("class", "section front line")
		.attr("stroke-width", measure * .02);
	var front_1 = heatmap.append("line")
		.attr("x1", width * .27)
		.attr("y1", height / 2 + (measure * .24))
		.attr("x2", width * .27)
		.attr("y2", height / 2 - (measure * .24))
		.attr("class", "section front line")
		.attr("stroke-width", measure * .02);
}


function tuileries(){

	width = $('#heatmap').width();
	height = $('#heatmap').height();
	measure = Math.min(width, height);

	$('#heatmap').html('');

	var heatmap = d3.select('#heatmap').append('svg')
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate(" + width * -.05 + "," + height * 0 + ")");

	var arc_3r = d3.arc()
		.innerRadius(measure * .37)
		.outerRadius(measure * .34)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section troisiemeloge arc")
		.attr("d", arc_3r)
		.attr("transform", "translate(" + width * .625 + "," + height / 2 + ")");

	var arc_2r = d3.arc()
		.innerRadius(measure * .33)
		.outerRadius(measure * .3)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section deuxiemeloge arc")
		.attr("d", arc_2r)
		.attr("transform", "translate(" + width * .625 + "," + height / 2 + ")");

	var arc_1r = d3.arc()
		.innerRadius(measure * .29)
		.outerRadius(measure * .26)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section premiereloge arc")
		.attr("d", arc_1r)
		.attr("transform", "translate(" + width * .625 + "," + height / 2 + ")");

	var loge_3rt = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 - (measure / 2.8175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 - (measure / 2.8175))
		.attr("class", "section troisiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_3rb = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 + (measure / 2.8175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 + (measure / 2.8175))
		.attr("class", "section troisiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_2rt = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 - (measure / 3.175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 - (measure / 3.175))
		.attr("class", "section deuxiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_2rb = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 + (measure / 3.175))
		.attr("x2", width * .25)
		.attr("y2", height / 2 + (measure / 3.175))
		.attr("class", "section deuxiemeloge line")
		.attr("stroke-width", measure * .03);
	var loge_1rt = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 - (measure / 3.635))
		.attr("x2", width * .25)
		.attr("y2", height / 2 - (measure / 3.635))
		.attr("class", "section premiereloge line")
		.attr("stroke-width", measure * .03);
	var loge_1rb = heatmap.append("line")
		.attr("x1", width * .625)
		.attr("y1", height / 2 + (measure / 3.635))
		.attr("x2", width * .25)
		.attr("y2", height / 2 + (measure / 3.635))
		.attr("class", "section premiereloge line")
		.attr("stroke-width", measure * .03);

	var amphitheater_4e = heatmap.append("line")
		.attr("x1", width * .7 + (measure * .04))
		.attr("y1", height / 2 + (measure * .1))
		.attr("x2", width * .7 + (measure * .04))
		.attr("y2", height / 2 - (measure * .1))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);
	var amphitheater_3e = heatmap.append("line")
		.attr("x1", width * .68 + (measure * .03))
		.attr("y1", height / 2 + (measure * .18))
		.attr("x2", width * .68 + (measure * .03))
		.attr("y2", height / 2 - (measure * .18))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);
	var amphitheater_2e = heatmap.append("line")
		.attr("x1", width * .66 + (measure * .02))
		.attr("y1", height / 2 + (measure * .2))
		.attr("x2", width * .66 + (measure * .02))
		.attr("y2", height / 2 - (measure * .2))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);
	var amphitheater_1e = heatmap.append("line")
		.attr("x1", width * .64 + (measure * .01))
		.attr("y1", height / 2 + (measure * .22))
		.attr("x2", width * .64 + (measure * .01))
		.attr("y2", height / 2 - (measure * .22))
		.attr("class", "section amphitheater line")
		.attr("stroke-width", measure * .03);

	var parterre = heatmap.append("rect")
		.attr("x", width * .35)
		.attr("y", height / 2 - (measure * .24))
		.attr("width", width * .245)
		.attr("height", measure / 2 - (measure * .02))
		.attr("class", "section parterre rect");


};


function odeon(){

	$('#heatmap').html('');
	var width = $('#heatmap').width();
	var height = $('#heatmap').height();	
	var measure = Math.min(width, height);	

	var heatmap = d3.select('#heatmap').append('svg')
		.attr("width", width)
		.attr("height", height)
		.attr("transform", "translate(" + width * -.05 + "," + 0 + ")");


	var paradis = d3.arc()
		.innerRadius(measure * .4)
		.outerRadius(measure * .38)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", paradis)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var paradis2 = d3.arc()
		.innerRadius(measure * .43)
		.outerRadius(measure * .41)
		.startAngle(.2 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", paradis2)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var paradis3 = d3.arc()
		.innerRadius(measure * .43)
		.outerRadius(measure * .41)
		.startAngle(.8 * Math.PI)
		.endAngle(1 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", paradis3)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var paradis4 = d3.arc()
		.innerRadius(measure * .43)
		.outerRadius(measure * .41)
		.startAngle(.25 * Math.PI)
		.endAngle(.75 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", paradis4)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var paradis5 = d3.arc()
		.innerRadius(measure * .46)
		.outerRadius(measure * .44)
		.startAngle(.2 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", paradis5)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var paradis6 = d3.arc()
		.innerRadius(measure * .46)
		.outerRadius(measure * .44)
		.startAngle(.8 * Math.PI)
		.endAngle(1 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", paradis6)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var paradis7 = d3.arc()
		.innerRadius(measure * .46)
		.outerRadius(measure * .44)
		.startAngle(.25 * Math.PI)
		.endAngle(.75 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", paradis7)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");


	var para1t = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) - (measure * .40))
		.attr("width", measure * .3)
		.attr("height", (measure * .02))
		.attr("class", "section");
	var para1b = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) + (measure * .38))
		.attr("width", measure * .3)
		.attr("height", (measure * .02))
		.attr("class", "section");


	var arc_3r = d3.arc()
		.innerRadius(measure * .37)
		.outerRadius(measure * .34)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", arc_3r)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var arc_2r = d3.arc()
		.innerRadius(measure * .33)
		.outerRadius(measure * .3)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", arc_2r)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");
	
	var arc_1r = d3.arc()
		.innerRadius(measure * .29)
		.outerRadius(measure * .26)
		.startAngle(1 * Math.PI)
		.endAngle(0 * Math.PI);
	heatmap.append("path")
		.attr("class", "section")
		.attr("d", arc_1r)
		.attr("transform", "translate(" + width * .5 + "," + height / 2 + ")");

	var parterre0 = heatmap.append("rect")
		.attr("x", (width * .5) + measure * .08)
		.attr("y",  (height * .5) - (measure * .19))
		.attr("width", measure * .03)
		.attr("height", (measure * .39))
		.attr("class", "section parterre line");
	var parterre1 = heatmap.append("rect")
		.attr("x", (width * .5) + measure * .04)
		.attr("y",  (height * .5) - (measure * .21))
		.attr("width", measure * .03)
		.attr("height", (measure * .43))
		.attr("class", "section parterre line");
	var parterre2 = heatmap.append("rect")
		.attr("x", (width * .5))
		.attr("y",  (height * .5) - (measure * .24))
		.attr("width", measure * .03)
		.attr("height", (measure * .48))
		.attr("class", "section parterre line");
	var parterre3 = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .04)
		.attr("y",  (height * .5) - (measure * .24))
		.attr("width", measure * .03)
		.attr("height", (measure * .48))
		.attr("class", "section parterre line");
	var parterre4 = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .08)
		.attr("y",  (height * .5) - (measure * .24))
		.attr("width", measure * .03)
		.attr("height", (measure * .48))
		.attr("class", "section parterre line");
	var parterre5 = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .12)
		.attr("y",  (height * .5) - (measure * .24))
		.attr("width", measure * .03)
		.attr("height", (measure * .48))
		.attr("class", "section parterre line");
	var parterre6 = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .16)
		.attr("y",  (height * .5) - (measure * .24))
		.attr("width", measure * .03)
		.attr("height", (measure * .48))
		.attr("class", "section parterre line");
	var parterre7 = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .20)
		.attr("y",  (height * .5) - (measure * .24))
		.attr("width", measure * .03)
		.attr("height", (measure * .48))
		.attr("class", "section parterre line");

	var rect3t = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) - (measure * .37))
		.attr("width", measure * .3)
		.attr("height", (measure * .03))
		.attr("class", "section");
	var rect2t = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) - (measure * .33))
		.attr("width", measure * .3)
		.attr("height", (measure * .03))
		.attr("class", "section");
	var rect1t = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) - (measure * .29))
		.attr("width", measure * .3)
		.attr("height", (measure * .03))
		.attr("class", "section");

	var rect1b = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) + (measure * .26))
		.attr("width", measure * .3)
		.attr("height", (measure * .03))
		.attr("class", "section");
	var rect2b = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) + (measure * .30))
		.attr("width", measure * .3)
		.attr("height", (measure * .03))
		.attr("class", "section");
	var rect3b = heatmap.append("rect")
		.attr("x", (width * .5) - measure * .3)
		.attr("y",  (height * .5) + (measure * .34))
		.attr("width", measure * .3)
		.attr("height", (measure * .03))
		.attr("class", "section");	

}

// var classname;
// var currentColor;
// $(document).on("mouseover", ".section", function(){
// 		classname = $(this).attr("class").split(" ")[1];
// 		currentColor = $(this).attr("data-color");
// 		highlight(classname, "gold");
// 	})
// 	.mouseout(function(){
// 		highlight(classname, "#159489");
// 	});


// function highlight(selector, color){

//     var elements = $("." + selector);    
//     for (var i = 0; i < elements.length; i++) {
//         elements[i].style.fill = color;
//         elements[i].style.stroke = color;
//     }
// }


