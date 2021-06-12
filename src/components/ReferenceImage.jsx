import stockPhoto from "../images/stockperson.png";
const ReferenceImage = (props) => {
  if (props.index != -1) {
    return (
      <div>
        <img
          className="d-inline-flex"
          width="180px"
          height="320px"
          style={{ borderRadius: "15px" }}
          src={props.images[props.index]}
        ></img>
        <div className="text-center">Reference Image</div>
      </div>
    );
  }
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
export default ReferenceImage;
