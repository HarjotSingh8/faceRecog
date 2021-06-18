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
  const [index, setIndex] = useState(null);
  const [faceCenter, setCenter] = useState(null);
  useEffect(() => {
    if (props.image != false && index == null) {
      setImg(props.image.image);
      let imagecomp = document.getElementById("faceImage");
      imagecomp.crossOrigin = "Anonymous";
      imagecomp.src = props.image.image;
      imagecomp.onload = function () {
        let width = imagecomp.naturalWidth;
        let height = imagecomp.naturalHeight;
        let centerOfImage = [
          (props.image.coordinates[0] + props.image.coordinates[2]) / 2,
          (props.image.coordinates[1] + props.image.coordinates[3]) / 2,
        ];
        var imagesInRow = Math.floor(props.localDimensions[1] / 160);
        var indx =
          Math.floor((imagesInRow * centerOfImage[1]) / height) * imagesInRow +
          Math.floor((imagesInRow * centerOfImage[0]) / width);
        console.log(indx);
        setIndex(indx);
      };
    } else if (props.image === false) {
      setImg(false);
      setIndex(null);
    }
  }, [props.image]);

  return (
    <>
      <div
        className="shadow"
        src={"url(" + (index != null ? props.faces[index] : "") + ")"}
        style={{
          position: "absolute",
          width: "180px",
          height: "320px",
          display: "block",
          backgroundImage:
            "url(" + (index != null ? props.faces[index] : "") + ")",
          backgroundSize: "cover",
          borderRadius: "15px",
        }}
      />
      <img id="faceImage" style={{ display: "none" }}></img>
      {img ? (
        <div className="col-12 row mx-0 justify-content-center align-items-center">
          <div className="col-12 row mx-0 justify-content-center"></div>
          <div className="col-12 text-center">Matched Imaged</div>
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
};
export default FoundFace;
