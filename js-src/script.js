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
               // console.log(current);
           }
           output.push(doc);
        }       
        
        console.log(output);
    },
    error: function(jqXHR, textStatus, errorThrow){
        console.log(textStatus);
    }
});

var dict = [];
dict['China'] = [];

dict['China']['2000'] = 100;



// function combineCountryInfo(data) {
//     let countryInfo = [];
//     for (let i = 0; i < data.length; i++) {
//         let curData = data[i];
//         let curDataCountry = curData["Country/Region"];
//         // check if cur Country exist in the list, add new if not
//         if ((typeof (countryInfo[curDataCountry)]) == "undefined") {
//             countryInfo[curDataCountry] = [];
//         }
        
//     }
// }



loadData().then(data => {
    // no country selected by default
    this.activeCountry = null;
    // deafultActiveYear is 2000
    this.activeYear = '2000';
    let that = this;

    // ******* TODO: PART 3 *******
    /**
     * Calls the functions of the views that need to react to a newly selected/highlighted country
     *
     * @param countryID the ID object for the newly selected country
     */
    function updateCountry(countryID) {

        that.activeCountry = countryID;

        //TODO - Your code goes here - 
        gapPlot.updateHighlightClick(countryID);
        worldMap.updateHighlightClick(countryID);
        gapPlot.selectedCountry = countryID;
        worldMap.selectedCountry = countryID;

        infoBox.updateTextDescription(countryID, that.activeYear);
        that.activeCountry = countryID;

    }

    // ******* TODO: PART 3 *******

    /**
     *  Takes the specified activeYear from the range slider in the GapPlot view.
     *  It takes the value for the activeYear as the parameter. When the range slider is dragged, we have to update the
     *  gap plot and the info box.
     *  @param year the new year we need to set to the other views
     */
    function updateYear(year) {
        that.activeYear = year;
        gapPlot.activeYear = year;
        gapPlot.updatePlot(year);
        infoBox.updateTextDescription(that.activeCountry, that.activeYear);

    }
    // Creates the view objects
    const infoBox = new InfoBox(data);
    const worldMap = new Map(data, updateCountry);
    const gapPlot = new GapPlot(data, updateCountry, updateYear, this.activeYear);


    // Initialize the plots; pick reasonable default values

    // here we load the map data
    d3.json('data/world.json').then(mapData => {


        // ******* TODO: PART I *******

        // You need to pass the world topo data to the drawMap() function as a parameter
        worldMap.drawMap(mapData);

    });

    // This clears a selection by listening for a click
    document.addEventListener("click", function(e) {
        //TODO - Your code goes here - 
		// call clear highight methods
        gapPlot.clearHighlight();
        worldMap.clearHighlight();
        gapPlot.selectedCountry = "null";
        worldMap.selectedCountry = "null";
    }, true);
});

// ******* DATA LOADING *******
// We took care of that for you

/**
 * A file loading function or CSVs
 * @param file
 * @returns {Promise<T>}
 */
async function loadFile(file) {
    let data = await d3.csv(file).then(d => {
        let mapped = d.map(g => {
            for (let key in g) {
                let numKey = +key;
                if (numKey) {
                    g[key] = +g[key];
                }
            }
            return g;
        });
        return mapped;
    });
    return data;
}

async function loadData() {
    let pop = await loadFile('data/pop.csv');
    let gdp = await loadFile('data/gdppc.csv');
    let tfr = await loadFile('data/tfr.csv');
    let cmu = await loadFile('data/cmu5.csv');
    let life = await loadFile('data/life_expect.csv');

    //return [pop, gdp, tfr, cmu, life];
    return {
        'population': pop,
        'gdp': gdp,
        'child-mortality': cmu,
        'life-expectancy': life,
        'fertility-rate': tfr
    };
}
