import { useEffect, useState } from "react";
import ImageUploadButton from "./imageUploadButton";
import AddToPhotosIcon from "@material-ui/icons/AddToPhotos";
import DeleteForever from "@material-ui/icons/DeleteForever";
import { LocalConvenienceStoreRounded } from "@material-ui/icons";
import personImage from "../images/stockperson.png";
const DummyGrid = (props) => {
  return (
    <div id="faceGrid" className="row mx-0 col-12 justify-content-center">
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

const ReferenceGrid = (props) => {
  if (props.images.length == 0) return <DummyGrid />;
  return (
    <div id="referenceGrid" className="row mx-0 justify-content-center px-2">
      {props.images.map((obj, index) => (
        <div
          className={
            "my-2 mx-2 shadow px-0  " +
            (props.active == index ? "activeGrid" : "inactiveGrid")
          }
        >
          <DeleteForever
            style={{
              position: "absolute",
              top: "7.5px",
              right: "7.5px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              if (props.active > 0 && props.active >= index)
                props.setActive(props.active - 1);
              if (props.images.length == 1) props.setActive(-1);
              props.removeImage(index);
            }}
          />
          <img
            className="shadow position-absolute top-50 start-50 translate-middle"
            src={obj}
            className={
              props.active == index ? "activeGridImg" : "inactiveGridImg"
            }
            onClick={() => {
              props.setActive(index);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default ReferenceGrid;
