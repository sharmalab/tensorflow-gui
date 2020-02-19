Write-Output "Welcome to TensorFlow-GUI"
conda activate tfgui
Set-Location .\..\src\
npm start
Set-Location .\..\scripts\
conda deactivate
Write-Output "Bye"
