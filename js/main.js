/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */

// init global variables & switches
let myMapVis
let selectedPrincess
let myScatterVis
let myWheelVis
let myTimeline
let myNetworkVis


// load data using promises
let promises = [
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
    d3.csv("data/favorite_princess.csv"),
    d3.csv('data/imdb_animations.csv'),
    d3.csv('data/disney_colors.csv'),
    d3.csv('data/belle_characters.csv'),
    d3.csv('data/belle_relationships.csv'),
    d3.csv('data/elsa_characters.csv'),
    d3.csv('data/elsa_relationships.csv'),
    d3.csv('data/cinderella_characters.csv'),
    d3.csv('data/cinderella_relationships.csv')
];

Promise.all(promises)
    .then(function (data) {
        initMainPage(data)
    })
    .catch(function (err) {
        console.log(err)
    });

// initMainPage
function initMainPage(dataArray) {
    // init color wheel
    myWheelVis = new WheelVis('wheelDiv', dataArray[3]);

    // init map
    myMapVis = new MapVis('mapDiv', dataArray[0], dataArray[1]);

    // init scatterplot
    myScatterVis = new ScatterVis('scatterDiv', dataArray[2]);

    // init timeline
    myTimeline = new Timeline('timelineDiv', dataArray[2], selectedPrincess);

    //init network graph
    myNetworkVis = new NetworkVis('networkDiv', dataArray[4], dataArray[5], dataArray[6],
        dataArray[7], dataArray[8], dataArray[9])
}
