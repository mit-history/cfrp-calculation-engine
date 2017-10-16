

$(".buttons.about").on("click",function () {
	ht_appear();
});

$(".howto_div").on("click",function() {
	ht_disappear();
});

$(window).scroll(function() {
	ht_disappear();
});

$(window).resize(function() {
	ht_disappear();
});

function ht_appear() {

$(".howto_div").css("visibility","visible");

var seasonCoords = $(".season").position();
$(".arrow1").css("left",seasonCoords.left-200);
$(".arrow1").css("top",seasonCoords.top-50);
$(".arrow1").css("visibility","visible");

seasonCoords = $(".slider-box").position();
$(".arrow2").css("left",seasonCoords.left+80);
$(".arrow2").css("top",seasonCoords.top-150);
$(".arrow2").css("visibility","visible");

seasonCoords = $(".date").position();
$(".arrow3").css("left",seasonCoords.left+120);
$(".arrow3").css("top",seasonCoords.top+30);
$(".arrow3").css("visibility","visible");


seasonCoords = $("#heatmap").position();
$(".ht_instructions").css("left",seasonCoords.left+140);
$(".ht_instructions").css("top",seasonCoords.top);
$(".ht_instructions").css("visibility","visible");
}

function ht_disappear() {
	$(".howto_div").css("visibility","hidden");
	$(".arrow1").css("visibility","hidden");
	$(".arrow2").css("visibility","hidden");
	$(".arrow3").css("visibility","hidden");
	$(".ht_instructions").css("visibility","hidden");
}