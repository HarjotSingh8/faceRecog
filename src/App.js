import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import ProgressIndicator from "./components/ProgressIndicator";
import ImageUploadButton from "./components/imageUploadButton";
import ImageCarousel from "./components/ImageCarousel";
import "bootstrap/dist/css/bootstrap.css";
import * as faceapi from "face-api.js";
import FaceCarousel from "./components/FaceCarousel";
function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [faces, setFaces] = useState([]);
  const [progressStatus, setProgressStatus] = useState({
    createDatabase: { label: "Create Database", status: 0 },
    uploadQueryImage: { label: "Upload Query", status: 0 },
    results: { label: "Results", status: 0 },
  });

  useEffect(() => {
    console.log(faceapi);
    //faceapi.TinyFaceDetector();
    // faceapi.ssdMobilenetv1();
    async function loadModel() {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      setModelLoaded(true);
      console.log(faceapi);
    }
    loadModel();
  });

  const addImage = (e) => {
    let temp = [...uploadedImages];
    console.log(e);
    temp.push({
      url: URL.createObjectURL(e.target.files[0]),
      processed: false,
    });
    setUploadedImages(temp);
  };
  const removeImage = (index) => {
    var temp = [];
    for (var i = 0; i < uploadedImages.length; i++) {
      if (index != i) {
        temp.push(uploadedImages[i]);
      }
    }
    setUploadedImages(temp);
  };

  useEffect(() => {
    //scan faces on a change in uploaded images
    async function addNewFaces() {
      let flag = -1;
      for (var i = 0; i < uploadedImages.length; i++) {
        if (uploadedImages[i].processed == false) {
          console.log("yes");

          flag = i;
          document.getElementById("hiddenImage").src = uploadedImages[i].url;
          break;
        }
      }
      if (flag !== -1) {
        async function processImage() {
          // let x = await faceapi.allFacesSsdMobilenetv1(
          //   //uploadedImages[flag].url,
          //   "activeImage",
          //   0.1
          // );

          var options = new faceapi.SsdMobilenetv1Options({
            minConfidence: 0.4,
          });
          let predictions = await faceapi.detectAllFaces(
            "hiddenImage",
            options
          );
          //let boxes = [];
          for (var i = 0; i < predictions.length; i++) {
            predictions[i].url = uploadedImages[flag].url;
            var canv = await faceapi.extractFaces("hiddenImage", [
              new faceapi.Rect(
                predictions[i].box._x,
                predictions[i].box._y,
                predictions[i].box._width,
                predictions[i].box._height
              ),
            ]);
            var img = new Image();
            img.src = canv[0].toDataURL();
            predictions[i].canvas = canv[0].toDataURL();
            // boxes.push(
            //   new faceapi.Rect(
            //     predictions[i].box._x,
            //     predictions[i].box._y,
            //     predictions[i].box._x + predictions[i].box._width,
            //     predictions[i].box._y + predictions[i].box._height
            //   )
            // );
          }
          // actually extractFaces is meant to extract face regions from bounding boxes
          // but you can also use it to extract any other region
          //const canvases = await faceapi.extractFaces("hiddenImage", boxes);
          //console.log(canvases);
          let f = [...faces];
          f.push(...predictions);
          setFaces(f);
          let temp = [...uploadedImages];
          temp[flag].processed = true;
          setUploadedImages(temp);

          console.log(predictions);
        }
        processImage();
      }
    }
    addNewFaces();
  }, [uploadedImages, modelLoaded]);

  const updateProgress = (level, status) => {
    var progress = { ...progressStatus };
    console.log(progress);
    progress[level].status = status;
    setProgressStatus(progress);
  };
  console.log(progressStatus);
  console.log(uploadedImages);
  return (
    <div className="App">
      <img id="hiddenImage" style={{ display: "none" }} src="" />
      <ProgressIndicator states={progressStatus} />
      <ImageUploadButton id="imageUpload" addImage={addImage} />
      Images
      <ImageCarousel
        addImage={addImage}
        removeImage={removeImage}
        images={uploadedImages}
      />
      Faces
      <FaceCarousel
        addImage={addImage}
        removeImage={removeImage}
        images={faces}
        faceapi={faceapi}
      />
    </div>
  );
}

export default App;
