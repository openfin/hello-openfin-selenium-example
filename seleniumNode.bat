REM Example batch to run Selenium Grid node
REM assuming Selenium Grid hub is running at 10.37.129.2:8818
REM chromedriver.exe and RunOpenFin.bat must exit in the current directory

java -Dwebdriver.chrome.driver="chromedriver.exe" -jar selenium-server-standalone-3.6.0.jar -role node -hub http://localhost:8818/grid/register -browser "browserName=chrome,maxInstances=1,platform=WIN8"
