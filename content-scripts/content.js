var hostname = window.location.hostname;
var domain = hostname.substring(hostname.lastIndexOf(".", hostname.lastIndexOf(".") - 1) + 1);
var settings;

var captionStyles = [
    `\{\"data\":\"{\\\"backgroundOpacity\\\":0,\\\"charEdgeStyle\\\":1,\\\"background\\\":\\\"#080808\\\",\\\"fontFamily\\\":4,\\\"fontFamilyOverride\\\":true}\",\"expiration\":4885238749000,\"creation\":${Date.now().toString()}\}`
]

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    sendResponse({ fromcontent: "Sucessfully Recived Message" });

    console.log("Recived Setttings From Extension")

    settings = request.data.usersettings;

    if (hostname == "www.youtube.com") {
        //Res
        localStorage.setItem("yt-player-quality", `\{\"data\":\"{\\\"quality\\\":${settings.youtube_res},\\\"previousQuality\\\":144}\",\"expiration\":4885238749000,\"creation\":${Date.now().toString()}\}`)

        //Vol
        localStorage.setItem("yt-player-volume", `\{\"data\":\"{\\\"volume\\\":${settings.youtube_vol},\\\"muted\\\":false}\",\"expiration\":4885238749000,\"creation\":${Date.now().toString()}\}`)

        //Caption Style
        if (settings.caption_style == "1") {
            localStorage.removeItem("yt-player-caption-display-settings")
        } else {
            localStorage.setItem("yt-player-caption-display-settings", captionStyles[0])
        }

        if (settings.youtube_logo_enabled) {
            document.getElementById("logo").remove();
            const gButton = document.getElementById("guide-button")
            gButton.insertAdjacentHTML('afterend', "<logo id=\"logo\"><a aria-label=\"\" href=\"/\" title=\"YouTube Home\"> <ytd-yoodle><picture> <source type=\"image/webp\" srcset=\"\"> <img src=\"" + request.url + "\" alt=\"Youtube Home\"> </picture> </ytd-yoodle> </a> </logo>")
        }

        try {
            document.getElementsByClassName("ytp-scrubber-button")[0].style.background = settings.scrub
            document.getElementsByClassName("ytp-play-progress")[0].style.background = `linear-gradient(to right,${settings.scrub_left} 80%,${settings.scrub_right} 100%)`
        } catch (error) {
            console.log("YT Scrub Bar Doesnt Exist Yet")
        }

        YoutubeMutations()

    } else if (hostname == "www.nytimes.com" && settings.wordle_ads) {
        DeleteElement('#ad-top')
    } else if (hostname == "www.google.com" && settings.gemini) {
        DeleteElement('#Odp5De')
    }
    if (settings.scramble) {
        setTimeout(() => {
            // Get all text nodes from the entire document body
            const allTextNodes = getAllTextNodes(document.body);

            // Switch pairs of letters in each text node
            allTextNodes.forEach(textNode => {
                const originalText = textNode.textContent;
                const switchedText = switchPairs(originalText);

                // Replace the text content without affecting HTML structure
                textNode.textContent = switchedText;
            });
        }, 1000);
    }
});

function YoutubeMutations() {
    const config = { attributes: true, childList: true, subtree: true };

    try {
        const youtubeVideo = new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "attributes") {
                    if (mutation.attributeName == "class" && settings.youtube_skip) {
                        if (document.getElementsByClassName("ad-showing").length > 0) {
                            document.getElementsByClassName("html5-main-video")[0].playbackRate = 100
                            console.log("Auto Skipped Ad")
                        }
                    }
                }
                if (mutation.type === "childList" && settings.youtube_watermark) {
                    if(document.getElementsByClassName("annotation annotation-type-custom iv-branding").length > 0){
                        document.getElementsByClassName("annotation annotation-type-custom iv-branding")[0].remove()
                    }
                }
                for (let i = 0; i < document.getElementsByClassName("ytp-play-progress").length; i++) {
                    const bar = document.getElementsByClassName("ytp-play-progress")[i];
                    bar.style.background = `linear-gradient(to right,${settings.scrub_left} 80%,${settings.scrub_right} 100%)`
                }
            }
        });
        youtubeVideo.observe(document.getElementById("movie_player"), config);
    } catch (error) {
        console.log("YT Video Player Not Active")
    }

    try {
        if (settings.youtube_ads) {
            const youtubeAd = new MutationObserver((mutationList, observer) => {
                for (const mutation of mutationList) {
                    if (mutation.type === "childList") {
                        if(document.getElementById("player-ads") != null){
                            document.getElementById("player-ads").remove()
                        }
                        for (let i = 0; i < document.getElementsByTagName("ytd-ad-slot-renderer").length; i++) {
                            const ad = document.getElementsByTagName("ytd-ad-slot-renderer")[i];
                            if (ad.parentElement.parentElement.tagName == "YTD-RICH-ITEM-RENDERER") {
                                ad.parentElement.parentElement.remove()
                            } else {
                                ad.remove()
                            }
                        }
                    }
                }
            });
            youtubeAd.observe(document.getElementById("content"), config);
        }
    } catch (error) {
        console.log("No Content Found")
    }
}

async function DeleteElement(element) {
    WaitForElement(element).then((elm) => {
        console.log(element + ' is ready');
        elm.remove()
    });
}

function WaitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function switchPairs(text) {
    // Check if the input is a string
    if (typeof text !== 'string') {
        console.error('Input must be a string');
        return text;
    }

    // Split the text into an array of characters
    const characters = text.split('');

    // Loop through the array with a step of 2
    for (let i = 0; i < characters.length - 1; i += 2) {
        // Swap the current pair of characters
        const temp = characters[i];
        characters[i] = characters[i + 1];
        characters[i + 1] = temp;
    }

    // Join the array back into a string
    const result = characters.join('');

    return result;
}
function getAllTextNodes(node) {
    const textNodes = [];

    function extractText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            node.childNodes.forEach(childNode => extractText(childNode));
        }
    }

    extractText(node);
    return textNodes;
}