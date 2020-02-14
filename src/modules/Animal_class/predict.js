$("#image-selector").change(function() {
  let reader = new FileReader();
  reader.onload = function() {
    let dataURL = reader.result;
    $("#selected-image").attr("src", dataURL);
    $("#prediction-list").empty();
  };
  let file = $("#image-selector").prop("files")[0];
  reader.readAsDataURL(file);
});

$("#model-selector").change(function() {
  loadModel($("#model-selector").val());
});

let model;
async function loadModel(name) {
  $(".progress-bar").show();
  model = undefined;
  model = await tf.loadModel(`tfjs-models/Classification_Models/model.json`);
  $(".progress-bar").hide();
}

$("#predict-button").click(async function() {
  let image = $("#selected-image").get(0);
  let modelName = $("#model-selector").val();
  let tensor = tf
    .fromPixels(image)
    .resizeNearestNeighbor([224, 224])
    .toFloat();

  let offset = tf.scalar(127.5);

  tensor = tensor
    .sub(offset)
    .div(offset)
    .expandDims();

  let predictions = await model.predict(tensor).data();
  let top5 = Array.from(predictions)
    .map(function(p, i) {
      return {
        probability: p,
        className: ANIMAL_CLASSES[i]
      };
    })
    .sort(function(a, b) {
      return b.probability - a.probability;
    })
    .slice(0, 3);

  $("#prediction-list").empty();
  top5.forEach(function(p) {
    $("#prediction-list").append(
      `<li>${p.className}: ${p.probability.toFixed(6)}</li>`
    );
  });
});

