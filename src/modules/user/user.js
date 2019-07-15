const {
    ipcRenderer
} = require('electron')
const swal = require('sweetalert');
const fs = require('fs');
const global = require('../../lib/global');
const print = console.log;
const childprocess = require('child_process');

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#user-create-project-button").click(() => {
    swal({
        text: "Project Name",
        title: "Create New Project",
        content: "input",
        buttons: ["Cancel", "Next"],
    }).then((value) => {
        if (value == "") {
            swal("Error", "Projet Name can't be empty.", "error");
        } else if (value) {
            let dir = value.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            let basepath = process.cwd() + "/testing/Projects/";
            if (!fs.existsSync(basepath)) {
                fs.mkdirSync(basepath);
            }

            if (!fs.existsSync(basepath + dir)) {
                swal({
                    text: "Project Details",
                    title: "Create New Project",
                    content: "input",
                    buttons: ["Cancel", "Create"],
                }).then(value => {
                    if (value == "") {
                        swal("Error", "Project Details can't be empty.");
                    } else if (value) {
                        fs.mkdirSync(basepath + dir, err => {
                            if (err) {
                                print("Error creating folder", err);
                            }
                        });
                        fs.mkdirSync(basepath + dir + "/logs");
                        let data = {
                            name: dir,
                            details: value,
                            creation_time: new Date(Date.now()).toString(),
                        };
                        let initgraph = { "nodes": [{ "id": 0, "x": 450, "y": 139, "text": "InputLayer" }, { "id": 1, "x": 453, "y": 259, "text": "Dense" }, { "id": 2, "x": 458, "y": 380, "text": "Output" }], "edges": [{ "from": 0, "to": 1 }, { "from": 1, "to": 2 }] };
                        let initeditor = `

# importing libraries
from tensorflow.keras.callbacks import TensorBoard
import tensorflow as tf
from time import asctime
from tensorflow.keras.layers import *
from tensorflow.keras.models import Model, load_model
import numpy as np

'''
Do not remove tensorboard initialization.
Also, don't forget to add tensorboard as callback in your model.
'''
tensorboard = TensorBoard(log_dir="testing/Projects/${dir}/logs/{}".format(asctime()), histogram_freq=0,write_graph=True,write_grads=True,write_images=True)


def getTrainingData():
    fashion_mnist = tf.keras.datasets.fashion_mnist
    (train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()
    train_images = train_images / 255.0
    test_images = test_images / 255.0
    return train_images, train_labels


def Network():
    input = Input(shape=(28, 28))
    flatten = Flatten()(input)
    dense = Dense(128, activation=tf.nn.relu)(flatten)
    output = Dense(10, activation=tf.nn.softmax)(dense)
    model = Model(inputs=input, outputs=output)
    model.compile(metrics=['mae','accuracy', 'mse', 'mape', 'cosine', 'categorical_crossentropy'], optimizer='adam' , loss = 'sparse_categorical_crossentropy')
    return model


# function for training model
def train():
    model = Network()
    X, Y = getTrainingData()
    model.fit(x = X,y = Y,batch_size = None,epochs = 10,verbose = 0,callbacks = [tensorboard],validation_split = 0,validation_data = None,shuffle = True)

train()

`
                        fs.writeFileSync(basepath + dir + "/graph.json", JSON.stringify(initgraph));
                        fs.writeFileSync(basepath + dir + "/editor.py", initeditor);
                        fs.writeFile(basepath + dir + "/info.json", JSON.stringify(data), 'utf-8', err => {
                            if (err) {
                                print("Error writing file", err);
                            } else {
                                loadProjects();
                                swal("Create New Project", "Project created successfully.", "success");
                            }
                        });
                    }
                });
            } else {
                swal("Error", "Project with this name already exists.", "error");
            }
        }
    });
});

$("#user-settings-button").click(() => {
    loadPage("settings/settings.html");
});

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function openProject(value) {
    let pdosi = $(value.target).parent().parent().siblings();
    global.projectDetails.name = pdosi[0].innerText;
    global.projectDetails.details = pdosi[1].innerText;

    let killtensorboard = childprocess.spawn('killall', ["-9", "tensorboard"]);

    var env = Object.create(process.env);
    killtensorboard.on('close', (code) => {
        let tensorbaord = childprocess.spawn('tensorboard', ["--logdir=testing/Projects/" + global.projectDetails.name + "/logs/"], {
            env: env
        });

        console.log(`child process exited with code ${code}`);
    });

    loadPage("draw/draw.html");
}

function loadProjects() {
    let basepath = process.cwd() + "/testing/Projects/";
    let dirlist = getDirectories(basepath)

    if (dirlist.length != 0) {
        $("#no-projects").hide();
    }

    $("#user-projects-card-row").empty();
    for (let dir in dirlist) {
        fs.readFile(basepath + dirlist[dir] + "/info.json", (err, fileData) => {
            if (err) {
                return print("Error in reading all projects", err)
            }
            try {
                const object = JSON.parse(fileData);
                $("#user-projects-card-row").append(`
                <div class="col-sm-*">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${object.name}</h5>
                            <p class="card-text">${object.details}</p>
                            <div class="btn-group" role="group">
                                <button id="btnGroupDrop1" type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Open Project in </button>
                                <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                                    <a class="dropdown-item opencodeeditor">Code editor</a>
                                    <a class="dropdown-item openbuttons">Graph editor</a>
                                </div>
                            </div>
                            <button type="button" class="btn btn-secondary m-1 settingsbuttons">
                                Settings
                            </button>
                            </div>
                        </div>
                    </div>
                `);

                $(".settingsbuttons").click((value) => {
                    let pdosi = $(value.target).siblings();
                    global.projectDetails.name = pdosi[0].innerText;
                    global.projectDetails.details = pdosi[1].innerText;

                    loadPage("project/project.html");
                });

                $(".opencodeeditor").click((value) => {
                    global.projectDetails.iseditor = true;
                    openProject(value);
                });

                $(".openbuttons").click((value) => {
                    openProject(value);
                });
            } catch (err) {
                return print("Error in reading all projects", err)
            }
        })
    }
}

$(document).ready(() => {
    global.projectDetails.iseditor = false;
    global.isLoaded.draw = false;
    loadProjects();
});