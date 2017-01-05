createNameSpace("realityEditor.gui.ar.lines");

/**
 * @desc
 * @param thisObject is a reference to an Hybrid Object
 * @param context is a reference to a html5 canvas object
 **/

realityEditor.gui.ar.lines.drawAllLines = function (thisObject, context) {
	for (var subKey in thisObject.links) {
		if (!thisObject.links.hasOwnProperty(subKey)) {
			continue;
		}
		var l = thisObject.links[subKey];
		var oA = thisObject;

		if (isNaN(l.ballAnimationCount))
			l.ballAnimationCount = 0;

		if (!objects.hasOwnProperty(l.objectB)) {
			continue;
		}
		var oB = objects[l.objectB];
		if (!oA.nodes.hasOwnProperty(l.nodeA)) {
			continue;
		}
		if (!oB.nodes.hasOwnProperty(l.nodeB)) {
			continue;
		}

		var bA = oA.nodes[l.nodeA];

		var bB = oB.nodes[l.nodeB];

		if (bA === undefined || bB === undefined || oA === undefined || oB === undefined) {
			continue; //should not be undefined
		}

		// Don't draw off-screen lines
		if (!oB.objectVisible && !oA.objectVisible) {
			continue;
		}

		if (!oB.objectVisible) {
			if (oB.memory) {
				var memoryPointer = getMemoryPointerWithId(oB.objectId);
				if (!memoryPointer) {
					memoryPointer = new MemoryPointer(l, false);
				}
				memoryPointer.draw();

				bB.screenX = memoryPointer.x;
				bB.screenY = memoryPointer.y;
				bB.screenZ = bA.screenZ;
			} else {
				bB.screenX = bA.screenX;
				bB.screenY = -10;
				bB.screenZ = bA.screenZ;
			}
			bB.screenZ = bA.screenZ;
			bB.screenLinearZ = bA.screenLinearZ;
		}

		if (!oA.objectVisible) {
			if (oA.memory) {
				var memoryPointer = getMemoryPointerWithId(oA.objectId);
				if (!memoryPointer) {
					memoryPointer = new MemoryPointer(l, true);
				}
				memoryPointer.draw();

				bA.screenX = memoryPointer.x;
				bA.screenY = memoryPointer.y;
			} else {
				bA.screenX = bB.screenX;
				bA.screenY = -10;
			}
			bA.screenZ = bB.screenZ;
			bA.screenLinearZ = bB.screenLinearZ;
		}

		// linearize a non linear zBuffer (see index.js)
		var bAScreenZ =   bA.screenLinearZ;
		var bBScreenZ = bB.screenLinearZ;

		var logicA;
		if (l.logicA == null || l.logicA === false) {
			logicA = 4;
		} else {
			logicA = l.logicA;
		}

		var logicB;
		if (l.logicB == null || l.logicB === false) {
			logicB = 4;
		} else {
			logicB = l.logicB;
		}

		drawLine(context, [bA.screenX, bA.screenY], [bB.screenX, bB.screenY], bAScreenZ, bBScreenZ, l, timeCorrection,logicA,logicB);
	}
	// context.fill();
	globalCanvas.hasContent = true;
};

/**
 * @desc
 **/

realityEditor.gui.ar.lines.drawInteractionLines = function () {
	// this function here needs to be more precise

	if (globalProgram.objectA) {

		var oA = objects[globalProgram.objectA];


		var tempStart = oA.nodes[globalProgram.nodeA];

		// this is for making sure that the line is drawn out of the screen... Don't know why this got lost somewhere down the road.
		// linearize a non linear zBuffer

		// map the linearized zBuffer to the final ball size
		if (!oA.objectVisible) {
			tempStart.screenX = globalStates.pointerPosition[0];
			tempStart.screenY = -10;
			tempStart.screenZ = 6;
		} else {
			if(tempStart.screenLinearZ)
				tempStart.screenZ = tempStart.screenLinearZ;
		}

		var logicA;
		if (globalProgram.logicA == null || globalProgram.logicA === false) {
			logicA = 4;
		} else {
			logicA = globalProgram.logicA;
		}

		drawLine(globalCanvas.context, [tempStart.screenX, tempStart.screenY], [globalStates.pointerPosition[0], globalStates.pointerPosition[1]], tempStart.screenZ, tempStart.screenZ, globalStates, timeCorrection, logicA, globalProgram.logicSelector);
	}

	if (globalStates.drawDotLine) {
		drawDotLine(globalCanvas.context, [globalStates.drawDotLineX, globalStates.drawDotLineY], [globalStates.pointerPosition[0], globalStates.pointerPosition[1]], 1, 1);
	}

	globalCanvas.hasContent = true;
};

/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param x21 position x 1
 * @param y21 position y 1
 * @param x22 position x 2
 * @param y22 position y 2
 **/

realityEditor.gui.ar.lines.deleteLines = function(x21, y21, x22, y22) {
	// window.location.href = "of://gotsome";
	for (var keysome in objects) {
		if (!objects.hasOwnProperty(keysome)) {
			continue;
		}

		var thisObject = objects[keysome];
		for (var subKeysome in thisObject.links) {
			if (!thisObject.links.hasOwnProperty(subKeysome)) {
				continue;
			}
			var l = thisObject.links[subKeysome];
			var oA = thisObject;
			var oB = objects[l.objectB];

			if (typeof(oA) === 'undefined' || typeof(oB) === 'undefined') {
				continue;
			}

			var bA = oA.nodes[l.nodeA];
			var bB = oB.nodes[l.nodeB]

			if (typeof(bA) === 'undefined' || typeof(bB) === 'undefined') {
				continue; //should not be undefined
			}

			if (this.realityEditor.gui.utilities.checkLineCross(bA.screenX, bA.screenY, bB.screenX, bB.screenY, x21, y21, x22, y22, globalCanvas.canvas.width, globalCanvas.canvas.height)) {
				delete thisObject.links[subKeysome];
				this.cout("iam executing link deletion");
				//todo this is a work around to not crash the server. only temporarly for testing
				// if(l.logicA === false && l.logicB === false)
				realityEditor.network.deleteLinkFromObject(thisObject.ip, keysome, subKeysome);
			}
		}
	}

};



/**********************************************************************************************************************
 **********************************************************************************************************************/

/**
 * @desc
 * @param context
 * @param lineStartPoint
 * @param lineEndPoint
 * @param b1
 * @param b2
 **/

realityEditor.gui.ar.lines.drawDotLine = function(context, lineStartPoint, lineEndPoint, b1, b2) {
	context.beginPath();
	context.moveTo(lineStartPoint[0], lineStartPoint[1]);
	context.lineTo(lineEndPoint[0], lineEndPoint[1]);
	context.setLineDash([7]);
	context.lineWidth = 2;
	context.strokeStyle = "#ff019f";//"#00fdff";
	context.stroke();
	context.closePath();
}

/**
 * @desc
 * @param context
 * @param lineStartPoint
 * @param lineEndPoint
 * @param radius
 **/

realityEditor.gui.ar.lines.drawGreen = function(context, lineStartPoint, lineEndPoint, radius) {
	context.beginPath();
	context.arc(lineStartPoint[0], lineStartPoint[1], radius, 0, Math.PI * 2);
	context.strokeStyle = "#7bff08";
	context.lineWidth = 2;
	context.setLineDash([7]);
	context.stroke();
	context.closePath();

}

/**
 * @desc
 * @param context
 * @param lineStartPoint
 * @param lineEndPoint
 * @param radius
 **/

realityEditor.gui.ar.lines.drawRed = function(context, lineStartPoint, lineEndPoint, radius) {
	context.beginPath();
	context.arc(lineStartPoint[0], lineStartPoint[1], radius, 0, Math.PI * 2);
	context.strokeStyle = "#ff036a";
	context.lineWidth = 2;
	context.setLineDash([7]);
	context.stroke();
	context.closePath();
}

/**
 * @desc
 * @param context
 * @param lineStartPoint
 * @param lineEndPoint
 * @param radius
 **/

realityEditor.gui.ar.lines.drawBlue = function(context, lineStartPoint, lineEndPoint, radius) {
	context.beginPath();
	context.arc(lineStartPoint[0], lineStartPoint[1], radius, 0, Math.PI * 2);
	context.strokeStyle = "#01fffd";
	context.lineWidth = 2;
	context.setLineDash([7]);
	context.stroke();
	context.closePath();
}

/**
 * @desc
 * @param context
 * @param lineStartPoint
 * @param lineEndPoint
 * @param radius
 **/

realityEditor.gui.ar.lines.drawYellow = function(context, lineStartPoint, lineEndPoint, radius) {
	context.beginPath();
	context.arc(lineStartPoint[0], lineStartPoint[1], radius, 0, Math.PI * 2);
	context.strokeStyle = "#FFFF00";
	context.lineWidth = 2;
	context.setLineDash([7]);
	context.stroke();
	context.closePath();
}

realityEditor.gui.ar.lines.drawSimpleLine = function(context, startX, startY, endX, endY, color, width) {
	context.strokeStyle = color;
	context.lineWidth = width;
	context.beginPath();
	context.moveTo(startX, startY);
	context.lineTo(endX, endY);
	context.stroke();
}
