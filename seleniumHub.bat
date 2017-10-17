REM Example script to run Selenium Grid hub on PORT
REM
REM To configure test code to access the hub,  make the following changes in test/config.js
REM         remoteDriverHost: "localhost",
REM         remoteDriverPort: 8818,
REM         remoteDriverPath: "/wd/hub",


set PORT=8818

echo "check status on http://localhost:$PORT/grid/console"

java -jar selenium-server-standalone-3.6.0.jar -role hub -port %PORT%


