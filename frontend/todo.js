class Event {
    constructor(name, date, type, finished) {
        this.name = name
        this.date = new Date(date)
        this.date.setDate(this.date.getDate() + 1)
        this.type = type
        this.finished = finished
    }
    /* Can add extra functions later to allow for greater customizability*/
}

default_color_scheme = {
    "test": "#ED553B",
    "quiz": "#F6D55C",
    "essay": "#3CAEA3",
    "homework": "#20629B",
    "reading": "#173F5F"
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
 


const xhttp = new XMLHttpRequest()
let full_list_events = []

xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        // Responded with list of events
        // Curate events and list ones of type homework, studying, or reading.
        
        // Clear todo and rewrite it
        document.getElementById("items").innerHTML = ""

        events = xhttp.responseText.split("\n")
        for (let i = 0; i < events.length; i++) {
            events[i] = new Event(...events[i].split(", "))
        }
        events = events.filter((val) => {
            return (val.type == "homework" || val.type == "studying" || val.type == "reading" || val.type=="essay") && (new Date() <= val.date)
        })
        // Add events to todo
        for (let i = 0; i < events.length; i++) {
            document.getElementById("items").innerHTML += `
            <label for="event_${i}" id="list_" class="container">
            <input id="event_${i}" type="checkbox" ${(events[i].finished == "1") ? 'checked' : ''}>
            <span class="checkmark" background="${default_color_scheme[events[i].type]}"></span>
            <div id="n">${events[i].name} - ${formatDate(events[i].date)} - ${events[i].type}</div></label><br>`
        }
        full_list_events = events
        listen_checkbox()
    }
}
xhttp.open("GET", "/events.csv")
xhttp.send()

const listen_checkbox = () => {
    // Listen for when checkbox is clicked
    checkboxes = document.querySelectorAll("input[type=checkbox]")
    console.log(checkboxes)

    for(let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", () => {
            console.log(`Box ${i} was clicked! Corresponds with:`)
            xhttp.open("PUT", "/events.csv")
            let is_finished = full_list_events[i].finished == "0" ? "1":"0"
            xhttp.send(`name=${full_list_events[i].name}&date=${formatDate(full_list_events[i].date)}&type=${full_list_events[i].type}&finished=${is_finished}`)
            console.log(full_list_events[i])
        })
    }
}