const ResultControls = (props) => {
  if (
    props.progressStatus.createDatabase.status == 0 ||
    props.progressStatus.uploadReferenceImage.status == 0
  ) {
    //cannot evaluate results
    return (
      <div className="btn btn-danger disabled">
        Complete Steps 1 & 2 to Match Results
      </div>
    );
  } else if (props.progressStatus.results.status == 0) {
    //can evaluate results
    return (
      <button onClick={() => props.startQuery()}>Check For Matches</button>
    );
  } else if (props.foundFace) {
    return (
      <button className="btn btn-success" onClick={() => props.startQuery()}>
        Found a Match
      </button>
    );
  } else if (props.inProgress) {
    return <button className="btn btn-success"> Loading</button>;
  } else return <button className="btn btn-danger">No Face Found</button>;
};
export default ResultControls;
