@ECHO OFF
REM This script is intended to be used for launching OpenFin Runtime by ChromeDriver or node of Selenium Grid server.
REM It parses --remote-debugging-port and --config parameters passed by ChromeDriver and passes them to OpenFinRVM.exe
REM %openfinLocation% needs to point to location of OpenFin install directory.
REM if devtools_port is set in app.json and ChromeDriver needs to communicate on that port,  set chromeOptions.debuggerAddress
REM to be the same as devtools_port.
REM Otherwise, devtools_port should NOT be set in app manifest json file and chromedriver dynamically assigns a port and passes
REM it with --remote-debugging-port as a command line argument to this script

SETLOCAL ENABLEDELAYEDEXPANSION
SETLOCAL ENABLEEXTENSIONS

SET debuggingPort=0

:loop  
 IF "%1"=="" GOTO cont  
 SET opt=%1
 IF "%opt%" == "--remote-debugging-port" (
    SET debuggingPort=%2
 )
 IF "%opt%" == "--config" (
    SET startupURL=%2
 )


 SHIFT & GOTO loop  

:cont

echo %debuggingPort%
echo %startupURL%

SET openfinLocation=%LocalAppData%\OpenFin

cd %openfinLocation%

IF "%debuggingPort%" == "0" (
 OpenFinRVM.exe --config=%startupURL%
) else (
 OpenFinRVM.exe --config=%startupURL% --runtime-arguments="--remote-debugging-port=%debuggingPort%"
)

ENDLOCAL