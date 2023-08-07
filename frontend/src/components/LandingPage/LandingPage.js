import { NavLink } from "react-router-dom";
import React from "react";
import "./LandingPage.css";
import SignupFormModal from "../SignupFormModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import { useSelector } from "react-redux";

const LandingPage = () => {
  const amazingUser = useSelector((state) => state.session.user);

  return (
    
    <div className="main-content">
      <div className="intro">
        <section className="main-content-title">
          <h1>LinkUp!</h1>
          <p>
            Discover countless extraordinary individuals who share your passion for thrilling adventures or fascinating discussions on LinkUp. Join the excitement today!
          </p>
        </section>
        <section className="main-content-image">
          <img
            src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=1080"
            className="main-content-image"
            alt="img"
          />
        </section>
      </div>
      <section className="main-content-meetup-works">
        <h2>Discover what's possible with LinkUp</h2>
        <p>
          Share new experiences with the people in your community with online and offline events! Create a free account today!
        </p>
      </section>
      <section className="main-content-cards">
        <div className="main-content-cards-container">
          <div>
            <img
              src="https://secure.meetupstatic.com/next/images/shared/handsUp.svg?w=384"
              alt="img"
            />
            <NavLink to="/groups" className='navlink'>Groups Available Now!</NavLink>
            <p>
              Unite with passionate individuals and create magical memories together. Pursue your passions today!
            </p>
          </div>
          <div>
            <img
              src="https://secure.meetupstatic.com/next/images/shared/ticket.svg?w=384"
              alt="img"
            />
            <NavLink to="/events" className='navlink'>Find an Event</NavLink>
            <p>
              Step out of your comfort zone with these exciting events happening in your area!
            </p>
          </div>
          <div>
            <img
              src="https://secure.meetupstatic.com/next/images/shared/joinGroup.svg?w=384"
              alt="img"
            />
            {amazingUser ? (
              <NavLink to="/groups/new" className='navlink'>Ignite a New Adventure</NavLink>
            ) : (
              <p className="start-new-group-btn-disabled">Ignite a New Adventure</p>
            )}
            <p>
              You don't need to be an expert to bring people together and explore shared interests. Let your curiosity lead the way!
            </p>
          </div>
        </div>
      </section>

      {!amazingUser && (
        <section className="join-meetup">
          <OpenModalMenuItem
            className="join-meetup-btn"
            itemText="Join the Magic"
            modalComponent={<SignupFormModal />}
          />
        </section>
      )}
    </div>
  );
};

export default LandingPage;
