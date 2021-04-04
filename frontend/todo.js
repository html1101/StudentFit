class Event {
    constructor(name, date, type) {
        this.name = name
        this.date = new Date(date)
        this.date.setDate(this.date.getDate() + 1)
        this.type = type
    }
    /* Can add extra functions later to allow for greater customizability*/
}

const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200) {
        // Responded with list of events
        // Curate events and list ones of type homework, studying, or reading.
        events = xhttp.responseText.split("\n")
        for(let i = 0; i < events.length; i++) {
            events[i] = new Event(...events[i].split(", "))
        }
        console.log(events)
    }
}
xhttp.open("GET", "/events.csv")
xhttp.send()