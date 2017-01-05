
/**********************************************************************************************************************
 ******************************************** constant settings *******************************************************
 **********************************************************************************************************************/

var ec = 0;
var disp = {};

var uiButtons;
var guiButtonImage;
var httpPort = 8080;
var timeForContentLoaded = 240; // temporary set to 1000x with the UI Recording mode for video recording
var timeCorrection = {delta: 0, now: 0, then: 0};

/**********************************************************************************************************************
 ******************************************** global variables  *******************************************************
 **********************************************************************************************************************/

var globalStates = {
	debug: false,
	overlay: 0,
	device: "",
	// drawWithLines
	ballDistance: 14,
	ballSize: 6,
	ballAnimationCount: 0,

	width: window.screen.width,
	height: window.screen.height,
	guiState: "ui",
	UIOffMode: false,
	preferencesButtonState: false,
	extendedTracking: false,
	currentLogic: null,

	extendedTrackingState: false,
	developerState: false,
	clearSkyState: false,
	externalState: "",
	sendMatrix3d: false,
	sendAcl: false,

	pocketButtonState: false,
	pocketButtonDown: false,
	pocketButtonUp: false,
	freezeButtonState: false,
	logButtonState: false,
	editingMode: false,
	guiURL: "",
	newURLText: "",
	platform: navigator.platform,
	lastLoop: 0,
	notLoading: "",
	drawDotLine: false,
	drawDotLineX: 0,
	drawDotLineY: 0,
	pointerPosition: [0, 0],
	projectionMatrix: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],
	realProjectionMatrix: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],
	acceleration:{
		x : 0,
		y : 0,
		z : 0,
		alpha: 0,
		beta: 0,
		gamma: 0,
		motion:0
	},
	sendAcceleration : false,
	editingModeHaveObject: false,
	angX: 0,
	angY: 0,
	angZ: 0,
	unconstrainedPositioning: false,
	thisAndthat : {
		interval: undefined,
		timeout: undefined
	}
};

var g = globalStates; // BEN TODO: REMOVE DEBUG ALIAS

var globalCanvas = {};

var globalLogic ={
	size:0,
	x:0,
	y:0,
	rectPoints: [],
	farFrontElement:"",
	frontDepth: 1000000


};

var pocketItem  = {"pocket" : new Objects()};
var pocketItemId = "";


var globalDOMCach = {};

var globalObjects = "";

var globalProgram = {
	objectA: false,
	nodeA: false,
	logicA:false,
	objectB: false,
	nodeB: false,
	logicB:false,
	logicSelector:4
};
var globalMatrix = {
	temp: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],
	begin: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],
	end: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],
	r: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],
	r2: [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	],
	matrixtouchOn: false,
	copyStillFromMatrixSwitch: false
};

var consoleText = "";
var rotateX = [
	1, 0, 0, 0,
	0, -1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1
];

var testInterlink = {};

var overlayDiv;
//var overlayImg;
//var overlayImage = [];

/**********************************************************************************************************************
 ***************************************** datacrafting variables  ****************************************************
 **********************************************************************************************************************/

// var blockColorMap = {
//    bright:["#2DFFFE", "#29FD2F", "#FFFD38", "#FC157D"], // blue, green, yellow, red
//    faded:["#EAFFFF", "#EAFFEB", "#FFFFEB", "#FFE8F2"] // lighter: blue, green, yellow, red
//}

var menuBarWidth = 62;
var blockColorMap = ["#00FFFF", "#00FF00", "#FFFF00", "#FF007C"];
var columnHighlightColorMap = ["rgba(0,255,255,0.15)", "rgba(0,255,0,0.15)", "rgba(255,255,0,0.15)", "rgba(255,0,124,0.15)"];
//var activeBlockColor = "#E6E6E6"; // added blocks are grey
//var movingBlockColor = "#FFFFFF"; // blocks turn white when you start to drag them

var DEBUG_DATACRAFTING = false; // when TRUE -> shows crafting board just by tapping on first menu item (DEBUG mode)

var blockIconCache = {};

