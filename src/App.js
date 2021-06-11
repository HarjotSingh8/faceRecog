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
import { AddAPhoto, AddToPhotos, DeleteForever } from "@material-ui/icons";
import WebCamModal from "./components/webcamModal";
import ScrollingCarousel from "./components/ScrollingCarousel";
//import { queryByDisplayValue } from "@testing-library/dom";
import ReferenceGrid from "./components/ReferenceGrid";
import UploadButtonGroup from "./components/UploadButtonGroup";
import FaceGrid from "./components/FaceGrid";
import ReferenceImage from "./components/ReferenceImage";
import ResultControls from "./components/ResultControls";
function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [multiFaceUpload, setMultiFaceUpload] = useState(true);
  const [faces, setFaces] = useState([]);
  const [referenceFaces, setReferenceFaces] = useState([]);
  const [referenceFace, setReferenceFace] = useState(-1);
  const [capturingWebCamForDatabase, setCapturingWebCamForDatabase] =
    useState(false);
  const [capturingWebcamForReference, setCapturingWebCamForReference] =
    useState(false);
  const [processing, setProcessing] = useState(false);

  /**
   * progress states
   *
   * startingdatabase - database empty
   * workingdatabase - filling database
   * startingreference - reference empty
   * workingreference - selecting reference image
   * loadingresults - loading results
   * loadedresults - loaded results
   */
  const [progressStatus, setProgressStatus] = useState({
    createDatabase: { label: "Create Database", status: 0 },
    uploadReferenceImage: { label: "Upload Reference", status: 0 },
    results: { label: "Results", status: 0 },
  });
  const [active, setActive] = useState("createDatabase");
  useEffect(() => {
    if (referenceFaces.length > 0 && referenceFace == -1) {
      let temp = { ...progressStatus };
      temp.uploadReferenceImage.status = 1;
      setProgressStatus(temp);
      setReferenceFace(0);
    } else {
      let temp = { ...progressStatus };
      temp.uploadReferenceImage.status = 0;
      setProgressStatus(temp);
    }
  }, [referenceFaces]);
  useEffect(() => {
    if (faces.length > 0) {
      let temp = { ...progressStatus };
      temp.createDatabase.status = 1;
      setProgressStatus(temp);
    } else {
      let temp = { ...progressStatus };
      temp.createDatabase.status = 0;
      setProgressStatus(temp);
    }
  }, [faces]);
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
    document.getElementById("hiddenImage").src = addedImage;
    let aspect_ratio = 16 / 9;
    var options = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.4,
    });
    //console.log(faces);
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

  async function processFaces() {
    let aspect_ratio = 16 / 9;
    var options = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.4,
    });
    //console.log(faces);
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
    return temp;
  }
  async function handleFileInput(addedImage, target) {
    console.log(addedImage);
    setProcessing(true);
    //let addedImage = URL.createObjectURL(e.target.files[0]);
    document.getElementById("hiddenImage").src = addedImage;
    let newFaces = await processFaces();
    if (target == "database") {
      setFaces([...faces, ...newFaces]);
    } else if (target == "reference") {
      setReferenceFaces([...referenceFaces, ...newFaces]);
    }
    setProcessing(false);
  }
  async function handleWebcamInput(addedImage) {
    setProcessing(true);
    document.getElementById("hiddenImage").src = addedImage;
    let newFaces = await processFaces();
    if (capturingWebCamForDatabase) {
      setFaces([...faces, ...newFaces]);
      setCapturingWebCamForDatabase(false);
    } else if (capturingWebcamForReference) {
      setReferenceFaces([...referenceFaces, ...newFaces]);
      setCapturingWebCamForReference(false);
    }
    setProcessing(false);
  }
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
  const removeReferenceFace = (index) => {
    var temp = [];
    for (var i = 0; i < referenceFaces.length; i++) {
      if (index != i) {
        temp.push(referenceFaces[i]);
      } else {
        URL.revokeObjectURL(referenceFaces[i]);
      }
    }
    setReferenceFaces(temp);
  };
  const updateProgress = (level, status) => {
    var progress = { ...progressStatus };
    // console.log(progress);
    progress[level].status = status;
    setProgressStatus(progress);
  };
  const closeWebcam = () => {
    if (capturingWebCamForDatabase) setCapturingWebCamForDatabase(false);
    if (capturingWebcamForReference) setCapturingWebCamForReference(false);
  };
  const prepareGridImage = () => {};
  return (
    <div className="App ">
      <div
        id="webcamBackdrop"
        className={
          capturingWebCamForDatabase || capturingWebcamForReference
            ? "d-block"
            : "d-none"
        }
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
        }}
      >
        {capturingWebCamForDatabase || capturingWebcamForReference ? (
          <WebcamComponent
            addImage={handleWebcamInput}
            closeWebcam={closeWebcam}
            processing={processing}
          />
        ) : null}
      </div>
      <div id="navbar" className="shadow bg-dark text-light mb-2">
        Face Recognition Demo
      </div>
      <div className="row mx-0 col-12">
        <div id="databaseGridArea" className="row mx-0 bg-light px-0">
          <div
            className={
              "col-12 text-light " +
              (progressStatus.createDatabase.status === 0
                ? "bg-secondary "
                : "") +
              (progressStatus.createDatabase.status === 1 ? "bg-success " : "")
            }
          >
            Step 1: Create your database
          </div>

          <div className="col-12 px-0">
            <FaceGrid images={faces} removeImage={removeFace} />
          </div>
          <div className="col-12 d-flex justify-content-center">
            <UploadButtonGroup
              label="Import Faces"
              webcamFunction={setCapturingWebCamForDatabase}
              modelLoaded={modelLoaded}
              handleFileInput={handleFileInput}
              target="database"
            />
          </div>
        </div>
        <div id="referenceArea" className="row mx-0 bg-light px-0">
          <div className="col-12 text-light bg-secondary">
            Step 2: Add a reference face
          </div>

          <ReferenceGrid
            images={referenceFaces}
            removeImage={removeReferenceFace}
            active={referenceFace}
            setActive={setReferenceFace}
          />

          <div className="col-12 d-flex justify-content-center pb-2">
            <UploadButtonGroup
              label="Import Faces"
              webcamFunction={setCapturingWebCamForReference}
              modelLoaded={modelLoaded}
              handleFileInput={handleFileInput}
              target="reference"
            />
          </div>
        </div>
        <div id="referenceEntryArea"></div>
        <div id="resultArea" className="row mx-0 bg-light px-0">
          <div className="col-12 text-light bg-secondary">Results</div>
          <div className="col-12 bg-light text-center text-success ">
            Result updates here
          </div>
          <div className="row mx-0 col-12 bg-light">
            <div className="col-4 d-flex mx-0 border justify-content-center">
              <ReferenceImage
                images={referenceFaces}
                index={referenceFace}
                label="Reference Image"
                que="Reference Image Will be displayed here"
              />
            </div>
            <div className="col-4 d-flex mx-0 border justify-content-center">
              {" "}
              <ReferenceImage
                images={referenceFaces}
                index={-1}
                label="Mached Image"
                que="Images Matched Will be displayed here"
              />
            </div>
            <div className="col-4 d-flex justify-content-center border align-items-center">
              <ResultControls progressStatus={progressStatus} />
            </div>
          </div>
        </div>
      </div>
      <img id="hiddenImage" style={{ display: "none" }} src="" />
      <canvas id="hiddenCanvas" style={{ display: "none" }} />
    </div>
  );
}

export default App;
