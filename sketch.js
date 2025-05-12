let facemesh;
let video;
let predictions = [];

// 嘴唇的特徵點編號
const lipsIndices = [409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184];

function setup() {
  createCanvas(400, 400);

  // 啟用攝影機，指定解析度
  video = createCapture(VIDEO);
  video.size(400, 400);
  video.hide();

  // 初始化 facemesh 模型
  facemesh = ml5.facemesh(modelReady);

  // 當模型偵測到臉部特徵時，更新 predictions
  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220);

  // 顯示攝影機畫面
  image(video, 0, 0, width, height);

  // 繪製嘴唇的線條
  drawLipsLines();
}

function drawLipsLines() {
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 繪製嘴唇的線條
    stroke(255, 0, 0); // 紅色線條
    strokeWeight(5); // 線條粗細為 5
    noFill();

    for (let i = 0; i < lipsIndices.length - 1; i++) {
      const [x1, y1] = keypoints[lipsIndices[i]];
      const [x2, y2] = keypoints[lipsIndices[i + 1]];
      line(x1, y1, x2, y2); // 繪製兩點之間的線條
    }

    // 將最後一點與第一點連接，封閉嘴唇
    const [xStart, yStart] = keypoints[lipsIndices[0]];
    const [xEnd, yEnd] = keypoints[lipsIndices[lipsIndices.length - 1]];
    line(xStart, yStart, xEnd, yEnd);
  }
}
