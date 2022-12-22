// show Princess Information

let belle = {"Name":"Belle", "Movie":"Beauty and the Beast", "Year": 1991, "Voice Actor":"Paige O'Hara","Creator":"Linda Woolverton",
"Nationality":"French", "Original Writer": "Gabrielle-Suzanne Barbot de Villeneuve", "Original Year": 1740};
let cinderella = {"Name":"Cinderella", "Movie":"Cinderella", "Year": 1950, "Voice Actor":"Ilene Woods","Creator":"Wilfred Jackson, Hamilton Luske, and Clyde Geronimi",
"Nationality":"French", "Original Writer": "Charles Perrault", "Original Year": 1697};
let elsa = {"Name":"Elsa", "Movie":"Frozen", "Year": 2013, "Voice Actor":"Idina Menzel","Creator":"Chris Buck and Jennifer Lee",
    "Nationality":"Scandinavian", "Original Writer": "Hans Christian Andersen", "Original Year": 1844};

function setPrincess(princess) {
    selectedPrincess = princess;
    let confirmation = document.getElementById("confirmation");
    confirmation.innerText = "please pick a princess: " + princess;
    showPrincessInfo();
}

function showPrincessInfo(){
    // let selectBox1 = document.getElementById("princess-name");
    // selectedPrincess = selectBox1.options[selectBox1.selectedIndex].value;
    let getTitleNode = document.getElementById("princessintro");
    let newTitle = "you picked " + selectedPrincess + "!";
    getTitleNode.innerText = newTitle;
    console.log(selectedPrincess);
    showDetailInfo();
    myTimeline.updateVis();
    myWheelVis.updateVis();
    myMapVis.updateVis();
    myNetworkVis.updateVis();
    myScatterVis.updateVis();
}
function showDetailInfo(){
    if (selectedPrincess === "Belle"){
        document.getElementById("princessintro-alt").innerText = "";
        document.getElementById("princess-info").style.backgroundColor = "#FCF5E5";
        document.getElementById("princess-info").style.border = "solid " + "#F6ECBD";
        document.getElementById("princess-info").style.borderWidth = "10px";
        document.getElementById("princess-info").style.borderRadius = "3px";
        document.getElementById("princess-info").style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px"
        document.getElementById("movie-name").innerText = "You live in the movie called " + belle["Movie"] + "...";
        document.getElementById("movie-year").innerText = "which was produced in the year of " + belle["Year"] + ".";
        document.getElementById("voice-actor").innerText = "You are voiced by " + belle["Voice Actor"] + "...";
        document.getElementById("creator").innerText = "and created by " + belle["Creator"] + ".";
        document.getElementById("nationality").innerText = "You are a " + belle["Nationality"] + " Princess, by the way,";
        document.getElementById("original-writer").innerText = "as the movie is based on " + belle["Original Writer"] + "'s work in " + belle["Original Year"] + ".";
        document.getElementById("princess-year").innerText = "You are born in Year " + belle["Year"] + ", Princess Belle. In 2022, you are "+(2022-belle["Year"]) + " years old";
        document.getElementById("princess-image").src = "img/bellemovie.jpg";
        document.getElementById("princess-age").innerText="You are ranked 5 among the 13 Disney princesses. Your eldest sister is Snow White; born in 1937, she is "+(belle["Year"]-1937)
        +" years older than you. Your youngest sister is Moana; born in 2016, she is " + (2016-belle["Year"]) +" years younger than you.";
    }
    else if (selectedPrincess === "Cinderella"){
        document.getElementById("princessintro-alt").innerText = "";
        document.getElementById("princess-info").style.backgroundcolor = "#FCF5E5";
        document.getElementById("princess-info").style.border = "solid " + "#D1F0EE";
        document.getElementById("princess-info").style.borderWidth = "10px";
        document.getElementById("princess-info").style.borderRadius = "3px";
        document.getElementById("movie-name").innerText = "You live in the movie called " + cinderella["Movie"] + "...";
        document.getElementById("movie-year").innerText = "which was produced in the year of " + cinderella["Year"] + ".";
        document.getElementById("voice-actor").innerText = "You are voiced by " + cinderella["Voice Actor"] + "...";
        document.getElementById("creator").innerText = "and created by " + cinderella["Creator"] + ".";
        document.getElementById("nationality").innerText = "You are a " + cinderella["Nationality"] + " Princess, by the way,";
        document.getElementById("original-writer").innerText = "as the movie is based on " + cinderella["Original Writer"] + "'s work in " + cinderella["Original Year"] + ".";
        document.getElementById("princess-year").innerText = "You are born in Year " + cinderella["Year"] + ", Princess Cinderella. In 2022, you are "+(2022-cinderella["Year"]) + " years old";
        document.getElementById("princess-image").src = "img/cinderellamovie.jpg";
        document.getElementById("princess-age").innerText="You are ranked 2 among the 13 Disney princesses. Your eldest sister is Snow White; born in 1937, she is "+(cinderella["Year"]-1937)
            +" years older than you. Your youngest sister is Moana; born in 2016, she is " + (2016-cinderella["Year"]) +" years younger than you.";
    }
    else if (selectedPrincess === "Elsa"){
        document.getElementById("princessintro-alt").innerText = "";
        document.getElementById("princess-info").style.backgroundcolor = "#FCF5E5";
        document.getElementById("princess-info").style.border = "solid " + "#FDA3B2";
        document.getElementById("princess-info").style.borderWidth = "10px";
        document.getElementById("princess-info").style.borderRadius = "3px";
        document.getElementById("movie-name").innerText = "You live in the movie called " + elsa["Movie"] + "...";
        document.getElementById("movie-year").innerText = "which was produced in the year of " + elsa["Year"] + ".";
        document.getElementById("voice-actor").innerText = "You are voiced by " + elsa["Voice Actor"] + "...";
        document.getElementById("creator").innerText = "and created by " + elsa["Creator"] + ".";
        document.getElementById("nationality").innerText = "You are a " + elsa["Nationality"] + " Princess, by the way,";
        document.getElementById("original-writer").innerText = "as the movie is inspired by " + elsa["Original Writer"] + "'s work in " + elsa["Original Year"] +".";
        document.getElementById("princess-year").innerText = "You are born in Year " + elsa["Year"] + ", Princess Elsa. In 2022, you are "+(2022-elsa['Year']) +" years old";
        document.getElementById("princess-image").src = "img/elsamovie.jpg";
        document.getElementById("princess-age").innerText="You are ranked 12 among the 13 Disney princesses. Your eldest sister is Snow White; born in 1937, she is "+(elsa["Year"]-1937)
            +" years older than you. Your youngest sister is Moana; born in 2016, she is " + (2016-elsa["Year"]) +" years younger than you."
    }
}