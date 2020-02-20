
# https://repo.anaconda.com/archive/Anaconda3-2019.10-Windows-x86_64.exe
# https://nodejs.org/dist/v12.16.1/node-v12.16.1-x64.msi

Write-Output "Setting up enviroment for TensorFlow-GUI"

conda create -n tfgui python=3.5
conda activate tfgui
conda install --file .\..\requirements.txt
conda install -c menpo opencv
conda install -c conda-forge python-language-server 
conda deactivate

Set-Location .\..\src\
npm install
Set-Location .\..\scripts\
mkdir -p .\..\testing\Projects\;
Write-Output "Completed!";