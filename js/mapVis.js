/* * * * * * * * * * * * * *
*          MapVis          *
* * * * * * * * * * * * * */


class MapVis {

    // constructor method to initialize the Map object
    constructor(parentElement, mapData, princessData){
        this.parentElement = parentElement;
        this.mapData = mapData;
        this.princessData = princessData;
        this.colors = ["#D1F0EE", "#FDA3B2", "#EDD6FE", "#F6ECBD", "#D0F4D0", "#F6CFDF", "#ECECEC"]

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // define geo generator and pass projection
        // Map and projection
        const projection = d3.geoNaturalEarth1()
            .scale(vis.width / 1.9 / Math.PI)
            .translate([vis.width / 2, vis.height / 1.7])

        // Draw the map
        vis.countries = vis.svg.append("g")
            .selectAll(".country")
            .data(vis.mapData.features)
            .enter().append("path")
            .attr("d", d3.geoPath()
                .projection(projection)
            )


        // background for legend
        vis.background = vis.svg.append('rect')
            .attr("width", 130)
            .attr("height", 170)
            .attr("rx", 2)
            .attr("transform", "translate(180,385)")
            .attr("fill", "white")
            .attr('stroke-width', '2px')
            .attr('stroke', 'grey')
        ;

        // declare the color scale
        vis.colorScale = d3.scaleOrdinal()
            .domain([0, 1, 2, 3, 4, 5, 6])
            .range(vis.colors);

        // declare legend
        vis.legend = vis.svg.append("g")
            .attr("class", "legendThreshold")
            .attr("transform", "translate(190,410)");

        // legend title
        vis.legend.append("text")
            .attr("class", "caption")
            .attr("x", 0)
            .attr("y", -6)
            //.style("font-size","px")
            .text("Princess")

        // legend labels
        var labels = ['Cinderella', 'Elsa', 'Rapunzel', 'Belle', 'Ariel', 'Snow White', 'No data'];

        // legend color
        var legend = d3.legendColor()
            .labels(function (d) { return labels[d.i]; })
            .shapePadding(5)
            .scale(vis.colorScale);

        // plot the legend
        vis.svg.select(".legendThreshold")
            .call(legend);

        // append the x-axis
        vis.legendAxis = vis.svg.append("g")
            .attr('class', 'legendAxis')
            .attr('transform', `translate(${vis.width - 300}, ${vis.height - 30})`)

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'mapTooltip')

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        let countries = d3.range(0, vis.princessData.length).map(function () {
            return 0;
        });

        vis.princessData.forEach(function (d, i) {
            countries[i] = d.alpha3;
        })

        if (selectedPrincess) {
            document.getElementById("map-intro-alt").innerText = "";
            if (selectedPrincess === "Belle") {
                document.getElementById("map-intro").innerText = "As Princess Belle, you are most loved by " +
                    "the 8 countries highlighted in red, most of them in Africa. Though you are not the most popular princess, " +
                    "you are still the 4th most popular!"
            }
            else if (selectedPrincess === "Cinderella") {
                document.getElementById("map-intro").innerText = "As Princess Cinderella, you are most loved by " +
                    "the 73 countries highlighted in red, most of them in Asia. You are by far the most popular Disney princess globally, congratulations!"
            }
            else if (selectedPrincess === "Elsa") {
                document.getElementById("map-intro").innerText = "As Princess Elsa, you are most loved by " +
                    "the 26 countries highlighted in red, most of them in Europe. Despite being one of the most recently introduced princess, you are" +
                    " the second most popular out of all the Disney princesses!"
            }
        }

        vis.countries
            .attr("fill", (d, i) => {
                let countryAlpha = d.id;
                if (countries.includes(countryAlpha)) {
                    let princess = vis.princessData[countries.indexOf(countryAlpha)].princess;
                    if (princess === "Cinderella") {
                        return vis.colors[0]

                    } else if (princess === "Elsa") {
                        return vis.colors[1]

                    } else if (princess === "Rapunzel") {
                        return vis.colors[2]

                    } else if (princess === "Belle") {
                        return vis.colors[3]

                    } else if (princess === "Ariel") {
                        return vis.colors[4]

                    } else if (princess === "Snow White") {
                        return vis.colors[5]

                    }
                } else {
                    return "#ECECEC";
                }
            })
            .attr("stroke-width", (d, i) => {
                let countryAlpha = d.id;
                if (countries.includes(countryAlpha)) {
                    let princess = vis.princessData[countries.indexOf(countryAlpha)].princess;
                    if (princess === selectedPrincess) {
                        return "2px";
                    }
                }
                return "1px";
            })
            .attr("stroke", (d, i) => {
                let countryAlpha = d.id;
                if (countries.includes(countryAlpha)) {
                    let princess = vis.princessData[countries.indexOf(countryAlpha)].princess;
                    if (princess === selectedPrincess) {
                        return "red"
                    }
                }
                return "black"
            })
            .on('mouseover', function(event, d) {
                let countryAlpha = d.id;
                let princess = "No data"
                if (countries.includes(countryAlpha)) {
                    princess = vis.princessData[countries.indexOf(countryAlpha)].princess;
                }
                d3.select(this)
                    .style('opacity', '0.6')

                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 3px; background: white; padding: 5px; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                             <h4>${d.properties.name}</h4>
                             <h5>Princess: ${princess}</h5>
                         </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .style('opacity', 1)
                    .attr("fill", (d, i) => {
                        let countryAlpha = d.id;
                        if (countries.includes(countryAlpha)) {
                            let princess = vis.princessData[countries.indexOf(countryAlpha)].princess;
                            if (princess === "Cinderella") {
                                return vis.colors[0]

                            } else if (princess === "Elsa") {
                                return vis.colors[1]

                            } else if (princess === "Rapunzel") {
                                return vis.colors[2]

                            } else if (princess === "Belle") {
                                return vis.colors[3]

                            } else if (princess === "Ariel") {
                                return vis.colors[4]

                            } else if (princess === "Snow White") {
                                return vis.colors[5]

                            }
                        } else {
                            return "#ECECEC";
                        }
                    })
            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        })
    }
}