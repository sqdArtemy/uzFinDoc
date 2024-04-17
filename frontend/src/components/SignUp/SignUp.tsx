import React, { useState } from "react";
import styles from "./SignUp.module.scss";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { observer } from "mobx-react";
import authStore from "../../stores/AuthStore";
import { useLoader } from "../Loader/Loader";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { VisibilityOff, Visibility } from "@mui/icons-material";

const SignUp = observer(() => {
  const navigate = useNavigate();
  const { showLoader, hideLoader } = useLoader();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password *
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            name="password"
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            defaultValue={authStore.data.password}
            onChange={(event) => (authStore.data.password = event.target.value)}
          />
        </FormControl>
        {error && <div className={styles.formError}>{error}</div>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ margin: "15px 0" }}
        >
          Create account
        </Button>
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
      </div>
    </form>
  );
});

export default SignUp;
