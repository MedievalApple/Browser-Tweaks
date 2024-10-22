chrome.storage.local.get("usersettings", function (data) {
  document.getElementById("wordle_ads").checked = data.usersettings.wordle_ads;
  document.getElementById("scramble").checked = data.usersettings.scramble;
  document.getElementById("amazon").checked = data.usersettings.amazon;
  document.getElementById("gemini").checked = data.usersettings.gemini;
  document.getElementById("youtube_tv").checked = data.usersettings.youtube_tv;
  document.getElementById("youtube_skip").checked = data.usersettings.youtube_skip;
  document.getElementById("youtube_ads").checked = data.usersettings.youtube_ads;
  document.getElementById("youtube_watermark").checked = data.usersettings.youtube_watermark;
  document.getElementById("scrub_left").value = data.usersettings.scrub_left;
  document.getElementById("scrub_right").value = data.usersettings.scrub_right;
  document.getElementById("scrub").value = data.usersettings.scrub;
  document.getElementById("caption_style").value = data.usersettings.caption_style;
  document.getElementById("youtube_logo").value = data.usersettings.youtube_logo;
  document.getElementById("youtube_res").value = data.usersettings.youtube_res;
  document.getElementById("youtube_vol").value = data.usersettings.youtube_vol;
  document.getElementById("u_agent").value = data.usersettings.u_agent;
  console.log("loaded Settings");
});

const apply = document.getElementById("apply");
if (apply) {
  apply.onclick = function () {

    youtubeLogoEnabled = false;
    uAgentEnabled = false;

    if (document.getElementById("youtube_logo").value != "1") {
      youtubeLogoEnabled = true;
    }

    if (document.getElementById("u_agent").value != "1") {
      uAgentEnabled = true;
    }

    var settings = {
      wordle_ads: document.getElementById("wordle_ads").checked,
      scramble: document.getElementById("scramble").checked,
      amazon: document.getElementById("amazon").checked,
      gemini: document.getElementById("gemini").checked,
      youtube_tv: document.getElementById("youtube_tv").checked,
      youtube_skip: document.getElementById("youtube_skip").checked,
      youtube_ads: document.getElementById("youtube_ads").checked,
      youtube_watermark: document.getElementById("youtube_watermark").checked,
      scrub_left: document.getElementById("scrub_left").value,
      scrub_right: document.getElementById("scrub_right").value,
      scrub: document.getElementById("scrub").value,
      caption_style: document.getElementById("caption_style").value,
      youtube_logo: document.getElementById("youtube_logo").value,
      youtube_res: document.getElementById("youtube_res").value,
      youtube_vol: document.getElementById("youtube_vol").value,
      youtube_logo_enabled: youtubeLogoEnabled,
      u_agent: document.getElementById("u_agent").value,
      u_agent_enabled: uAgentEnabled
    }

    chrome.storage.local.set(({ usersettings: settings }), function () {
      console.log("User Settings Saved :D");
      window.close();
    });
  };
}

document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.getElementsByClassName("tab");

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () {
      ChangeTab(tabs[i].id);
    });
  }
});

function ChangeTab(id) {

  const tabs = document.getElementsByClassName("tab");
  const settings = document.getElementsByClassName("settings")

  for (let i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove("active")
  }

  for (let i = 0; i < settings.length; i++) {
    settings[i].hidden = true
  }

  document.getElementById(id).classList.add("active")

  document.getElementsByClassName(id)[0].hidden = false
}
