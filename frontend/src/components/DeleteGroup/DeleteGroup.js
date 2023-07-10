import React from "react";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteGroupThunk } from "../../store/groups";
import { useDispatch } from "react-redux";

const DeleteGroup = ({ groupDelete, setDeleteGroup }) => {
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleDelete = async () => {
    if (setDeleteGroup) {
      setDeleteGroup(true);
    }
    const response = await dispatch(deleteGroupThunk(groupDelete));
    console.log(groupDelete)
    closeModal();
    history.push("/groups");
  };

  const handlenotDelete = () => {
    console.log("Group not deleted");
    closeModal();
  };

  return (
    <div className="confirmation-modal">
      <h2>Confirm Delete</h2>
      <p>
        Are you sure you want to delete this group? :( It will be missed
      </p>
      <button
        onClick={handleDelete}
        className="confirmation-modal__delete-btn"
      >
        Yes
      </button>
      <button
        onClick={handlenotDelete}
        className="confirmation-modal__keep-btn"
      >
        No
      </button>
    </div>
  );
};

export default DeleteGroup;
