import "./EventList.css";
import { useHistory } from "react-router-dom";
import React from "react";


export const EventCard = ({ event }) => {
    const history = useHistory();

    const handleEventClick = () => {
        history.push(`/events/${event.id}`);
    };
    console.log(event)

    const date = event.startDate?.split(" ");

    return (
        <div className="event-card-container" onClick={handleEventClick}>
            <div className="event-card-image-container">
                <img className="event-card-image" src='https://media.timeout.com/images/105841825/750/422/image.jpg' alt="" />
                <div className="event-card-info-container"></div>
                <div className="event-card-status-info">
                    <h2 className="event-card-title">{event.name}</h2>
                    <div className="event-card-location">
                        <p className="event-card-description">{event.description}</p>
                        {event.Group.city}, {event.Group.state}
                    </div>
                    {date &&
                        <span className="event-card-date">
                            {date[0]} · {date[1]}
                        </span>
                    }
                    <p>{event.private ? "Private" : "Public"}</p>
                </div>
            </div>
        </div>
    );
};
