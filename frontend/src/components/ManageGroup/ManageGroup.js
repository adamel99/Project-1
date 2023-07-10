import React, { useEffect, useState } from "react";
import { csrfFetch } from "../../store/csrf";
import MyGroupCard from "../GroupCard/GroupCard";
import "./ManageGroup.css";

const ManageGroup = () => {
  const [groups, setGroups] = useState([]);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await csrfFetch("/api/groups/current");
        const data = await response.json();
        setGroups(data.Groups);
      } catch (error) {
        setErrors(error);
      }
    };

    fetchData();
  }, []);

  if (errors) {
    return <h3>Error occurred: {errors.message}</h3>;
  }

  if (!groups || groups.length === 0) {
    return <h3>You're Not a Member of these groups! Checkout available groups today!</h3>;
  }

  return (
    <div className="management-container">
      <section className="management-section">
        <div className="management-title-container">
          <p>Your Groups!</p>
        </div>
      </section>
      <section className="management-list">
        {groups.map((group, index, array) => (
          <MyGroupCard
            key={group.id}
            group={group}
            isManagementPage={true}
          />
        ))}
      </section>
    </div>
  );
};

export default ManageGroup;
