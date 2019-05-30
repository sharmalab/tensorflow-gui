#/bin/sh

echo "Welcome to TensorFlow-GUI"

conda --version 2 > /dev/null
if [ $? == 0 ]
then
    source activate tfgui
    npm start --prefix=../src/
    conda deactivate
else
    npm start --prefix=../src/
fi
echo "Bye"