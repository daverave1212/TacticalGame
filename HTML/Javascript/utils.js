	var print = console.log;
	var NULL = 0;
	var KEY_ENTER = 13;
	var linkLocation = window.location.href;
	var url = new URL(window.location.href);
	var Parameters = {};
	var body = document.body;
	
	function objectToURLParameters(obj){
		if(obj == null) return ''
		url = Object.keys(obj).map(function(k) {
			return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
		}).join('&')
		return url
	}
	
	var objectToURL = objectToURLParameters
		
	function submitForm(_url, _data, type, callback){
		if(type == null){
			type = 'get'
		}
		$.ajax({
			type : type,
			url : _url + '?' + objectToURLParameters(_data),
			data : {},
			success : function(response){
				callback(response);
			}
		});
	}
	
	function doPost(url, data, callback){
		submitForm(url, data, 'post', callback)
	}
	
	function doGet(url, data, callback){
		submitForm(url, data, 'post', callback)
	}
	
	
	
	function loadJSON(filePath, callback) {   

		var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
		xobj.open('GET', filePath, true); // Replace 'my_data' with the path to your file
		xobj.onreadystatechange = function () {
			console.log("State changed...");
			  if (xobj.readyState == 4 && xobj.status == "200") {
				// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
				callback(xobj.responseText);}};
		xobj.send(null);  
	}
	
	function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
	
	function imgToData(img) {
		var canvas = get("Canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		console.log(12321)
		var dataURL = canvas.toDataURL("image/png; base64");
		return dataURL;
		return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}

//	function submitForm() {
//		var parameters = document.getElementById("in").value;
//		alert("Submitting");
//		var http = new XMLHttpRequest();
//		http.open("POST", "http://5.12.112.34:8080/XServer/XServer?" + parameters, true);
//		http.setRequestHeader("Content-type","application/x-www-form-urlencoded");
//		var params = "search=" + "HELLOIMAPARAMETEUR"; // probably use document.getElementById(...).value
//		http.send(params);
//		http.onload = function() {
//			alert(http.responseText);
//		}
//	}
	
	function createMatrix(nRows, nCols){
		var array = new Array(nRows);
		for(var i = 0; i<nRows; i++){
			array[i] = new Array(nCols);
		}
		return array;
	}
	
	function matrixRows(matrix){
		return matrix.length;
	}
	
	function matrixCols(matrix){
		return matrix[0].length;
	}
	
	function forEachElementInObject(object, func){
		for (var key in object) {
			if (!object.hasOwnProperty(key)) continue;
			func(object, key);}}
	
	function inRedSpan(str){
		return "<span style='color:#FF3333'>"+ str + "</span>"
	}
	
	function inGreenSpan(str){
		return "<span style='color:#99EE99'>" + str + "</span>";
	}
	
	function inGraySpan(str){
		return  "<span style='color:#999999'>" + str + "</span>";
	}
	
	function inBlueSpan(str){
		return  "<span style='color:#777799'>" + str + "</span>";
	}
	
	function loadParameters() {
		if(! linkLocation.includes("?")){
			console.log("Link does not have parameters");
			return;
		}
		var parser = document.createElement('a');
		parser.href = linkLocation;
		var query = parser.search.substring(1);
		var vars = query.split('&');
		console.log("Found " + vars.length + " parameters");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			Parameters[pair[0]] = decodeURIComponent(pair[1]);}
	};
	
	function getURLParameters(){
		let pars = {}
		if(! linkLocation.includes("?")){
			console.log("Link does not have parameters");
			return pars;
		}
		var parser = document.createElement('a');
		parser.href = linkLocation;
		var query = parser.search.substring(1);
		var vars = query.split('&');
		console.log("Found " + vars.length + " parameters");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			pars[pair[0]] = decodeURIComponent(pair[1]);
		}
		return pars;
	}
	
	function setParameter(param, value){
		Parameters[param] = value;
	}
	
	function parseParameters(){
		var ret = "";
		for (var key in Parameters) {	// for each property/ability in the Races object...
			if (!Parameters.hasOwnProperty(key)) continue;
			var thisParam = Parameters[key];
			ret += urlify(key + "=" + Parameters[key]) + "&";
		}
		return substringTo(ret, ret.length - 2);
	}
	
	function printParameters(){
		console.log("  > Printing parameters:");
		for (var key in Parameters) {	// for each property/ability in the Races object...
			if (!Parameters.hasOwnProperty(key)) continue;
			console.log(Parameters[key]);
		}
		console.log("  > Done");
	}
	
	function urlify(str){
		return replaceAll(str, " ", "%20");
	}
	
	function replaceAll(str, word, replacer){
		var strings = str.split(word);
		var ret = strings[0];
		for(var i = 1; i<strings.length; i++){
			ret += replacer + strings[i];
		}
		return ret;
	}
	
	function removeSpaces(str){
		return replaceAll(str, " ", "");
	}
	
	function toAbilitiesArray(str){
		var ret = "[Abilities['";
		ret += replaceAll(str, " ", "'], Abilities['")
		ret += "']]";
		return ret;
	}
	
	function getURLTail(str){
		str = str.split("?");
		var ret = "";
		for(var i = 1; i<str.length; i++){
			ret += str[i];
		}
		return ret;
	}
	
	function getParameter(param){
		var value = url.searchParams.get(param)
		if(value != null) return val;
		return "";
	}
	
	function getParameterNumber(param){
		return parseInt(url.searchParams.get(param));
	}
	
	function fitImageInContainer(image, containerWidth, containerHeight){
		var imgHeight = image.naturalHeight;
		var imgWidth = image.naturalWidth;
		if(imgHeight >= imgWidth){
			image.style.width = "100%";
			image.style.height = "auto";}
		else{
			image.style.width = "auto";
			image.style.height = "100%";}
		imgHeight = image.clientHeight;
		imgWidth = image.clientWidth;
		print(imgHeight);
		print(imgWidth);
		image.style.marginLeft = (containerWidth - imgWidth)/2 + "px";
		image.style.marginTop = (containerHeight - imgHeight)/2 + "px";}
	
	function getRandomProperty(obj) {
		var result;
		var count = 0;
		for (var prop in obj)
			if (Math.random() < 1/++count)
			   result = prop;
		return result;
	}

	function roundUp(nr, by){
		return (nr - nr%by + by);
	}
	
	function roundUp25(nr){
		return (nr - nr%25 + 25);
	}
	
	function roundUp50(nr){
		return (nr - nr%50 + 50);
	}
	
	function roundDown25(nr){
		return (nr - nr%25);
	}
	
	function roundDown50(nr){
		return (nr - nr%50);
	}
	
	function round50(nr){
		var roundness = nr%50;
		var complement  = 50 - roundness;
		if(roundness <= complement){
			return nr - roundness;}
		else return nr + complement;
	}
	
	function substringTo(str, index){
		return str.substring(0, index + 1);
	}
	
	function substringFrom(str, index){
		return str.substring(index, str.length);
	}
	
	function quotify(str){
		return "\"" + str + "\"";
	}
	
	function stringToFunctionName(str){
		var words = str.split(" ");
		var returnedString = "";
		if(isUpperCase(words[0][0])){
			var i = 0;
			while(i < words[0].length){
				if(isUpperCase(words[0][i])){
					returnedString += words[0][i].toLowerCase();
				} else {
					break;
				}
				i++;
			}
			if(i < words[0].length){
				returnedString += words[0].substring(i, words[0].length);
			}
		} else {
			returnedString += words[0];
		}
		for(var i = 1; i<words.length; i++){
			print(words[i]);
			if(!isUpperCase(words[i][0])){
				var aux = words[i].toLowerCase();
				returnedString += aux[0].toUpperCase() + words[i].substring(1, aux.length);
			} else {
				returnedString += words[i];
			}	
		}
		return returnedString;
	}
	
	function isUpperCase(str){
		if(str == str.toUpperCase()){
			return true;
		}
		return false;
	}
	
	function playSound(path){
		new Audio(path).play();
	}
	
	function roundDown25(nr){
		return (nr - nr%25);
	}
	
	function talentNameToImagePath(t){
		var lowerCaseT = t.toLowerCase();
		var returnedPath = "";
		for(var i = 0; i<t.length; i++){
			if(lowerCaseT[i] == " "){
				returnedPath += "_";}
			else if(lowerCaseT[i] == ":"){
				returnedPath = returnedPath.substring(0, i-1);
				return returnedPath;
			}
			else{
				returnedPath += lowerCaseT[i];
			}
		}
		return returnedPath;
	}
	
	function distanceBetween(t1, t2){
		return Math.sqrt((t1.x - t2.x) * (t1.x - t2.x) + (t1.y - t2.y) * (t1.y - t2.y));}
		
	function angleBetween(t1, t2){
		return Math.atan2(t2.y - t1.y, t2.x - t1.x) * 180 / Math.PI;}
		
	function min(a, b){
		if(a < b) return a;
		return b;}
	
	function SequenceNode(_Object){
		this.previous	= NULL;
		this.next		= NULL;
		this.data		= _Object;
	}
	
	function Sequence(){
		this.first	= NULL;
		this.last	= NULL;
		this.length = 0;
		
		this.pushBack = function(_Object){
			var s = new SequenceNode(_Object);
			if(this.length == 0){
				this.last = s;
				this.first = s;}
			else{
				this.last.next = s;
				s.previous = this.last;
				this.last = s;}
			this.length++;}
			
		this.pushFront = function(_Object){
			var s = new SequenceNode(_Object);
			if(this.length == 0){
				this.first = s;
				this.last = s;}
			else{
				s.next = this.first;
				this.first.previous = s;
				this.first = s;}
			this.length++;}
	}//endSequence
	
	function Match(){
		this.pieces = new Array();
		this.push = function(_Object){
			this.pieces.push(_Object);
		}
	}
	
	function addElement(dom_e){
		document.getElementById("MAP").appendChild(dom_e);
	}
	function removeElement(dom_e){
		document.getElementById("MAP").removeChild(dom_e);
	}
	function percentChance(chance){	/* Ex: percentChance(20) = 20% chance to return true; */
		var c = randomInt(1, 100);
		if(c <= chance) return true;
		return false;
	}
	function detectCollision(Object_a, Object_b){
		var aCenterX = Object_a.x + Object_a.width/2;
		var aCenterY = Object_a.y + Object_a.height/2;
		var bCenterX = Object_b.x + Object_b.width/2;
		var bCenterY = Object_b.y + Object_b.height/2;
		var distance = Math.sqrt( (bCenterX - aCenterX)*(bCenterX - aCenterX) + (bCenterY - aCenterY)*(bCenterY - aCenterY) );
		if(distance < Object_a.width/2 + Object_b.width/2){
			return true;}
		return false;
	}
	
	function getTextInputValueAsNumber(id){
		var theInput = document.getElementById(id);
		return parseInt(theInput.value);
	}
	
	function getSelectedOption(id){
		var theInput = document.getElementById(id);
		return theInput.options[theInput.selectedIndex].value;
	}
	
	var WORLDSEED = 0;
	
	function capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}
	
	function initSeed(seed){
		WORLDSEED = seed % 2147483647;
		if(WORLDSEED <= 0)
			WORLDSEED += 2147483646;
	}

	function next(){
	  return WORLDSEED = WORLDSEED * 16807 % 2147483647;
	}

	function DEPRECATEDrandomInt(low, high){
		return next() % (high - low + 1) + low;
	}
	
	function randomInt(low, high){
		return Math.floor(Math.random() * (high - low + 1) + low);
	}
	
	function randomOf(...args){
		return args[randomInt(0, args.length - 1)];
	}
	
	/*
	function randomInt(l, h){
		//var r = randomFromSeed();
		//console.log(r);
		//return Math.floor(r * (h - l + 1) + l);
		return Math.floor(Math.random() * (h - l + 1) + l);
	}
	*/
	
	var floor = Math.floor;
	
	function get(theElement){
		return document.getElementById(theElement);
	}
	
	function normalizeConsole(theElement){
		theElement.style.width = "300px";
		theElement.style.height = "150px";
		theElement.style.position = "relative";
	}
	
	function add(theElement){
		document.getElementById("Window").appendChild(theElement);
	}
	
	function randomIntControlled(l, h){
		var a = randomInt(1, 2);
		if(a == 1){
			return randomInt(l, l/2);}
		else{
			return randomInt(h/2, h);}
	}
	
	function createElement(type){
		if(type == "scrollbox"){
			var scrollableDiv = createElement("div");
			scrollableDiv.style.width = "300px";
			scrollableDiv.style.height = "300px";
			scrollableDiv.style.overflowY = "scroll";
			return scrollableDiv;
		} else return document.createElement(type);
	}
	
	function createElementWithClass(type, cls){
		var elem = document.createElement(type);
		setClass(elem, cls);
		return elem;}
		
	function createElementWithID(type, id){
		var elem = document.createElement(type);
		setID(elem, id);
		return elem;
	}
	
	function getParent(node){
		return node.parentElement;
	}
	
	function getElement(id){
		return document.getElementById(id);
	}
	
	function getElementByClass(className){
		return document.getElementsByClassName(className)[0];
	}

	function getByClass(className){
		return document.getElementsByClassName(className)[0];
	}
	
	function getElements(className){
		return document.getElementsByClassName(className);
	}
	
	function removeAllChildren(node){
		while (node.firstChild) {
			console.log("Removing " + node.firstChild);
			node.removeChild(node.firstChild);}
	}

	function removeChildWithClass(node, cls){
		var removedElement = node.getElementsByClassName(cls)[0];
		node.removeChild(removedElement);
	}
		
	function setClass(object, c){
		object.setAttribute("class", c);}
	
	function setID(object, id){
		object.setAttribute("id", id);}
		
	function addClass(object, c){
		object.setAttribute("class", object.getAttribute("class") + " " + c);}
	
	function createImage(src){
		var img = createElement("img");
		img.setAttribute("src", src);
		img.crossorigin = true;
		return img;
	}

	function randomizeArray(array_a){
		var iRandomize;
		for(iRandomize = 0; iRandomize < array_a.length; iRandomize++){
			var randomizeArrayIndex = randomInt(0, array_a.length - 1);
			var auxRandomize = array_a[iRandomize];
			array_a[iRandomize] = array_a[randomizeArrayIndex];
			array_a[randomizeArrayIndex] = auxRandomize;
		}
	}


	function setImageXY(var_img_i, x, y){
		var_img_i.style.top = y + "px";
		var_img_i.style.left = x + "px";}
		
	function stringContains(string_a, substring_b){
		if(string_a.indexOf(substring_b) >= 0){
			return true;
		}
		return false;
	}



