// TBAInterface funcitons to pull data from TheBlueAlliance.com
var teams = null;
var schedule = null;
var authKey = "9DZZQh1sNphG06vwCrX6tJXjucIGan6lGbXaiQ0q5T7qhDkzgYSAP83ekuLYhpWb";
/**
 * Get list of teams in event
 *
 * @param {eventCode} eventCode the event code (i.e. 2020caln) to pull the team list
 */
function getTeams(eventCode) {
	if (authKey) {
		var xmlhttp = new XMLHttpRequest();
		var url = "https://www.thebluealliance.com/api/v3/event/" + eventCode + "/teams/simple";
		console.log("fetch teams")
		xmlhttp.open("GET", url, true);
		xmlhttp.setRequestHeader("X-TBA-Auth-Key", authKey);
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 ) {
				if (this.status == 200) {
				var response = this.responseText;
				teams = JSON.parse(response);
				window.localStorage.setItem(`${eventCode}-teams`, response);
				console.log("fetched teams from TBA");
				}
				else if (this.status == 0) {
					console.log("could not reach TBA");
					var teamsStr = window.localStorage.getItem(`${eventCode}-teams`);
					if(teamsStr != null) {
						console.log("Found teams in local storage.");
						teams = JSON.parse(teamsStr);
						
					}
					else {
						teams = {};
					}
				}
			}
		};
		// Send request
		xmlhttp.send();
		console.log("fetch teams")
	}
	else {
		console.log("no auth")
	}
}

/**
 * Get schefule for event
 *
 * @param {eventCode} eventCode the event code (i.e. 2020caln) to pull the team list
 */
function getSchedule(eventCode) {
	if (authKey) {
		var xmlhttp = new XMLHttpRequest();
		var url = "https://www.thebluealliance.com/api/v3/event/" + eventCode + "/matches/simple";
		xmlhttp.open("GET", url, true);
		xmlhttp.setRequestHeader("X-TBA-Auth-Key", authKey);
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 ) {
				if (this.status == 200) {
				var response = this.responseText;
				schedule = JSON.parse(response);
				window.localStorage.setItem(`${eventCode}-schedule`, response);
				document.getElementById("fetch-status").innerText = `Fetched: ${eventCode}`; 
				}
				else if (this.status == 0) {
					console.log("could not reach TBA");
					var scheduleStr = window.localStorage.getItem(`${eventCode}-schedule`);
					if(scheduleStr != null) {
						console.log("Found schedule in local storage.");
						schedule = JSON.parse(scheduleStr);
						document.getElementById("fetch-status").innerText = `Fetched: ${eventCode}`; 
					}
					else {
						schedule = {};
					}
				}
			}
		};
		// Send request
		xmlhttp.send();
	}
}
