Type.registerNamespace("Alchemy.Plugins.ViewWorkflow.Views");

Alchemy.Plugins.ViewWorkflow.Views.ViewWorkflow = function viewWorkflow() {
    Tridion.OO.enableInterface(this, "Alchemy.Plugins.ViewWorkflow.Views.ViewWorkflow");
    this.addInterface("Tridion.Cme.View");
};

var resultJson = [];
Alchemy.Plugins.ViewWorkflow.Views.ViewWorkflow.prototype.initialize = function viewWorkflow$initialize() {
    var p = this.properties;
    var c = p.controls;
    var self = this;
    p.selectedItem = $url.getHashParam("selectedItem");
    
    Alchemy.Plugins["${PluginName}"].Api.getSettings()
    .success(function (settings) {
        if (settings) {
            var param = { ActivityInstanceId: p.selectedItem };

            Alchemy.Plugins["${PluginName}"].Api.Service.viewWorkflow(param)
        .success(function (result) {
            drawCanvas(JSON.parse(result));
        })
        .error(function (type, error) {
            $messages.registerError("Error Occoured :" +type);
        })
        .complete(function () {
        });
        }
    })
    .complete(function () {

    });

};



$display.registerView(Alchemy.Plugins.ViewWorkflow.Views.ViewWorkflow);

var xAxis = 0;
var yAxis = 0;
function drawCanvas(processInstance) {
    var iconMapping = [
        {
            "actionTypeId": 1,
            "file": "${ImgUrl}start.png",
            "opacity": 100,
            "coordinateX": 5,
            "coordinateY": 0
        },
        {
            "actionTypeId": 2,
            "file": "${ImgUrl}stop.png",
            "opacity": 100,
            "coordinateX": 0,
            "coordinateY": 0
        },
        {
            "actionTypeId": 3,
            "file": "${ImgUrl}manual-activity.png",
            "opacity": 100,
            "coordinateX": 0,
            "coordinateY": 0
        },
        {
            "actionTypeId": 4,
            "file": "${ImgUrl}manual-decision.png",
            "opacity": 100,
            "coordinateX": 0,
            "coordinateY": 0
        },
        {
            "actionTypeId": 5,
            "file": "${ImgUrl}automaticl-activity.png",
            "opacity": 50,
            "coordinateX": 0,
            "coordinateY": 0
        },
        {
            "actionTypeId": 6,
            "file": "${ImgUrl}automatic-decision.png",
            "opacity": 50,
            "coordinateX": 0,
            "coordinateY": 0
        }
    ];
    loadCanvas(processInstance, iconMapping);
}
function loadCanvas(processInstance, iconMapping) {
    var canvasHeight = 0, canvasWidth = 0;
    canvasHeight = processInstance.actions.length * 80;
    canvasWidth = processInstance.actions.length * 90;
    var canvas = new Canvas(canvasHeight, canvasWidth);
    canvas.drawWorkflow(processInstance, iconMapping);
}

function Canvas(height, width) {
    this.hght = height;
    this.wdth = width;
}

Canvas.prototype.drawWorkflow = function (processInstance, iconMapping) {
    var wrapper = document.getElementById("wrapper");
    var canvasContext = fetchCanvas(this.wdth, this.hght);
    wrapper.appendChild(canvasContext.canvas);
    if (processInstance) {
        if (processInstance.workflowTitle) {
            console.log(processInstance);
            wrapTitleText(canvasContext, processInstance.workflowTitle, this.wdth / 2.5, 20, 250, 18);
            var actions = processInstance.actions;
            if (actions) {
                actions.forEach(function (action) {
                    drawIconOnCanvas(iconMapping, action, canvasContext, this.wdth, this.hght);
                }.bind(this));
                actions.forEach(function (action) {
                    var nextSteps = action.nextSequences;
                    var linkedActions = [];
                    nextSteps.forEach(function (step) {
                        var nextActions = actions.filter((linkedAction) => (linkedAction.actionSequence === step.sequenceNumber));
                        linkedActions.push(nextActions[0]);
                    });
                    linkedActions.forEach(function (lAction) {
                        if (action.actionSequence > lAction.actionSequence) {
                            drawBackwardLineAndArrow(canvasContext, { "x": action.xAxis - 5, "y": action.yAxis + 50 }, { "x": lAction.xAxis + 50, "y": lAction.yAxis + 75 }, 10);
                        } else {
                            if (action.actionTypeId === 1) {
                                drawForwardLineAndArrow(canvasContext, { "x": action.xAxis + 50, "y": action.yAxis + 25 }, { "x": lAction.xAxis, "y": lAction.yAxis + 30 }, 10);
                            } else {
                                drawForwardLineAndArrow(canvasContext, { "x": action.xAxis + 55, "y": action.yAxis + 50 }, { "x": lAction.xAxis, "y": lAction.yAxis + 30 }, 10);
                            }
                        }
                    }.bind(this));
                }.bind(this));
            }
        }
    }
}

function fetchCanvas(width, height) {
    var canvas = createHiDPICanvas(width, height);
    canvas.style = "border:1px solid #d3d3d3";
    var canvasContext = canvas.getContext("2d");
    return canvasContext;
}
function createHiDPICanvas(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    context.fillStyle = "black";
    context.font = "8px Verdana";
    var words = text.split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function wrapTitleText(context, text, x, y, maxWidth, lineHeight) {
    context.font = "20px Verdana";
    var gradient = context.createLinearGradient(0, 0, x * 2, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    context.fillStyle = gradient;
    var words = text.split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = context.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
}

function drawBulbIcon(ctx, imgPath, xNode, yNode) {
    let img = new Image();
    img.src = imgPath;
    img.onload = function () {
        ctx.drawImage(img, xNode, yNode, 30, 30);
    };
}

function drawIconOnCanvas(iconMapping, action, canvasContext, width, height) {
    var icon = iconMapping.filter((icon) => (icon.actionTypeId === action.actionTypeId));
    var tempX = 0, tempY = 0;
    var opacity = icon[0].opacity;
    var img = new Image();
    img.src = icon[0].file;
    if (action.actionTypeId === 1) {
        tempX = xAxis = icon[0].coordinateX;
        tempY = yAxis = icon[0].coordinateY;
    } else if (action.actionTypeId === 2) {
        tempX = xAxis = icon[0].coordinateX = width - 50;
        tempY = yAxis = icon[0].coordinateY = height - 50;
    }
    else {
        tempX = xAxis = icon[0].coordinateX = xAxis + 90
        tempY = yAxis = icon[0].coordinateY = yAxis + 70;


        if (action.isActive) {
            canvasContext.rect(tempX - 5, tempY, 60, 100);
            var gradient = canvasContext.createLinearGradient(0, 0, width, 0);
            gradient.addColorStop("0", "yellow");
            gradient.addColorStop("0.75", "lime");
            gradient.addColorStop("1.0", "green");
            canvasContext.fillStyle = gradient;
            canvasContext.fillRect(tempX - 5, tempY, 60, 100);
            canvasContext.stroke();
        }/*else if(action.actionTypeId === 5 || action.actionTypeId === 6){
					canvasContext.rect(tempX-5,tempY,60,100);
					canvasContext.fillStyle="lightgrey";
					canvasContext.fillRect(tempX-5,tempY,60,100);
					canvasContext.stroke();
				}*/else {
            canvasContext.rect(tempX - 5, tempY, 60, 100);
            canvasContext.stroke();
        }
    }
    action["xAxis"] = tempX;
    action["yAxis"] = tempY;
    img.onload = function () {
        if (action.isActive) {
            canvasContext.globalAlpha = opacity / 150;
        } else {
            canvasContext.globalAlpha = opacity / 100;
        }
        canvasContext.drawImage(img, tempX - 4, tempY, 58, 58);
    };
    wrapText(canvasContext, action.actionTitle, icon[0].coordinateX + 2, icon[0].coordinateY + 70, 40, 10);
}

function arrow(ctx, p1, p2, size) {
    ctx.save();
    let points = edges(ctx, p1, p2);
    if (points.length < 2)
        return p1 = points[0], p2 = points[points.length - 1];

    // Rotate the context to point along the path
    let dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx * dx + dy * dy);
    ctx.translate(p2.x, p2.y);
    ctx.rotate(Math.atan2(dy, dx));

    // line
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-len + 2, 0);
    ctx.closePath();
    ctx.stroke();

    // arrowhead
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-size + 5, -size + 5);
    ctx.lineTo(-size + 5, size - 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
}

// Find all transparent/opaque transitions between two points
// Uses http://en.wikipedia.org/wiki/Bresenham's_line_algorithm
function edges(ctx, p1, p2, cutoff) {
    if (!cutoff) cutoff = 220; // alpha threshold
    var dx = Math.abs(p2.x - p1.x), dy = Math.abs(p2.y - p1.y),
        sx = p2.x > p1.x ? 1 : -1, sy = p2.y > p1.y ? 1 : -1;
    var x0 = Math.min(p1.x, p2.x), y0 = Math.min(p1.y, p2.y);
    var pixels = ctx.getImageData(x0, y0, dx + 1, dy + 1).data;
    var hits = [], i = 0;
    for (var x = p1.x, y = p1.y, e = dx - dy; x != p2.x || y != p2.y;) {
        var red = pixels[((y - y0) * (dx + 1) + x - x0) * 4];
        var green = pixels[((y - y0) * (dx + 1) + x - x0) * 4 + 1];
        var blue = pixels[((y - y0) * (dx + 1) + x - x0) * 4 + 2];
        if (red === 0 && green === 0 && blue === 0) {
            i++
            hits.push({ x: x, y: y });
        }
        var e2 = 2 * e;
        if (e2 > -dy) { e -= dy; x += sx }
        if (e2 < dx) { e += dx; y += sy }
        //over = alpha>=cutoff;
    }
    return hits;
}

function drawForwardLineAndArrow(ctx, p1, p2, size) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.strokeStyle = '#0f0';
    const pointX = p1.x + (p2.x - p1.x) + 25;
    const pointY = p2.y + (p1.y - p2.y);
    ctx.lineTo(pointX + 1, pointY);
    ctx.closePath();
    ctx.stroke();
    const newPointOne = { "x": pointX, "y": pointY - 1 }
    const newPointTwo = { "x": p2.x + 25, "y": p2.y - 31 }
    arrow(ctx, newPointOne, newPointTwo, size);
}

function drawBackwardLineAndArrow(ctx, p1, p2, size) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.strokeStyle = '#f00';
    const pointX = p1.x - (p1.x - p2.x) - 25;
    const pointY = p1.y;
    ctx.lineTo(pointX, pointY - 2);
    ctx.stroke();
    const newPointOne = { "x": pointX, "y": pointY }
    const newPointTwo = { "x": p2.x - 25, "y": p2.y + 30 }
    arrow(ctx, newPointOne, newPointTwo, size);
}