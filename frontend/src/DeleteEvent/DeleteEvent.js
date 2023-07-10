import { useHistory } from "react-router-dom";
import { useModal } from "../context/Modal";
import { deleteEventThunk as deleteEvent } from "../store/events";
import { useDispatch } from "react-redux";
import React from "react";
const DeleteEvent = ({ eventToDelete, setIsDeletingEvent, eventGroupId }) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = async () => {
    if (setIsDeletingEvent) {
      setIsDeletingEvent(true);
    }

    const response = await dispatch(deleteEvent(eventToDelete));
    closeModal();
    history.push(`/groups/${eventToDelete.groupId}`);
  };
  console.log(eventToDelete);
  const handleKeep = () => {
    console.log("Events kept!");
    closeModal();
  };
  if (eventToDelete) {
    return (
      <div className="confirm-delete-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this Event?</p>
        <button
          onClick={handleDelete}
          className="confirm-delete-modal__delete-btn"
        >
          Yes (Delete Event)
        </button>
        <button onClick={handleKeep} className="confirm-delete-modal__keep-btn">
          No (Keep Event)
        </button>
      </div>
    );
  }
};
export default DeleteEvent;
