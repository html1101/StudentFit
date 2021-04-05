const xhttp = new XMLHttpRequest()
var workout_vids = {
    "leg": {
        "short": "https://www.youtube.com/watch?v=9l5kjL2JedM",
        "long": "https://www.youtube.com/watch?v=Bf8uyQOmqU8"
    },
    "core": {
        "short": "https://www.youtube.com/watch?v=glxrwC9zsHY",
        "long": "https://www.youtube.com/watch?v=5i8y-_cbwgw"
    },
    "upper body": {
        "short": "https://www.youtube.com/watch?v=0zhvUV1bAVQ",
        "long": "https://www.youtube.com/watch?v=rOf4tRtuvyA"
    },
    "yoga": {
        "short": "https://www.youtube.com/watch?v=XCIviBT3Txc",
        "long": "https://www.youtube.com/watch?v=6hZIzMpHl-c"
    }
}

xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText)
    }
}
// xhttp.open("GET", "/frontend/workout-leg.jpg")
// xhttp.send()

// Resizing workout images
// Either width or height can be automatically distinguished; however, this should NOT be done on shorter sides.
// Calculate sides of each and decide how to size it.
imgs = document.getElementsByClassName("rounded")
for (let i = 0; i < imgs.length; i++) {
    console.log(imgs[i])
    imgs[i].onload = function () {
        console.log("hey")
        let fullI = imgs[i].getBoundingClientRect()
        console.log(fullI)
        if (fullI["width"] > fullI["height"]) {
            // Width > height = width auto, height manual
            console.log("wid > height")
            imgs[i].style.height = "100px"
            imgs[i].style.width = "auto"
            imgs[i].style.maxWidth = "100px"
        } else {
            // Height >= width = width auto, height manual
            console.log("height >= width")
            imgs[i].style.width = "100px"
            imgs[i].style.height = "auto"
            imgs[i].style.maxHeight = "100px"
        }
    }
    imgs[i].onload()
}
// width: auto;
// max-width: 100px;
// height: 100px;
// min-width: 100px;
//s overflow: hidden;