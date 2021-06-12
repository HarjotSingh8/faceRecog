import { useEffect, useState } from "react";
import stockPhoto from "../images/stockperson.png";
const FoundFace = (props) => {
  const [img, setImg] = useState(false);
  useEffect(() => {
    if (props.image != false) {
      setImg(props.image.image);
    } else if (props.image == false) {
      setImg(false);
    }
  }, [props.image]);
  //if (props.index != -1) {
  const [transformed, setTransformed] = useState(false);

  useEffect(() => {
    function transforming() {
      if (img) {
        console.log("laodedimage");
        let canvas = document.getElementById("faceCanvas");
        let imagecomp = document.getElementById("faceImage");
        imagecomp.crossOrigin = "Anonymous";
        imagecomp.src = props.image.image;
        imagecomp.onload = function () {
          console.log(canvas);
          let ctx = canvas.getContext("2d");
          let x = props.image.coordinates[2] / 2;
          let y = props.image.coordinates[3] / 2;
          if (x > (y * 9) / 16) {
            x = (y * 9) / 16;
          } else {
            y = (x * 16) / 9;
          }
          canvas.width = x;
          canvas.height = y;

          console.log(imagecomp.actualWidth);
          ctx.drawImage(
            imagecomp,
            -props.image.coordinates[0],
            -props.image.coordinates[1],
            props.image.coordinates[2],
            props.image.coordinates[3]
          );
        };
        setTransformed(true);
        // let t = canvas.toDataURL();
        // setImg(t);
      }
    }

    setTimeout(() => {
      transforming();
    }, 1000);
    //   }
  }, [img]);
  //   useEffect(() => {
  //     if (transformed) {
  //       console.log("transofrmed");
  //       let canvas = document.getElementById("faceCanvas");
  //       let imagecomp = document.getElementById("faceImage");
  //       let t = canvas.toDataURL("image/png");
  //       setImg(t);
  //     }
  //   }, [transformed]);
  return (
    <>
      {/* <canvas id="faceCanvas" style={{ display: "block" }}></canvas> */}
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
