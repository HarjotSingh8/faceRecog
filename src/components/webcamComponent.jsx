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
    //var imageSrc = document.getElementById("webcam").getScreenshot();
    ///props.addImage(imageSrc);
    setImage(imageSrc);
  }, [webcamRef]);

  return (
    <>
      <Webcam
        mirrored={true}
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      />
      <button onClick={() => capture()}>Capture photo</button>
    </>
  );
};
export default WebcamComponent;
