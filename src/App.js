import { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import * as faceapi from "face-api.js";
import WebcamComponent from "./components/webcamComponent";
import ReferenceGrid from "./components/ReferenceGrid";
import UploadButtonGroup from "./components/UploadButtonGroup";
import FaceGrid from "./components/FaceGrid";
import ReferenceImage from "./components/ReferenceImage";
import ResultControls from "./components/ResultControls";
import FoundFace from "./components/FoundFace";

import Tips from "./components/tips";
import { FormatUnderlinedSharp } from "@material-ui/icons";
function App() {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [faces, setFaces] = useState([]);
  const [referenceFaces, setReferenceFaces] = useState([]);
  const [referenceFace, setReferenceFace] = useState(-1);
  const [processing, setProcessing] = useState(false);
  const [queries, setQueries] = useState([]);
  const [imageDimensions, setImageDimensions] = useState([]);
  const [foundFace, setFoundFace] = useState(false);
  const [progressStatus, setProgressStatus] = useState({
    fetchingResults: false,
    inputResource: "",
    inputTarget: "",
    foundFace: false,
    result: false,

    createDatabase: { label: "Create Database", status: 0 },
    uploadReferenceImage: { label: "Upload Reference", status: 0 },
    results: { label: "Results", status: 0 },
  });

  useEffect(() => {
    if (referenceFaces.length > 0 && referenceFace == -1) {
      setReferenceFace(0);
    }
  }, [referenceFaces]);
  /**
   * Load Model
   */
  useEffect(() => {
    async function loadModel() {
      const MODEL_URL = process.env.PUBLIC_URL + "/models";
      await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
      setModelLoaded(true);
    }
    loadModel();
  }, []);

  /**
   * Polling Function
   */
  useEffect(() => {
    async function poll() {
      let temp = [...queries];
      for (let i = 0; i < temp.length; i++) {
        if (!temp[i].result) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          let res = await fetch(
            "https://api.skylarklabs.ai/face-recognition/" +
              temp[i].query +
              "?key=662b2a0adeb3bbc7388bb274fc735c98648f0c70e6ebde9aebb9b56784f05d33",
            {
              method: "GET",
            }
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              return data;
            });
          if (res.status == "success") {
            temp[i].result = res;
            temp[i].result.json = JSON.parse(temp[i].result.response_json);
            setQueries(temp);
          } else if (res.status == "pending") {
            setQueries([...temp]);
          } else {
            temp[i].result = "failed";
            setQueries(temp);
          }
        }
      }
    }
    if (
      queries.length > 0 &&
      (queries[queries.length - 1].result.status == "success" ||
        queries[queries.length - 1].result.status == "failed")
    ) {
      setProgressStatus({
        ...progressStatus,
        result: true,
      });
    } else poll();
  }, [queries]);

  /**
   * Handles response from the queries
   * checks if a matched face is found
   */
  useEffect(() => {
    if (progressStatus.result == true && foundFace === false) {
      let active = null;
      for (let i = 0; i < queries.length; i++) {
        console.log("here");
        console.log(queries[i].result.json.recognitions);
        for (let j = 0; j < queries[i].result.json.recognitions.length; j++) {
          console.log(queries[i].result.json.recognitions[j]);
          if (queries[i].result.json.recognitions[j][0] != -1) {
            if (
              active == null ||
              active.prob < queries[i].result.json.recognitions[j][1]
            ) {
              active = {};
              active.prob = queries[i].result.json.recognitions[j][1];
              active.coordinates =
                queries[i].result.json.query_detections[j].coordinates;
              active.image = queries[i].img;
            }
          }
        }
      }
      console.log(active);
      if (active != null) {
        setFoundFace(active);
        setProgressStatus({ ...progressStatus, result: true });
      }
    }
  }, [progressStatus]);
  console.log(foundFace);
  async function postRequest(image) {
    let c = document.getElementById("hiddenCanvas");
    let ctx = c.getContext("2d");
    let hiddenImage = document.getElementById("hiddenImage");
    let hiddenImage2 = document.getElementById("hiddenImage2");
    var data = new FormData();
    hiddenImage.src = image;
    let imageBlob = await new Promise((resolve) =>
      c.toBlob(resolve, "image/png")
    );
    data.set("query_image", imageBlob, "file2.png");
    c.width = 180;
    c.height = 320;
    hiddenImage.src = referenceFaces[referenceFace];
    setTimeout(() => {}, 100);
    ctx.drawImage(hiddenImage, 0, 0, 180, 320);
    let imageBlob1 = await new Promise((resolve) =>
      c.toBlob(resolve, "image/png")
    );

    data.set("target_image", imageBlob1, "file1.png");
    data.set(
      "key",
      "662b2a0adeb3bbc7388bb274fc735c98648f0c70e6ebde9aebb9b56784f05d33"
    );
    hiddenImage.src = URL.createObjectURL(imageBlob);
    return fetch("https://api.skylarklabs.ai/face-recognition/", {
      method: "POST",
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // temp[i].query = data.id;
        // setQueries(temp);
        return data.id;
      });
  }
  console.log(queries);

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
    setProcessing(true);
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
    if (progressStatus.inputTarget == "database") {
      setFaces([...faces, ...newFaces]);
      setProgressStatus({
        ...progressStatus,
        inputResource: "",
        inputTarget: "",
      });
    } else if (progressStatus.inputTarget == "reference") {
      setReferenceFaces([...referenceFaces, ...newFaces]);
      setProgressStatus({
        ...progressStatus,
        inputResource: "",
        inputTarget: "",
      });
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
    if (progressStatus.active_reference === index) {
      setProgressStatus({ ...progressStatus, active_reference: -1 });
    } else if (progressStatus.active_reference > index) {
      setProgressStatus({
        ...progressStatus,
        active_reference: progressStatus.active_reference - 1,
      });
    }
    setReferenceFaces(temp);
  };

  const closeWebcam = () => {
    console.log("yes");
    if (progressStatus.inputResource === "camera")
      setProgressStatus({
        ...progressStatus,
        inputResource: "",
        inputTarget: "",
      });
  };
  const startWebCam = (target) => {
    setProgressStatus({
      ...progressStatus,
      inputResource: "camera",
      inputTarget: target,
    });
  };

  /**
   * prepares a grid for the target image (query)
   *
   */
  async function prepareGridImage() {
    //prepares grid for query and sends request
    var c = document.getElementById("hiddenCanvas");
    var hiddenImage = document.getElementById("hiddenImage2");
    var ctx = c.getContext("2d");
    //compute size of canvas
    var length_in_images = Math.ceil(Math.sqrt(faces.length));
    var num_grids = 1;
    if (length_in_images > 12) {
      num_grids = Math.ceil(faces.length / 144);
      length_in_images = 12;
    }
    c.width = length_in_images * 90;
    c.height = length_in_images * 160;
    setImageDimensions([length_in_images * 90, length_in_images * 160]);
    let q = [];
    for (let i = 0; i < num_grids; i++) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, length_in_images * 90, length_in_images * 160);
      for (
        let j = 0;
        j < length_in_images * length_in_images &&
        i * length_in_images + j < faces.length;
        j++
      ) {
        let index = i * length_in_images * length_in_images + j;
        hiddenImage.src = faces[index];
        ctx.drawImage(
          hiddenImage,
          (index % length_in_images) * 90,
          Math.floor(j / length_in_images) * 160,
          90,
          160
        );
      }
      var im = c.toDataURL();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let reqId = await postRequest(im);
      q.push({
        img: im,
        query: reqId,
        result: false,
        index: i,
      });
    }
    setQueries(q);
  }
  function reset() {
    setProgressStatus({ ...progressStatus, result: false });
    setFoundFace(false);
    setQueries([]);
  }
  return (
    <div className="App ">
      <div
        id="webcamBackdrop"
        className={
          progressStatus.inputResource === "camera" ? "d-block" : "d-none"
        }
        style={{
          width: window.innerWidth,
          height: window.innerHeight,
        }}
      >
        {progressStatus.inputResource === "camera" ? (
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
              (faces.length > 0 ? "bg-success " : "bg-secondary")
            }
          >
            Step 1: Create your database
          </div>
          <div className="col-12 px-0">
            <FaceGrid
              result={progressStatus.result}
              images={faces}
              removeImage={removeFace}
            />
          </div>
          {/* <Tips
            tips={[
              {
                condition: faces.length == 0,
                text: "Faces can be added from a file or the database",
              },
              {
                condition: faces.length == 1,
                text: "Database can have mutiple faces",
              },
            ]}
          /> */}
          <div className="col-12 d-flex justify-content-center">
            <UploadButtonGroup
              label="Import Faces"
              webcamFunction={() => startWebCam("database")}
              modelLoaded={modelLoaded}
              handleFileInput={(arg) => handleFileInput(arg, "database")}
              target="database"
              processing={processing}
            />
          </div>
        </div>
        <div id="referenceArea" className="row mx-0 bg-light px-0">
          <div
            className={
              "col-12 text-light " +
              (referenceFaces.length > 0 ? "bg-success" : "bg-secondary")
            }
          >
            Step 2: Add a reference face
          </div>
          <ReferenceGrid
            result={progressStatus.result}
            images={referenceFaces}
            removeImage={removeReferenceFace}
            active={referenceFace}
            setActive={setReferenceFace}
          />
          {/* <Tips
            tips={[
              {
                condition: referenceFaces.length == 0,
                text: "Faces can be added from a file or the database",
              },
            ]}
          /> */}
          <div className="col-12 d-flex justify-content-center pb-2">
            <UploadButtonGroup
              label="Import Faces"
              webcamFunction={() => startWebCam("reference")}
              modelLoaded={modelLoaded}
              handleFileInput={(arg) => handleFileInput(arg, "reference")}
              target="reference"
              processing={processing}
            />
          </div>
        </div>
        <div id="referenceEntryArea"></div>
        <div id="resultArea" className="row mx-0 bg-light px-0">
          <div
            className={
              "col-12 text-light " + (foundFace ? "bg-success" : "bg-secondary")
            }
          >
            Results
          </div>
          <Tips
            tips={[
              {
                condition: !progressStatus.result,
                text: "Results will be displayed here",
              },
              {
                condition: foundFace,
                text: "Found a Matching face, to run another query press the button below",
              },
              {
                condition: !foundFace,
                text: "No face matched, try updating database or with better images",
              },
            ]}
          />
          <div className="row mx-0 col-12 bg-light">
            <div className="col-4 d-flex mx-0 justify-content-center">
              <ReferenceImage
                images={referenceFaces}
                index={referenceFace}
                label="Reference Image"
                que="Reference Image Will be displayed here"
              />
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
              <ResultControls
                progressStatus={progressStatus}
                numFaces={faces.length}
                numReferences={referenceFaces.length}
                startQuery={() => {
                  prepareGridImage();
                }}
                foundFace={foundFace}
                inProgress={processing}
                reset={reset}
              />
              {/* <button onClick={() => prepareGridImage()}>prepare</button> */}
            </div>
            <div className="col-4 d-flex mx-0 justify-content-center">
              <FoundFace
                image={foundFace}
                label="Mached Image"
                que="Images Matched Will be displayed here"
                localDimensions={imageDimensions}
                faces={faces}
              />
            </div>
          </div>
        </div>
      </div>
      <img id="hiddenImage" style={{ display: "none" }} src="" />
      <img id="hiddenImage2" style={{ display: "none" }} src="" />
      <canvas id="hiddenCanvas" style={{ display: "none" }} />
      <canvas id="hiddenCanvas2" style={{ display: "none" }} />
    </div>
  );
}

export default App;
