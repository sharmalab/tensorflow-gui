const {
    ipcRenderer
} = require('electron')

function loadPage(page_path) {
    $("#main-content").html('');
    $("#main-content").load(page_path);
}

$("#user-create-project-button").click(() => {
    // title = "Sad";
    // val = "ASD";
    // args = {
    //     title,
    //     val
    // }
    // ipcRenderer.on('prompt-reply', (event, result) => {
    //     console.log("asdsd",result)
    // })

    // ipcRenderer.sendSync('prompt', args)

    // TODO: call window for craeting project
    console.log("prject created.")
})


$("#first-project").click(() => {
    loadPage("draw/draw.html")
})