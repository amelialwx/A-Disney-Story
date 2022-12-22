
class Timeline {

    // constructor method to initialize Timeline object
    constructor(parentElement, data, selectedPrincess){
        this._parentElement = parentElement;
        this._data = data;

        // No data wrangling, no update sequence
        this.data = data;
        this.selectedPrincess = selectedPrincess
        this.initVis();
    }

    // create initVis method for Timeline class
    initVis() {
        // store keyword this which refers to the object it belongs to in variable vis
        let vis = this;
        let formatDate = d3.timeFormat("%Y");
        let parseDate = d3.timeParse("%Y");
        vis.data.forEach(d=>{
            d.Year = parseDate(d.Year);
            d.Description = +d["Description"];
            d["IMDb Rating"] = +d["IMDb Rating"];
        });
        vis.data.sort((a,b)=> a.Year - b.Year);
        console.log(vis.data);

        vis.margin = {top: 100, right: 40, bottom: 30, left: 40};

        vis.width = document.getElementById(vis._parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = document.getElementById(vis._parentElement).getBoundingClientRect().height/2  - vis.margin.top - vis.margin.bottom;

        // SVG drawing area
        vis.svg = d3.select("#" + vis._parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
      //  vis.x = d3.scaleTime()
        //    .range([0, vis.width])
          //  .domain([parseDate("1935"), parseDate("2022")])
        let n = 13
        vis.x = d3.scaleTime()
            .range([0,1/n*vis.width, 2/n*vis.width,3/n*vis.width,4/n*vis.width,5/n*vis.width,6/n*vis.width,
                7/n*vis.width,8/n*vis.width,9/n*vis.width,10/n*vis.width,11/n*vis.width,12/n*vis.width,vis.width])
            .domain([parseDate("1935"),parseDate("1950"),parseDate("1959"),parseDate("1989"),parseDate("1991"),parseDate("1992"),
                parseDate("1995"),parseDate("1998"),parseDate("2009"),parseDate("2010"),parseDate("2012"),parseDate("2013"),parseDate("2016"),parseDate("2022")])

        vis.y = d3.scaleLinear()
            .domain([d3.max(vis.data, d => +d['Description'])+0.5, d3.min(vis.data, d => +d['Description'])-0.5])
          //  .domain([d3.max(vis.data, d => +d['IMDb Rating'])+0.5, d3.min(vis.data, d => +d['IMDb Rating'])-0.5])
            .range([0, vis.height]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickValues([parseDate("1937"),parseDate("1950"),parseDate("1959"),parseDate("1989"),parseDate("1991"),parseDate("1992"),
                parseDate("1995"),parseDate("1998"),parseDate("2009"),parseDate("2010"),parseDate("2012"),parseDate("2013"),parseDate("2016"),parseDate("2022")]);
           // .tickValues([1937,1950,1959,1989,1991,1992,1995,1998,2009,2010,2012,2013,2016,2022]);
        // Append x-axis
        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")")
            .call(vis.xAxis);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);
        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(-10,0)")
            .call(vis.yAxis);

        // SVG area path generator
        vis.area = d3.area()
            .x(function(d) { return vis.x(d.Year); })
            .y0(vis.height)
            .y1(function(d) { return vis.y(d["IMDb Rating"]); });

        let config = {
            "avatar_size": 80
        }

        vis.defs = vis.svg.append('svg:defs');

        vis.princessPics = [{
            name: "Snow White",
          posx: 1937,
            posy: 7.6,
            img: "img/snowwhite.png"
        },
            {
                name: "Elsa",
            posx: 2013,
            posy: 7.4,
            img: "img/elsa.png",
        }, {
            name: "Cinderella",
                posx: 1950,
                posy: 7.3,
                img: "img/cinderella.png",
            },
            {
                name: "Aurora",
                posx: 1959,
                posy: 7.2,
                img: "img/aurora.png",
            },
            {
                name: "Ariel",
            posx: 1989,
            posy: 7.6,
            img: "img/ariel.png"
        }, {
            name: "Belle",
                posx: 1991,
                posy: 8,
                img: "img/belle.png",
            },{
            name: "Jasmine",
                posx: 1992,
                posy: 8,
                img: "img/jasmine.png",
            },{
            name: "Pocahontas",
                posx: 1995,
                posy: 6.7,
                img: "img/pocahontas.png",
            },
            {
                name: "Mulan",
                posx: 1998,
                posy: 7.6,
                img: "img/mulan.png",
            },{
                name: "Moana",
                posx: 2016,
                posy: 7.6,
                img: "img/moana.png",
            },{
                name: "Rapunzel",
                posx: 2010,
                posy: 7.7,
                img: "img/rapunzel.png",
            },{
                name: "Tiana",
                posx: 2009,
                posy: 7.1,
                img: "img/tiana.png",
            },{
                name: "Merida",
                posx: 2012,
                posy: 7.1,
                img: "img/merida.png",
            }
        ];

        vis.princessCircles = vis.svg.append('clipPath')
            .attr('id','clipObj')
            .append('circle')
            .attr('cx',config.avatar_size/2)
            .attr('cy',config.avatar_size/2)
            .attr('r',config.avatar_size/2);

        vis.princessPics.forEach(function(d,i){
            vis.svg.append('image')
                .attr('xlink:href',d.img)
                .attr('width',config.avatar_size)
                .attr('height',config.avatar_size)
                .attr('transform','translate('+parseInt(vis.x(parseDate(d.posx))-config.avatar_size/2)+','+parseInt(vis.y(1)-config.avatar_size/2*1.5)+')')
             //   .attr('transform','translate('+parseInt(vis.x(parseDate(d.posx))-config.avatar_size/2)+','+parseInt(vis.y(d.posy)-config.avatar_size/2)+')')
                .attr('clip-path','url(#clipObj)');
        });

        let circle = vis.svg.selectAll("circle")
            .data(vis.data);
        vis.circles = circle.enter()
            .append("circle")
            .attr("class", "tooltip-circle")
            .attr("cx", d => vis.x(+d.Year))
            .attr("cy", d => vis.y(+d["Description"]))
          //  .attr("cy", d => vis.y(+d["IMDb Rating"]))
            .attr("r", function(d){
                if (d.Princess === "None"){
                    return 6;
                }
                else {return 35;}
            })
            .attr("fill", function(d){
                if (d.Princess === "None"){
                    return "None";
                }
                else
                {return "None";}
            })
            .attr("stroke", function(d){
                if (d.Princess === "None"){
                    return "black";
                } else
                {return "None";}
            });

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'timelineTooltip');

        vis.tooltip2 = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'timelineTooltip2')

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this;
        vis.updateVis();
    }

    updateVis(){
        if (selectedPrincess) {
            document.getElementById("")
        }
        let vis = this;
        let formatDate = d3.timeFormat("%Y");
        vis.circles
            .attr("fill",function(d){
                if (d.Princess === "None"){
                    return "white";
                } else if (d.Princess === "Belle" && selectedPrincess === "Belle"){
                    return "red";
                } else if (d.Princess === "Cinderella" && selectedPrincess === "Cinderella"){
                    return "red";
                } else if (d.Title === "Frozen" && selectedPrincess === "Elsa"){
                    return "red";
                } else
                    {return "white";}
            })
            .style('opacity', function(d){
                if (d.Princess === "None"){
                    return 0.2
                } else {return 0}
            })
        vis.circles.on('mouseover', function(event, d){
            d3.select(this)
                .attr('stroke-width', '2px')
                .attr('stroke', 'red')
                .style('opacity', function(d){
                    if (d.Princess === "None"){
                        return 0.2
                    } else {return 0}
                })
            let textblock = `<div><\div>`
            vis.tooltip
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                         <div style="border: thin solid grey; border-radius: 3px; background: white; padding: 5px; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                             ${textblock}
                             <h4>${d.Title}</h4>
                             <h5>IMDb Rating: ${d['IMDb Rating']}</h5>
                             <h5>Year: ${formatDate(d['Year'])}</h5>
                         </div>`);
        })
            .on('mouseout', function(event, d){
                d3.select(this)
                    .attr('stroke-width', function(d){
                        if (d.Princess === "None"){
                            return 1
                        } else {return 0}
                    })
                    .style('opacity', function(d){
                        if (d.Princess === "None"){
                            return 0.2
                        } else {return 0}
                    })
                    .attr("stroke", "black");
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });
        vis.princessCircles.on('mouseover', function(event, d){
            d3.select(this)
                .attr('stroke-width', '2px')
                .attr('stroke', 'red')
                .style('opacity', '1')
            let textblock = `<div><\div>`
            vis.tooltip2
                .style("opacity", 1)
                .style("left", event.pageX + 20 + "px")
                .style("top", event.pageY + "px")
                .html(`
                         <div style="border: thin solid grey; border-radius: 3px; background: white; padding: 5px; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                             ${textblock}
                             <h4>${d.Name}</h4>
                         </div>`);
        })
    }
}