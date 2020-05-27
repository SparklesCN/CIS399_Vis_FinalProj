class Map {
	constructor(data) {
		this.data = data;
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
        // this.nameArray = data.population.map(d => d.geo.toUpperCase());
	}

	drawMap(world) {
		let geojson = topojson.feature(world, world.objects.countries);
		console.log(geojson.features);
		let isoCode = new isoGenerator();
		console.log(isoCode.getRegionByAlpha3("USA"));

		//d.Coords[1],d.Coords[0] // y first
		let pos = this.projection([116, 40]);
		console.log(pos);

		

		

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
            .attr("class", (d) => {
            	console.log(d.id);
            	if (d.id == "-99") {
            		return "none"
            	}
            	return isoCode.getRegionByAlpha3(d.id).toLowerCase();
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

        d3.select("#world-map")
			.append("circle")
			.attr("r", "10")
			.attr("cx", pos[0])
			.attr("cy", pos[1])
			.attr("fill", "blue")
			.classed("asia", true);
	}
}