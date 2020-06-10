class Map {
	constructor(data, updateSelect) {
        this.updateSelect = updateSelect;
		this.data = data;
        this.yesterday = this.getYesterday();
        this.projection = d3.geoWinkel3().scale(140).translate([365, 225]);
	}

	drawMap(world) {
		let geojson = topojson.feature(world, world.objects.countries);
		let isoCode = new isoGenerator();

		//d.Coords[1],d.Coords[0] // y first
		let pos = this.projection([116, 40]);

		let that = this;

		

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
            .selectAll("circle")
            .data(this.data)
			.join("circle")
			.attr("r", "3")
			.attr("cx", (d) => {
                let curLong = that.projection([d.Long, d.Lat])[0];
                if (isNaN(curLong)) {
                    return;
                }
                return curLong;
                // return this.projection([116, 40]);
            })
			.attr("cy", (d) => {
                let curLat = that.projection([d.Long, d.Lat])[1];
                // console.log(that.projection([d.Long, d.Lat])[1])
                if (isNaN(curLat)) {
                    return;
                }
                return curLat;
            })
			.attr("fill", "blue")
            .attr("id", (d) => {
                // console.log(d);
                if (d["Province/State"] != "") {
                    return d["Province/State"];
                }
                return d["Country/Region"];
            })
            .on("click", function(d, i) {
                that.updateSelect(d);
            })
            .on("mouseover", () => {
                d3.select(event.currentTarget)
                  .style("fill", "#c7001e");
              })
            .on("mouseout", () => {
              d3.select(event.currentTarget)
                .style("fill", "silver");
            })
            .append("title")
            .text((d) => {
                if (d["Province/State"] != "") {
                    return d["Province/State"] + ", " + d["Country/Region"] + "; cases: " + d[that.yesterday];
                }
                return d["Country/Region"] + "; cases: " + d[that.yesterday];
            });
			
	}

    getYesterday() {
        var yesterday = new Date();
        yesterday = new Date(new Date().setDate(yesterday.getDate()- 2))
        var dd = String(yesterday.getDate());
        var mm = String(yesterday.getMonth() + 1); //January is 0!
        var yyyy = yesterday.getFullYear();
        yesterday = mm + '/' + dd + '/' + yyyy.toString()[2] + yyyy.toString()[3]
        return yesterday;
    }
}