/** Data structure for the data associated with an individual country. */
class PlotData {
    /**
     *
     * @param country country name from the x data object
     * @param xVal value from the data object chosen for x at the active year
     * @param yVal value from the data object chosen for y at the active year
     * @param id country id
     * @param region country region
     * @param circleSize value for r from data object chosen for circleSizeIndicator
     */
    constructor(country, xVal, yVal, id, region, circleSize) {
        this.country = country;
        this.xVal = xVal;
        this.yVal = yVal;
        this.id = id;
        this.region = region;
        this.circleSize = circleSize;
    }
}

/** Class representing the scatter plot view. */
class GapPlot {

    /**
     * Creates an new GapPlot Object
     *
     * For part 2 of the homework, you only need to worry about the first parameter.
     * You will be updating the plot with the data in updatePlot,
     * but first you need to draw the plot structure that you will be updating.
     *
     * Set the data as a variable that will be accessible to you in updatePlot()
     * Call the drawplot() function after you set it up to draw the plot structure on GapPlot load
     *
     * We have provided the dimensions for you!
     *
     * @param updateCountry a callback function used to notify other parts of the program when the selected
     * country was updated (clicked)
     * @param updateYear a callback function used to notify other parts of the program when a year was updated
     * @param activeYear the year for which the data should be drawn initially
     */
    constructor(data, updateCountry, updateYear, activeYear) {

        // ******* TODO: PART 2 *******

        this.margin = { top: 20, right: 20, bottom: 60, left: 80 };
        this.width = 810 - this.margin.left - this.margin.right;
        this.height = 500 - this.margin.top - this.margin.bottom;
        this.activeYear = activeYear;
        this.selectedCountry;

        this.xIndicator;
        this.yIndicator;
        this.circleSizeIndicator;

        this.updateYear = updateYear;
        this.updateCountry = updateCountry;

        this.data = data;
        
        // max value for max circle size
        this.maxPopulation = this.getMaxData(this.data["population"]);
        this.maxGdp = this.getMaxData(this.data["gdp"]);
        this.maxChildMortality = this.getMaxData(this.data["child-mortality"]);
        this.maxLifeExpectancy = this.getMaxData(this.data["life-expectancy"]);
        this.maxFertilityRate = this.getMaxData(this.data["fertility-rate"]);

        // min value for max circle size
        this.minPopulation = this.getMinData(this.data["population"]);
        this.minGdp = this.getMinData(this.data["gdp"]);
        this.minChildMortality = this.getMinData(this.data["child-mortality"]);
        this.minLifeExpectancy = this.getMinData(this.data["life-expectancy"]);
        this.minFertilityRate = this.getMinData(this.data["fertility-rate"]);

        // bounds value for axis max value
        this.maxPopulationBound = 1500000000;
        this.maxGdpBound = 180000;
        this.maxChildMortalityBound = 800;
        this.maxLifeExpectancyBound = 90;
        this.maxFertilityRateBound = 9;
        let maxDataBoundArray = [];
        maxDataBoundArray["population"] = this.maxPopulationBound;
        maxDataBoundArray["gdp"] = this.maxGdpBound;
        maxDataBoundArray["child-mortality"] = this.maxChildMortalityBound;
        maxDataBoundArray["life-expectancy"] = this.maxLifeExpectancyBound;
        maxDataBoundArray["fertility-rate"] = this.maxFertilityRateBound;

        this.maxDataBoundArray = maxDataBoundArray;

        let indicatorFullName = [];
        indicatorFullName["population"] = "population";
        indicatorFullName["gdp"] = "GDP per capita";
        indicatorFullName["child-mortality"] = "Child mortality (under age five)";
        indicatorFullName["life-expectancy"] = "Life expectancy";
        indicatorFullName["fertility-rate"] = "Total fertility rate";
        this.indicatorFullName = indicatorFullName;

        //YOUR CODE HERE  
        this.drawPlot();

        // ******* TODO: PART 3 *******
        /**
         For part 4 of the homework, you will be using the other 3 parameters.
         * assign the highlightUpdate function as a variable that will be accessible to you in updatePlot()
         * assign the dragUpdate function as a variable that will be accessible to you in updatePlot()
         */

        //YOUR CODE HERE  


    }

    /**
     * Sets up the plot, axes, and slider,
     */

    drawPlot() {
        // ******* TODO: PART 2 *******
        /**
         You will be setting up the plot for the scatterplot.
         Here you will create axes for the x and y data that you will be selecting and calling in updatePlot
         (hint): class them.

         Main things you should set up here:
         1). Create the x and y axes
         2). Create the activeYear background text


         The dropdown menus have been created for you!

         */

        d3.select('#scatter-plot')
            .append('div').attr('id', 'chart-view');

        d3.select('#scatter-plot')
            .append('div').attr('id', 'activeYear-bar');

        d3.select('#chart-view')
            .append('div')
            .attr("class", "tooltip")
            .style("opacity", 0);

        d3.select('#chart-view')
            .append('svg').classed('plot-svg', true)
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        let svgGroup = d3.select('#chart-view').select('.plot-svg').append('g').classed('wrapper-group', true);

        //YOUR CODE HERE  
        let scatterSVG = d3.select("#chart-view").select("svg");
        let width = scatterSVG.attr("width"), height = scatterSVG.attr("height");

        // default x-axis fertility-rate
        // default y-axis gdp max 
        // default circle size Population
        
        var xScale = d3
            .scaleLinear()
            .domain([0, this.maxFertilityRateBound])
            .range([0, width-150]);

        var yScale = d3
            .scaleLinear()
            .domain([0, this.maxGdpBound])
            .range([height-100, 0]);

        let xAxis = d3.axisBottom().scale(xScale);
        let yAxis = d3.axisLeft().scale(yScale);

        scatterSVG.append("g")
            .attr("id", "y-axis")
            .attr("transform", "translate(100, 20)")
            .call(yAxis);
            

        scatterSVG.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(100, " + this.height + " )")
            .call(xAxis);


        

        // let scatterSVG = d3.select("#scatterplotChart");
        //   let width = 300, height = 300;
        //   let xScale = d3
        //     .scaleLinear()
        //     .domain([0, d3.max(data, d => d.a)])
        //     .range([0, width - 100]);

        //   let yScale = d3
        //     .scaleLinear()
        //     .domain([0, d3.max(data, d => d.b)])
        //     .range([height - 100, 0]);

        //   let xAxis = d3.axisBottom().scale(xScale);
        //   let yAxis = d3.axisLeft().scale(yScale);

        //   scatterSVG.select("#y-axis")
        //             .call(yAxis);

        //   scatterSVG.select("#x-axis")
        //             .call(xAxis)



        scatterSVG.append("g")
            .attr("id", "activeYear")
            .append("text")
            .text("2000")
            .attr("transform", "translate(200,80)")
            .attr("font-size", "80px")
            .style("fill", "silver");

        scatterSVG.append("g")
            .attr("id", "activeXlabel")
            .append("text")
            .text("TOTAL FERTILITY RATE")
            .attr("transform", "translate(350,460)")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .style("fill", "black");

        scatterSVG.append("g")
            .attr("id", "activeYlabel")
            .append("text")
            .text("GDP PER CAPITA")
            .attr("transform", "translate(50,280) rotate(270)")
            .attr("font-size", "15px")
            .attr("font-weight", "bold")
            .style("fill", "black");


        
        /* This is the setup for the dropdown menu- no need to change this */

        let dropdownWrap = d3.select('#chart-view').append('div').classed('dropdown-wrapper', true);

        let cWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        cWrap.append('div').classed('c-label', true)
            .append('text')
            .text('Circle Size');

        cWrap.append('div').attr('id', 'dropdown_c').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let xWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        xWrap.append('div').classed('x-label', true)
            .append('text')
            .text('X Axis Data');

        xWrap.append('div').attr('id', 'dropdown_x').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        let yWrap = dropdownWrap.append('div').classed('dropdown-panel', true);

        yWrap.append('div').classed('y-label', true)
            .append('text')
            .text('Y Axis Data');

        yWrap.append('div').attr('id', 'dropdown_y').classed('dropdown', true).append('div').classed('dropdown-content', true)
            .append('select');

        d3.select('#chart-view')
            .append('div')
            .classed('circle-legend', true)
            .append('svg')
            .append('g')
            .attr('transform', 'translate(10, 0)');

        // d3.select(".circle-legend").select("svg").append("g").attr("transform", "translate(100,30)")
        //     .attr("id", "activeMaxCircle")
        //     .append("circle").attr("r", 20).attr("cx", 0).attr("cy", 0);

        // d3.select("#activeMaxCircle")
        //     .append("text").attr("id", "text-activeMaxCircle").text(this.maxPopulation).attr("font-size", "15px").attr("font-weight", "bold").attr("transform", "translate(30,0)").style("fill", "black");

        // d3.select(".circle-legend").select("svg").append("g").attr("transform", "translate(10,30)")
        //     .attr("id", "activeMinCircle").append("circle").attr("r", 3).attr("cx", 0).attr("cy", 0);

        //  d3.select("#activeMinCircle")
        //     .append("text").attr("id", "text-activeMaxCircle").text(this.minPopulation).attr("font-size", "15px").attr("font-weight", "bold").attr("transform", "translate(10,0)").style("fill", "black");

        
        

        function tempCircleSizer(number, min, max) {
            let cScale = d3.scaleSqrt().range([3, 20]).domain([min, max]);
            return cScale(number);
        }

        scatterSVG.append("g").attr("id", "plots");


        // function getRealCoordX(x) {
        //     return xScale(x) + 100;
        // }

        // function getRealCoordY(y) {
        //     return yScale(y) + 20;
        // }

        // d3.select("#plots").selectAll("circle").data(this.data.population)
        //     .join("circle")
        //     .attr("class", (d) => {
        //         return this.getRegion(d.country);
        //     })
        //     .attr("r", (d) => {
        //         let curPop = this.getPopData(d.country, 2000);
        //         return tempCircleSizer(curPop, this.minPopulation, this.maxPopulation);
        //     })
        //     .attr("cx", (d) => {
        //         let curTfr = this.getTfrData(d.country, 2000);
        //         return getRealCoordX(curTfr);
        //     })
        //     .attr("cy", (d) => {
        //         let curGdp = this.getGdpData(d.country, 2000);
        //         return getRealCoordY(curGdp);
        //     });

        // // country, xVal, yVal, id, region, circleSize
        // let plotData = new PlotData();
        this.drawYearBar();
        this.updatePlot(2000, "fertility-rate", "gdp", "child-mortality");
        // population 
        // gdp 
        // child-mortality 
        // life-expectancy 
        // fertility-rate
        


    }

    /**
     * Renders the plot for the parameters specified
     *
     * @param activeYear the year for which to render
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    updatePlot(activeYear, xIndicator = this.xIndicator, yIndicator = this.yIndicator, circleSizeIndicator = this.circleSizeIndicator) {

        // use the mathod in struct to call function get needs value
        // ******* TODO: PART 2 *******
        
        /*
        You will be updating the scatterplot from the data. hint: use the #chart-view div

        *** Structuring your PlotData objects ***
        You need to start by mapping the data specified by the parameters to the PlotData Object
        Your PlotData object is specified at the top of the file
        You will need get the data specified by the x, y and circle size parameters from the data passed
        to the GapPlot constructor

        *** Setting the scales for your x, y, and circle data ***
        For x and y data, you should get the overall max of the whole data set for that data category,
        not just for the activeYear.

        ***draw circles***
        draw the circles with a scaled area from the circle data, with cx from your x data and cy from y data
        You need to size the circles from your circleSize data, we have provided a function for you to do this
        called circleSizer. Use this when you assign the 'r' attribute.

        ***Tooltip for the bubbles***
        You need to assign a tooltip to appear on mouse-over of a country bubble to show the name of the country.
        We have provided the mouse-over for you, but you have to set it up
        Hint: you will need to call the tooltipRender function for this.

        *** call the drawLegend() and drawDropDown()
        These will draw the legend and the drop down menus in your data
        Pay attention to the parameters needed in each of the functions
        
        */

        
        // this.drawLegend();

        /**
         *  Function to determine the circle radius by circle size
         *  This is the function to size your circles, you don't need to do anything to this
         *  but you will call it and pass the circle data as the parameter.
         * 
         * @param d the data value to encode
         * @returns {number} the radius
         */

        // let circleSizer = function(d) {
        //     let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
        //     return d.circleSize ? cScale(d.circleSize) : 3;
        // };
        ///////////////////////////////////////////////////////////////////

        //YOUR CODE HERE  
        let that = this;
        this.xIndicator = xIndicator;
        this.yIndicator = yIndicator;
        this.circleSizeIndicator = circleSizeIndicator;
        d3.select('#yearSliderValue')
            .attr('value', activeYear);

        d3.select('#yearSliderText')
            .text(activeYear);

        this.drawDropDown(xIndicator, yIndicator, circleSizeIndicator);
        

        d3.select("#activeYear")
            .select("text")
            .text(activeYear);
        d3.select("#activeXlabel")
            .select("text")
            .text(this.indicatorFullName[xIndicator]);
        d3.select("#activeYlabel")
            .select("text")
            .text(this.indicatorFullName[yIndicator]);


        let minSize = this.getMinData(this.data[circleSizeIndicator]);
        let maxSize = this.getMaxData(this.data[circleSizeIndicator]);
        let cScale = d3.scaleSqrt().range([3, 20]).domain([minSize, maxSize]);
        this.drawLegend(minSize, maxSize);

        let scatterSVG = d3.select("#chart-view").select("svg");
        let width = scatterSVG.attr("width"), height = scatterSVG.attr("height");

        let xScale = d3
            .scaleLinear()
            .domain([0, this.maxDataBoundArray[xIndicator]])
            .range([0, width-150]);

        let yScale = d3
            .scaleLinear()
            .domain([0, this.maxDataBoundArray[yIndicator]])
            .range([height-100, 0]);

        let xAxis = d3.axisBottom().scale(xScale);
        let yAxis = d3.axisLeft().scale(yScale);

        scatterSVG.select("#y-axis")
            .call(yAxis);
            

        scatterSVG.select("#x-axis")
            .call(xAxis);


        // calculate the correct coordinates since axis has transform
        function getRealCoordX(x) {
            return xScale(x) + 100;
        }

        function getRealCoordY(y) {
            return yScale(y) + 20;
        }

        d3.select("#plots").selectAll("circle").data(this.data.population)
            .join("circle")
            .attr("class", (d) => {
                return this.getRegion(d.country);
            })
            .classed("plotCircle", true)
            .attr("r", (d) => {
                let curData = this.getNeedsData(d.country, activeYear, circleSizeIndicator);
                return cScale(curData);
            })
            .attr("cx", (d) => {
                let curData = this.getNeedsData(d.country, activeYear, xIndicator);
                return getRealCoordX(curData);
            })
            .attr("cy", (d) => {
                let curData = this.getNeedsData(d.country, activeYear, yIndicator);
                return getRealCoordY(curData);
            })
            .attr("id", (d) => {
                return d.geo.toUpperCase();
            })
            .on("click", (d) => {
                that.updateCountry(d.geo.toUpperCase());
            });


    }

    /**
     * Setting up the drop-downs
     * @param xIndicator identifies the values to use for the x axis
     * @param yIndicator identifies the values to use for the y axis
     * @param circleSizeIndicator identifies the values to use for the circle size
     */
    drawDropDown(xIndicator, yIndicator, circleSizeIndicator) {

        let that = this;
        let dropDownWrapper = d3.select('.dropdown-wrapper');
        let dropData = [];

        for (let key in this.data) {
            dropData.push({
                indicator: key,
                indicator_name: this.data[key][0].indicator_name
            });
        }

        /* CIRCLE DROPDOWN */
        let dropC = dropDownWrapper.select('#dropdown_c').select('.dropdown-content').select('select');

        let optionsC = dropC.selectAll('option')
            .data(dropData);


        optionsC.exit().remove();

        let optionsCEnter = optionsC.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsCEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsC = optionsCEnter.merge(optionsC);

        let selectedC = optionsC.filter(d => d.indicator === circleSizeIndicator)
            .attr('selected', true);

        dropC.on('change', function(d, i) {
            let cValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let yValue = dropY.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* X DROPDOWN */
        let dropX = dropDownWrapper.select('#dropdown_x').select('.dropdown-content').select('select');

        let optionsX = dropX.selectAll('option')
            .data(dropData);

        optionsX.exit().remove();

        let optionsXEnter = optionsX.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsXEnter.append('text')
            .text((d, i) => d.indicator_name);

        optionsX = optionsXEnter.merge(optionsX);

        let selectedX = optionsX.filter(d => d.indicator === xIndicator)
            .attr('selected', true);

        dropX.on('change', function(d, i) {
            let xValue = this.options[this.selectedIndex].value;
            let yValue = dropY.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

        /* Y DROPDOWN */
        let dropY = dropDownWrapper.select('#dropdown_y').select('.dropdown-content').select('select');

        let optionsY = dropY.selectAll('option')
            .data(dropData);

        optionsY.exit().remove();

        let optionsYEnter = optionsY.enter()
            .append('option')
            .attr('value', (d, i) => d.indicator);

        optionsY = optionsYEnter.merge(optionsY);

        optionsYEnter.append('text')
            .text((d, i) => d.indicator_name);

        let selectedY = optionsY.filter(d => d.indicator === yIndicator)
            .attr('selected', true);

        dropY.on('change', function(d, i) {
            let yValue = this.options[this.selectedIndex].value;
            let xValue = dropX.node().value;
            let cValue = dropC.node().value;
            that.updatePlot(that.activeYear, xValue, yValue, cValue);
        });

    }

    /**
     * Draws the year bar and hooks up the events of a year change
     */
    drawYearBar() {

        // ******* TODO: PART 2 *******
        //The drop-down boxes are set up for you, but you have to set the slider to updatePlot() on activeYear change

        // Create the x scale for the activeYear;
        // hint: the domain should be max and min of the years (1800 - 2020); it's OK to set it as numbers
        // the plot needs to update on move of the slider

        /* ******* TODO: PART 3 *******
        You will need to call the updateYear() function passed from script.js in your activeYear slider
        */
        let that = this;


        //Slider to change the activeYear of the data
        let yearScale = d3.scaleLinear().domain([1800, 2020]).range([30, 730]);

        let yearSlider = d3.select('#activeYear-bar')
            .append('div').classed('slider-wrap', true)
            .append('input').classed('slider', true)
            .attr('type', 'range')
            .attr('min', 1800)
            .attr('max', 2020)
            .attr('value', this.activeYear).attr("id", "yearSliderValue");

        let sliderLabel = d3.select('.slider-wrap')
            .append('div').classed('slider-label', true)
            .append('svg');

        let sliderText = sliderLabel.append('text').text(this.activeYear).attr("id", "yearSliderText");

        sliderText.attr('x', yearScale(this.activeYear));
        sliderText.attr('y', 25);

        yearSlider.on('input', function() {
            //YOUR CODE HERE 
            that.updateYear(this.value);
            sliderText.text(this.value);
            
        });
    }

    /**
     * Draws the legend for the circle sizes
     *
     * @param min minimum value for the sizeData
     * @param max maximum value for the sizeData
     */
    drawLegend(min, max) {
        // ******* TODO: PART 2*******
        //This has been done for you but you need to call it in updatePlot()!
        //Draws the circle legend to show size based on health data
        let scale = d3.scaleSqrt().range([3, 20]).domain([min, max]);

        let circleData = [min, max];

        let svg = d3.select('.circle-legend').select('svg').select('g');

        let circleGroup = svg.selectAll('g').data(circleData);
        circleGroup.exit().remove();

        let circleEnter = circleGroup.enter().append('g');
        circleEnter.append('circle').classed('neutral', true);
        circleEnter.append('text').classed('circle-size-text', true);

        circleGroup = circleEnter.merge(circleGroup);

        circleGroup.attr('transform', (d, i) => 'translate(' + ((i * (5 * scale(d))) + 20) + ', 25)');

        circleGroup.select('circle').attr('r', (d) => scale(d));
        circleGroup.select('circle').attr('cx', '0');
        circleGroup.select('circle').attr('cy', '0');
        let numText = circleGroup.select('text').text(d => new Intl.NumberFormat().format(d));

        numText.attr('transform', (d) => 'translate(' + ((scale(d)) + 10) + ', 0)');
    }

    /**
     * Reacts to a highlight/click event for a country; draws that country darker
     * and fades countries on other continents out
     * @param activeCountry
     */
    updateHighlightClick(activeCountry) {
        /* ******* TODO: PART 3*******
        //You need to assign selected class to the target country and corresponding region
        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for countries/regions, you can use
        // d3 selection and .classed to set these classes on here.
        // You will not be calling this directly in the gapPlot class,
        // you will need to call it from the updateHighlight function in script.js
        */
        //YOUR CODE HERE  
        let curRegion = d3.selectAll("#" + activeCountry).attr("class");
        d3.selectAll("#" + activeCountry)
            .classed("selected-country", true);

        
        d3.selectAll(".plotCircle")
            .classed("hidden", true);

        d3.selectAll("." + curRegion)
            .classed("selected-region", true)
            .classed("hidden", false);
    }

    /**
     * Clears any highlights
     */
    clearHighlight() {
        // ******* TODO: PART 3*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes off here.

        //YOUR CODE HERE  
        d3.selectAll(".selected-country")
            .classed("selected-country", false);

        d3.selectAll(".selected-region")
            .classed("selected-region", false);

        d3.selectAll(".hidden")
            .classed("hidden", false);
    }

    /**
     * Returns html that can be used to render the tooltip.
     * @param data 
     * @returns {string}
     */
    tooltipRender(data) {
        let text = "<h2>" + data['country'] + "</h2>";
        return text;
    }

    getMaxData(dataSet) {
        let max = -1;
        for (let i = 0; i < dataSet.length; i++) {
            let curData = dataSet[i];
            for (let j = 1800; j < 2021; j++) {
                let curValue = curData[j];
                max = Math.max(max, curValue);
            }
        }
        return max;
    }

    getMinData(dataSet) {
        let min = dataSet[0][1800];
        for (let i = 0; i < dataSet.length; i++) {
            let curData = dataSet[i];
            for (let j = 1800; j < 2021; j++) {
                let curValue = curData[j];
                min = Math.min(min, curValue);
            }
        }
        return min;
    }

    getPopData(country, year) {
        let curDataSet = this.data["population"];
        // loop all data
        for (let i = 0; i < curDataSet.length; i++) {
            let curData = curDataSet[i];
            if (curData.country == country) {
                return curData[year];
            }
        }
    }

    getGdpData(country, year) {
        let curDataSet = this.data["gdp"];
        // loop all data
        for (let i = 0; i < curDataSet.length; i++) {
            let curData = curDataSet[i];
            if (curData.country == country) {
                return curData[year];
            }
        }
    }

    getCmu5Data(country, year) {
        let curDataSet = this.data["child-mortality"];
        // loop all data
        for (let i = 0; i < curDataSet.length; i++) {
            let curData = curDataSet[i];
            if (curData.country == country) {
                return curData[year];
            }
        }
    }

    getLifeExpData(country, year) {
        let curDataSet = this.data["life-expectancy"];
        // loop all data
        for (let i = 0; i < curDataSet.length; i++) {
            let curData = curDataSet[i];
            if (curData.country == country) {
                return curData[year];
            }
        }
    }

    getTfrData(country, year) {
        let curDataSet = this.data["fertility-rate"];
        // loop all data
        for (let i = 0; i < curDataSet.length; i++) {
            let curData = curDataSet[i];
            if (curData.country == country) {
                return curData[year];
            }
        }
    }

    getRegion(country) {
        let curDataSet = this.data["population"];
        // loop all data
        for (let i = 0; i < curDataSet.length; i++) {
            let curData = curDataSet[i];
            if (curData.country == country) {
                return curData.region;
            }
        }
    }

    getNeedsData(country, year, indicator) {
        let dataArray = [];
        dataArray["population"] = this.getPopData(country, year);
        dataArray["gdp"] = this.getGdpData(country, year);
        dataArray["child-mortality"] = this.getCmu5Data(country, year);
        dataArray["life-expectancy"] = this.getLifeExpData(country, year);
        dataArray["fertility-rate"] = this.getTfrData(country, year);
        let ret = dataArray[indicator];
        return ret;
    }

}