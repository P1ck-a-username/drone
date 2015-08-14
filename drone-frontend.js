function init() {
    tracker = initTracker("#droneView");
    droneConnection.streamImage(tracker,"#droneView.drone");
    tracking.track("#example .drone", tracker);
}

function initTracker(element) {
    // Initialise a color tracker
    var tracker = new tracking.ColorTracker();

    TrackerUtils.addTrackingColor("#5EA24E", "green", tracker);

    TrackerUtils.startTrackingColors(tracker);

    // Whenever there is a new color detected, mark them
    tracker.on('track', function(event) {
        markColors(event.data, element);
        decideDroneMovement(event.data);
    });

    return tracker;
}

function markColors(colors, element) {
    var canvas = $(element + ' .canvas').get(0);
    var context = canvas.getContext('2d');

    context.clearRect(0,0,context.width,context.length);

    for (var i=0; i<colors.length; i++) {
        drawRectangle(colors[i], context);
        writeRectangle(colors[i], element + ' .output')
    }
}

function drawRectangle(rect, context) {
    if (rect.width * rect.height > 2000) {
        context.strokeStyle = rect.color;
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
    }
}

function writeRectangle(rect, element) {
    if (rect.width * rect.height > 2000) {
        $(element)
            .append("<p>")
            .append(rect.color + ": " + rect.width + "X" + rect.height)
            .append(" @ " + rect.x + ":" + rect.y)
    }
}

function decideDroneMovement(colors){
    var move = {
        left: false,
        right: false
    };

    for(var i = 0; i < colors.length; i++) {
        var rectangle = colors[i];
        var colour = checkColor(rectangle);
        if (colour == "green") {
            if (rectangle.width > 300) {
                move.left = true;
            }
        }
        if (colour == "red") {
            if (rectangle.width > 300) {
                move.right = ture;
            }
        }
    }
    droneConnection.send(move);
}

function checkColor(rectangle) {
    return rectangle.color;
}

window.addEventListener("load", init);
