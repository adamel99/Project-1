import { useDispatch, useSelector } from "react-redux";
import "./CreateEvent.css";
import { useEffect, useState } from "react";
import { createEventThunk as createEvent } from "../../store/events";
import { ViewSingleGroupThunk as getSingleGroup } from "../../store/groups";
import { useParams, useHistory } from "react-router-dom";
import React from "react";
// import {saveEventImage} from '../../store/events'

const EventCreator = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const [eventName, setEventName] = useState("");
  const group = useSelector((state) => state.groups.singleGroup);
  const history = useHistory();
  const [eventPrice, setEventPrice] = useState(0);
  const [eventDescription, setEventDescription] = useState("");
  const [eventErrors, setEventErrors] = useState({});
  const [eventType, setEventType] = useState("");
  const [eventImgUrl, setEventImgUrl] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);


  useEffect(() => {
    const validation = {};
    if (!eventName) {
      validation.eventName = "Event name is required";
    }
    if (!eventType || eventType === "(select one)") {
      validation.eventType = "Event type is required";
    }
    if (!eventStartDate) {
      validation.eventStart = "Event start date is required";
    }
    if (!eventEndDate) {
      validation.eventEnd = "Event end date is required";
    }
    if (eventDescription.length < 30) {
      validation.eventDescription =
        "Description must be at least 30 characters long";
    }
    if (eventPrice < 0) {
      validation.eventPrice = "Price must not be negative";
    }
    setEventErrors(validation);
  }, [eventName, eventType, eventStartDate, eventEndDate, eventDescription, eventPrice]);

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setIsCreatingEvent(true);
    if (Object.keys(eventErrors).length > 0) {
      return;
    }

    const newEvent = {
      groupId: parseInt(groupId),
      name: eventName,
      type: eventType,
      price: parseInt(eventPrice),
      capacity: 20,
      description: eventDescription,
      startDate: eventStartDate,
      endDate: eventEndDate,
      venueId: 1,
      imgUrl: eventImgUrl
    };

    const res = await dispatch(createEvent(newEvent));
    if (res.errors) {
      setEventErrors(res.errors);
    } else {
      history.push(`/events/${res.id}`);
    }
  };



  useEffect(() => {
    dispatch(getSingleGroup(groupId));
  }, [dispatch, groupId]);

  return (
    <div className="event-creator">
      <section className="event-creator__heading-section">
        <h3>Create an event for {group.name}</h3>
        <div className="event-creator__name-input-container">
          <p>What is the name of your event?</p>
          <input
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Event Name"
          />
        </div>
        {eventErrors.eventName && isCreatingEvent && (
          <p style={{ color: "red" }} p>
            {eventErrors.eventName}
          </p>
        )}
      </section>
      <section className="event-creator__visibility-price-section">
        <div className="event-creator__type-input-container">
          <p>Is this an in-person or online event?</p>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
            <option value="(select one)">(select one)</option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          {eventErrors.eventType && isCreatingEvent && (
            <p style={{ color: "red" }} p>
              {eventErrors.eventType}
            </p>
          )}{" "}
        </div>
        <div className="event-creator__price-input-container">
          <p>What is the price for your event?</p>
          <input
            value={eventPrice}
            onChange={(e) => setEventPrice(e.target.value)}
            type="number"
            min={0}
          />
          {eventErrors.eventPrice && isCreatingEvent && (
            <p style={{ color: "red" }} p>
              {eventErrors.eventPrice}
            </p>
          )}{" "}
        </div>
      </section>
      <section className="event-creator__date-section">
        <div className="event-creator__start-date-container">
          <p>When does your event start?</p>
          <input
            type="datetime-local"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
          />
          {eventErrors.eventStart && isCreatingEvent && (
            <p style={{ color: "red" }} p>
              {eventErrors.eventStart}
            </p>
          )}{" "}
        </div>
        <div className="event-creator__end-date-container">
          <p>When does your event end?</p>
          <input
            type="datetime-local"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
          />
          {eventErrors.eventEnd && isCreatingEvent && (
            <p style={{ color: "red" }} p>
              {eventErrors.eventEnd}
            </p>
          )}{" "}
        </div>
      </section>
      <section className="event-creator__image-section">
        <div className="event-creator__image-input-container">
          <p>Please add an image URL for your event below:</p>
          <input
            value={eventImgUrl}
            onChange={(e) => setEventImgUrl(e.target.value)}
            placeholder="Image URL"
          />
          {eventErrors.previewImage && isCreatingEvent && (
            <p style={{ color: "red" }} p>
              {eventErrors.previewImage}
            </p>

          )}
        </div>
      </section>
      <section className="event-creator__desc-section">
        <div className="event-creator__desc-input-container">
          <p>Please describe your event:</p>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            placeholder="Please include at least 30 characters"
          />
          {eventErrors.eventDescription && isCreatingEvent && (
            <p style={{ color: "red" }} p>
              {eventErrors.eventDescription}
            </p>
          )}{" "}
        </div>
      </section>
      <button
        onClick={handleEventSubmit}
        className="event-creator__create-event-btn"
      >
        Create Event
      </button>
    </div>
  );
};

export default EventCreator;
