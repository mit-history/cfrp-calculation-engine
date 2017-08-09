//gloabal variables
var current_season="1680-1681";
var current_season_min;
var current_season_max;
var current_season_days;

var current_season_seating_profile_ids;
var current_season_seating_profile_max;
var current_season_seating_profile_min;
var current_season_seating_profile_avg;

var current_theater;
var prev_theater;


//UI actions

function dateChange(newDate) {
	if (newDate < current_season_min || newDate > current_season_max) {
		seasonChange(seasonFinder(newDate));
	}
	setInfos(newDate);
	setDate(newDate);
	$("html").css("cursor", "default");
	//setDate(newDate);
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

	$("#slider").slider({
		max:current_season_days.length,
		change: function(event,ui) {
			dateChange(current_season_days[ui.value]);
			$("#dayDate").val(current_season_days[ui.value]);
		}

	});
}

function drawTheater() {
	//draw a theater from a certain period
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

	if(prev_theater === current_theater) {
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

				if (evening_totals[j].id == data[i].seating_category_profile_id) {
					evening_totals[j].total += data[i].recorded_total_l;
					evening_totals[j].name = data[i].category;
				}
			}
		});
	});
	
	heatmapFireworks(JSON.stringify(evening_totals));
	
}

function setScale() {

}