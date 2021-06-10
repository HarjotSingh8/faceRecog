import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ProgressIndicator from "./components/ProgressIndicator";
import ImageUploadButton from "./components/imageUploadButton";
import ImageCarousel from "./components/ImageCarousel";
import "bootstrap/dist/css/bootstrap.css";
import * as faceapi from "face-api.js";
import FaceCarousel from "./components/FaceCarousel";
import WebcamComponent from "./components/webcamComponent";
function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [multiFaceUpload, setMultiFaceUpload] = useState(true);
  const [faces, setFaces] = useState([]);
  const [capturingWebCamForDatabase, setCapturingWebCamForDatabase] =
    useState(false);
  const [capturingWebcamForReference, setCapturingWebCamForReference] =
    useState(false);
  const [progressStatus, setProgressStatus] = useState({
    createDatabase: { label: "Create Database", status: 0 },
    uploadQueryImage: { label: "Upload Query", status: 0 },
    results: { label: "Results", status: 0 },
  });
  useEffect(() => {
    async function loadModel() {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      setModelLoaded(true);
    }
    loadModel();
  });
  function imageFromFile(e) {
    console.log(e);
    let addedImage = URL.createObjectURL(e.target.files[0]);
    console.log(addedImage);
    addImage(addedImage);
  }
  async function imageFromWebcam(addedImage) {
    let aspect_ratio = 16 / 9;
    console.log(addedImage);
    document.getElementById("hiddenImage").src = addedImage;
    var options = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.4,
    });
    console.log(faces);
    let predictions = await faceapi.detectAllFaces("hiddenImage", options);
    let temp = [];
    for (var i = 0; i < predictions.length; i++) {
      let width = predictions[i].box._width;
      let height = predictions[i].box.height;
      let adjustmentx = 0;
      let adjustmenty = 0;
      if (width * aspect_ratio > height) {
        adjustmenty = width * aspect_ratio - height;
      } else if (height > width * aspect_ratio) {
        adjustmentx = height / aspect_ratio - width;
      }
      var canv = await faceapi.extractFaces("hiddenImage", [
        new faceapi.Rect(
          predictions[i].box._x - adjustmentx / 2,
          predictions[i].box._y - adjustmenty / 2,
          predictions[i].box._width + adjustmentx,
          predictions[i].box._height + adjustmenty
        ),
      ]);
      predictions[i].url = canv[0].toDataURL();
      temp.push(canv[0].toDataURL());
    }

    let f = [...faces, ...temp];
    console.log(f);
    setFaces(f);
  }
  async function addImage(addedImage) {
    let aspect_ratio = 16 / 9;
    document.getElementById("hiddenImage").src = addedImage;
    var options = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.4,
    });
    console.log(faces);
    let predictions = await faceapi.detectAllFaces("hiddenImage", options);
    let temp = [];
    for (var i = 0; i < predictions.length; i++) {
      let width = predictions[i].box._width;
      let height = predictions[i].box.height;
      let adjustmentx = 0;
      let adjustmenty = 0;
      if (width * aspect_ratio > height) {
        adjustmenty = width * aspect_ratio - height;
      } else if (height > width * aspect_ratio) {
        adjustmentx = height / aspect_ratio - width;
      }
      var canv = await faceapi.extractFaces("hiddenImage", [
        new faceapi.Rect(
          predictions[i].box._x - adjustmentx / 2,
          predictions[i].box._y - adjustmenty / 2,
          predictions[i].box._width + adjustmentx,
          predictions[i].box._height + adjustmenty
        ),
      ]);
      predictions[i].url = canv[0].toDataURL();
      temp.push(canv[0].toDataURL());
    }
    let f = [...faces, ...temp];
    console.log(f);
    setFaces(f);
  }

  /**
   * Functions
   *
   * handleFileInput
   * handles input from file
   * sends cropped faces to database or reference array
   *
   * handleWebcamInput
   * handles input from webcam
   * sends cropped faces to databse or reference array
   *
   * addFacesToDatabase
   * adds faces to database
   *
   * addFacesToReference
   * adds faces to reference
   *
   * removeFaceFromDatabse
   * input: index (number)
   * removes face from database
   *
   * removeFaceFromReference
   * input: index (number)
   * removes face from reference
   */

  const removeFace = (index) => {
    var temp = [];
    for (var i = 0; i < faces.length; i++) {
      if (index != i) {
        temp.push(faces[i]);
      } else {
        URL.revokeObjectURL(faces[i]);
      }
    }
    setFaces(temp);
  };

  const updateProgress = (level, status) => {
    var progress = { ...progressStatus };
    // console.log(progress);
    progress[level].status = status;
    setProgressStatus(progress);
  };
  return (
    <div className="App ">
      <img id="hiddenImage" style={{ display: "none" }} src="" />
      <ProgressIndicator states={progressStatus} />
      Images
      <ImageCarousel
        addImage={imageFromFile}
        removeImage={removeFace}
        images={faces}
        modelLoaded={modelLoaded}
      />
      <WebcamComponent addImage={imageFromWebcam} />
      {/* Faces
      <FaceCarousel
        addImage={addImage}
        removeImage={removeImage}
        images={faces}
        faceapi={faceapi}
      /> */}
    </div>
  );
}

export default App;
