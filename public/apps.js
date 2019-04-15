const shownAppList = [
    { name: "commongroundband.ca" },
    { name: "commonGroundiOS" },
    { name: "maestro-pi" }
];

function constructAppTile(app) {

    console.log(app.name);

    //create wrapper div
    var mainWrapperDiv = document.createElement('div');
    mainWrapperDiv.setAttribute('class', 'w3-third');
    mainWrapperDiv.className += " w3-margin-bottom";
    mainWrapperDiv.className += " w3-black";


    // //create subwrapper div
    var subWrapperDiv = document.createElement('div');
    subWrapperDiv.setAttribute('class', 'w3-container');
    subWrapperDiv.className += ' w3-white';

    // //create venue name paragraph div
    var nameBlock = document.createElement('p');
    var venueString = app.name
    nameBlock.innerHTML = venueString.bold();

    // var buttonDiv = document.createElement('button');
    // buttonDiv.setAttribute('class', 'w3-button');
    // buttonDiv.className += " w3-black";
    // buttonDiv.className += " w3-margin-bottom";
    // buttonDiv.setAttribute('onclick', "" );
    // buttonDiv.innerHTML = 'App Config';

    //nest divs
    subWrapperDiv.appendChild(nameBlock);
    //    subWrapperDiv.appendChild(buttonDiv);
    mainWrapperDiv.appendChild(subWrapperDiv);
    return mainWrapperDiv;
};

var i = 0;
let targetDiv = document.getElementById('apps');
for (i = 0; i < shownAppList.length; i++) {
        let app = shownAppList[i];
        let tile = constructAppTile(app);
        targetDiv.appendChild(tile);
        tile.onclick = function () {console.log('hi')};
        tile.className += " w3-hover-opacity"
        console.log(app)
};

//create wrapper div
var mainWrapperDiv = document.createElement('div');
mainWrapperDiv.setAttribute('class', 'w3-third');
mainWrapperDiv.className += " w3-margin-bottom";
mainWrapperDiv.className += " w3-black";
mainWrapperDiv.className += " w3-hover-opacity"


// //create subwrapper div
var subWrapperDiv = document.createElement('div');
subWrapperDiv.setAttribute('class', 'w3-container');
subWrapperDiv.className += ' w3-white';

// //create venue name paragraph div
var nameBlock = document.createElement('p');
var venueString = 'Add App';
nameBlock.innerHTML = venueString.bold();

// var buttonDiv = document.createElement('button');
// buttonDiv.setAttribute('class', 'w3-button');
// buttonDiv.className += " w3-black";
// buttonDiv.className += " w3-margin-bottom";
// buttonDiv.setAttribute('onclick', "" );
// buttonDiv.innerHTML = 'App Config';

//nest divs
subWrapperDiv.appendChild(nameBlock);
//subWrapperDiv.appendChild(buttonDiv);
mainWrapperDiv.appendChild(subWrapperDiv);
mainWrapperDiv.onclick = function () {console.log('hi')};
targetDiv.appendChild(mainWrapperDiv);

let header = document.getElementById('apps-header');
header.innerHTML = "COMMON GROUND API DASHBOARD";
let blurb = document.getElementById('apps-blurb');
blurb.innerHTML = "Create and Manage Your Apps";
