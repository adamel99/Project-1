import "./EventDetails.css";
import { NavLink, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useEffect } from "react";
import { getSingleEventThunk as getSingleEvent } from "../store/events";
import { ViewSingleGroupThunk as getSingleGroup } from "../store/groups";
import OpenModalMenuItem from "../components/Navigation/OpenModalMenuItem";
import DeleteEvent from "../DeleteEvent/DeleteEvent";
const EventDetails = () => {
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const event = useSelector((state) => state.events.singleEvent);
  const group = useSelector((state) => state.groups.singleGroup);


  useEffect(() => {
    (async () => {
      let event = await dispatch(getSingleEvent(eventId));
      dispatch(getSingleGroup(event.groupId));
    })();
  }, [dispatch, eventId]);
  console.log(event);
  if (!event.id || !group.id) return <h3>Loading ...</h3>;
  const groupOrganizerId = group.organizerId;
  const { firstName, lastName } = group.Organizer;
  console.log(sessionUser, groupOrganizerId);
  return (
    <div className="event-details">
      <div className="event-details__breadcrumb">
        <span>
          <i className="fa-solid fa-arrow-left"></i>
        </span>
        <NavLink to="/events">Events</NavLink>
      </div>
      <div className="event-header">
        <h2>Event {event.name}</h2>{" "}
        <p>
          Host: {firstName} {lastName}
        </p>
      </div>
      <section className="event-details__group-section">
        <div className="event-details__image-container">
          <img
            className="event-details__event-image"
            src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
            alt="img"
          ></img>
        </div>
        <div className="event-details__group-info-container">
          <div className="event-details__group-info">
            <div className="event-details-row">
              <i class="fa-solid fa-clock"></i>
              <div className="start-to-end">
                <p>Start Date</p>
                <p>{event.startDate.split(" ").join(" · ")}</p>
                <p>End Date</p>
                <p>{event.endDate.split(" ").join(" · ")}</p>
              </div>
            </div>
            <div className="event-details-row">
              <i class="fa-dollar-sign"></i> <p>${event.price}</p>
            </div>
            <div className="event-details-row">
              <i class="fa-map-pin"></i>
              <p>{event.type ? "In person" : "Online"}</p>
            </div>
          </div>
          <div className="container">
            {sessionUser && sessionUser.id === groupOrganizerId && (
              <button
                className="details__join-group-btn"
                onClick={() => {
                  alert("Working on it!");
                }}
              >
                Update
              </button>
            )}
            {sessionUser && sessionUser.id === groupOrganizerId && (
              <OpenModalMenuItem
                itemText="Delete"
                modalComponent={<DeleteEvent eventToDelete={event} />}
              />
            )}
          </div>
        </div>
      </section>
      <section className="group-details__more-details-section">
        <div className="group-details__more-details-container">
          <div className="group-details__organizer-info"></div>
          <div className="group-details__about-info">
            <h2>Details</h2>
            <p>{event.description}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;
