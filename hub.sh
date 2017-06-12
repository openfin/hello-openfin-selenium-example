#!/bin/sh
#Example script to run Selenium Grid hub on PORT
#Assuing local IP is 10.37.129.2.
#
#To configure test code to access the hub,  make the following changes in test/config.js
#        remoteDriverHost: "10.37.129.2",
#        remoteDriverPort: 8818,
#        remoteDriverPath: "/wd/hub",


PORT=8818

echo "check status on http://localhost:$PORT/grid/console"

java -jar selenium-server-standalone-3.0.1.jar -role hub -port $PORT


