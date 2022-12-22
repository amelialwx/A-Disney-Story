/* * * * * * * * * * * * * * *
*          WheelVis          *
* * * * * * * * * * * * * * */

class WheelVis {

    // constructor method to initialize the Map object
    constructor(parentElement, colorData) {
        this.parentElement = parentElement;
        this.colorData = colorData;
        this.princessInfo = [{name: "Belle",
            sameColor: ", which is the same group as Princess Snow White.",
            traits: "You are a good Princess due to how independent, caring, and inspiring you are as a Princess."},
            {name: "Cinderella",
            sameColor: ", which is the same group as Princess Elsa and Princess Aurora.",
            traits: "You are a good Princess because you selflessly serve the people around you, treat everyone with kindness, and hold no hatred towards others in your heart."},
            {name: "Elsa",
            sameColor: ", which is the same group as Princess Cinderella and Princess Aurora.",
            traits: "You are a neutral Princess due to your tendency to run away from your problems despite having good intentions and a good heart. Being neutral doesn't make " +
                "you evil, it just means you are way more relatable of a character that others can look up to."}]
        this.colorText = {'red': 'Even though heroes are suppose to wear red capes, we were surprised to find that red was more' +
                'commonly featured in character designs for villains. Red is often associated with determination and passion, which' +
                'can serve as both heroic and villainous qualities. There’s no denying that characters like Captain Hook from Peter ' +
                'Pan or Jafar from Aladdin are determined, but red can also be associated with anger, which may ' +
                'influence their characters designs as well.',
            'orange': 'Like yellow, orange is a bright and “sunny” color. As expected, it did feature most prominently in Disney heroes.' +
                'The only Disney villain we sampled who was primarily orange was Shere Khan from The Jungle Book. But he’s a tiger... so ' +
                'attributing too much meaning to his color scheme feels like a bit of a stretch. That being said, color psychology does ' +
                'associate orange with selfishness and opportunism.',
            'yellow': 'Yellow is generally associated as a positive color for how bright and warm the color symbolizes. Characters who featured ' +
                'yellow were some of the most purely good characters from our sample. Pocahontas, Snow White, and Belle from Beauty and the Beast ' +
                'all have a lot of yellow in their character designs.',
            'green': 'Green is a color often associated with growth, healing and safety. It makes sense, then, that green was found most often in ' +
                'hero designs. The heroes who feature green most prominently in their designs also tended to be character who undergo a lot of growth ' +
                'in their movies. take Mulan, who grows from a daughter set to be married, to a fearless warrior. And Ariel, who literally learns how to ' +
                'walk on her own two feet and leave the ocean for the life she always dreamed of having.',
            'blue': 'Blue was overwhelmingly a heroic color. The color certainly fits the bill, with characteristics like trust, loyalty, confidence and ' +
                'stability often attributed to it. There are some undeniably good characters in the blue category, such as Cinderella and Elsa. We also ' +
                'found that villains who featured blue prominently in their design were all likable characters. Hades from Hercules, for example, is ' +
                'undeniably villainous (he is the god of the underworld, after all) but he’s also a source of comic relief.',
            'purple': 'As we anticipated, purple was overwhelmingly one of the most villainous colors. When you consider that purple is often associated with ' +
                'power, nobility, luxury and ambition, it makes sense. Those characteristics are certainly reflected in characters like Maleficent from ' +
                'Sleeping Beauty, Dr. Facilier from The Princess and the Frog, and the Evil Queen from Snow White and the Seven Dwarfs. They are all character ' +
                'who seek power in some form.',
            'black': 'As you would expect, all of the characters in our sample who featured black prominently in their designs were villains. Some of the ' +
                'villains in this category were also scored the most evil, like Scar from The Lion King, Ursula from The Little Mermaid and Yokai from Big ' +
                'Hero 6. But while Scar and Ursula have virtually no redeeming qualities, Yokai is a much more complex character. And a striking part of ' +
                'Yokai’s costume is his white mask. Maybe there’s some conflict at play in his character design?',
            'white': 'White has the commonly attributed characteristics of innocence and goodness. This is certainly fitting since both Pongo and the Duchess' +
                ' are great representatives of their colors in their respective movies.'}

        this.initVis();
    }

    initVis() {
        let vis = this;
        vis.margin = {top: 10, right: 10, bottom: 10, left: 10};

        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width;
        vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        // get the array of character type (good, netural, bad)
        vis.types = d3.range(0, vis.colorData.length).map(function () {
            return 0;
        });
        vis.colorData.forEach(function (d, i) {
            vis.types[i] = d.type;
        })

        // set the array of character type colors
        vis.typeColors = ['#efefef', '#9e9e9e', '#464646']

        // get the array of character colors
        vis.colors = d3.range(0, vis.colorData.length).map(function () {
            return 0;
        });
        vis.colorData.forEach(function (d, i) {
            vis.colors[i] = d.color;
        })

        // get the array of character group color
        vis.colorGroup = d3.range(0, vis.colorData.length).map(function () {
            return 0;
        });
        vis.colorData.forEach(function (d, i) {
            vis.colorGroup[i] = d.group;
        })

        // get an array of color counts
        vis.colorCount = [];
        vis.colorGroup.forEach(d => {
            if (vis.colorCount.some((val) => { return val["color"] === d })) {
                vis.colorCount.forEach(k =>{
                    if (k["color"] === d) {
                        k["num"]++;
                    }
                })
            } else {
                let a = {};
                a["color"] = d;
                a["num"] = 1;
                vis.colorCount.push(a);
            }
        })

        // get the array of character type (good, netural, bad)
        vis.colorCountFlat = d3.range(0, vis.colorCount.length).map(function () {
            return 0;
        });
        vis.colorCount.forEach(function (d, i) {
            vis.colorCountFlat[i] = d.num;
        })

        vis.SIZE         = 550 - 4;
        vis.SIZE_INNER   = 170;
        vis.BAND_WIDTH1  = vis.SIZE - vis.SIZE_INNER;
        vis.BAND_WIDTH2  = 4 * (vis.SIZE - vis.SIZE_INNER) / 10;
        vis.BAND_WIDTH3  = 2 * (vis.SIZE - vis.SIZE_INNER) / 10;
        vis.BAND_WIDTH   = [0, vis.BAND_WIDTH3, vis.BAND_WIDTH2, vis.BAND_WIDTH1]

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .append('g')
            .attr('transform', 'translate(' + ((vis.SIZE + 4)/2) + ',' + ((vis.SIZE + 4)/1.7) + ')');

        // append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'wheelTooltip')

        vis.wrangleData();
    }

    wrangleData() {
        let vis = this

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        console.log(selectedPrincess);

        function isSelectedPrincess(princess) {
            return princess.name === selectedPrincess;
        }
        let princess = vis.colorData.find(isSelectedPrincess);
        let princessInfo = vis.princessInfo.find(isSelectedPrincess);
        if (selectedPrincess) {
            document.getElementById("wheel-intro-alt").innerText = "";
            document.getElementById("wheel-intro").innerText = "Hey Princess " + princess.name +"! You're in the "+ princess.group + " color group" + princessInfo.sameColor +
                " Read the text below to find out more about what it represents. You can also hover over the inner ring to learn more " +
                "about each color group, or hover over the middle ring to see what colors your fellow Disney friends (& foes) are! The " +
                "outer ring represents whether that character is good, neutral, or bad. " + princessInfo.traits;
            vis.showColorInfo(princess.group);
            vis.showCharacterInfo(princess);
        }


        // outermost arc (character type)
        vis.outerArc = d3.arc()
            .outerRadius((vis.SIZE - vis.BAND_WIDTH[0]) / 2)
            .innerRadius((vis.SIZE - vis.BAND_WIDTH[1]) / 2)
            .startAngle(0)
            .endAngle((2 * Math.PI) / vis.types.length);

        vis.svg.append('g')
            .attr('class', 'band')
            .selectAll('path').data(vis.colorData)
            .enter()
            .append('path')
            .attr('fill', d => {
                if (d.type == 'good') {
                    return vis.typeColors[0];
                } else if (d.type == 'neutral') {
                    return vis.typeColors[1];
                } else {
                    return vis.typeColors[2];
                }
            })
            .attr('stroke', 'grey')
            .attr('stroke-width', 2)
            .attr('transform', (d, i) => 'rotate(' + (i*(360/vis.types.length)) + ')')
            .attr('d', vis.outerArc)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .style('opacity', '0.8')
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html(`
                 <div style="border: thin solid grey; border-radius: 3px; background: white; padding: 5px; padding-top: 10px; padding-left: 10px; padding-right: 10px">
                     <h4>${d.name}</h4>
                     <h5>${d.type.toUpperCase()}</h5>
                 </div>`);
            })
            .on('mouseout', function(event, d) {
                d3.select(this)
                    .style('opacity', '1')
                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html(``);
            });

        // middle arc (character color)
        vis.middleArc = d3.arc()
            .outerRadius((vis.SIZE - vis.BAND_WIDTH[1]) / 2)
            .innerRadius((vis.SIZE - vis.BAND_WIDTH[2]) / 2)
            .startAngle(0)
            .endAngle((2 * Math.PI) / vis.types.length);

        vis.svg.append('g')
            .attr('class', 'band')
            .selectAll('path').data(vis.colorData)
            .enter()
            .append('path')
            .attr('fill', d => {
                return d.color;
            })
            .attr('stroke', 'grey')
            .attr('stroke-width', 2)
            .attr('transform', (d, i) => 'rotate(' + (i*(360/vis.types.length)) + ')')
            .attr('d', vis.middleArc)
            .on('mouseover', function(d, i) {
                d3.select(this)
                    .style('opacity', '0.8')
                vis.showColorInfo(i.group);
                vis.showCharacterInfo(i);
            })
            .on('mouseout', function(d, i) {
                d3.select(this)
                    .style('opacity', '1')
            });

        // inner arc (character color group)
        vis.pie = d3.pie().sort(null);

        vis.innerArc = d3.arc()
            .outerRadius((vis.SIZE - vis.BAND_WIDTH[2]) / 2)
            .innerRadius((vis.SIZE - vis.BAND_WIDTH[3]) / 2)

        // Grouping different arcs
        vis.innerArcs = vis.svg.selectAll("arc")
            .data(vis.pie(vis.colorCountFlat))
            .enter()
            .append("g");

        // Appending path
        vis.innerArcs.append("path")
            .attr("fill", (d, i)=>{
                return vis.colorCount[i].color;
            })
            .attr('stroke', 'grey')
            .attr('stroke-width', 2)
            .attr("d", vis.innerArc)
            .on('mouseover', function(d, i) {
                d3.select(this)
                    .style('opacity', '0.8')
                vis.showColorInfo(vis.colorCount[i.index].color);
            })
            .on('mouseout', function(d, i) {
                d3.select(this)
                    .style('opacity', '1')
            });
    }
    showColorInfo(color) {
        let vis = this;
        document.getElementById("colorText").style.display = "block";
        document.getElementById("colorText").style.backgroundColor = "#FCF5E5";
        document.getElementById("colorText").style.border = "solid " + color;
        document.getElementById("colorText").style.borderWidth = "10px";
        document.getElementById("colorText").style.borderRadius = "3px";
        document.getElementById("colorText").style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
        document.getElementById('colorText').innerText = vis.colorText[color];
        document.getElementById("character-info").style.visibility = "hidden";
    }

    showCharacterInfo(i) {
        let vis = this;

        // styling
        document.getElementById("character-info").style.display = "block";
        document.getElementById("character-info").style.visibility = "visible";
        document.getElementById("character-info").style.backgroundColor = "#FCF5E5";
        document.getElementById("character-info").style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
        let border = "";
        if (i.type == 'good') {
            border = vis.typeColors[0];
        } else if (i.type == 'neutral') {
            border = vis.typeColors[1];
        } else {
            border = vis.typeColors[2];
        }
        document.getElementById("character-info").style.border = "solid " + border;
        document.getElementById("character-info").style.borderWidth = "10px";
        document.getElementById("character-info").style.borderRadius = "3px";

        // character info
        document.getElementById("character-image").src = "img/" + i.id + ".jpeg";
        document.getElementById("character-name").innerText = i.name;
        document.getElementById("character-movie").innerText = "Movie: " + i.movie_title;
        document.getElementById("character-color").innerText = "Color: " + i.color;
        document.getElementById("character-attribute").innerText = "Type: " + i.type;
    }
}