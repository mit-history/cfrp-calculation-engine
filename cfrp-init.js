$.ajaxSetup({
	async: false
});
$("document").ready(function () {
	seasonChange("1680-1681");
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
			if(parseInt($("#season1").val()) < 1681 || isNaN(parseInt($("#season1").val()))) {
				$("#season2").val("1681");
			}
			if(parseInt($("#season1").val()) > 1793) {
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
	});
});