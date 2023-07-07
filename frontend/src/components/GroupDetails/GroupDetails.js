import "./GroupDetails.css";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { ViewSingleGroupThunk as getSingleGroup } from "../../store/groups";



const GroupDetails = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const { groupId } = useParams();
    const group = useSelector((state) => state.groups.singleGroup);

    const groupOrganizerId = group.organizerId;
    const history = useHistory();

    useEffect(() => {
        dispatch(getSingleGroup(groupId));

    }, [dispatch]);


    if (!group.id || !group.Organizer) return <h3>Access Denied</h3>;

    const { firstName, lastName } = group.Organizer;


    return (
        <div className="modified-group-details">
            <div className="modified-group-details">
                <NavLink to="/groups">Groups</NavLink>
            </div>
            <section className="modified-group-details__group-section">
                <div className="modified-group-details__image-container">
                    <img
                        className="modified-group-details__group-image"
                        src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
                        alt="img"
                    ></img>
                </div>
                <div className="modified-group-details__group-info-container">
                    <div className="modified-group-details__group-info">
                        <h2 className="no-margin">{group.name}</h2>
                        <p>
                            {group.city}, {group.state}
                        </p>
                        <div className="modified-group-details__group-status-container">

                            <span>•</span>
                            <p>{group.private ? "Private" : "Public"}</p>
                        </div>
                        <p>
                            Organizer: {firstName} {lastName}
                        </p>
                    </div>
                    <div className="modified-container">
                        {sessionUser && sessionUser.id !== groupOrganizerId && (
                            <button
                                className="modified-group-details__join-group-btn"
                                onClick={() => alert("Bug Fixes")}
                            >
                                LinkUp with this Group!
                            </button>
                        )}
                        {sessionUser && sessionUser.id === groupOrganizerId && (
                            <button
                                className="createEvent"
                                onClick={() => {
                                    history.push(`/groups/${groupId}/events/new`);
                                }}
                            >
                                Create Event
                            </button>
                        )}
                        {sessionUser && sessionUser.id === groupOrganizerId && (
                            <button
                                className="modified-group-details__join-group-btn"
                                onClick={() => {
                                    history.push(`/groups/${groupId}/edit`);
                                }}
                            >
                                Update
                            </button>
                        )}

                    </div>
                </div>
            </section>
            <section className="modified-group-details__more-details-section">
                <div className="modified-group-details__more-details-container">
                    <div className="modified-group-details__organizer-info">
                        <h2>Organizer</h2>
                        <p>
                            {firstName} {lastName}
                        </p>
                    </div>
                    <div className="modified-group-details__about-info">
                        <h2>What to Expect!</h2>
                        <p>{group.about}</p>
                    </div>
                    <div className="modified-group-details__event">

                        <div className="modified-group-event-card">

                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GroupDetails;
