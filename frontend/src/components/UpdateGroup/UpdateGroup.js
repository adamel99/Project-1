import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./UpdateGroup.css";
import {
  updateGroupThunk as updateGroup,
  ViewSingleGroupThunk as getSingleGroup,
} from "../../store/groups";

const UpdateGroup = () => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const group = useSelector((state) => state.groups.singleGroup);
  const { groupId } = useParams();
  const [description, setDescription] = useState(group.about);
  const [location, setLocation] = useState(`${group.city}, ${group.state}`);
  const dispatch = useDispatch();
  const [name, setName] = useState(group.name);
  const validation = {};
  const [errors, setErrors] = useState({});

  const [groupType, setGroupType] = useState(group.type);
  const [groupStatus, setGroupStatus] = useState(
    group.private ? "Private" : "Public"
  );

  useEffect(() => {
    dispatch(getSingleGroup(groupId));
  }, [dispatch, groupId]);

  if (!group.id) {
    return null;
  }

  if (user === null || user.id !== group.organizerId) {
    history.push("/");
  }

  const handleGroupSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      validation.location = "Location is required";
    }
    if (!name) {
      validation.name = "Name is required";
    }
    if (description.length < 50) {
      validation.description =
        "Description must be at least 50 characters long";
    }
    if (!groupType || groupType === "(select one)") {
      validation.groupType = "Group Type is required";
    }
    if (!groupStatus || groupStatus === "(select one)") {
      validation.groupStatus = "Visibility Type is required";
    }
    if (Object.keys(validation).length) {
      setErrors(validation);
      return;
    }

    const [city, state] = location.split(", ");

    const updatedGroup = {
      id: group.id,
      name,
      about: description,
      type: groupType,
      private: groupStatus === "Private" ? true : false,
      city,
      state,
    };

    const res = await dispatch(updateGroup(updatedGroup, groupId));

    if (res.id) {
      history.push(`/groups/${res.id}`);
    } else {
      setErrors(res.errors);
    }
  };

  return (
    <div className="update-container">
      <section className="update-heading">
        <h3>UPDATE YOUR GROUP'S INFO</h3>
      </section>
      <section className="update-location">
        <h3>Group Location</h3>
        <p>
          Meetup groups meet locally, in person and online. We'll connect you
          with people in your area, and more can join you online.
        </p>
        <input
          className="update-location-input"
          placeholder="City, State"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        {errors.location && <p error={errors.location} />}
      </section>
      <section className="update-group-name-input-section">
        <h3>Group Name</h3>
        <p>
          Choose a name that will give peoplea clear idea of what the group is about. Feel free to get creative!
        </p>
        <input
          className="update-group-name-input"
          placeholder="Group name?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p error={errors.name} />}
      </section>
      <section className="update-group-desc-section">
        <h3>Group Description</h3>
        <ol className="update-group-desc">
          <li>What crowd would you want to attract?</li>
          <li>What do your events consist of?</li>
        </ol>
        <textarea
          placeholder="Please write at least 50 characters"
          cols="35"
          rows="10"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {errors.description && <p error={errors.description} />}
      </section>
      <section className="update-acc-section">
        <h3>Accessibility</h3>
        <div className="update-group-type-container">
          <p>Online or In-person</p>
          <select
            className="update-group-type-input"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
          >
            <option value="(select one)">(Choose one)</option>
            <option value="online">Online</option>
            <option value="in person">In Person</option>
          </select>
          {errors.groupType && <p error={errors.groupType} />}
        </div>
        <div className="update-group-status-container">
          <p>Private or Public</p>
          <select
            className="update-group-status-input"
            value={groupStatus}
            onChange={(e) => setGroupStatus(e.target.value)}
          >
            <option value="(select one)">(Choose one)</option>
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
          {errors.groupStatus && <p error={errors.groupStatus} />}
        </div>
      </section>
      <section className="update-submission-section">
        <button className="update-submit-btn" onClick={handleGroupSubmit}>
          Done!
        </button>
      </section>
    </div>
  );
};

export default UpdateGroup;
