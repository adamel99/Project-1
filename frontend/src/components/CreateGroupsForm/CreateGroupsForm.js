import { useState, useEffect } from "react";
import "./CreateGroupsForm.css";
import React from "react";
import { useDispatch } from "react-redux";
import { createGroupThunk as CreateGroups } from "../../store/groups";
import { useHistory } from "react-router-dom";

const CreateGroupsForm = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [inFlight, setInflight] = useState(false);

  useEffect(() => {
    const validation = {};

    if (!formData.location) {
      validation.location = "Location is required";
    }
    if (!formData.name) {
      validation.name = "Name is required";
    }
    if (formData.desc && formData.desc.length < 30) {
      validation.desc = "Description must be at least 30 characters long";
    }
    if (!formData.desc) {
      validation.desc = "Description is required";
    }
    if (!formData.groupType) {
      validation.type = "Group type is required";
    }
    if (!formData.groupStatus) {
      validation.visibility = "Visibility type is required";
    }
    if (!formData.imgUrl) {
      validation.image = "Image is required";
    }

    setErrors(validation);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // const handleGroupSubmit = async (e) => {
  async function handleGroupSubmit(e) {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      return;
    }

    setInflight(true);
    const { location, name, desc, groupType, groupStatus } = formData;
    const [city, state] = location.split(", ");

    const newGroup = {
      name,
      about: desc,
      type: groupType,
      private: groupStatus === "Private",
      city,
      state,
      organizer: state.session.user.id
    };

    const res = await dispatch(CreateGroups(newGroup));
    console.log('res');
    console.log()
    history.push(`/groups/${res.id}`);
  };
  console.log('a sentence')
  return (
    <form onSubmit={handleGroupSubmit}>
      <div className="meetup-form">
        <section className="meetup-form__heading">
          <h2>Start a New Group</h2>
          <h3>BECOME AN ORGANIZER</h3>
          <p>We'll walk you through a few steps to build your local community</p>
        </section>
        <section className="meetup-form__location-input-section">
          <h3>First, set your group's location</h3>
          <p>
            Meetup groups meet locally, in person and online. We'll connect you
            with people in your area, and more can join you online.
          </p>
          <input
            className="meetup-form__location-input"
            placeholder="City, State"
            name="location"
            value={formData.location || ""}
            onChange={handleInputChange}
          />
          {errors.location && inFlight && <p style={{ color: "red" }}>{errors.location}</p>}
        </section>
        <section className="meetup-form__group-name-input-section">
          <h3>What will your group's name be?</h3>
          <p>
            Choose a name that will give people a clear idea of what the group is
            about. Feel free to get creative! You can edit this later if you
            change your mind.
          </p>
          <input
            className="meetup-form__group-name-input"
            placeholder="What is your group name?"
            name="name"
            value={formData.name || ""}
            onChange={handleInputChange}
          />
          {errors.name && inFlight && <p style={{ color: "red" }}>{errors.name}</p>}
        </section>
        <section className="meetup-form__group-desc-input-section">
          <h3>Now describe what your group will be about</h3>
          <p>
            People will see this when we promote your group, but you'll be able to
            add to it later, too.
          </p>
          <ol className="meetup-form__group-desc-prompts">
            <li>What's the purpose of the group?</li>
            <li>Who should join?</li>
            <li>What will you do at your events?</li>
          </ol>
          <textarea
            placeholder="Please write at least 30 characters"
            cols="35"
            rows="10"
            name="desc"
            value={formData.desc || ""}
            onChange={handleInputChange}
          />
          {errors.desc && inFlight && <p style={{ color: "red" }}>{errors.desc}</p>}
        </section>
        <section className="meetup-form__final-steps-section">
          <h3>Final steps...</h3>
          <div className="meetup-form__group-type-container">
            <p>Is this an in-person or online group?</p>
            <select
              className="meetup-form__group-type-input"
              name="groupType"
              value={formData.groupType || "online"}
              onChange={handleInputChange}
            >
              <option value="online">Online</option>
              <option value="in person">In Person</option>
            </select>
            {errors.type && inFlight && <p style={{ color: "red" }}>{errors.type}</p>}
          </div>
          <div className="meetup-form__group-status-container">
            <p>Is this group private or public?</p>
            <select
              className="meetup-form__group-status-input"
              name="groupStatus"
              value={formData.groupStatus || "Private"}
              onChange={handleInputChange}
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
            </select>
            {errors.visibility && inFlight && <p style={{ color: "red" }}>{errors.visibility}</p>}
          </div>
          <div className="meetup-form__group-img-input">
            <p>Please add an image URL for your group below:</p>
            <input
              placeholder="Image URL"
              name="imgUrl"
              type='text'
              value={formData.imgUrl || ""}
              onChange={handleInputChange}
            />
            {errors.image && inFlight && <p style={{ color: "red" }}>{errors.image}</p>}
          </div>
        </section>
        {/* <section className="meetup-form__submission-section"> */}
        <button className="meetup-form__submit-btn" type='submit'>
          Create Group
        </button>
        {/* </section> */}
      </div>
    </form>
  );
};

export default CreateGroupsForm;
