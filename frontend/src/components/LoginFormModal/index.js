import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [userFirstName, setUserFirstName] = useState(null);

  // Redux selector to get the logged-in user
  const user = useSelector((state) => state.session.user);

  // Define the minimum length for username and password
  const minUsernameLength = 4;
  const minPasswordLength = 6;

  useEffect(() => {
    // Check if a user is logged in and set their first name
    if (user) {
      setUserFirstName(user.firstName);
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  // Determine if the "Log in" button should be disabled
  const isButtonDisabled = credential.length < minUsernameLength || password.length < minPasswordLength;

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button type="submit" disabled={isButtonDisabled}>Log In</button>
      </form>
      {userFirstName && (
        <p>Hello, {userFirstName}</p>
      )}
    </>
  );
}

export default LoginFormModal;
