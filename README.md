# cfrp-calculation-engine
Calculation Engine

Those are the CFRP-HEATMAP files.

All database requests are handled by the PHP files that deliver JSON objects :  
– getDays.php retrives the performance days from one season and the list of all seasons (currently extending the tool compatibility with all the base).  
– seating_measures.php do the math. That is the calculation engine. The code would definitly improve by using the API directly.   

The odeon.html file makes 3 Ajax requests to the PHP files, sets the scale and the colors accordingly. 
