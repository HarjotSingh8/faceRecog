import DeleteForever from "@material-ui/icons/DeleteForever";
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

const FaceGrid = (props) => {
  if (props.images.length == 0) return <DummyGrid />;
  return (
    <div id="faceGrid" className="row mx-0 justify-content-center px-2">
      {props.images.map((obj, index) => (
        <div key={"face" + index} className="my-2 mx-2 shadow px-0">
          <DeleteForever
            style={{
              position: "absolute",
              top: "7.5px",
              right: "7.5px",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => {
              if (props.result !== true) props.removeImage(index);
            }}
          />
          <img src={obj} />
        </div>
      ))}
    </div>
  );
};

export default FaceGrid;
