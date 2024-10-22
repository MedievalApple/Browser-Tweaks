let settings = {}

const youtubeLogos = ["", "", "images/mclogo.webp", "images/mc1million.webp", "images/soccer.webp", "images/vtuber.webp"]
const uAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (X11; CrOS x86_64 10066.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; Xbox; Xbox One) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.19041"
]

chrome.tabs.onUpdated.addListener(() => {
  console.log("Sending Settings");
  chrome.storage.local.get("usersettings", function (data) {
    settings = data
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          url: chrome.runtime.getURL(youtubeLogos[Number(data.usersettings.youtube_logo)]),
          data
        },
        function (response) {
          console.log("Send Sucessful")
        }
      );
    });
  });
});

function rewriteUserAgentHeader(e) {

  let youtube = false;
  let amazon = false;

  if (settings.usersettings.u_agent_enabled) {
    console.log("User-Agents Are Enabled")
    e.requestHeaders.forEach((header) => {
      if (header.name.toLowerCase() === "user-agent") {
        header.value = uAgents[Number(settings.usersettings.u_agent) - 2];
        console.log(uAgents[Number(settings.usersettings.u_agent) - 2]);
        console.log(settings.usersettings.u_agent);
      }
    });
  }
  if (settings.usersettings.youtube_tv) {
    e.requestHeaders.forEach((header) => {
      if (header.name.toLowerCase() === "host") {
        if (header.value.toLowerCase() === "www.youtube.com") {
          youtube = true;
        }
      }
      if (header.name.toLowerCase() === "user-agent") {
        if (youtube) {
          header.value = uAgents[3];
        }
      }
    });
  }
  if (settings.usersettings.amazon) {
    e.requestHeaders.forEach((header) => {
      if (header.name.toLowerCase() === "host") {
        if (header.value.toLowerCase() === "www.amazon.com") {
          amazon = true;
        }
      }
      if (header.name.toLowerCase() === "user-agent") {
        if (amazon) {
          header.value = uAgents[0];
        }
      }
    });
  }
  return { requestHeaders: e.requestHeaders };
}


chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"],
);