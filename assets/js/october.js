
// Nevexo.space Halloween-ifyer

const currentBackground = [41, 41, 41]
const targetBackground =  [178, 107, 2]

const currentHrefColour = [53, 139, 252]
const targetHrefColour =  [255, 125, 130]

const setHrefColour = (rgb) => {
    // user1385191 (deleted) on StackOverflow 
    let links = document.getElementsByTagName("a");
    for(var i=0;i<links.length;i++) {
        if(links[i].href)
        {
            links[i].style.color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; 
        }
    }  
}

const setBackgroundColour = (rgb) => {
    document.body.style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')'; 
}

const fadeBackground = () => {
    let changes
    let backgroundFadeLoop = setInterval(() => {
        changes = false 
        if (currentBackground[0] < targetBackground[0]) {
            currentBackground[0]++;
            changes = true;
        }
        if (currentBackground[1] < targetBackground[1]) {
            currentBackground[1]++;
            changes = true;
        }
        if (currentBackground[2] > targetBackground[2]) {
            currentBackground[2]--;
            changes = true;
        }
        if (!changes) {
            console.log("Finished background colour transition.")
            clearInterval(backgroundFadeLoop)
        }
        setBackgroundColour(currentBackground)
    }, 10)
}

const fadeHref = () => {
    let changes
    let backgroundFadeLoop = setInterval(() => {
        changes = false;
        if (currentHrefColour[0] < targetHrefColour[0]) {
            currentHrefColour[0]++;
            changes = true;
        }
        if (currentHrefColour[1] < targetHrefColour[1]) {
            currentHrefColour[1]++;
            changes = true;
        }
        if (currentHrefColour[2] > targetHrefColour[2]) {
            currentHrefColour[2]--;
            changes = true;
        }
        if (!changes) {
            console.log("Finished href colour transition.")
            clearInterval(backgroundFadeLoop)
        }
        setHrefColour(currentHrefColour)
    }, 10)
}

const runAnimation = () => {
    fadeBackground()
    fadeHref()
}