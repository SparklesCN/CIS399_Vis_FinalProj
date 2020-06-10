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
	// initial the map

  function updateSelect(data) {
    selectTrend.graphPlots(data);

  }



	const worldMap = new Map(dynamicData, updateSelect);

	d3.json('data/world.json').then(mapData => {
	        worldMap.drawMap(mapData);

	});

  const rank = new worldRank(dynamicData);

  const usTrend = new UsTrend(dynamicData[225]);
  const selectTrend = new SelectTrend();

}

function getPast30Days() {
    var arr = [];
    var beforedate = new Date();
    beforedate = new Date(new Date().setDate(beforedate.getDate()- 2))
    for (let i = 29; i >= 0; i--) {
      var priordate = new Date(new Date().setDate(beforedate.getDate()-i));
      var dd2 = priordate.getDate();
      var mm2 = priordate.getMonth()+1;//January is 0, so always add + 1
      var yyyy2 = priordate.getFullYear();
      var datefrommonthago = mm2 + '/' + dd2 + '/' + yyyy2.toString()[2] + yyyy2.toString()[3];
      arr.push(datefrommonthago);
    }

    return arr;

  }








