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
  } else if (props.progressStatus.results.status == -1) {
    //can evaluate results
    return <div>Match Results</div>;
  } else if (props.progressStatus.results.status == 0) {
    //evaluating results
    return <div></div>;
  } else {
    //showing results
    return <div></div>;
  }
};
export default ResultControls;
