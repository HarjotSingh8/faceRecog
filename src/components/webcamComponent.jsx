import { CameraAlt, Close } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
const WebcamComponent = (props) => {
  const webcamRef = React.useRef(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (image != null) {
      props.addImage(image);
    }
  }, [image]);
  const capture = React.useCallback(() => {
    var imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  return (
    <div
      id="webcamModal"
      className="d-inline-flex justify-content-center shadow position-absolute top-50 start-50 translate-middle"
      style={{ position: "relative" }}
    >
      <Webcam
        style={{ borderRadius: "15px", zIndex: 12 }}
        mirrored={true}
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <div
        className="text-white position-absolute top-50 start-50 translate-middle"
        style={{ zIndex: 11 }}
      >
        Loading{" "}
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        ></span>
      </div>
      <button
        onClick={() => capture()}
        className={"btn btn-success " + (props.processing ? "disabled" : "")}
        style={{ position: "absolute", bottom: "10px", zIndex: 13 }}
      >
        {props.processing == false ? (
          <>
            Capture photo <CameraAlt />
          </>
        ) : (
          <>
            processing{" "}
            <span
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          </>
        )}
      </button>
      <button
        style={{ position: "absolute", top: "10px", right: "10px", zIndex: 13 }}
        onClick={() => {
          props.closeWebcam();
        }}
        className="btn btn-danger"
      >
        <Close />
      </button>
    </div>
  );
};
export default WebcamComponent;
