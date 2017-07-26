# cfrp-calculation-engine
Calculation Engine

Those are the CFRP-HEATMAP files.

All database requests are handled by the PHP files that deliver JSON objects :
– getDays get performance days from one season and list of seasons (currently working to make the tool compatible with all the base).
– seating_measures.php do the math. That is the engin. It will definitly improve by using directly the API.

The odeon.html file makes 3 Ajax request to them and sets the scale accordingly.
