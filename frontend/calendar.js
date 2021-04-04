// Set the month and year to the current one on #month_yr

let date = new Date(),
calendarDoc = document.getElementById("calendar"),
input_month_yr = document.getElementById("month_yr")

default_color_scheme = {
    "test": "#ED553B",
    "quiz": "#F6D55C",
    "essay": "#3CAEA3",
    "homework": "#20629B",
    "reading": "#173F5F"
}

event_list_loaded = []

Date.prototype.getWeeksInMonth = function() {
    var firstDay = new Date(this.setDate(1)).getDay();
    var totalDays = new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    return Math.ceil((firstDay + totalDays) / 7);
}

const toTwoDigits = (month) => {
    return month.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
    })
}

input_month_yr.value = `${date.getFullYear()}-${toTwoDigits(date.getMonth()+1)}`
// Default back to original calendar(deep copy!) before changing it
original_calendar = JSON.parse(JSON.stringify(document.getElementById("calendar").innerHTML))

const create_cal = (calendarDoc, event_list=[]) => {
    let currentDay = new Date(date.getFullYear(), date.getMonth(), 1),
    lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0),
    startWeek = false,
    newW = document.createElement("tr"),
    weekN = 1
    newW.id = `Week${weekN}`
    calendarDoc.appendChild(newW)

    document.getElementById("upcoming_list").innerHTML = ""
    if(currentDay.getDay()) { 
        // Add spacing if not on Sunday
        spacing = document.createElement("td")
        spacing.colSpan = currentDay.getDay()
        newW.appendChild(spacing)
    }
    for(let i = currentDay.getDate(); i <= lastDay.getDate(); i++) {
        // Create element at corresponding day in week
        if(currentDay.getDay() == 0) {
            startWeek = true // Sunday
        }
        if(startWeek == true) {
            weekN += 1
            newW = document.createElement("tr")
            newW.id = "Week" + weekN
            calendarDoc.appendChild(newW)
        }
        let day = document.createElement("td")
        day.innerHTML = i
        day.id = i
        newW.appendChild(day)
        for(let ii = 0; ii < event_list.length; ii++) {
            evt_date = new Date(event_list[ii].date)
            evt_date.setDate(evt_date.getDate() + 1)
            if((evt_date.getMonth() == currentDay.getMonth()) && (evt_date.getFullYear() == currentDay.getFullYear()) && (evt_date.getDate() == currentDay.getDate())) {
                // Event match with date!
                // Display name
                day.innerHTML += `<br><div id='small-txt' class='${event_list[ii].type}'>${event_list[ii].name}</div>`
                // Get list of particular class(test, quiz, etc)
                class_name = document.getElementsByClassName(event_list[ii].type)
                class_name[class_name.length - 1].style.color = default_color_scheme[event_list[ii].type]
                console.log(evt_date.toJSON().slice(0, 10), new Date().toJSON().slice(0, 10))
                if(evt_date.toJSON().slice(0, 10) > new Date().toJSON().slice(0, 10)) {
                    // Compare two dates, add to timeline
                    v = document.createElement("li")
                    v.innerHTML = `${event_list[ii].name} - <i>Due ${evt_date.getMonth()}-${evt_date.getDate()}</i>`
                    document.getElementById("upcoming_list").appendChild(v)
                }
            }
        }

        day.style.height = `calc(100px - 0.5em)`
        startWeek = false
        currentDay.setDate(currentDay.getDate() + 1)
    }
}


input_month_yr.addEventListener("change", () => {
    date = new Date(...input_month_yr.value.split("-"), 1)
    date.setMonth(date.getMonth() - 1)
    // Default to original calendar
    calendarDoc.innerHTML = original_calendar
    create_cal(calendarDoc, event_list_loaded)
})


class Event {
    constructor(name, date, type) {
        this.name = name
        this.date = date
        this.type = type
    }
    /* Can add extra functions later to allow for greater customizability*/
}
// Now events.
// Look at the events, add upcoming ones within the timeline
const xhttpG = new XMLHttpRequest()
xhttpG.onreadystatechange = () => {
    if(xhttpG.readyState == 4 && xhttpG.status == 200) {
        // xhttp.responseText
        /*
        CSV file Formatting:
        name, date, type
        */
        // document.getElementById("demo").innerHTML = xhttp.responseText
        /// Returns the server response as a text string
        // Parse the text into events of class Event
        text = xhttpG.responseText.split("\n")
        for(let i = 0; i < text.length; i++) {
            text[i] = new Event(...text[i].split(", "))
        }
        event_list_loaded = text
        console.log(text)
        calendarDoc.innerHTML = original_calendar
        create_cal(calendarDoc, text)
    }
}
xhttpG.open("GET", "/events.csv", true)
xhttpG.send()

// Formatting for POST request:
// xhttpG.open("POST", "/events.csv", true)
// xhttpG.send("name=test&date=bla&type=test")

document.getElementById("create").addEventListener("click", () => {
    // Pull popup into foreground
    appear = document.getElementById("popup")
    appear.style.opacity = 1
    appear.style.display = "block"
})

// Listen for submit_pop
document.getElementById("submit_pop").addEventListener("click", () => {
    // evttype, dateN, eventN
    let event_type = document.getElementById("evttype").value,
    event_date = document.getElementById("dateN").value,
    event_name = document.getElementById("eventN").value

    console.log(event_type, event_date, event_name)
    xhttpG.open("POST", "/events.csv", false)
    xhttpG.send(`name=${event_name}&date=${event_date}&type=${event_type}`)

    // Pull popup into background
    disappear = document.getElementById("popup")
    disappear.style.opacity = 0
    disappear.style.display = "none"

    // Now update the current events
    xhttpG.open("GET", "/events.csv", true)
    xhttpG.send()
})