$(document).ready(function() {

	/*Jquery cylcle plugin to layout slideshow of pictures in the background*/
	$('#slideshow').cycle({
		fx: 'fade',
		pager: '#smallnav', 
		pause:   1, 
		speed: 1800,
		timeout:  3500 
	});	

	/*Jquery autocomplete plugin, used to autocomplete city field with city, state and Country*/
	$(".city").autocomplete({
      source: function( request, response ) {
        $.ajax({
          url: "http://gd.geobytes.com/AutoCompleteCity", /*This is a Geobytes API json call to fetch the city results*/
          dataType: "jsonp",
          data: {
            q: request.term
          },
          success: function( data ) {
			response(data);
          }
        });
      },
      minLength: 3,
      select: function( event, ui ) {
      	return ui.item ? $(this).val(ui.item.label) : $(this).val(this.value);
      },
      open: function() {
        $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
      },
      close: function() {
        $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
      }
    });

	/*check for the change in the selection of radio button and clear the results div*/
	$('input:radio[name="forecast"]').change(function() {
		/*clear the previous fields in the result div before displaying the new results */
		clearAllFields();
	});

	$('#inputForm').submit(function() {
		
		var sourceCity = $('#source').val();
		var destCity = $('#dest').val();
		/*Determine the type of forecast( 3 day or 10 day )*/
		var selectedChoice = $('input[name=forecast]:checked', '#inputForm').val();

		/*This method setups calls to the weather underground API calls*/
		showComparisonChart(sourceCity, destCity, selectedChoice);

	});	

	function showComparisonChart(source, dest, selectedChoice) {

		/*Get source city forecast based on the forecast type*/
		var srcCityArray = source.split(",");
		getSourceCityForecast(srcCityArray, selectedChoice);

		/*Get destination city forecast based on the forecast type*/
		var destCityArray = dest.split(",");
		getDestCityForecast(destCityArray, selectedChoice);
	
	}

	/*This method provides an AJAX call to fetech forecast from weather underground for soure city */
	/*and append the response to the result div*/
	function getSourceCityForecast(cityArray, selectedChoice) {

		var srcRes = $.ajax({
			url: "http://api.wunderground.com/api/178a89cfc9ccecd8/" + selectedChoice + "/q/" + cityArray[1].trim() + "/" + cityArray[0].trim() + ".json",
			dataType: "json",
			type: "GET",
		})
		.done(function(srcRes){
			var html = "<span>" + cityArray[0].trim() +  "</span>";
			$('#srcResult').append(html);
			$.each(srcRes.forecast.simpleforecast.forecastday, function(i)  {
			    var srchtml = "<ul><li><span> Day " + srcRes.forecast.simpleforecast.forecastday[i].period + ": Date: " + srcRes.forecast.simpleforecast.forecastday[i].date.month + "/" + srcRes.forecast.simpleforecast.forecastday[i].date.day + "/" + srcRes.forecast.simpleforecast.forecastday[i].date.year + " </span><img src='" + srcRes.forecast.simpleforecast.forecastday[i].icon_url + "'></img><span>High: " + srcRes.forecast.simpleforecast.forecastday[i].high.fahrenheit + " F</span><span> Low:" + srcRes.forecast.simpleforecast.forecastday[i].low.fahrenheit + " F</span></li></ul>";
				$('#srcResult').append(srchtml);
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			alert("error");
		});
	}

	/*This method provides an AJAX call to fetech forecast from weather underground for destination*/
	/*city and append the response to the result div*/
	function getDestCityForecast(cityArray, selectedChoice) {

		var destRes = $.ajax({
			url: "http://api.wunderground.com/api/178a89cfc9ccecd8/" + selectedChoice + "/q/" + cityArray[1].trim() + "/" + cityArray[0].trim() + ".json",
			dataType: "json",
			type: "GET",
		})
		.done(function(destRes){
			var html = "<span>" + cityArray[0].trim() +  "</span>";
			$('#destResult').append(html); 
			$.each(destRes.forecast.simpleforecast.forecastday, function(i)  {
				var desthtml = "<ul><li><span> Day " + destRes.forecast.simpleforecast.forecastday[i].period + ": Date: " + destRes.forecast.simpleforecast.forecastday[i].date.month + "/" + destRes.forecast.simpleforecast.forecastday[i].date.day + "/" + destRes.forecast.simpleforecast.forecastday[i].date.year + " </span><img src='" + destRes.forecast.simpleforecast.forecastday[i].icon_url + "'></img><span>High: " + destRes.forecast.simpleforecast.forecastday[i].high.fahrenheit + " F</span><span> Low: " + destRes.forecast.simpleforecast.forecastday[i].low.fahrenheit + " F</span></li></ul>";
				$('#destResult').append(desthtml);
			});
		})
		.fail(function(jqXHR, error, errorThrown){
			alert("error");
		});
	}

	function clearAllFields() {
		/*$('#source').val("");
		$('#dest').val("");*/
		$('#srcResult').html("");
		$('#destResult').html("");
	}
});