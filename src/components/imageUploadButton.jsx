import { useEffect } from "react";

const ImageUploadButton = (props) => {
  useEffect(() => console.log(props), []);
  return (
    <div style={{ display: "inline-flex" }}>
      <label className={props.id + "Label"} htmlFor={props.id} key={props.id}>
        {props.children}
      </label>
      <input
        id={props.id}
        style={{ display: "none" }}
        name={props.id}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (props.modelLoaded) props.addImage(e);
        }}
      />
    </div>
  );
};
export default ImageUploadButton;
