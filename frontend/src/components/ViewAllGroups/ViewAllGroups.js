import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./ViewAllGroups.css";
import MyGroupCard from '../GroupCard/GroupCard';

import * as groupActions from "../../store/groups";

const ViewAllGroups = () => {
  const dispatch = useDispatch();
  const allGroups = useSelector((state) => state.groups.allGroups);

  useEffect(() => {
    console.log("pre-dispatch");
    dispatch(groupActions.ViewAllGroupsThunk());
  }, [dispatch]);

  const allGroupsArray = Object.values(allGroups);

  return (
    <div className="groups-view">
      <section className="group-event-section">
        <div className="title-container">
          <NavLink to="/groups" activeClassName="active-link">
            <h2 className="teal-header">Groups</h2> {/* Teal header */}
          </NavLink>
          <NavLink to="/events" activeClassName="active-link">
          <h2 className="gray-header">Events</h2> {/* Gray header */}
          </NavLink>
        </div>
        <p>Checkout a Group! Connect with your community!</p>
      </section>
      <section className="groups-list">
        {allGroups &&
          allGroupsArray.map((group) => (
            <MyGroupCard customGroup={group} key={group.id} />
          ))}
      </section>
    </div>
  );
};

export default ViewAllGroups;
