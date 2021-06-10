const ProgressIndicator = (props) => {
  /**
   * props
   * States
   * current state
   */
  const determineClass = (obj) => {
    return "progressIndicator " + props.states[obj].status == 0
      ? "progressIndicatorInactive"
      : "" + props.states[obj].status == 1
      ? "progressIndicatorActive"
      : "" + props.states[obj].status == -1
      ? "progressIndicatorDanger"
      : "";
  };
  return (
    <div>
      {Object.keys(props.states).map((obj, index) => (
        <div
          className={
            "progressIndicator " +
            (props.states[obj].status == 0 ? "progressIndicatorInactive" : "") +
            (props.states[obj].status == 1 ? "progressIndicatorActive" : "") +
            (props.states[obj].status == -1 ? "progressIndicatorDanger" : "")
          }
          key={"state" + index}
        >
          {props.states[obj].label}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
