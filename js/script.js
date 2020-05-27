jQuery.ajax({
    url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
    type: 'get',
    dataType: 'text',
    success: function(data) {
        let lines = data.split('\n');
        let fields = lines[0].split(',');
        
        let output = [];

        for(let i = 1; i < lines.length; i++){
           let current = lines[i].split(',');
           let doc = {};
           for(let j = 0; j < fields.length; j++){
               doc[fields[j]] = current[j];
           }
           output.push(doc);
        }       
        initProj(output);

    },
    error: function(jqXHR, textStatus, errorThrow){
    	console.log(textStatus);
    }
});



function initProj(dynamicData) {
	console.log(dynamicData);
	// initial the map
	const worldMap = new Map(dynamicData);

	d3.json('data/world.json').then(mapData => {
	        worldMap.drawMap(mapData);

	});

}







