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

const xhttp = new XMLHttpRequest()
let full_list_events = []


xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        // Responded with list of events
        // Curate events and list ones of type homework, studying, or reading.
        events = xhttp.responseText.split("\n")
        for (let i = 0; i < events.length; i++) {
            events[i] = new Event(...events[i].split(", "))
        }
        events = events.filter((val) => {
            return (val.type == "homework" || val.type == "studying" || val.type == "reading" || val.type=="essay") && (new Date() <= val.date)
        })
        console.log(events)
    }
}
xhttp.open("GET", "/events.csv")
xhttp.send()