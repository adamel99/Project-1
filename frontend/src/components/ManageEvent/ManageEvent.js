
import React, { useEffect, useState } from "react";
import { csrfFetch } from "../../store/csrf";
import "./ManageEvent.css";

const ManageEvent = () => {
    const [events, setEvents] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await csrfFetch("/api/groups/current");
                const data = await response.json();
                setEvents(data.Groups);
            } catch (error) {
                setErrors(error);
            }
        };
        fetchData();
    }, []);

    if (!events) return <h3>Loading...</h3>;
    return (
        <div className="group-management-view">
            <section className="group-event-selection-section">
                <div className="title-container">
                    <p>Your groups in Meetup</p>
                </div>
            </section>
            <section className="group-management-list">
                {events.map((event, index, array) => (
                    <CustomGroupCard
                        key={event.id}
                        group={event}
                        isManagementPage={true}
                    />
                ))}
            </section>
        </div>
    );
};

export default ManageEvent;
