/* * * * * * * * * * * * * *
*        NetworkVis        *
* * * * * * * * * * * * * */

let mickey = "M88 41.5C88 42.9981 87.9158 44.4777 87.7517 45.9347C93.998 44.0266 100.629 43 107.5 43C114.371 43 121.002 44.0266 127.248 45.9347C127.084 44.4777 127 42.9981 127 41.5C127 18.5802 146.699 0 171 0C195.301 0 215 18.5802 215 41.5C215 64.4198 195.301 83 171 83C170.379 83 169.761 82.9879 169.146 82.9638C172.908 91.3728 175 100.692 175 110.5C175 147.779 144.779 178 107.5 178C70.2208 178 40 147.779 40 110.5C40 100.692 42.0918 91.3728 45.8536 82.9638C45.2389 82.9879 44.621 83 44 83C19.6995 83 0 64.4198 0 41.5C0 18.5802 19.6995 0 44 0C68.3005 0 88 18.5802 88 41.5Z";
let connections;

class NetworkVis {

    // constructor method to initialize the NetworkVis object
    constructor(parentElement, belleNodes, belleEdges, elsaNodes, elsaEdges, cinderellaNodes, cinderellaEdges){
        this.parentElement = parentElement;
        this.belleNodes = belleNodes;
        this.belleEdges = belleEdges
        this.elsaNodes = elsaNodes;
        this.elsaEdges = elsaEdges;
        this.cinderellaNodes = cinderellaNodes;
        this.cinderellaEdges = cinderellaEdges;

        this.belleEdges = belleEdges.map(function(d) {
            return {name1: d.name1,
                name2: d.name2,
                score: +d.score,
                source: +d.source,
                target: +d.target}
        })

        this.elsaEdges = elsaEdges.map(function(d) {
            return {name1: d.name1,
                name2: d.name2,
                score: +d.score,
                source: +d.source,
                target: +d.target}
        })

        this.cinderellaEdges = cinderellaEdges.map(function(d) {
            return {name1: d.name1,
                name2: d.name2,
                score: +d.score,
                source: +d.source,
                target: +d.target}
        })

        this.networkData = {
            "Belle": {"nodes": this.belleNodes, "edges": this.belleEdges},
            "Elsa": {"nodes": this.elsaNodes, "edges": this.elsaEdges},
            "Cinderella": {"nodes": this.cinderellaNodes, "edges": this.cinderellaEdges}
        }

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 50, right: 50, bottom: 50, left: 50};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // init tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'networkTooltip')

        vis.edgeGroup = vis.svg.append('g')
        vis.nodeGroup = vis.svg.append('g')

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        vis.updateVis()
    }

    updateVis() {
        let vis = this;
        //setting up forces
        let selectBox1 = document.getElementById("princess-name");
        let networkPrincess = selectBox1.options[selectBox1.selectedIndex].value;

        if (selectedPrincess && networkPrincess === "Princess") {
            networkPrincess = selectedPrincess
            document.getElementById("network-intro").innerText = "The pink Mickey " +
                "is you, "+ selectedPrincess + "! The size of Mickey represents your presence in your movie.  " +
                "You can also see which characters you have interacted and your relationship " +
                "score by hovering over your Mickey! The thicker the line between you and " +
                "another Mickey, the stronger your connection is with that Mickey's character. " +
                "You can also take a peek at the relationships your Princess friends have!"
        } else if (!selectedPrincess && networkPrincess === "Princess") {
            networkPrincess = "Belle"
        }

        vis.dragDrop = d3.drag()
            .on('start', (event, d) => {
                if (!event.active) vis.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on('drag', (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on('end', (event, d) => {
                if (!event.active) vis.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        //create the visualization - line
        vis.edges = vis.edgeGroup.selectAll('line')
            .data(vis.networkData[networkPrincess].edges, d => d.name1)

        vis.edges.exit().remove()

        let finalString = ''

        vis.edgeEnter = vis.edges.enter()
            .append('line')
            .style('stroke', 'grey')
            .style('stroke-width', d => 10**(d.score/40))
            .attr('class', function(d){
                return d.name1 + ' ' + d.name2 + ' ' + 'line'
            })
            .on('mouseover', function(event, d){
                d3.select(this)
                    .style('stroke', 'red')
                let lineName = this.className.baseVal
                let nodeName = document.getElementById('node-name').innerText
                let actalName = nodeName.replace(/\s/g, '')
                if(lineName.includes(actalName)){
                    let diff = (diffMe, diffBy) => diffMe.split(diffBy).join('');
                    let string1 = diff(lineName, actalName);
                    let string2 = diff(string1, 'line');
                    finalString = string2.trim()+'text';
                    d3.selectAll('.'+finalString).style('color', 'red');
                    document.getElementById("connect-img").src = "img/node-img/" + finalString.replace('text', '') + ".jpeg";
                    d3.selectAll('#connect-img').style('border', '5px solid red');
                }

            })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .style('stroke', 'grey')
                d3.selectAll('.'+finalString).style('color', 'black')
                let pic = document.getElementById("connect-img")
                pic.src = ''
                d3.selectAll('#connect-img').style('border-width', 0)
            })
            .merge(vis.edges)

        vis.nodes = vis.nodeGroup.selectAll('path')
            .data(vis.networkData[networkPrincess].nodes, d => d.name)

        vis.nodes.exit().remove()

        vis.nodeEnter = vis.nodes.enter()
            .append('path')
            .attr('d', mickey)
            .attr('stroke', 'black')
            .attr('stroke-width', "8px")
            .attr('class', function(d){
                return d.name + ' node'
            })
            .style('fill', function(d){
                if(d.name === networkPrincess){return "#FFB6C1"}
                else{return '#ADD8E6'}
            })
            .call(vis.dragDrop)
            .on('mouseover', function(event, d){
                d3.selectAll('line')
                    .transition()
                    .style('opacity', '0.2')
                d3.selectAll('path')
                    .transition()
                    .style('opacity', '0.2')
                d3.select(this)
                    .transition()
                    .style('opacity', '1')
                let name = d.name
                connections = "";
                nameDisplay = "";
                source = "";
                selectBox1 = document.getElementById("princess-name");
                networkPrincess = selectBox1.options[selectBox1.selectedIndex].value;
                if (!selectedPrincess && networkPrincess === "Princess") {
                    networkPrincess = "Belle";
                } else if (selectedPrincess && networkPrincess === "Princess") {
                    networkPrincess = selectedPrincess
                }
                vis.networkData[networkPrincess].edges.forEach(function(d, i) {
                    if (d.name1 === name) {
                        source = d.name2
                        nameDisplay = vis.networkData[networkPrincess].nodes.find(findConnection).nameDisplay
                        connections += "<div class="+d.name2+"text"+">"+ nameDisplay + ": " + d.score + "</div>";
                    } else if (d.name2 === name) {
                        source = d.name1
                        nameDisplay = vis.networkData[networkPrincess].nodes.find(findConnection).nameDisplay
                        connections += "<div class="+d.name1+"text"+">"+ nameDisplay + ": " + d.score + "</div>";
                    }
                });
                document.getElementById("node-name").innerText = d.nameDisplay;
                document.getElementById("node-connections").innerHTML = connections;
                document.getElementById("node-img").src = "img/node-img/" + d.name + ".jpeg";
                d3.selectAll('.' + name)
                    .transition()
                    .style('opacity', '1')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                         <div style="border: thin solid grey; border-radius: 3px; background: white; padding: 5px; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                             <h4>${d.nameDisplay}</h4>
                         </div>`);
            })
            .on('mouseout', function(event, d){
                d3.selectAll('path')
                    .transition()
                    .style('opacity', '1')
                d3.selectAll('line')
                    .transition()
                    .style('opacity', '1')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            })
            .attr('x', vis.width / 2)
            .attr('y', vis.height / 2)
            .merge(vis.nodes)

        vis.simulation = d3.forceSimulation(vis.networkData[networkPrincess].nodes)
            .force('charge', d3.forceManyBody().strength(-2500))
            .force('link', d3.forceLink(vis.networkData[networkPrincess].edges).distance(10))
            //.force('center', d3.forceCenter().x(vis.width/2).y(vis.height/2))
            .force('center', d3.forceCenter(vis.width / 2, vis.height / 2))
            .force('collide', d3.forceCollide(vis.networkData[networkPrincess].nodes.count).iterations(20))
            .force('x', d3.forceX(vis.width / 2).strength(0.0015))
            .force('y', d3.forceY(vis.height / 2).strength(0.0015))
            .on('tick', function(){
                vis.edgeEnter.attr("x1", function (d) {return d.source.x})
                    .attr("y1", function (d) {return d.source.y})
                    .attr("x2", function (d) {return d.target.x})
                    .attr("y2", function (d) {return d.target.y});
                vis.nodeEnter.attr('x', function(d) {return d.x})
                    .attr('y', function(d){return d.y})
                    .attr('transform', function(d) { return `translate (${d.x - (320 * +d.count/800)}, ${d.y - (300 * +d.count/800)}), scale(${+d.count/500*2})` });
                vis.fixBounds();
            })

        let connections = "";
        let nameDisplay = "";
        let source = "";
        function findConnection(target) {
            return target.name === source;
        }
        vis.networkData[networkPrincess].edges.forEach(function(d, i) {
            if (d.name1 === networkPrincess) {
                source = d.name2
                nameDisplay = vis.networkData[networkPrincess].nodes.find(findConnection).nameDisplay
                connections += "<div class="+d.name2+"text"+">"+nameDisplay + ": " + d.score + "</div>";
            } else if (d.name2 === networkPrincess) {
                source = d.name1
                nameDisplay = vis.networkData[networkPrincess].nodes.find(findConnection).nameDisplay
                connections += "<div class="+d.name1+"text"+">"+nameDisplay + ": " + d.score + "</div>";
            }
        });

        document.getElementById("node-name").innerText = networkPrincess;
        document.getElementById("node-connections").innerHTML = connections;
        document.getElementById("node-img").src = "img/node-img/" + networkPrincess + '.jpeg';

        vis.simulation.force('link').links(vis.networkData[networkPrincess].edges);
        vis.simulation.nodes(vis.networkData[networkPrincess].nodes);
        vis.simulation.alpha(1).restart();
    }


    fixBounds() {
        let vis = this;
        vis.simulation.nodes().forEach((node) => {
            if (node.x - (320 * +node.count/800) < 0) {
                node.x = 320 * +node.count/800 + 5;
                node.vx = 0;
            }
            if (node.y - (300 * +node.count/800) < 0) {
                node.y = 300 * +node.count/800 + 5;
                node.vy = 0;
            }
            if (vis.width && node.x + (320 * +node.count/800) > vis.width) {
                node.x = this.width - (320 * +node.count/800);
                node.vx = 0;
            }
            if (vis.height && node.y + (300 * +node.count/800) > vis.height) {
                node.y = vis.height - (300 * +node.count/800);
                node.yx = 0;
            }
        })
    }
}