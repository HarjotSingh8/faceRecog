import { useEffect, useState } from "react";
import ImageUploadButton from "./imageUploadButton";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import DeleteForever from "@material-ui/icons/DeleteForever";
import { LocalConvenienceStoreRounded } from "@material-ui/icons";
import personImage from "../images/stockperson.png";

const DummyCarousel = (props) => {
  return (
    <div id="faceCarouselRow" className="row justify-content-center">
      <div
        className="d-flex bg-light shadow my-2 mx-2 px-0"
        style={{
          backgroundImage: "url(" + personImage + ")",
        }}
      ></div>
      <div
        className="d-flex bg-light text-dark text-center shadow my-2 mx-2 px-0"
        style={{
          backgroundImage: "url(" + personImage + ")",
        }}
      >
        <div
          className="d-flex muted px-0 align-items-center bd-blur"
          style={{ fontWeight: "bold" }}
        >
          Add Images to see faces here
        </div>
      </div>
      <div
        className="d-flex bg-light shadow my-2 mx-2 px-0"
        style={{
          backgroundImage: "url(" + personImage + ")",
        }}
      ></div>
    </div>
  );
};

const ScrollingCarousel = (props) => {
  const [scroll, setScroll] = useState(false);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    let t = null;
    t = setTimeout(() => {
      if (scroll) setOffset(offset + 1);
    });
    return clearTimeout(t);
  }, [scroll]);
  let timer = null;
  //  let timeout = null;
  console.log(scroll);
  if (props.images.length == 0) return <DummyCarousel />;
  return (
    <div
      id="faceCarouselRow"
      className="row mx-0 px-0"
      onMouseEnter={() => {
        clearTimeout(timer);
        setScroll(true);
      }}
      onMouseLeave={() => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          timer = null;
          setScroll(false);
        }, 1000);
      }}
    >
      <div className="spacerCarouselRow" style={{ width: "10px" }}></div>
      {props.images.map((obj, index) => (
        <div className="my-2 mx-2 shadow px-0">
          <DeleteForever
            style={{
              position: "absolute",
              top: "7.5px",
              right: "7.5px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              //   if (active > 0) setActive(active - 1);
              //   if (props.images.length == 1) setActive(-1);
              props.removeImage(index);
            }}
          />
          <img src={obj} />
        </div>
      ))}
      <div className="spacerCarouselRow" style={{ width: "10px" }}></div>
    </div>
  );
};

export default ScrollingCarousel;
