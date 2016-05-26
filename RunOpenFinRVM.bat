Set filename=%0
set filename=%filename:"=%

For %%A in ("%filename%") do (
    Set Folder=%%~dpA
)

cd %Folder%
start %Folder%OpenFinRVM.exe %*