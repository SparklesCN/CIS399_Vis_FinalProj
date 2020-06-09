class worldRank {
	constructor(data) {
		this.data = data;
		this.yesterday = this.getYesterday();
		this.topTwenty = this.generateTopTwenty();
		this.drawRankGraph();
	}

	drawRankGraph() {
		let that = this;

		let rankSvg = d3.select("#rank-graph").select("svg")

		let barScale = d3
			.scaleLinear()
			.domain([0, this.getMax()])
			.range([0, rankSvg.attr("width") - 120]);

		rankSvg.selectAll("rect")
			.data(this.topTwenty)
			.attr("x", 120)
			.attr("y", (d, i) => {
				return i * 25 + 50
			})
			.attr("width", (d) => {
				return barScale(d[1]);
			})
			.attr("height", 20)
			.style("fill", "steelblue");

		rankSvg.selectAll(".rankPlaceName")
			.data(this.topTwenty)
			.attr("x", 0)
			.attr("y", (d, i) => {
				return i * 25 + 65
			})
			.text((d) => d[0])
			.attr("font-weight", "bold");

		rankSvg.selectAll(".rankPlaceCase")
			.data(this.topTwenty)
			.attr("x", 120)
			.attr("y", (d, i) => {
				return i * 25 + 65
			})
			.text((d) => d[1])
			.attr("font-weight", "bold");

		rankSvg.select("#rank-date")
			.attr("x", 120)
			.attr("y", 30)
			.text(this.yesterday + " Confirmed COVID-19 Cases")
			.attr("font-size", "30px")
			.attr("font-weight", "bold")

		rankSvg.select("#rank-note-1")
			.attr("x", 200)
			.attr("y", 500)
			.text("Note: Some Countries like China will be show as")
			.attr("font-weight", "bold")
			.attr("font-style", "italic");

			rankSvg.select("#rank-note-2")
			.attr("x", 200)
			.attr("y", 520)
			.text("Province Level because of the data source format")
			.attr("font-weight", "bold")
			.attr("font-style", "italic");

		this.getPast30Days();


	}

	getYesterday() {
		var yesterday = new Date();
		yesterday = new Date(new Date().setDate(yesterday.getDate()- 2))
		var dd = String(yesterday.getDate());
		var mm = String(yesterday.getMonth() + 1); //January is 0!
		var yyyy = yesterday.getFullYear();
		yesterday = mm + '/' + dd + '/' + yyyy.toString()[2] + yyyy.toString()[3]
		console.log(yesterday);
		return yesterday;
	}

	getPast30Days() {
		var arr = [];
		var beforedate = new Date();
		beforedate = new Date(new Date().setDate(beforedate.getDate()- 2))
		for (let i = 0; i < 30; i++) {
			var priordate = new Date(new Date().setDate(beforedate.getDate()-i));
			var dd2 = priordate.getDate();
			var mm2 = priordate.getMonth()+1;//January is 0, so always add + 1
			var yyyy2 = priordate.getFullYear();
			var datefrommonthago = mm2 + '/' + dd2 + '/' + yyyy2.toString()[2] + yyyy2.toString()[3];
			arr.push(datefrommonthago);
		}
		

		return arr;

	}

	generateTopTwenty() {
		var array = [];
		// init with 20 init
		for (let i = 0; i < 20; i++) {
			array.push(["null", -1]);
		}

		function minOf2DArr(array) {
			let min = Number.POSITIVE_INFINITY;
			let minName = "error";
			let minIndex = -1;
			for (let i = 0; i < array.length; i++) {
				let curData = array[i];
				let curValue = curData[1];
				let curName = curData[0];
				if (curValue < min) {
					min = curValue;
					minName = curName;
					minIndex = i;
				}
			}
			return [minName, min, minIndex];
		}

		for (let i = 0; i < this.data.length; i++) {
			var curDataCase = parseInt(this.data[i][this.yesterday]);
			if (this.data[i]["Province/State"] != "") {
                var curDataPlace = this.data[i]["Province/State"] + ", " + this.data[i]["Country/Region"];
            }
            else {
            	var curDataPlace = this.data[i]["Country/Region"];
            }
			var curMin = minOf2DArr(array);
			if (curMin[1] < curDataCase) {
				array[curMin[2]] = [curDataPlace, curDataCase];
			}
		}

		function sortByValue(x, y) {
			return y[1] - x[1];
		}
		array = array.sort(sortByValue);
		return array;
		

	}

	getMax() {
		let max = -1;
		for (let i = 0; i < this.topTwenty.length; i++) {
			let cur = this.topTwenty[i][1];
			max = max < cur ? cur : max;
		}
		return max + 10000;
	}
}