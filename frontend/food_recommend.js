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
function withinXDays(x, date) {
    let inputDate = new Date(date),
        endDate = new Date();
    endDate.setDate(endDate.getDate() + x);// adding 5 days from today
    return inputDate <= endDate && inputDate >= new Date()
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

        timeWorking = 0,
        testComing = 0,
        testComingClose = 0

        /**
         * Test/ Project Presentation in the next 3 days you should eat:
            Fatty Fish has Omega 3's which is good for your memory
            Dark Chocolate helps with concentration and memory
            Eggs have protiens, leading to greater mental alertness
            Nuts for proteins
            Yogurt for proteins
            */
        // Count about how long someone will have to spend on work for the next 3 days.
        /*
        Key:
        - homework, essay, reading - 30min
        - test - 1.75hr(105min)
        - quiz - 35min
        */
        for (let i = 0; i < events.length; i++) {
            if (withinXDays(3, events[i].date) && events[i].type == "test") {
                testComing = 1
            }
            if(withinXDays(1, events[i].date) && events[i].type == "test") {
                testComingClose = 1
            }
            if ((events[i].type == "homework" || events[i].type == "studying" || events[i].type == "reading" || events[i].type == "essay") && withinXDays(2, events[i].date)) {
                console.log("HW within 2 days.")
                timeWorking += 30
            }
            else if ((events[i].type == "test") && withinXDays(3, events[i].date)) {
                console.log("Test within 3 days.")
                timeWorking += 105
                if((events[i].type == "test") && withinXDays(3, events[i].date)) {
                    testComing = 1
                }
            }
            else if ((events[i].type == "quiz") && withinXDays(3, events[i].date)) {
                console.log("Quiz within 3 days.")
                timeWorking += 35
            }
        }
        if(testComing) {
            document.body.innerHTML += `
                <div class="foods">Fatty Fish - <i>has Omega 3's which is good for your memory</i></div>
                <div class="foods">Dark Chocolate - <i>helps with concentration and memory</i></div>
                <div class="foods">Eggs - <i>have proteins, leading to greater mental alertness</i></div>
                <div class="foods">Nuts and Yogurt - <i>also have proteins</i></div>
                `
            if(testComingClose) {
                document.body.innerHTML += `
                <div class="foods">Coffee - <i>has caffeine, good for short term energy</i></div>
                <div class="foods">Tea - also has caffeine<i></i></div>
                `
            }
        } else {
            document.getElementById("why-1").style.display = "none"
        }
        if(timeWorking >= 120) {
            document.body.innerHTML += `
                <div id="why-2" opacity="0"><i>Because it appears you have a lot to do, we recommend you snack on...</i></div>
                <div class="foods">Unsalted Trail Mix - <i>has nuts which are good for an energy boost</i></div>
                <div class="foods">Greek yogurt - <i>very high in protein and it's filling if you are hungry</i></div>
                <div class="foods">Fruit salad - <i>give you minerals and fibers for a quick brain boost</i></div>
                <div class="foods">Unbuttered popcorn - <i>great snack if you want to stay concentrated</i></div>
                `
        }
        if(timeWorking < 120 && !testComing) {
            document.body.innerHTML += `
            <div id="why-3"><i>It looks like you have an unstressful day ahead! Here are some foods to boost your brain...</i></div>
            <div class="foods">Blueberries - <i>has antioxidants which acts against short-term memory loss</i></div>
            <div class="foods">Broccoli - <i>packed with Vitamin K that forms sphingolipids, a fat that is packed in your brain</i></div>
            <div class="foods">Pumpkin Seeds - <i>contains powerful antioxidants, useful to protect the body and brain</i></div>
            <div class="foods">Oranges - <i>has Vitamin C which helps prevent mental decline</i></div>
            `
        }
    }
}
xhttp.open("GET", "/events.csv")
xhttp.send()