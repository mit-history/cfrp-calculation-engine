$.ajaxSetup({
	async: false
});

var visitCode;


function isValidDate(dateString) {
	var regEx = /^\d{4}-\d{2}-\d{2}$/;
		if(!dateString.match(regEx)) return false;  // Invalid format // Invalid date (or this could be epoch)
		return true;
}

function theLoad() {
	$("body").css({ opacity: 0.5 });
}

function theUnload() {
	$("body").css({ opacity: 1 });
}


	$("document").ready(function () {

		$("body").css("cursor", "progress");
		seasonChange("1680-1681");
		seasonslider.value = 0;


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

		$("#season1").on("change", function (e) {
			reset_date=true;

			if (e.originalEvent) {
				if(parseInt($("#season1").val()) < 1680 || isNaN(parseInt($("#season1").val()))) {
					$("#season1").val("1680");
				}
				if(parseInt($("#season1").val()) > 1792) {
					$("#season1").val("1792");
				}
				$("html").css("cursor", "progress");
				$("#season2").val(parseInt($("#season1").val())+1);

				theLoad();
				seasonChange($("#season1").val() + "-" + $("#season2").val());
				theUnload();
			}
		});
		$("#season2").on("change", function (e) {
			reset_date=true;
			if (e.originalEvent) {
				if(parseInt($("#season2").val()) < 1681 || isNaN(parseInt($("#season2").val()))) {
					$("#season2").val("1681");
				}
				if(parseInt($("#season2").val()) > 1793) {
					$("#season2").val("1793");
				}
				$("html").css("cursor", "progress");
				$("#season1").val(parseInt($("#season2").val())-1);

				theLoad();
				seasonChange($("#season1").val() + "-" + $("#season2").val());
				theUnload();
			}
		});

		$("#dayDate").on("change", function (e) {
			reset_date=false;
			$("html").css("cursor", "progress");
			if (e.originalEvent) { 
				if(isValidDate($("#dayDate").val())) {
					theLoad();
					dateChange($("#dayDate").val());
					theUnload();
				} else {
					alert("Date must be in the YYYY-MM-DD format");
				}
			}

		// test if there is a performance at this date
		
		});

		//change venues
		$("#chv_guenegaud").on("click", function (e) {
			theLoad();
			dateChange("1680-04-30");
			theUnload();
		});
		$("#chv_fsgpI").on("click", function (e) {
			theLoad();
			dateChange("1689-04-18");
			theUnload();
		});
		$("#chv_fsgpII").on("click", function (e) {
			theLoad();
			dateChange("1760-04-14");
			theUnload();
		});
		$("#chv_tuileries").on("click", function (e) {
			theLoad();
			dateChange("1770-04-23");
			theUnload();
		});
		$("#chv_odeon").on("click", function (e) {
			theLoad();
			dateChange("1782-04-09");
			theUnload();
		});


		//+1/-1 slider
		$("#onedayless").on("click", function (e) { 
			theLoad();
			slider.noUiSlider.set(parseInt(slider.noUiSlider.get())-1);
			dateChange(current_season_days[parseInt(slider.noUiSlider.get())]);
			$("#dayDate").val(current_season_days[parseInt(slider.noUiSlider.get())]);
			theUnload();
		});
		$("#onedaymore").on("click", function (e) { 
			theLoad();
			// slider.noUiSlider.set(parseInt(slider.noUiSlider.get())+1);
			dateChange(current_season_days[parseInt(slider.noUiSlider.get())]);
			$("#dayDate").val(current_season_days[parseInt(slider.noUiSlider.get())]);
			theUnload();
		});


		//VISITS
		$("#pause").on("click", function (e) {
			console.log(visitCode);
			clearInterval(visitCode);
		});

		$("#play").on("click", function (e) { 
			// Warning : it is still possible to start multiple overlapping intervals 
			// Note: Intervals no longer overlappable (play button hides when running)
			visitCode = setInterval(function() {
				theLoad();
				// slider.noUiSlider.set(parseInt(slider.noUiSlider.get())+1);
				seasonslider.value = seasonslider.value + 1;
				dateChange(current_season_days[seasonslider.value]);
				// dateChange(current_season_days[parseInt(slider.noUiSlider.get())]);
				$("#dayDate").val(current_season_days[parseInt(slider.noUiSlider.get())]);


				theUnload();
			},4000); //the stop only work if loading can occur before the entier timeout pass. 
		});
	});
