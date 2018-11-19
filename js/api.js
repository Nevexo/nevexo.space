// This script will use the Nevexo.space API to get social media data.
// Rules:
//  - It must work without access to the API.

// Set failbacks:
// Used if the API is unavailable.
const failback = {
    "twitter": {
        "name": "@_nevexo_",
        "url": "https://twitter.com/_nevexo_",
        "fa_icon": "fab fa-twitter"
    },
    "linkedin": {
        "name": "Nevexo",
        "url": "https://www.linkedin.com/in/nevexo",
        "fa_icon": "fab fa-linkedin"
    },
    "gitlab": {
        "name": "Nevexo",
        "url": "https://gitlab.com/nevexo",
        "fa_icon": "fab fa-gitlab"
    },
    "github": {
        "name": "Nevexo",
        "url": "https://github.com/nevexo",
        "fa_icon": "fab fa-github"
    },
    "keybase": {
        "name": "Nevexo",
        "url": "https://keybase.io/nevexo",
        "fa_icon": "fab fa-keybase"
    }
}

const fetch_endpoint = (endpoint, callback) => {
    fetch("https://api.nevexo.space" + endpoint, {"Content-Type": "Application/JSON", "mode": "no-cors"})
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            console.log(JSON.stringify(json));
            callback(json)
        });
}

const update_frontend = (obj) => {
    const base = `
    <a href="{service_url}" class="animated bounceIn button is-large is-dark" style="margin: 0.2em;">
        <span class="icon is-medium">
            <i class="{service_fa_icon}"></i>
        </span>
        <span>{service_name}</span>
    </a>`
    let content = ""; 

    for (let service_name in obj) {
        if (obj.hasOwnProperty(service_name)) {
            let service = obj[service_name]
            console.log("[SRV] Adding: " + service_name)
            let dom = base
                dom = dom.replace("{service_name}", service_name)
                dom = dom.replace("{service_fa_icon}", service.fa_icon)
                dom = dom.replace("{service_url}", service.url)
            content += dom
        }
    }
    console.log("[SRV] Rendering...")
    document.getElementById("social_icons").innerHTML = content
}

document.onreadystatechange = (state) => {
    document.addEventListener("DOMContentLoaded", () => {
        // Run failback - possibly change this later?
        update_frontend({"Loading": {"fa_icon": "fas fa-ellipsis-h", "url": ""}})
        // Super-temp till I add CORS support:
        setTimeout(() => {update_frontend(failback)}, 600)
    });
}