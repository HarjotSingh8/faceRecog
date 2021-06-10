import { useEffect, useState } from "react";
import ImageUploadButton from "./imageUploadButton";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import DeleteForever from "@material-ui/icons/DeleteForever";
import { LocalConvenienceStoreRounded } from "@material-ui/icons";

const Selector = (props) => {
  console.log(props.active);
  return (
    <div id="faceCarouselSelectorImages">
      {props.images.map((obj, index) => (
        <img
          className={"" + (props.active === index ? "active" : "")}
          src={obj.canvas}
          onClick={() => {
            props.setActive(index);
          }}
        />
      ))}
    </div>
  );
};

const ReturnCanvas = (props) => {
  return props.canvas;
};

const FaceCarousel = (props) => {
  /**
   * props structure
   * Images
   *
   * todo
   * [] ability to delete image
   * [] handle empty images array
   * []
   */

  /**
   * active
   * Index of active image
   * null when no image present
   */
  const [active, setActive] = useState(-1);
  //   useEffect(() => {
  //     if (active !== -1) {
  //       const box = { x: 50, y: 50, width: 100, height: 100 };
  //       // see DrawBoxOptions below
  //       const drawOptions = {
  //         label: "Hello I am a box!",
  //         lineWidth: 2,
  //       };
  //       const drawBox = new props.faceapi.draw.DrawBox(box, drawOptions);
  //       drawBox.draw(document.getElementById("activeFace"));
  //     }
  //   }, [active]);
  useEffect(() => {
    if (active == -1 && props.images.length > 0) {
      setActive(0);
    }
  }, [props.images]);
  console.log(props);

  return (
    <div id="ImageCarouselMain" className="">
      {/** Active image here */}
      <div className="activeImage">
        {props.images.length > 0 && active !== -1 ? (
          <div style={{ position: "relative" }}>
            {/* <DeleteForever
              style={{
                position: "absolute",
                top: "0px",
                right: "0px",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => {
                setActive(active - 1);
                props.removeImage(active);
              }}
            /> */}
            {/* <img
              id="activeImage"
              className="imageCarouselMainImage"
              src={props.images[active].url}
            /> */}
            {/* <canvas width="200px" height="200px" id="activeFace" /> */}
            <img
              className="imageCarouselMainImage"
              src={props.images[active].canvas}
            />
          </div>
        ) : (
          <div>Add Images to view faces here</div>
        )}
      </div>

      {/** Selector here */}
      <Selector
        addImage={props.addImage}
        images={props.images}
        active={active}
        setActive={setActive}
      />
    </div>
  );
};

export default FaceCarousel;
