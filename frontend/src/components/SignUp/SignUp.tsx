import React, { useState } from "react";
import styles from "./SignUp.module.scss";
import { Button, TextField } from "@mui/material";
import { observer } from "mobx-react";
import authStore from "../../stores/AuthStore";
import { useLoader } from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ArrowForwardIos } from "@mui/icons-material";

const SignUp = observer(() => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password: string = data.get("password") as string;
    console.log({
      email: authStore.data.email,
      password: password,
    });
    if (!password) {
      return setError("This is required information.");
    }

    showLoader();
    try {
      setError("");
      hideLoader();
      authStore.data.password = password;
      // auth logic
      navigate("/auth/sign-up");
    } catch (error) {
      setError("Some error occurred.");
      hideLoader();
    }
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formTopContainer}>
        <span className={styles.formTextLarge}>Sign Up</span>
        <span className={styles.formTextRegular}>
          Welcome, {authStore.data.email}
        </span>
      </div>
      <div className={styles.formInputContainer}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Name *"
          name="name"
          autoComplete="name"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Surname *"
          name="surname"
          autoComplete="surname"
          autoFocus
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Phone Number *"
          name="phoneNUmber"
          autoComplete="phoneNumber"
          autoFocus
          // error={!!emailErrorText}
          // helperText={emailErrorText}
          // onChange={(e) => validateEmail(e.target.value, setEmailErrorText)}
        />
        {error && <div className={styles.formError}>{error}</div>}
        <span className={styles.btnsContainer}>
          <Button
            type="submit"
            className={styles.backBtn}
            variant="text"
            color="primary"
            style={{ margin: "15px 0" }}
            startIcon={<ArrowBackIosNewIcon />}
            onClick={() => navigate("/auth/initial")}
          >
            Back
          </Button>
          <Button
            type="submit"
            className={styles.backBtn}
            variant="text"
            color="primary"
            style={{ margin: "15px 0" }}
            endIcon={<ArrowForwardIos />}
            onClick={() => navigate("/auth/sign-up/pwd")}
          >
            Next
          </Button>
        </span>
      </div>
    </form>
  );
});

export default SignUp;
