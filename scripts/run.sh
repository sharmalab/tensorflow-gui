#/bin/sh

echo "Welcome to TensorFlow-GUI"

conda --version > /dev/null
if [ $? == 0 ]
then
    source activate tfgui
    npm start --prefix=../src/
    source deactivate
else
    npm start --prefix=../src/
fi
echo "Bye"