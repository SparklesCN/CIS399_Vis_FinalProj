class worldRank {
	constructor(data) {
		this.data = data;
		this.yesterday = this.getYesterday();
		this.topTwenty = this.generateTopTwenty();
	}

	drawRankGraph() {
		let that = this;

		let rankSvg = d3.select("rank-graph").select("svg");

		let barScale = d3
			.scaleLinear()
			.domain([0, ])
			.range([0, 0]);

		rankSvg.selectAll("rect")
			.data(this.topTwenty)
			.join("rect")
			

	}

	getYesterday() {
		var yesterday = new Date();
		var dd = String(yesterday.getDate() - 1);
		var mm = String(yesterday.getMonth() + 1); //January is 0!
		var yyyy = yesterday.getFullYear();
		yesterday = mm + '/' + dd + '/' + yyyy.toString()[2] + yyyy.toString()[3]
		return yesterday;
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
		console.log(array);
		return array;
		

	}
}