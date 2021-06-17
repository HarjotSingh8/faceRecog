import { useEffect, useState } from "react";
import stockPhoto from "../images/stockperson.png";
function getImageDimensions(file) {
  return new Promise(function (resolved, rejected) {
    var i = new Image();
    i.onload = function () {
      resolved({ w: i.width, h: i.height });
    };
    i.src = file;
  });
}
const FoundFace = (props) => {
  const [img, setImg] = useState(false);
  const [index, setIndex] = useState(false);
  const [faceCenter, setCenter] = useState(null);
  useEffect(() => {
    if (props.image != false) {
      setImg(props.image.image);
      let imagecomp = document.getElementById("faceImage");
      imagecomp.crossOrigin = "Anonymous";
      imagecomp.src = props.image.image;
      imagecomp.onload = function () {
        let width = imagecomp.naturalWidth;
        let height = imagecomp.naturalHeight;
        console.log(height);
        console.log(width);

        let centerOfImage = [
          (props.image.coordinates[0] + props.image.coordinates[2]) / 2,
          (props.image.coordinates[1] + props.image.coordinates[3]) / 2,
        ];
        var imagesInRow = Math.floor(props.localDimensions[1] / 160);
        console.log(imagesInRow);
        console.log(centerOfImage);
        var indx =
          Math.floor((imagesInRow * centerOfImage[1]) / height) * imagesInRow +
          Math.floor((imagesInRow * centerOfImage[0]) / width);
        console.log(centerOfImage[0] / width);
        console.log(indx);
        console.log(getImageDimensions(props.image.image));

        setIndex(indx);
        console.log(props);
        console.log(indx);
      };
    } else if (props.image == false) {
      setImg(false);
    }
  }, [props.image]);

  return (
    <>
      {/* <canvas id="faceCanvas" style={{ display: "block" }}></canvas> */}
      {/* <div
        className="shadow"
        style={{
          position: "absolute",
          width: "180px",
          height: "320px",
          display: "block",
          background: "url(" + (index ? props.faces[index] : "") + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderRadius: "15px",
        }}
      ></div> */}
      <div
        className="shadow"
        src={"url(" + (index ? props.faces[index] : "") + ")"}
        style={{
          position: "absolute",
          width: "180px",
          height: "320px",
          display: "block",
          backgroundImage: "url(" + (index ? props.faces[index] : "") + ")",
          backgroundSize: "cover",
          borderRadius: "15px",
        }}
      />
      <img
        id="faceImage"
        style={{ display: "none" }}
        // onLoad={() => {
        //   adjustDimensions();
        // }}
      ></img>
      <img
        id="matchedImage"
        // className="d-inline-flex"

        style={{ position: "fixed", borderRadius: "15px", display: "none" }}
        src={img}
      ></img>
      {img ? (
        <div className="col-12 row mx-0 justify-content-center align-items-center">
          <div className="col-12 row mx-0 justify-content-center">
            <canvas
              id="faceCanvas"
              className="mx-0 px-0 my-0"
              style={{
                width: props.image.coordinates[2] + "px",
                height: props.image.coordinates[3] + "px",
              }}
              // style={{ display: "block" }}
            ></canvas>
          </div>
          <div className="col-12 text-center">Matched Imaged</div>

          {/* <div className="text-center">Reference Image</div> */}
        </div>
      ) : (
        <div>
          <div
            className="d-inline-flex"
            style={{
              borderRadius: "15px",
              backgroundImage: "url(" + stockPhoto + ")",
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "320px",
              width: "180px",
            }}
            // src={props.images[props.index]}
          >
            <div
              className="d-flex bd-blur shadow text-dark bold text-center justify-content-center align-items-center"
              style={{ height: "320px", width: "180px", fontWeight: "bold" }}
            >
              {props.que}
            </div>
          </div>
        </div>
      )}
    </>
  );
  //}
  return (
    <div>
      <div
        className="d-inline-flex"
        style={{
          borderRadius: "15px",
          backgroundImage: "url(" + stockPhoto + ")",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "320px",
          width: "180px",
        }}
        src={props.images[props.index]}
      >
        <div
          className="d-flex bd-blur shadow text-dark bold text-center justify-content-center align-items-center"
          style={{ height: "320px", width: "180px", fontWeight: "bold" }}
        >
          {props.que}
        </div>
      </div>
    </div>
  );
};
export default FoundFace;
