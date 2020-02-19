
# TensorFlow-GUI
[![GitHub stars](https://img.shields.io/github/stars/sharmalab/tensorflow-gui)](https://github.com/sharmalab/tensorflow-gui/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/sharmalab/tensorflow-gui)](https://github.com/sharmalab/tensorflow-gui/issues)
[![GitHub forks](https://img.shields.io/github/forks/sharmalab/tensorflow-gui)](https://github.com/sharmalab/tensorflow-gui/network)
![GitHub License](https://img.shields.io/github/license/sharmalab/tensorflow-gui)

![GSoC Icon](https://developers.google.com/open-source/gsoc/resources/downloads/GSoC-logo-horizontal-200.png)

This project aims to develop a TensorFlow compatible GUI to perform all the operations done by TensorFlow.

Student: **Vikas Gola**

Mentors: **Monjoy Saha** (monjoy.saha@emory.edu) and **Pooya Mobadersany** (pooya.mobadersany@emory.edu)

![Gui Demo Video](screenshots/shots.gif)

## Progress and Features
Progress and features of the Tensorflow-GUI can be checked [here](https://github.com/sharmalab/tensorflow-gui/wiki/Progress-and-Features). 

## Installation & Setup

#### For Ubuntu
- (Optional but recommended) Install the Anaconda from [here](https://www.anaconda.com/).
- Clone the repo from GitHub
    ```
    git clone https://github.com/sharmalab/tensorflow-gui
    ```
- Give permission to scripts to install the required libraries
    ```  
    cd tensorflow-gui/scripts/
    chmod +x setup.sh run.sh
    ```
- Run the script to setup and install required libraries
    ```
    ./setup.sh
    ```

#### For Windows 10
- Download and Install Anaconda from [here](https://www.anaconda.com/) for the current user.
- Download and Install NodeJs from [here](https://nodejs.org/en/).
- Download and Install git from [here](https://git-scm.com/).
- Open powershell and follow next instructions.
- Clone the repo from GitHub
    ```
    git clone https://github.com/sharmalab/tensorflow-gui
    ```
- Give permission to scripts to install the required libraries
    ```  
    cd tensorflow-gui\scripts\
    ```
- Run the script to setup and install required libraries
    ```
    .\setup.ps1
    ```

***Note***: Make sure NodeJs, Anaconda, and git are available from powershell

## How to Run

- Change the directory
    ```
    cd tensorflow-gui/scripts/
    ```
- Start the TensorFlow-GUI
    ```
    For Ubuntu
    ./run.sh
    For Windows
    .\run.ps1
    ```