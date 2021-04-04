const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = () => {
    if(xhttp.readyState == 4 && xhttp.status == 200) {
        console.log(xhttp.responseText)
    }
}
// xhttp.open("GET", "/frontend/workout-leg.jpg")
// xhttp.send()

// Resizing workout images
// Either width or height can be automatically distinguished; however, this should NOT be done on shorter sides.
// Calculate sides of each and decide how to size it.
imgs = document.getElementsByClassName("rounded")
for(let i = 0; i < imgs.length; i++) {
    console.log(imgs[i])
    imgs[i].onload =  function() {
        console.log("hey")
        let fullI = imgs[i].getBoundingClientRect()
        console.log(fullI)
        if(fullI["width"] > fullI["height"]) {
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