import "./GroupDetails.css";
import { NavLink, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { ViewSingleGroupThunk as getSingleGroup } from "../../store/groups";
import { createGroupImagesThunk as getImageGroup } from "../../store/groups";
import DeleteGroup from "../DeleteGroup/DeleteGroup";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
// import groupimage from "../../../../backend/db/models/groupimage";



const GroupDetails = () => {
    const sessionUser = useSelector((state) => state.session.user);
    const dispatch = useDispatch();
    const { groupId, preview, url } = useParams();
    const group = useSelector((state) => state.groups.singleGroup);

    const groupOrganizerId = group.organizerId;
    const history = useHistory();
    const eventsSection =
        group.events && group.events.length > 0 ? (
            <div className="created_events">
                <h3>Events</h3>
                <ul>
                    {group.events.map((event) => (
                        <li key={event.id}>
                            <h4>{event.name}</h4>
                        </li>
                    ))}
                </ul>
            </div>
        ) : null;
    useEffect(() => {
        dispatch(getSingleGroup(groupId));
        dispatch(getImageGroup(groupId, preview, url))
    }, [dispatch, groupId, preview, url]);

    // useEffect(()=> {
    //     dispatch(createGroupImage)
    // })

    console.log('Group:', group);
    if (!group.id || !group.Organizer) return <h3>Access Denied</h3>;

    const { firstName, lastName } = group.Organizer;

    const groupImage = group.GroupImages && group.GroupImages.length > 0
        ? group.GroupImages[0].url
        : '';
    return (
        <div className="modified-group-details">
            <div className="modified-group-details">
                <NavLink to="/groups">Groups</NavLink>
            </div>
            <section className="modified-group-details__group-section">
                <div className="modified-group-details__image-container">
                    <img
                        className="modified-group-details__group-image"
                        src={groupImage}
                        alt="Group Preview"
                    />
                </div>
                <div className="modified-group-details__group-info-container">
                    <div className="modified-group-details__group-info">
                        <h2 className="no-margin">{group.name}</h2>
                        <p>
                            {group.city}, {group.state}
                        </p>
                        <h3>Accessibility</h3>
                        <p>
                            {group.type}
                        </p>
                        <div className="modified-group-details__group-status-container">

                            <span>•</span>
                            <p>{group.private ? "Private" : "Public"}</p>
                        </div>
                        <p>
                            Organized by: {firstName} {lastName}
                        </p>
                    </div>
                    <div className='group_events'>
                        <h3>Group Events</h3>
                        {/* Add Events for specific group here */}
                        {eventsSection}
                    </div>
                    {/* {eventsSection} */}
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
                            <p>
                                <button
                                    className="modified-group-details__join-group-btn"
                                    onClick={() => {
                                        history.push(`/groups/${groupId}/edit`);
                                    }}
                                >
                                    Update
                                </button>
                                <button>
                                    {sessionUser && sessionUser.id === groupOrganizerId && (
                                        <OpenModalMenuItem
                                            itemText="Delete"
                                            modalComponent={<DeleteGroup groupDelete={group} />}
                                        />
                                    )}
                                </button>

                            </p>

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
