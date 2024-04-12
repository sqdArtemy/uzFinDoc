import React from "react";
import styles from "./Auth.module.scss";
import projectLogo from "../../assets/project-logo.png";
import { Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";

function Auth() {
  return (
    <div className={styles.authContainer}>
      <span className={styles.topContainer}>
        <img src={projectLogo}></img>
      </span>
      <div className={styles.mainContainer}>
        <form className={styles.formContainer}>
          <div className={styles.formTopContainer}>
            <span className={styles.formTextLarge}>Sign Up</span>
            <span className={styles.formTextRegular}>
              Already have an account?{" "}
              <Link to="./log-in" relative="path">
                Log in
              </Link>
            </span>
          </div>
          <div className={styles.formInputContainer}>
            <TextField
              className={styles.formInput}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ margin: "15px 0" }}
            >
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Auth;
