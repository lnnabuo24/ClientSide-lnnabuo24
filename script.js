/*

fields/filters im thinking of

name
category (filter by what youre interested in)
club/event organizer? (kinda overlaps with category i feel, but filter to find events for your clubs)
rsvps (basically sort by popularity, maybe youre interested in smaller/"niche" events)
(or maybe youre going to an event where you can get boba and dont want to get jumpscared with a massive line)
(this has definitely never happened to me)
could also be used to find "average" popularity for filtered events?

time could also be a good one
for one, user experience (clubs can just put down the time their event starts instead of remembering to put it in the description)
filter by time to see events your schedule works for
(ex. i only want events after 5, or events between 2 and 8 pm)
alongside date
javascript does have a date object, but apparently its outdated and its replacement is temporal (thats what its called)

*/



//const events = [];
const events = [
    // goodbye erwe club and bulc ewre
    // good test events
    //{name: "erwe club first meeting!!!", desc:"hello", organizer:"erwe club", category:"club meeting", rsvpCount:21},
    //{name: "bulc ewre first gniteem???", desc:"olleh", organizer:"bulc ewre", category:"social", rsvpCount:12}
    
    // and hello the last few coe events in my email
    // (plus a few i made up)
    {name: "TTRPG Night", date: new Date(2026, 8, 25, 19), desc:"Join Geekfest for a night of tabletop RPGs!", organizer: "Geekfest", category: "Social", rsvpCount: 15},
    {name: "Coe Student Education Association Club Meeting", date:new Date(2026, 8, 24, 18), desc:"Come study or relax with us!", organizer: "Student Education Association", category: "Social", rsvpCount: 20},
    {name: "Free Boba", date:new Date(2026, 9, 1, 17), desc:"Free boba tea!", organizer: "Asian Association", category: "Social", rsvpCount: 50},
    {name: "Concert", date:new Date(2026, 9, 20, 17), desc:"There's no description. We do have a local band singing, though!", organizer: "Residence Life", category: "Social", rsvpCount: 45},
    
    {name: "NC's First Meeting!", date:new Date(2026, 9, 2, 16), desc:"We made our club 5 minutes ago! Come join us for our first meeting!", organizer: "Neat Club", category: "Meeting", rsvpCount: 1},
    {name: "Chemistry Club Meeting", date:new Date(2026, 10, 2, 18), desc:"No description.", organizer: "Chemistry Club", category: "Meeting", rsvpCount: 7},
    {name: "Ice Cream Social", date:new Date(2026, 10, 18, 15), desc:"No description.", organizer: "Physics Club", category: "Meeting", rsvpCount: 8},
    
    {name: "What to do in Cedar Rapids?", date:new Date(2026, 10, 2, 14), desc:"Learn about the various fun things you can do in Cedar Rapids!", organizer: "Residence Life", category: "Information", rsvpCount: 18},
    {name: "Nearby Job Opportunities", date:new Date(2026, 10, 2, 16), desc:"There are many job opportunities within walking distance of campus. Come learn about them!", organizer: "C3", category: "Information", rsvpCount: 12},
    {name: "New to Voting?", date:new Date(2026, 11, 15, 16), desc:"Are you registered to vote? Do you know when, where, and how to vote? If the answer to either question was \"no\", come join us and we'll teach you!", organizer: "CoeVotes", category: "Information", rsvpCount: 4},
    
];

// Track the currently selected item object
let selectedUserData = null;

const tableBody = document.getElementById("tableBody");

const nameInput = document.getElementById("nameInput");
const organizerInput = document.getElementById("organizerInput");
const categoryInput = document.getElementById("categoryInput");
const timeInput_before = document.getElementById("timeInput_before");
const timeInput_after = document.getElementById("timeInput_after");

const averageRSVPCount = document.getElementById("averageRSVPCount");
const filterClearButton = document.getElementById("clearButton");

const inputs = [
    nameInput,
    organizerInput,
    categoryInput,
    timeInput_before,
    timeInput_after
];

function populateTable(dataArray) {
    tableBody.innerHTML = "";
    
    // calculate the average # of rsvps for the input array
    // and round down
    const averageRSVP = Math.floor( dataArray.reduce( (acc, current) => acc + (current.rsvpCount / dataArray.length), 0 ) );
    //console.log(averageRSVP)
    
    // my cool and amazing idea
    // "popular" events get a different color
    // "popular" is currently defined as 1.5x the average rsvp count for the events being looked at
    // think its a nice feature, shows some of the "standout" events
    const updatedArray = dataArray.map( (someEvent) => Object.assign({}, someEvent, {isPopular: (someEvent.rsvpCount >= (averageRSVP * 1.5))}) );
    /*
    const updatedArray = dataArray.map( (someEvent) => {
        
        if ( someEvent.rsvpCount >= (averageRSVP * 1.5) )
        {
            // popular
            return Object.assign({}, someEvent, {isPopular: true});
        }
        else
        {
            // not popular (which is fine too)
            return Object.assign({}, someEvent, {isPopular: false});
        };
        
    } );
    */

    updatedArray.forEach(event => {
        const row = document.createElement("tr");

        // Keep the visual highlight active if this item was previously selected
        /*
        if (selectedUserData && selectedUserData.id === event.id) {
            row.classList.add("selected");
        }
        */

        // description was highlighted blue (scary)
        // so its now desc
        row.innerHTML = `
            <td>${event.name}</td>
            <td>${event.date.toString()}</td>
            <td>${event.desc}</td>
            <td>${event.organizer}</td>
            <td>${event.category}</td>
            <td>${event.rsvpCount}</td>
        `;
        
        //console.log(event.isPopular);
        
        if (event.isPopular)
        {
            //console.log("RAAAAA" + event.name);
            row.classList.add("popularEvent");
        };
        
        /*
        // Add click listener to select a specific row
        row.addEventListener("click", () => {
            // Remove selection class from all rows in view
            document.querySelectorAll("#tableBody tr").forEach(r => r.classList.remove("selected"));
            
            // Toggle selection
            if (selectedUserData && selectedUserData.id === event.id) {
                selectedUserData = null; // Deselect if clicking the same row again
            } else {
                row.classList.add("selected"); // Select new row
                selectedUserData = event;       // Store the data object
            }
        });
        */

        tableBody.appendChild(row);
    });
    
    // update the average rsvp count to reflect this
    averageRSVPCount.innerHTML = "Average RSVPs for these events: " + averageRSVP;
}


// no copying and pasting this time
updateTable = (triggeringEvent) => {
    const filterName = nameInput.value.toLowerCase();
    const filterOrganizer = organizerInput.value.toLowerCase();
    const filterCategory = categoryInput.value.toLowerCase();
    const filter_timeBefore = timeInput_before.value; // events must occur before then
    const filter_timeAfter = timeInput_after.value; // events must occur after then
    
    const filteredEvents = events.filter(event => {
        return (
            // filter by name
            (event.name.toLowerCase().includes(filterName))
            &&
            // filter by organizer
            (event.organizer.toLowerCase().includes(filterOrganizer))
            &&
            // filter by category
            // (having dropdown is another option)
            (event.category.toLowerCase().includes(filterCategory))
            &&
            // filter by time
            // before
            (!filter_timeBefore || (new Date(filter_timeBefore) > event.date))
            &&
            // after
            (!filter_timeAfter || (new Date(filter_timeAfter) < event.date))
            
        );
    });
    populateTable(filteredEvents);
    
    
    // this feels ugly
    // whenever i add a new input i have to hardcode including it here
    // couldnt i just compare filteredEvents to the original table?
    // my only issue is that if my name filter is something as broad as a single space " ", thats considered not having a filter
    // (since im pretty sure all event names include a space somewhere)
    
    // okay, length works okay-ish
    // the space issue is only missing because there is an event with a space
    // except wait
    // the space issue is theoretically also there with the organizer too, it just doesnt show up here
    //isDifferent = (filteredEvents.length != events.length);
    
    const isDifferent = (filteredEvents.length != events.length) || !( events.every( (anEvent, index) => events.at(index) == filteredEvents.at(index) ) );
    
    // okay
    // every() returns false if it finds something that doesnt satisfy the condition
    // here, the condition is that the item at index whatever equals whatever the item at the same index in filteredEvents
    // so it returns false if an item does NOT match (i think)
    
    //if (filterName || filterOrganizer || filterCategory || filter_timeBefore || filter_timeAfter)
    //if (filteredEvents.length != events.length)
    if (isDifferent)
    {
        // at least one filter is active
        console.log("enable me");
        filterClearButton.disabled = false;
        filterClearButton.classList.add("button_clear");
        filterClearButton.classList.remove("button_clear_disabled");
    }
    else
    {
        // filters are disabled
        console.log("disable me");
        filterClearButton.disabled = true;
        filterClearButton.classList.remove("button_clear");
        filterClearButton.classList.add("button_clear_disabled");
    }
    
};

/*
// create an empty array
// iterate over the events
// if an event has a category not in the array, add it to the array
// creates a list of available categories
// or i hardcode a list of categories
// which feels a little bad
// unless i can say that theoretically id get the categories from the server
makeCategories = (eventList) => {
    const currentCats = []
}
*/

/*
nameInput.addEventListener("input", updateTable);
organizerInput.addEventListener("input", updateTable);
categoryInput.addEventListener("input", updateTable);
timeInput_before.addEventListener("input", updateTable);
timeInput_after.addEventListener("input", updateTable);
*/
// i copied and pasted
// i feel bad now

inputs.forEach( (someInput) => someInput.addEventListener("input", updateTable) );


// filter button
filterClearButton.addEventListener("click", () => {
    console.log("clear filters here");
    /*
    nameInput.value = "";
    organizerInput.value = "";
    categoryInput.value = "";
    timeInput_before.value = "";
    timeInput_after.value = "";
    */
    // hmmmm
    // this feels funny
    // or i guess smells funny
    
    // this feels a lot cleaner
    // does this violate mutability?
    // its directly altering the inputs
    // or is it fine?
    inputs.forEach( (someInput) => someInput.value = "" );
    
    updateTable();
})


// Init
populateTable(events);
updateTable();
