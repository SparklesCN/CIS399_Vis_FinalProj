/**
 * Data structure for the data associated with an individual country.
 * the CountryData class will be used to keep the data for drawing your map.
 * You will use the region to assign a class to color the map!
 */
class CountryData {
    /**
     *
     * @param type refers to the geoJSON type- countries are considered features
     * @param properties contains the value mappings for the data
     * @param geometry contains array of coordinates to draw the country paths
     * @param region the country region
     */
    constructor(type, id, properties, geometry, region) {

        this.type = type;
        this.id = id;
        this.properties = properties;
        this.geometry = geometry;
        this.region = region;
    }
}

/** Class representing the map view. */
class Map {

    /**
     * Creates a Map Object
     *
     * @param data the full dataset
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     */
    constructor(data, updateCountry) {
        // ******* TODO: PART I *******
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        // this.projection = d3.geoConicConformal().scale(200).translate([500, 450]);
        this.nameArray = data.population.map(d => d.geo.toUpperCase());
        this.populationData = data.population;
        this.updateCountry = updateCountry;
        this.selectedCountry;

    }

    /**
     * Renders the map
     * @param world the topojson data with the shape of all countries and a string for the activeYear
     */
    drawMap(world) {
        //note that projection is global!

        // ******* TODO: PART I *******

        //world is a topojson file. you will have to convert this to geojson (hint: you should have learned this in class!

        // Draw the background (country outlines; hint: use #map-chart)
        // Make sure to add a graticule (gridlines) and an outline to the map

        // Hint: assign an id to each country path to make it easier to select afterwards
        // we suggest you use the variable in the data element's id field to set the id

        // Make sure and give your paths the appropriate class (see the .css selectors at
        // the top of the provided html file)

        // You need to match the country with the region. This can be done using .map()
        // We have provided a class structure for the data called CountryData that you should assign the paramters to in your mapping

        //TODO - Your code goes here - 
        let that = this;

        let geojson = topojson.feature(world, world.objects.countries);

        // console.log("------------geojson.features-----------")
        console.log(geojson.features);
        // console.log(topojson.feature(world, world.objects.countries));
        // console.log("---------------------------------------")


        let countryData = geojson.features.map(country => {

            let index = this.nameArray.indexOf(country.id);
            let region = 'countries';
            if (index > -1) {
                //  console.log(this.populationData[index].geo, country.id);
                region = this.populationData[index].region;
                return new CountryData(country.type, country.id, country.properties, country.geometry, region);
            } else {
                // console.log('not found');

            }

        });

        // console.log(countryData);

        // let projection = d3.geoConicConformal().scale(200).translate([500, 450]);
        var path = d3.geoPath()
            .projection(this.projection);


        d3.select("#world-map")
            .selectAll("#countries")
            .data(geojson.features)
            .join("path")
            .attr("d", path)
            .attr("stroke", "white")
            .attr("id", (d, i) => {
                return d.id;
            })
            .attr("class", (d, i) => {
                if (typeof(countryData[i]) == "undefined") {
                    return "undeclearedRegion";
                }
                return countryData[i].region;
            })
            .on("click", function(d, i) {
                that.updateCountry(d.id);
            });

        var geoGenerator = d3.geoPath()
            .projection(this.projection);

        var graticule = d3.geoGraticule();
        var mapOutline = graticule.outline();
        
        d3.select("#map-grid")
            .append("path")
            .attr("d", geoGenerator(graticule()))
            .attr("stroke", "#DCDCDC")
            .style("fill", "none");

        // note: one diff between .data & .datum
        //      data use to bind set of data
        //      datum could use for one sigle data element
        d3.select("#map-outline")
            .append("path")
            .datum(graticule.outline)
            .attr("d", path)
            .style("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        // console.log(this.populationData);
    }

    /**
     * Highlights the selected conutry and region on mouse click
     * @param activeCountry the country ID of the country to be rendered as selected/highlighted
     */
    updateHighlightClick(activeCountry) {
        // ******* TODO: PART 3*******
        // Assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        //

        //TODO - Your code goes here - 
        d3.selectAll("#" + activeCountry)
            .classed("selected-country", true);

    }

    /**
     * Clears all highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //TODO - Your code goes here - 
        d3.selectAll(".selected-country")
            .classed("selected-country", false);

        d3.selectAll(".selected-region")
            .classed("selected-region", false);

        d3.selectAll(".hidden")
            .classed("hidden", false);


    }

    countryCodeToName(countryCode) {
        for (let i = 0; i < this.populationData.length; i++) {
            let curId = this.populationData[i].geo;
            if (curId.toUpperCase() == countryCode) {
                return this.populationData[i].country;
            }
        }
    }



    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // -------------------------------------------------------------
    // -------------------------------------------------------------


}