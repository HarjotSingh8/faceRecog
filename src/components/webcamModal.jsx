import { useState } from "react";

const WebCamModal = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button
        type="button"
        class="btn btn-dark"
        // data-bs-toggle="modal"
        // data-bs-target="#exampleModal"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        {props.children}
      </button>
      <div
        style={{ display: visible ? "block" : "none" }}
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={visible}
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Modal title
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">...</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" class="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default WebCamModal;
