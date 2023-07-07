import { useState, useEffect } from "react";
import "./CreateGroupsForm.css";
import React from "react";
import { useDispatch } from "react-redux";
import { createGroupThunk as CreateGroups } from "../../store/groups";
import { useHistory } from "react-router-dom";

const initialState = {
  location: "",
  name: "",
  desc: "",
  groupType: "online",
  groupStatus: "Private",
  imgUrl: "",
};

const CreateGroupsForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [inFlight, setInFlight] = useState(false);

  useEffect(() => {
    const { location, name, desc, groupType, groupStatus, imgUrl } = formData;
    const validation = {};

    if (!location) {
      validation.location = "Location is required";
    }
    if (!name) {
      validation.name = "Name is required";
    }
    if (desc && desc.length < 30) {
      validation.desc = "Description must be at least 30 characters long";
    }
    if (!desc) {
      validation.desc = "Description is required";
    }
    if (!groupType) {
      validation.type = "Group type is required";
    }
    if (!groupStatus) {
      validation.visability = "Visibility type is required";
    }
    if (!imgUrl) {
      validation.image = "Image is required";
    }
    setErrors(validation);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleGroupSubmit = async (e) => {
    setInFlight(true);
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }
    const { location, name, desc, groupType, groupStatus } = formData;
    const [city, state] = location.split(", ");

    const newGroup = {
      name,
      about: desc,
      type: groupType,
      private: groupStatus === "Private",
      city,
      state,
    };

    console.log(newGroup);
    const res = await dispatch(CreateGroups(newGroup));
    console.log(res);
    history.push(`/groups/${res.id}`);
  };

  return (
    <div className="my-form">
      <section className="my-form__heading">
        <h2>Start a Group</h2>
        <h3>BECOME AN ORGANIZER</h3>
        <p>When you put effort into your community, EVERYONE wins!</p>
        <p>It's up to us to participate and show love!</p>
      </section>
      <section className="my-form__location-input-section">
        <h3>Where is your group located?</h3>
        <p>
          It's the people in your community that make events like this come to life!
        </p>
        <input
          className="my-form__location-input"
          placeholder="City, State, etc"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />
        {errors.location && inFlight && <p style={{ color: "red" }}>{errors.location}</p>}
      </section>
      <section className="my-form__group-name-input-section">
        <h3>Every group has to have a name! What will yours be?</h3>
        <p>
          Choosing a name that gives a good explanation of what the event brings is a good starting point. You have the oppurtunity to change it later if you find a better one!
        </p>
        <input
          className="my-form__group-name-input"
          placeholder="Name here"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && inFlight && <p style={{ color: "red" }}>{errors.name}</p>}
      </section>
      <section className="my-form__group-desc-input-section">
        <h3>Description!</h3>
        <p>
          This is what other people will see when searching for an event near them! Please make sure to add important details and any requirements you may have to join!
        </p>
        <ol className="my-form__group-desc-prompts">
          <li>Who would most enjoy this group?</li>
          <li>What activities are you guys going to partake in?</li>
          <li>Are there any requirements?</li>
        </ol>
        <textarea
          placeholder="Minimum 30 characters"
          cols="35"
          rows="10"
          name="desc"
          value={formData.desc}
          onChange={handleInputChange}
        />
        {errors.desc && inFlight && <p style={{ color: "red" }}>{errors.desc}</p>}
      </section>
      <section className="my-form__final-steps-section">
        <h3>Accessibility</h3>
        <div className="my-form__group-type-container">
          <p>Virtual(Online) or In-person</p>
          <select
            className="my-form__group-type-input"
            name="groupType"
            value={formData.groupType}
            onChange={handleInputChange}
          >
            <option value="online">Online</option>
            <option value="in person">In Person</option>
          </select>
          {errors.type && inFlight && <p style={{ color: "red" }}>{errors.type}</p>}
        </div>
        <div className="my-form__group-status-container">
          <p>Will this be a private or public group?</p>
          <select
            className="my-form__group-status-input"
            name="groupStatus"
            value={formData.groupStatus}
            onChange={handleInputChange}
          >
            <option value="Private">Private</option>
            <option value="Public">Public</option>
          </select>
          {errors.visability && inFlight && <p style={{ color: "red" }}>{errors.visability}</p>}
        </div>
        <div className="my-form__group-img-input">
          <p>Add a cool image URL to your group!</p>
          <input
            placeholder="Image URL"
            name="imgUrl"
            type="Url"
            value={formData.imgUrl}
            onChange={handleInputChange}
          />
          {errors.image && inFlight && <p style={{ color: "red" }}>{errors.image}</p>}
        </div>
      </section>
      <section className="my-form__submission-section">
        <button className="my-form__submit-btn" onClick={handleGroupSubmit}>
        DONE
        </button>
      </section>
    </div>
  );
};

export default CreateGroupsForm;
