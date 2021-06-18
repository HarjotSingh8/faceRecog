const ResultControls = (props) => {
  if (props.numFaces == 0 || props.numReferences == 0) {
    return (
      <div className="btn btn-danger disabled">
        Complete Steps 1 & 2 to Match Results
      </div>
    );
  }
  if (props.progressStatus.result == false) {
    return (
      <div className="row mx-0 justify-content-center">
        <button
          className="btn btn-secondary"
          onClick={() => props.startQuery()}
        >
          Check For Matches
        </button>
      </div>
    );
  }
  if (props.progressStatus.result) {
    return (
      <div className="row mx-0 justify-content-center">
        <div className="row mx-0 justify-content-center">
          {props.foundFace ? (
            <button className="btn btn-success disabled">Match Found</button>
          ) : (
            <button className="btn btn-danger disabled">Match not Found</button>
          )}
        </div>
        <div className="row mx-0 my-3 justify-content-center">
          <button className="btn btn-success " onClick={() => props.reset()}>
            Try Another Query
          </button>
        </div>
      </div>
    );
  }

  if (
    props.progressStatus.createDatabase.status == 0 ||
    props.progressStatus.uploadReferenceImage.status == 0
  ) {
    return (
      <div className="btn btn-danger disabled">
        Complete Steps 1 & 2 to Match Results
      </div>
    );
  } else if (props.progressStatus.results.status == 0) {
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
