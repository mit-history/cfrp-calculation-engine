<?php 
$bdd = pg_connect("host=localhost dbname=cfrp user=cschuwey password=goldpen855 port=5432"); 
$max_vals=array();
$day_vals=array();
$dates=array();

if (isset($_GET['max'])) {
	getSeasonMax("");
}

if(isset($_GET['day'])) {
	getSeated($_GET['day']);
}

if(isset($GET['theDays'])) {
	getSeason();
}


function getSeasonMax($season) {
	global $bdd;
	global $max_vals;

	//Parterre
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=39");
	$max_vals['parterre'] = pg_fetch_row($result)[0];

	//Galeries
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=36");
	$max_vals['galerie'] = pg_fetch_row($result)[0];

	//1eres
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=27");
	$addition = intval(pg_fetch_row($result)[0]);
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=28");
	$addition += intval(pg_fetch_row($result)[0]);
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=37");
	$addition += intval(pg_fetch_row($result)[0]);
	$max_vals['1eres'] = $addition;

	//2èmes
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=29");
	$addition = intval(pg_fetch_row($result)[0]);
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=30");
	$addition += intval(pg_fetch_row($result)[0]);
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=38");
	$addition += intval(pg_fetch_row($result)[0]);
	$max_vals['2emes'] = $addition;

	//3èmes
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=31");
	$addition = intval(pg_fetch_row($result)[0]);
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=32");
	$addition += intval(pg_fetch_row($result)[0]);
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=33");
	$addition += intval(pg_fetch_row($result)[0]);
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=40");
	$addition += intval(pg_fetch_row($result)[0]);
	$max_vals['3emes'] = $addition;

	//Paradis
	$result = pg_query($bdd, "select max(recorded_total_l) from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.season like '1784-1785' and ticket_sales.seating_category_id=41");
	$max_vals['paradis'] = pg_fetch_row($result)[0];

	echo(json_encode($max_vals));

}

function getSeated($day) {
	global $bdd;
	global $day_vals;

	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=39");
	$day_vals['parterre'] = pg_fetch_row($result)[0];

	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=36");
	$day_vals['galerie'] = pg_fetch_row($result)[0];

	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=27");
	$addition = pg_fetch_row($result)[0];
	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=28");
	$addition += pg_fetch_row($result)[0];
	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=37");
	$addition += pg_fetch_row($result)[0];
	$day_vals['1eres'] = $addition;

	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=29");
	$addition = pg_fetch_row($result)[0];
	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=30");
	$addition += pg_fetch_row($result)[0];
	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=38");
	$addition += pg_fetch_row($result)[0];
	$day_vals['2emes'] = $addition;

	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=31");
	$addition = pg_fetch_row($result)[0];
	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=32");
	$addition += pg_fetch_row($result)[0];
	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=33");
	$addition += pg_fetch_row($result)[0];
	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=40");
	$addition += pg_fetch_row($result)[0];
	$day_vals['3emes'] = $addition;

	$result = pg_query($bdd, "select ticket_sales.recorded_total_l from registers inner join ticket_sales on registers.id=ticket_sales.register_id where registers.date='". $day . "' and ticket_sales.seating_category_id=41");
	$day_vals['paradis'] = pg_fetch_row($result)[0];

	echo(json_encode($day_vals));
}



?>
