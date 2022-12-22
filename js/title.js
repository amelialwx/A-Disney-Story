function animate_circular_text() {
    //Create the SVG
    var svg = d3.select("#title-animated").append("svg")
        .attr("width", 800)
        .attr("height", 600);

    //Create an SVG arc starting at location [0,300], ending at [400,300] with a radius of 200 (circle)
    var path = svg.append("path")
        .attr("id", "circular") //A unique ID to reference later
        .attr("d", "M0,470 A270,270 0 0,1 800,470") //Notation for an SVG path
        .style("fill", "none")
        .style("stroke", "none")

    //Create an SVG text element and append a textPath element
    var textArc = svg.append("text")
        .style("text-anchor", "middle")
        .append("textPath")				//append a textPath to the text element
        .attr("xlink:href", "#circular") 	//place the ID of the path here
        .attr("startOffset", "50%")		//place the text halfway on the arc
        .attr("font-size", 70)
        .attr("font-family", "customDisney, sans-serif")
        .text("A Story of Disney Animated Movies");

    function repeat() {
        path
            .transition().duration(2000)
            //Transition to an arc starting at location [75,300], ending at [325,300] with a radius of 125 (circle)
            .attr("d", "M50,470 A250,250 0 0,1 750,470")
            .transition().duration(2000)
            //Transition back to original arc
            .attr("d", "M0,470 A270,270 0 0,1 800,470")
            .on("end", repeat);
    }//repeat

    //Repeatedly change the arcs back and forth
    repeat();

}//function animate_circular_text

animate_circular_text();