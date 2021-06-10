import { useEffect, useState } from "react";
import ImageUploadButton from "./imageUploadButton";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import DeleteForever from "@material-ui/icons/DeleteForever";

const Selector = (props) => {
  return (
    <div id="imageCarouselSelectorMain">
      <div id="imageCarouselSelectorImages">
        {props.images.map((obj, index) => (
          <img
            src={obj.url}
            onClick={() => {
              props.setActive(index);
            }}
          />
        ))}
      </div>
      <ImageUploadButton addImage={props.addImage} id="imagesCarouselAddButton">
        {/* <div>+</div> */}
        <AddToPhotosIcon />
      </ImageUploadButton>
    </div>
  );
};

const ImageCarousel = (props) => {
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
  const [active, setActive] = useState(0);
  useEffect(() => {}, [props.images]);
  console.log(props);
  return (
    <div id="ImageCarouselMain" className="">
      {/** Active image here */}
      <div className="activeImage">
        {props.images.length > 0 ? (
          <div style={{ position: "relative" }}>
            <DeleteForever
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
            />
            <img
              id="activeImage"
              className="imageCarouselMainImage"
              src={props.images[active].url}
            />
          </div>
        ) : (
          <div>Add Images to view them here</div>
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

export default ImageCarousel;
