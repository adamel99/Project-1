import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getAllEventsThunk as getAllEvents } from "../../store/events";
import { EventCard } from "./EventCard";
import "./EventList.css";

const EventList = () => {
  const dispatch = useDispatch();
  const allEvents = useSelector((state) => state.events.allEvents);
  const [currentSelection, setCurrentSelection] = useState("Events");
  useEffect(() => {
    dispatch(getAllEvents());
  }, [dispatch]);

//   console.log("allEvents", allEvents);
  if (!allEvents) {
    return (
      <div className="loading-container">
        <h3>Loading...</h3>
      </div>
    );
  }
  const CURRENT_DATE = new Date().getTime();
  const sortedEvents = allEvents.sort((eventA, eventB) => {
    let dateA = new Date(eventA.startDate).getTime();
    let dateB = new Date(eventB.startDate).getTime();
    if (dateA > CURRENT_DATE && dateB > CURRENT_DATE) return dateA - dateB;
    else if (dateA < CURRENT_DATE && dateB < CURRENT_DATE) return dateB - dateA;
    else if (dateA < CURRENT_DATE) return 1;
    else return -1;
  });
  return (
    <div className="events-container">
      <div className="selection-section">
        <div className="title-container">
          <NavLink
            to="/events"
            className={(isActive) =>
              isActive ? "active-link" : "inactive-link"
            }
            onClick={(e) => setCurrentSelection(e.target.innerText)}
          >
            Events
          </NavLink>
          <NavLink
            to="/groups"
            className={(isActive) =>
              isActive ? "active-link" : "inactive-link"
            }
            onClick={(e) => setCurrentSelection(e.target.innerText)}
          >
            Groups
          </NavLink>
        </div>
        <p>{currentSelection} in Meetup</p>
      </div>
      <div className="event-list">
        {sortedEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
