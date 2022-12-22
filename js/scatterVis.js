/* * * * * * * * * * * * * *
*          ScatterVis          *
* * * * * * * * * * * * * */


class ScatterVis {

    // constructor method to initialize the Map object
    constructor(parentElement, imdbData){
        this.parentElement = parentElement;
        this.imdbData = imdbData;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 70, right: 50, bottom: 50, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        console.log(vis.imdbData)

        //x and y scale and axis
        vis.xScale = d3.scaleLinear()
            .domain([0, d3.max(vis.imdbData, d => +d['Num Votes'] + 100000)])
            .range([0, vis.width]);

        vis.yScale = d3.scaleLinear()
            .domain([d3.max(vis.imdbData, d => +d['IMDb Rating']+1), d3.min(vis.imdbData, d => +d['IMDb Rating'] - 0.2)])
            .range([0, vis.height]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale)

        vis.xAxisGroup = vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr('transform', `translate (30, ${vis.height-50})`);


        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale)

        vis.yAxisGroup = vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr('transform', 'translate (30, -50)');

        let circle = vis.svg.selectAll('circle')
            .data(vis.imdbData)

        vis.circle = circle.enter().append('circle')
            .attr('class', function(d){
                if(d.Princess === 'None'){
                    return 'Others'
                }
                else{
                    return d.Princess
                }
            })
            .attr('r', d => +d.Inflation_Gross/10)
            .attr('cx', d => vis.xScale(+d['Num Votes']) + 30)
            .attr('cy', d => vis.yScale(+d['IMDb Rating']) - 50)
            .attr('stroke', 'white')
            // .attr('transform', `translate (30, -100)`)
            .style('fill', function(d){
                if (d.Princess === "None"){
                    return 'grey'
                }
                else{
                    return '#e75480'
                }
            })
            .style('opacity', function(d){
                if (d.Princess === "None"){
                    return 0.75
                } else {return 0.8}
            })


        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'scatterTooltip')


        let arrowPoints = [[0, 0], [0, 20], [20, 10]]

        vis.svg.append('defs')
            .append('marker')
            .attr('id', 'arrow1')
            .attr('viewBox', [0, 0, 10, 21])
            .attr('refX', 10/2)
            .attr('refY', 20/2)
            .attr('markerWidth', 20)
            .attr('markerHeight', 10)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', d3.line()(arrowPoints))
            .attr('stroke', 'None')
            .attr('fill', 'black');

        vis.svg.append("line")
            .attr("x1", vis.width-50)
            // .attr("y1", vis.height-50)
            .attr("y1", 50)
            .attr("x2", vis.width-0)
            // .attr("y2", vis.height-50)
            .attr("y2", 50)
            .attr("stroke-width", 5)
            .attr("stroke", "None")
            .attr('marker-start', 'url(#arrow1)')

        vis.svg.append("line")
            .attr("x1", 25)
            .attr("y1", 50)
            .attr("x2", 25)
            .attr("y2", 0)
            .attr("stroke-width", 5)
            .attr("stroke", "None")
            .attr('marker-start', 'url(#arrow1)')

        vis.svg.append("line")
            .attr("x1", 700)
            .attr("y1", 80)
            .attr("x2", 900)
            .attr("y2", 0)
            .attr("stroke-width", 5)
            .attr("stroke", "None")
            .attr('marker-start', 'url(#arrow1)')

        vis.svg.append('text')
            .attr('x', vis.width - 250)
            // .attr('y', vis.height - 47.5)
            .attr('y', 55)
            .text('HIGHER X: MORE VOTES ')

        vis.svg.append('text')
            .attr('x', 50)
            .attr('y', 50)
            .text('HIGHER Y: HIGHER RATINGS')

        vis.svg.append('text')
            .attr('x', 750)
            .attr('y', 90)
            .text('LARGER RADIUS: MORE REVENUE')

        vis.svg.append('text')
            .attr('x', vis.width/6*5)
            .attr('y', vis.height - 20)
            .text('PINK: PRINCESS MOVIES')
            .style('fill', '#e75480')
            .style('font-size', '15px')


        vis.svg.append('text')
            .attr('x', vis.width/6*5)
            .attr('y', vis.height - 20 - 25)
            .text('GREY: NON-PRINCESS MOVIES')
            .style('fill', 'grey')
            .style('font-size', '15px')

        let textData = ['','','','']

        vis.textDesc = vis.svg.selectAll('textDesc')
            .data(textData)
            .attr('class', 'textDesc');

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        vis.updateVis()
    }

    updateVis() {
        let vis = this;
        // vis.svg.select('.y-axis')
        //     .call(vis.yAxis);
        // vis.svg.select('.x-axis')
        //     .call(vis.xAxis);

        vis.circle
            .on('mouseover', function(event, d){
                d3.select(this)
                    .attr('stroke-width', '2px')
                    .attr('stroke', 'red')
                    .style('opacity', '1')
                let textblock = ''
                if (d.Princess === 'None'){
                    textblock = `<div><\div>`
                } else {
                    textblock = `<h4 style = "font-size:30px">${d.Princess}</h4>`
                }
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 3px; background: white; padding: 5px; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                             ${textblock}
                             <h4>Title: ${d.Title}</h4>
                             <h4>IMDb Rating: ${d['IMDb Rating']}</h4>
                             <h4>Votes: ${d['Num Votes']}</h4>
                             <h4>Inflation Adjusted Revenue: ${parseFloat(d['Inflation_Gross']).toFixed(2)} Million</h4>
                         </div>`);
            })
            .on('mouseout', function(event, d){
            d3.select(this)
                .attr('stroke', function(d){
                    if (d.Princess === selectedPrincess){
                        return 'red'
                    } else {return 'white'}
                })
                .attr('stroke-width', function(d){
                    if (d.Princess === selectedPrincess){
                        return 5
                    } else {return 1}
                })
                .style('opacity', function(d){
                    if (d.Princess === "None"){
                        return 0.75
                    } else {return 0.8}
                }
                );
            vis.tooltip
                .style("opacity", 0)
                .style("left", 0)
                .style("top", 0)
                .html(``);
        });

        let princessColors = {'Cinderella':'#99b8d8', 'Elsa':'#7498c7', 'Belle':'#fcee8f'}

        let princessRank = {'Cinderella':2, 'Elsa': 4, 'Belle':5}

        if (selectedPrincess == null){
            selectedPrincess = 'Belle'
        } else {
            vis.svg.selectAll('.Belle')
                .style('fill', "#e75480")
                .attr('stroke', 'white')
                .attr('stroke-width', '1px')

            vis.svg.selectAll('.Cinderella')
                .style('fill', "#e75480")
                .attr('stroke', 'white')
                .attr('stroke-width', '1px')

            vis.svg.selectAll('.Elsa')
                .style('fill', "#e75480")
                .attr('stroke', 'white')
                .attr('stroke-width', '1px')
        }

        console.log(princessColors[selectedPrincess])

        vis.svg.selectAll('.'+selectedPrincess)
            .style('fill', princessColors[selectedPrincess])
            .attr('stroke', 'red')
            .attr('stroke-width', '5px')


        let princessElement = vis.imdbData.find(x => x.Princess === selectedPrincess)

        console.log(princessElement)


        let textData = [
            `Congratulations, -${selectedPrincess}-!`,
            `With a rating of -${princessElement['IMDb Rating']}-,`,
            `and -${princessElement['Num Votes']} -votes,`,
            `you raked in -$${princessElement['Gross']} million -at the time,`,
            `equivalent of -$${parseFloat(princessElement['Inflation_Gross']).toFixed(2)} million -today;`,
            `That is the -${princessRank[selectedPrincess]}th- best out of our 11 princesses!`
        ];

        vis.svg.selectAll('.textDesc').remove()

        vis.textDesc = vis.svg.selectAll('.textDesc')
            .data(textData);

        vis.textEnter = vis.textDesc
            .enter()
            .append('text')
            .attr('class','textDesc')
            .attr('x', vis.width*5.5/10)
            .attr('y', function(d, i){
                return vis.height/10*6 + (i-1)*35
            })
            .text(function(d){
                return d.split('-')[0]
            })
            .style('font-size', '25px')
            .append('tspan')
            .style('stroke', 'red')
            .style('stroke-width', '1px')
            .style('fill', princessColors[selectedPrincess])
            .text(function(d){
                return d.split('-')[1]
            })
            .style('font-size', '30px')
            .append('tspan')
            .style('fill', 'black')
            .text(function(d){
                return d.split('-')[2]
            })
            .style('font-size', '25px')
            .style('stroke-width', '0px')

        vis.textDesc.exit().remove();



    }
}