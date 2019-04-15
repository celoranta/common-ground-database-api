

const menuList = [
    "DASHBOARD", "ACCOUNT"
];

const appList = [
    "www.commonground.com",
    "commonGroundiOS",
    "maestro-pi"
];

function makeMenuItem(x) {
//        <a href="#band" class="w3-bar-item w3-button w3-padding-large w3-hide-small">BAND</a>
console.log(x)
    let string = x.toUpperCase();
    //create wrapper div
    var menuItemDiv = document.createElement( 'a' );
    menuItemDiv.setAttribute('class', 'w3-bar-item');
    menuItemDiv.className += (' w3-button');
    menuItemDiv.className += (' w3-padding-large');

    let hrefString = "#" + string;
    menuItemDiv.setAttribute('href', hrefString)
    menuItemDiv.innerHTML = string;
    return menuItemDiv;
}

//Header content
let navbars = document.getElementsByClassName('menubar');

i = 0;
j = 0;
navbarQty = navbars.length;
menuItemQty = menuList.length;
for (i = 0; i < navbarQty; i++){
    var navbar = navbars[i];
    for (j = 0; j < menuList.length; j++){
        let menuItem = makeMenuItem(menuList[j]);
        if (navbar.id != "navDemo"){
          menuItem.className +=  " w3-hide-small";
        }
        else {
            //menuItem.className += " w3-right";
        }
        navbar.appendChild(menuItem);
    };
};

// Present shows by month list
// var showsByMonthDiv = document.getElementById('shows-by-month');
// i = 0;
// for (i = 0; i < monthsShownList.length; i++) {
//     console.log("List item iteration");
//     const showMonthDate = monthsShownList[i];
//     const showMonth = showMonthDate.getMonth();
//     var monthlyShowCount = countShowsInMonth(showMonth);
//     var listItemDiv = constructMonthlyShowListItemDiv(showMonth, monthlyShowCount);
//     showsByMonthDiv.appendChild(listItemDiv);
// }

// Show promo panels
    //filter master showlist for advertized shows
// var showsToPromo = [];

i = 0;
for (i = 0; i < appList.length; i++) {
    const app = appList[i];
    //If show is public, confirmed, and not more than 'x' hours in the past, promo it.
    // if (show.private == "false" && show.confirmed == "true" && dateCompareResult) {
    //     showsToPromo.push(show);
    // }
}

