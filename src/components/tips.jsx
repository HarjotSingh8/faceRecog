import { Info } from "@material-ui/icons";
const Tips = (props) => {
  for (let tip in props.tips) {
    if (props.tips[tip].condition)
      return (
        <div className="col-12 d-flex text-muted justify-content-center">
          <Info /> &nbsp;{props.tips[tip].text}
        </div>
      );
  }
  return null;
};
export default Tips;
