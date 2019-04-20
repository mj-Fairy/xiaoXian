if (typeof (BackColor) == "undefined") {
	BackColor = "white"
}
if (typeof (ForeColor) == "undefined") {
	ForeColor = "black"
}
if (typeof (DisplayFormat) == "undefined") {
	DisplayFormat = "<div class='day box-time-date'><span class='time-num time-day'>%%D%%</span>Days</div><div class='hour box-time-date'><span class='time-num'>%%H%%</span>Hrs</div><div class='min box-time-date'><span class='time-num'>%%M%%</span>Mins</div><div class='sec box-time-date'><span class='time-num'>%%S%%</span>Secs</div>"
}
if (typeof (CountActive) == "undefined") {
	CountActive = true
}
if (typeof (FinishMessage) == "undefined") {
	FinishMessage = ""
}
if (typeof (CountStepper) != "number") {
	CountStepper = -1
}
if (typeof (LeadingZero) == "undefined") {
	LeadingZero = true
}
CountStepper = Math.ceil(CountStepper);
if (CountStepper == 0) {
	CountActive = false
}
var SetTimeOutPeriod = (Math.abs(CountStepper) - 1) * 1000 + 990;
function calcage(c, a, b) {
	s = ((Math.floor(c / a) % b)).toString();
	if (LeadingZero && s.length < 2) {
		s = "0" + s
	}
	return s
}
function CountBack_slider(e, c, d) {
	if (e < 0) {
		document.getElementById(c).innerHTML = FinishMessage;
		document.getElementById("caption" + d).style.display = "none";
		document.getElementById("heading" + d).style.display = "none";return
	}
	DisplayStr = DisplayFormat.replace(/%%D%%/g, calcage(e, 86400, 100000));
	DisplayStr = DisplayStr.replace(/%%H%%/g, calcage(e, 3600, 24));
	DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(e, 60, 60));
	DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(e, 1, 60));var a = document.getElementsByTagName("*"),
		b;
	for (b in a) {
		if ((" " + a[b].className + " ").indexOf(" " + c + " ") > -1) {
			a[b].innerHTML = DisplayStr
		}
	}
	$("." + c).innerHTML = DisplayStr;
	if (CountActive) {
		setTimeout(function() {
			CountBack_slider((e + CountStepper), c, d)
		}, SetTimeOutPeriod)
	}
}
function CountBack(c, a, b) {
	if (c < 0) {
		document.getElementById(a).innerHTML = FinishMessage;
		document.getElementById("caption" + b).style.display = "none";
		document.getElementById("heading" + b).style.display = "none";return
	}
	DisplayStr = DisplayFormat.replace(/%%D%%/g, calcage(c, 86400, 100000));
	DisplayStr = DisplayStr.replace(/%%H%%/g, calcage(c, 3600, 24));
	DisplayStr = DisplayStr.replace(/%%M%%/g, calcage(c, 60, 60));
	DisplayStr = DisplayStr.replace(/%%S%%/g, calcage(c, 1, 60));
	document.getElementById(a).innerHTML = DisplayStr;
	if (CountActive) {
		setTimeout(function() {
			CountBack((c + CountStepper), a, b)
		}, SetTimeOutPeriod)
	}
}
;