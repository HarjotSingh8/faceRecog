import { useEffect } from "react";

const ImageUploadButton = (props) => {
  return (
    <div style={{ display: "inline-flex" }}>
      <label
        className={props.input_id + "Label col-12"}
        htmlFor={props.input_id}
        key={props.input_id}
      >
        {props.children}
      </label>
      <input
        id={props.input_id}
        style={{ display: "none" }}
        name={props.input_id}
        type="file"
        accept="image/*"
        onClick={(e) => {
          e.target.value = "";
          console.log(e.target.files);
        }}
        onChange={(e) => {
          if (props.modelLoaded) {
            //console.log(e);
            let addedImage = URL.createObjectURL(e.target.files[0]);
            console.log(e.target.files);
            props.addImage(addedImage, props.target);
          }
        }}
      />
    </div>
  );
};
export default ImageUploadButton;
