import { AddAPhoto, AddToPhotos } from "@material-ui/icons";
import ImageUploadButton from "./imageUploadButton";
const UploadButtonGroup = (props) => {
  return (
    <div className="btn-group pb-2">
      <ImageUploadButton
        addImage={props.handleFileInput}
        target={props.target}
        modelLoaded={props.modelLoaded}
        input_id={props.target + "Image"}
      >
        <div
          className={
            "col-12 btn btn-success" + (props.processing ? "disabled" : "")
          }
          style={{
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        >
          <AddToPhotos /> from file
        </div>
      </ImageUploadButton>
      <button className="col btn btn-success disabled">{props.label}</button>
      <button
        className={
          "col btn btn-success " + (props.processing ? "disabled" : "")
        }
        onClick={() => {
          props.webcamFunction(true);
        }}
      >
        webcam <AddAPhoto />
      </button>
    </div>
  );
};
export default UploadButtonGroup;
