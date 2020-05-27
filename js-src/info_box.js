/** Data structure for the data associated with an individual country. */
class InfoBoxData {
    /**
     *
     * @param country name of the active country
     * @param region region of the active country
     * @param indicator_name the label name from the data category
     * @param value the number value from the active year
     */
    constructor(country, region, indicator_name, value) {
        this.country = country;
        this.region = region;
        this.indicator_name = indicator_name;
        this.value = value;
    }
}

/** Class representing the highlighting and selection interactivity. */
class InfoBox {
    /**
     * Creates a InfoBox Object
     * @param data the full data array
     */
    constructor(data) {
        this.data = data;
        this.populationData = data.population;



        let textBox = d3.select("#country-detail").append("svg").attr("id", "#textBox");
        textBox.append("text").attr("id", "country-text").attr("transform", "translate(20,20)").attr("font-size", "20px").attr("font-weight", "bold").style("fill", "black");
        textBox.append("text").attr("id", "pop-text").attr("transform", "translate(0,40)").attr("font-size", "15px").style("fill", "black");
        textBox.append("text").attr("id", "gdp-text").attr("transform", "translate(0,60)").attr("font-size", "15px").style("fill", "black");
        textBox.append("text").attr("id", "cmu5-text").attr("transform", "translate(0,80)").attr("font-size", "15px").style("fill", "black");
        textBox.append("text").attr("id", "lifeExp-text").attr("transform", "translate(0,100)").attr("font-size", "15px").style("fill", "black");
        textBox.append("text").attr("id", "tfr-text").attr("transform", "translate(0,120)").attr("font-size", "15px").style("fill", "black");

    }

    /**
     * Renders the country description
     * @param activeCountry the IDs for the active country
     * @param activeYear the year to render the data for
     */
    updateTextDescription(activeCountry, activeYear) {
        // *******  PART 4 *******
        // Update the text elements in the infoBox to reflect:
        // Selected country, region, population and stats associated with the country.
        /*
         * You will need to get an array of the values for each category in your data object
         * hint: you can do this by using Object.values(this.data)
         * you will then need to filter just the activeCountry data from each array
         * you will then pass the data as paramters to make an InfoBoxData object for each category
         *
         */

        //TODO - Your code goes here - 

        let textBox = d3.select("#textBox");
        let curCountryName = this.countryCodeToName(activeCountry);
        d3.select("#country-text").text(curCountryName);
        d3.select("#pop-text").text("Population: " + this.getPopData(curCountryName, activeYear));
        d3.select("#gdp-text").text("GDP per capita: " + this.getGdpData(curCountryName, activeYear));
        d3.select("#cmu5-text").text("Child mortality (under age five): " + this.getCmu5Data(curCountryName, activeYear));
        d3.select("#lifeExp-text").text("Life expectancy: " + this.getLifeExpData(curCountryName, activeYear));
        d3.select("#tfr-text").text("Total fertility rate: " + this.getTfrData(curCountryName, activeYear));
        


    }

    /**
     * Removes or makes invisible the info box
     */
    clearHighlight() {

        //TODO - Your code goes here - 
    }

    countryCodeToName(countryCode) {
        for (let i = 0; i < this.populationData.length; i++) {
            let curId = this.populationData[i].geo;
            if (curId.toUpperCase() == countryCode) {
                return this.populationData[i].country;
            }
        }
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

}