// ScoutingPASS.js
//
// The guts of the ScountingPASS application
// Written by Team 2451 - PWNAGE

// Swipe Up / Down / Left / Right
var slide = 0;

// Options
var options = {
	text: "t=9998;m=99;l=q;r=b1;s=rjs;d=0;to=0;ds=5;if=0;f=15;cf=0;in=1;alp=5;aop=5;aip=5;apu=5;atr=1;atro=0;lp=20;op=10;ip=10;rc=0;pc=0;ss=[(111,111),(111,111),(111,111),(111,111),(111,111),(111,111),(111,111)];c=1;hbc=0;ac=1;hc=0;cb=0;cs=3;nh=0;p=0;b=0;tr=1;ct=3;dr=3;comm='good shooter; shot from all over the field'",
	correctLevel: QRCode.CorrectLevel.L,
    quietZone: 15,
    quietZoneColor: '#FFFFFF'
};

// Must be filled in: e=event, m=match#, l=level(q,qf,sf,f), t=team#, r=robot(r1,r2,b1..), s=scouter
//var requiredFields = ["e", "m", "l", "t", "r", "s", "as"];
var requiredFields = ["m", "si", "r"];

var eventCode = "2022cabl";

function getRobot(){
	return document.getElementById("input_r").value;
}

function validateRobot() {
	if(document.getElementById("input_r").value.length != 0) {
    return true;
  }
  else {
    return false;
  }
}

function resetRobot() {
	document.getElementById("input_r").value = "";
}


function getLevel(){
  return "qm";
}

function validateLevel() {
  // if(document.getElementById("input_l")) {
  //   var level = getLevel();
  //   return (
  //     level == "qm" ||
  //     level == "ef" ||
  //     level == "qf" ||
  //     level == "sf" ||
  //     level == "f"
  //   );
  // }
  return true;
}

function validateData() {
	var ret = true;
	var errStr = "Bad fields: ";
	for (rf of requiredFields) {
		// Robot requires special (radio) validation
		if (rf == "r") {
			if (!validateRobot()) {
				errStr += rf + " "
				ret = false
			}
		} else if (rf == "l") {
			if (!validateLevel()) {
				errStr += rf + " "
				ret = false
			}
		// Normal validation (length <> 0)
		} else if (document.getElementById("input_"+rf).value.length == 0) {
			errStr += rf + " "
			ret = false
		}
	}
	if (ret == false) {
		alert("Enter all required values\n"+errStr);
	}
	return ret
}

function getData() {
	var str = ''
	var rep = ''
	var start = true
	inputs = document.querySelectorAll("[id*='input_']");
	for (e of inputs) {
		if (getComputedStyle(e).display == "none") {
			continue;
		}
		code = e.id.substring(6)
		radio = code.indexOf("_")
		if (radio > -1) {
			if (e.checked) {
				if (start==false) {
					str=str+';'
				} else {
					start=false
				}
				// str=str+code.substr(0,radio)+'='+code.substr(radio+1)
				// document.getElementById("display_"+code.substr(0, radio)).value = code.substr(radio+1)
				str=str+code.substr(0,radio)+'='+e.value
				document.getElementById("display_"+code.substr(0, radio)).value = e.value
			}
		} else {
			if (start==false) {
				str=str+';'
			} else {
				start=false
			}
			if (e.value == "on") {
				if (e.checked) {
					str=str+code+'=Y'
				} else {
					str=str+code+'=N'
				}
			} else {
				str=str+code+'='+e.value.split(';').join('-')
			}
		}
	}
	return str
}

function updateQRHeader() {
	var str = 'Event: !EVENT! Match: !MATCH! Robot: !ROBOT! Team: !TEAM!';

	str = str
		.replace('!EVENT!', eventCode)
		.replace('!MATCH!', document.getElementById("input_m").value)
		.replace('!ROBOT!', document.getElementById("input_r").value)
		.replace('!TEAM!', document.getElementById("input_t").value);

	document.getElementById("display_qr-info").textContent = str;
}


function qr_regenerate() {
	// Validate required pre-match date (event, match, level, robot, scouter)
	if (validateData() == false) {
		// Don't allow a swipe until all required data is filled in
		return false
	}

	// Get data
	data = getData()
  console.log(data)
  // Regenerate QR Code
	qr.makeCode(data)

	updateQRHeader()
	return true
}

function qr_clear() {
    qr.clear()
}

function clearForm() {
	var match = 0;
	var e = 0;

	swipePage(-5)

	// Increment match
	match = parseInt(document.getElementById("input_m").value)
	if (match == NaN) {
		document.getElementById("input_m").value = ""
	} else {
		document.getElementById("input_m").value = match+1
	}

	// Robot
	resetRobot()

	// Clear XY coordinates
	inputs = document.querySelectorAll("[id*='XY_']");
	for (e of inputs) {
		code = e.id.substring(3)
		e.value = ""
	}

	inputs = document.querySelectorAll("[id*='input_']");
	for (e of inputs) {
		code = e.id.substring(6)

		// Don't clear key fields
		if (code == "m") continue
		if (code.substring(0,2) == "r_") continue
		if (code.substring(0,2) == "l_") continue
		if (code == "e") continue
		if (code == "s") continue


		radio = code.indexOf("_")
		if (radio > -1) {
			var baseCode = code.substr(0, radio)
			if (e.checked) {
				e.checked = false
				document.getElementById("display_"+baseCode).value = ""
			}
			var defaultValue = document.getElementById("default_"+baseCode).value
			if (defaultValue != "") {
				if (defaultValue == e.value) {
					console.log("they match!")
					e.checked = true
					document.getElementById("display_"+baseCode).value = defaultValue
				}
			}
		} else {
			if (e.type=="number" || e.type=="text" || e.type=="hidden") {
				if (e.className == "number-input") {
					e.value = 0
				} else {
					e.value = ""
				}
			} else if (e.type == "checkbox") {
				if (e.checked == true) {
					e.checked = false
				}
			} else {
				console.log("unsupported input type")
			}
		}
	}
	drawFields()
}


function swipePage(incriment){
	if (qr_regenerate() == true) {
		slides = document.getElementById("main-panel-holder").children
		if(slide + incriment < slides.length && slide + incriment >= 0){
			slides[slide].style.display = "none";
			slide += incriment;
			//window.scrollTo(0,0);
			slides[slide].style.display = "block";
		}
	}
  if (slide == 5) {
    document.getElementById("footer").style.display = "none";
  }
  else {
    document.getElementById("footer").style.display = "flex";
  }
}



function getIdBase(name){
	return name.slice(name.indexOf("_"), name.length)
}

function getTeamName(teamNumber){
	if(teamNumber !== undefined){
		if (teams) {
			var teamKey = "frc" + teamNumber;
			var ret = "";
			Array.from(teams).forEach(team => ret = team.key == teamKey ? team.nickname : ret);
			return ret;
		}
	}
	return "";
}

function getMatch(matchKey){
	//This needs to be different than getTeamName() because of how JS stores their data
	if(matchKey !== undefined){
		if (schedule) {
			var ret = "";
			Array.from(schedule).forEach(match => ret = match.key == matchKey ? match.alliances : ret);
			return ret;
		}
	}
	return "";
}

function getCurrentTeamNumberFromRobot(){
  console.log(getRobot());
	if(getRobot() != "" && typeof getRobot() !== 'undefined' && getCurrentMatch() != ""){
		if(getRobot().charAt(0) == "r"){
			return getCurrentMatch().red.team_keys[parseInt(getRobot().charAt(1))-1]
		} else if(getRobot().charAt(0) == "b"){
			return getCurrentMatch().blue.team_keys[parseInt(getRobot().charAt(1))-1]
		}
	}
}
function updateRobotDropdown(){
  var matchData = getCurrentMatch();
  console.log(getRobot());
  document.getElementById("input_r_x").label = "Robot";
  document.getElementById("input_r_r1").innerText = "R-" + matchData.red.team_keys[0].replace("frc", "");
  document.getElementById("input_r_r2").innerText = "R-" + matchData.red.team_keys[1].replace("frc", "");
  document.getElementById("input_r_r3").innerText = "R-" + matchData.red.team_keys[2].replace("frc", "");
  document.getElementById("input_r_b1").innerText = "B-" + matchData.blue.team_keys[0].replace("frc", "");
  document.getElementById("input_r_b2").innerText = "B-" + matchData.blue.team_keys[1].replace("frc", "");
  document.getElementById("input_r_b3").innerText = "B-" + matchData.blue.team_keys[2].replace("frc", "");

}

function getCurrentMatchKey(){
	return eventCode + "_" + getLevel() + document.getElementById("input_m").value;
}

function getCurrentMatch(){
	return getMatch(getCurrentMatchKey());
}

function updateMatchStart(event){
	if((getCurrentMatch() == "") &&
		 (!teams)) {
		return;
	}
	if(event.target.id == "input_t") {
		onTeamnameChange();
	}
	if(event.target.id == "input_r" || event.target.name == "m"){
		var teamNum = getCurrentTeamNumberFromRobot().replace("frc", "");
		if (teamNum !== undefined) {
			document.getElementById("input_t").value = teamNum;
			onTeamnameChange();
		}
		
		
	}
	if(event.target.name == "m"){
    updateRobotDropdown();
		// if(getRobot() != "" && typeof getRobot()){
		// 	document.getElementById("input_t").value = getCurrentTeamNumberFromRobot().replace("frc", "");
		// 	onTeamnameChange();
		// }
	}
}

function onTeamnameChange(event){
	console.log("changing teamname")
	var newNumber = document.getElementById("input_t").value;
	var teamLabel = document.getElementById("teamname-label");
	if(newNumber != ""){
		teamLabel.innerText = getTeamName(newNumber) != "" ? getTeamName(newNumber) : "Not in team list";
	} else{
		teamLabel.innerText = "";
	}
}

function updateClimbTimeSlider(event) {
    document.getElementById('climb-time-display').innerText = event.target.value;
}
window.onload = function(){
    var ec = eventCode;
    getTeams(ec);
    console.log(teams);
    getSchedule(ec);
};
