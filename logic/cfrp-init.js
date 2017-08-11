$.ajaxSetup({
	async: false
});



$("document").ready(function () {
	$("body").css("cursor","progress");
	seasonChange("1680-1681");
// <<<<<<< HEAD
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
