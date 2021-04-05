var workout_vids = {
    "legs": {
        "short": "https://www.youtube.com/watch?v=9l5kjL2JedM",
        "long": "https://www.youtube.com/watch?v=Bf8uyQOmqU8",
        "burn": 90
    },
    "core": {
        "short": "https://www.youtube.com/watch?v=glxrwC9zsHY",
        "long": "https://www.youtube.com/watch?v=5i8y-_cbwgw",
        "burn": 70
    },
    "upper body": {
        "short": "https://www.youtube.com/watch?v=0zhvUV1bAVQ",
        "long": "https://www.youtube.com/watch?v=rOf4tRtuvyA",
        "burn": 110
    },
    "yoga": {
        "short": "https://www.youtube.com/watch?v=XCIviBT3Txc",
        "long": "https://www.youtube.com/watch?v=6hZIzMpHl-c",
        "very short": "https://www.youtube.com/watch?v=nQFf38xeBww",
        "burn": 35
    }
}

let generalWorkout = [
    "legs",
    "core",
    "upper body",
    "legs",
    "yoga",
    "core",
    "upper body"
]
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

function withinXDays(x, date) {
    let inputDate = new Date(date),
        endDate = new Date();
    endDate.setDate(endDate.getDate() + x);// adding 5 days from today
    return inputDate <= endDate && inputDate >= new Date()
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
        timeWorking = 0,
        testComing = 0
        // Count about how long someone will have to spend on work for the next 3 days.
        /*
        Key:
        - homework, essay, reading - 30min
        - test - 1.75hr(105min)
        - quiz - 35min
        */
        for (let i = 0; i < events.length; i++) {
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
            /**
             * Now it's time to make decisions.
             * If >= 3hours of work: short workout + some yoga in between working
             * If test coming up: some yoga in between working
             * If none of the above: long normal workout
             */
        }
        console.log(`Estimated time working: ${timeWorking}min`)
        if(testComing) {
            // Suggest yoga in between work
            document.getElementById("suggest-work").innerHTML = "<i>Because you have a test coming up, we suggest...</i>"
            document.body.innerHTML += `
        <div class="workout" id="leg" onclick="window.open('${workout_vids['yoga']['short']}');">
            <img src="/frontend/workout-yoga.png" alt="Leg workout" class="rounded">
            <div id="text">Yoga</div>
            <div class="time" id="mov"><b id="l">Time:</b> 15min</div>
            <div class="burn" id="mov"><b id="l">Burn:</b> ${Math.round(workout_vids["yoga"]["burn"]*1.5)}cal</div>
        </div>`
        } else if(timeWorking > 180) {
            // >= 3 hours of work
            // Suggest short workout and yoga
            day_workout = generalWorkout[new Date().getDay()]
            console.log(day_workout)
            document.getElementById("suggest-work").innerHTML = "<i>Because you have a lot of work today, we suggest...</i>"
            document.body.innerHTML += `
        <div class="workout" id="leg" onclick="window.open('${workout_vids[day_workout]['short']}');">
            <img src="/frontend/workout-${day_workout}.png" alt="${day_workout} workout" class="rounded">
            <div id="text">${day_workout.charAt(0).toUpperCase() + day_workout.slice(1)}</div>
            <div class="time" id="mov"><b id="l">Time:</b> 15min</div>
            <div class="burn" id="mov"><b id="l">Burn:</b> ${Math.round(workout_vids[day_workout]["burn"]*1.5)}cal</div>
        </div>
        <div class="workout" onclick="window.open('${workout_vids["yoga"]['very short']}');">
            <img src="/frontend/workout-yoga.png"  id="stretch" alt="${day_workout} workout" class="rounded">
            <div id="text">Stretch</div>
            <div class="time" id="mov"><b id="l">Time:</b> 5min</div>
            <div class="burn" id="mov"><b id="l">Burn:</b> ${Math.round(workout_vids["yoga"]["burn"]*0.5)}cal</div>
        </div>
        `
        } else {
            day_workout = generalWorkout[new Date().getDay()]
            console.log(day_workout)
            document.getElementById("suggest-work").innerHTML = "<i>Because it looks like you have a normal work day, we suggest...</i>"
            document.body.innerHTML += `
        <div class="workout" id="leg" onclick="window.open('${workout_vids[day_workout]["long"]}');">
            <img src="/frontend/workout-${day_workout}.png" alt="${day_workout} workout" class="rounded">
            <div id="text">${day_workout.charAt(0).toUpperCase() + day_workout.slice(1)}</div>
            <div class="time" id="mov"><b id="l">Time:</b> 30min</div>
            <div class="burn" id="mov"><b id="l">Burn:</b> ${Math.round(workout_vids[day_workout]["burn"]*3)}cal</div>
        </div>
        <div class="workout" onclick="window.open('${workout_vids["yoga"]['very short']}');">
            <img src="/frontend/workout-yoga.png" id="stretch" alt="${day_workout} workout" class="rounded">
            <div id="text">Stretch</div>
            <div class="time" id="mov"><b id="l">Time:</b> 5min</div>
            <div class="burn" id="mov"><b id="l">Burn:</b> ${Math.round(workout_vids["yoga"]["burn"]*0.5)}cal</div>
        </div>`
        }
    }
}
xhttp.open("GET", "/events.csv")
xhttp.send()