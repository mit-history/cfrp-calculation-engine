<?php 

try {
$bdd = pg_connect("host=localhost dbname=cfrp user=cschuwey password=goldpen855 port=5432 connect_timeout=60"); 
} catch (PDOException $e) {
	echo($e->getMessage());
}
$dates=array();

$seasons=array();

if($_GET['req']=="days") {
	getSeason();
} else {
	getSeasons();
}


function getSeason() {
	global $bdd;
	global $dates;
	$result = pg_query($bdd,"select date from registers where season like '" . $_GET['season'] . "' order by date");
	
	while ($row = pg_fetch_row($result)) {
		array_push($dates,$row[0]);
	}
	echo(json_encode($dates));
}


function getSeasons() {
	global $bdd;
	global $seasons;
	$result = pg_query($bdd,"select distinct season from registers order by season");
	
	while ($row = pg_fetch_row($result)) {
		array_push($seasons,$row[0]);
	}
	echo(json_encode($seasons));
}

?>
