class UsTrend {
	constructor(data) {
		this.data = data;
		
		this.past30Days = this.getPast30Days();
		this.graphPlots();
	}

	graphPlots() {
		let that = this;
		let scatterSVG = d3.select("#us-plotChart");
		let width = 300, height = 300;
		let xScale = d3
			.scaleLinear()
			.domain([0, 30])
			.range([0, width - 100]);

		let yScale = d3
			.scaleLinear()
			.domain([that.data[that.past30Days[0]], that.data[that.past30Days[29]]])
			.range([height - 100, 0]);

		let xAxis = d3.axisBottom().scale(xScale);
		let yAxis = d3.axisLeft().scale(yScale);

		scatterSVG.select("#us-y-axis")
            .call(yAxis);

  		scatterSVG.select("#us-x-axis")
            .call(xAxis)

        scatterSVG.select("#us-plot")
        	.selectAll("circle")
        	.data(that.past30Days)
        	.join("circle")
        	.style("fill", "#c7001e")
        	.on("mouseover", () => {
                d3.select(event.currentTarget)
                  .style("fill", "gray");
              })
            .on("mouseout", () => {
              d3.select(event.currentTarget)
                .style("fill", "#c7001e");
            })
            .transition()
            .duration(2000)
            .attr("r", 5)
            .attr("cx", (d, i) => xScale(i) + 10)
            .attr("cy", (d, i) => yScale(that.data[d]))
            .select("title")
            .text((d) => d + ": " + that.data[d]);

        scatterSVG.select("#us-trend-topic")
        	.text("U.S. Confirmed" + "(" + that.past30Days[0] + " - " + that.past30Days[29] + ")")
        	.attr("x", 20)
			.attr("y", 20)
			.attr("font-weight", "bold")
			.attr("font-style", "italic");;
	}

	getPast30Days() {
		var arr = [];
		var simObj = this.data;
		for (let i = 30; i >= 0; i--) {

			arr.push(Object.keys(simObj)[Object.keys(simObj).length - 1 - i]);
		}

		return arr;
		// var arr = [];
		// var beforedate = new Date();
		// beforedate = new Date(new Date().setDate(beforedate.getDate()- 2))
		// for (let i = 29; i >= 0; i--) {
		// 	var priordate = new Date(new Date().setDate(beforedate.getDate()-i));
		// 	var dd2 = priordate.getDate();
		// 	var mm2 = priordate.getMonth()+1;//January is 0, so always add + 1
		// 	var yyyy2 = priordate.getFullYear();
		// 	var datefrommonthago = mm2 + '/' + dd2 + '/' + yyyy2.toString()[2] + yyyy2.toString()[3];
		// 	arr.push(datefrommonthago);
		// }
		// return arr;
	}
}
