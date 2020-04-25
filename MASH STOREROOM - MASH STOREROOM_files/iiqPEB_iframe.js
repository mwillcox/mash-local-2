//stands for the sub_eid
var iiq_partner_id = 10232;
var iiq_dpi = 1670403413;

// namespace
var IIQ = {}


// singleton
IIQ.PEB = (function() {


	var client = {};
	var differenceInDays = 0;
	var cookieFound = false;
	var logStrBuilder = "";

	
    function parseCookieData(){
        var personIdCookie = readCookie("IQPersonid");
        var cookieParams = personIdCookie.split('@');
        var arrLen = cookieParams.length;
        for (var i=0; i < arrLen; i++) {
        	var keyVal = cookieParams[i].split(':');
        	client[keyVal[0]] = keyVal[1];
        }
    }
    
    function calcDifferenceInDays(){
        // Calc diff in days
        var differenceInMillis = new Date().getTime() - client.timestamp;
        var diffInDays = differenceInMillis / (1000 * 3600 * 24);
        differenceInDays = Math.round(diffInDays);
    }
	
    /**
     * Do not use as a replacement for (typeof val !== "undefined") -
     * works only for undefined function arguments and undefined properties
     * @param val
     * @returns {Boolean}
     */
    var isDefined = function (val) {
        return (typeof val !== "undefined" && val != null);
    }



    var isNotEmptyStr = function (str) {
        return  isDefined(str) && str!="" && typeof str.length !== "undefined" && str.length > 0;
    }



    var getProtocol = function () {
        var protocol = "http:";
        var tmpProtocol = "";
        if (typeof window.location.protocol !== "undefined") {
            tmpProtocol = window.location.protocol;
        }
        else if (typeof document.location.protocol !== "undefined") {
            tmpProtocol = document.location.protocol;
        }
        if (tmpProtocol == "https:") {
            protocol = "https:";
        }
        return protocol;
    }


    var createCookie = function (name, value, millis, domain) {
        var expires = "";
        var date = new Date();
        var cookieValue ="";
        date.setTime(date.getTime() + millis);
        expires = "; expires=" + date.toGMTString();
        cookieValue=name + "=" + value + expires + (isNotEmptyStr(domain) ? ";path=/; domain=" + domain : "") + "";
        document.cookie = cookieValue;

    }


    /**
     * Returns null if no cookie found
     * @param name
     * @returns
     */
    var readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i=0 ; i<ca.length ; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
                return c.substring(nameEQ.length, c.length);
            }
        }
        return null;
    }

    var appendImage = function (imageSrc) {
        if (isDefined(imageSrc)) {
            var img = document.createElement("img");
            img.src = imageSrc;
            img.width = "1";
            img.height = "1";
            document.body.appendChild(img);
        }
    }

    function evaluateVisitorRecognition(vrJson){
        try {
            var tddAudiencePixel = "https://insight.adsrvr.org/track/pxl/?adv=57wihx2&ct=0:tbp39tf&fmt=3"; // New 9.3.20 pixel
            var shouldPutCookie = false;

            // Analyze if VR was empty -> log and return
            if (vrJson.hasOwnProperty('RESULT') && vrJson.RESULT == "NA" ||
                !(vrJson.hasOwnProperty('ctrid') && vrJson.ctrid != "")) {
            	logStrBuilder += "@markedNoVrData";
            	logToIiqMonitor();
                return;
            }

            // Cookie not found or old cookie
            if (!cookieFound) {
            	logStrBuilder += "@markedNew";
                shouldPutCookie = true;
            } else {
            	// All the data from cookie was already read
                // Keep old cookie date if cookie and VR match
                if (vrJson.ctrid == client.ctrid || vrJson.browser == client.browser || vrJson.device == client.device 
                		|| vrJson.person == client.person || vrJson.house == client.house) {
                	logStrBuilder += "@markedExisting";
                    appendImage(tddAudiencePixel);
                } 
                else {
                	logStrBuilder += "@markedExistingOverride";
//                  shouldPutCookie = true;
                }
            }

            // Put iiq cookie
            if (shouldPutCookie) {
                var cookieData = "ctrid:"+vrJson.ctrid+"@browser:"+vrJson.browser+"@device:"+vrJson.device+"@person:"+
                				vrJson.person+"@house:"+vrJson.house+"@calltype:mark@testresult:False"+
					    		"@cookieage:-1@timestamp:"+new Date().getTime();
                
//                var cookieData = vrJson.ctrid + '$' + new Date().getTime();
                createCookie("IQPersonid", cookieData, 3600 * 1000 * 24 * 365, ".intentiq.com");
                appendImage(tddAudiencePixel);
                //console.log("put cookieData="+cookieData);
            }
            
            logToIiqMonitor();
        } catch (e) {
        	logStrBuilder += "@markedError_evaluateVisitorRecognition@markedError";
			logToIiqMonitor();
        }
    }

    function runVisitorRecognitionTest(){
        try {
        	var reportData = "ctrid:@browser:@device:@person:"+
				    		"@house:@calltype:mark@testresult:False"+
				    		"@cookieage:-1@timestamp:"+new Date().getTime();
        	
            var personIdCookie = readCookie("IQPersonid");
            if (personIdCookie != null && personIdCookie.indexOf('@') != -1) {
            	parseCookieData();
            	calcDifferenceInDays();
            	cookieFound = true;
                var reportData = "ctrid:"+client.ctrid+"@browser:"+client.browser+"@device:"+client.device+"@person:"+
								client.person+"@house:"+client.house+"@calltype:mark@testresult:False"+
					    		"@cookieage:"+differenceInDays+"@timestamp:"+new Date().getTime();
            }
    
            fetch("https://api.intentiq.com/profiles_engine/ProfilesEngineServlet?at=39&mi=10&dpi=27012016&pt=17&dpn=1&dpt=mark&resmet=1&reprtlg="+reportData, {
                method: 'GET',
                credentials: 'include'
            })
                .then((response) => response.json())
                .then((json) => {
                    evaluateVisitorRecognition(json);
                }).catch((err) => {
                logStrBuilder += "@markedError_runVisitorRecognitionTest1@markedError";
                logToIiqMonitor();
            });
        } catch (e) {
        	logStrBuilder += "@markedError_runVisitorRecognitionTest2@markedError";
        	logToIiqMonitor();
        }
    }
    
    function logToIiqMonitor(){
        try {
            //console.log(monitorName.toString());
            var url = "https://api.intentiq.com/profiles_engine/ProfilesEngineServlet?at=308&monlg=" + logStrBuilder;
            fetch(url, {
                method: 'GET',
                credentials: 'include'
            }).then((response) => response);
        } catch (e) {
            //console.log("Error sending data to monitor");
        }
    }

    return {

        /* public section */

        createIIQPEBElements: function () {
            runVisitorRecognitionTest();
        }
    }
})();


IIQ.PEB.createIIQPEBElements();
