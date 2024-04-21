import React, { useState } from "react";
import styles from "./SignUp.module.scss";
import { Button, TextField } from "@mui/material";
import { observer } from "mobx-react";
import authStore from "../../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ArrowForwardIos } from "@mui/icons-material";

const SignUp = observer(() => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name") as string;
    const surname = data.get("surname") as string;
    const phoneNumber = data.get("phoneNumber") as string;
    console.log({
      email: authStore.data.email,
      name,
      surname,
      phoneNumber,
    });
    if (!name || !surname || !phoneNumber) {
      return setError("This is required information.");
    }

    authStore.data.name = name;
    authStore.data.surname = surname;
    authStore.data.phoneNumber = phoneNumber;

    navigate("/auth/sign-up/pwd");
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
          defaultValue={authStore.data.name}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Surname *"
          name="surname"
          autoComplete="surname"
          autoFocus
          defaultValue={authStore.data.surname}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Phone Number *"
          name="phoneNumber"
          autoComplete="phoneNumber"
          autoFocus
          defaultValue={authStore.data.phoneNumber}
          // error={!!emailErrorText}
          // helperText={emailErrorText}
          // onChange={(e) => validateEmail(e.target.value, setEmailErrorText)}
        />
        {error && <div className={styles.formError}>{error}</div>}
        <span className={styles.btnsContainer}>
          <Button
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
            variant="text"
            color="primary"
            style={{ margin: "15px 0" }}
            endIcon={<ArrowForwardIos />}
          >
            Next
          </Button>
        </span>
      </div>
    </form>
  );
});

export default SignUp;
