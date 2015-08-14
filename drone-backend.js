var Cylon = require('cylon');
var utils = require('utils/droneUtils.js');
var bot;
var landed = true;
// Initialise the robot
Cylon.robot()
    .connection("ardrone", {
        adaptor: 'ardrone',
        port: '192.168.1.1'
    })
    .device("drone", {
        driver: "ardrone",
        connection: "ardrone"
    })
    .device("nav", {
        driver: "ardrone-nav",
        connection: "ardrone"
    })
    .on("ready", fly);
    
// Fly the bot
function fly(robot) {
    bot = robot;
    bot.drone.disableEmergency();
    bot.drone.ftrim();
    bot.drone.takeoff();
    landed = false;

    bot.drone.config('general:navdata_demo', 'TRUE');
    bot.nav.on("navdata", function(data) {
    });

    bot.nav.on("altitudeChange", function(data) {
        console.log("Altitude:", data);
        // Drone is higher than 1.5 meters up
        if (altitude > 1.5) {
            bot.drone.land();
            landed = true;
        }
    });

    bot.nav.on("batteryChange", function(data) {
        console.log("Battery level:", data);

    });

    if (landed == false) {
        after(5 * 1000, function () {
            bot.drone.left(0.2);
        });
        after(6 * 1000, function () {
            bot.drone.forward(0.2);
        });
        after(7 * 1000, function () {
            bot.drone.right(0.2);
        });
        after(8 * 1000, function () {
            bot.drone.back(0.2);
        });
        after(9 * 1000, function () {
            bot.drone.stop();
            landed = true;
        });
    }
    bot.drone.getPngStream()
        .on("data", utils.sendFrame);

}

Cylon.start();

