import React, { useState } from "react";
import styles from "./Profile.module.scss";
import { observer } from "mobx-react";
import authStore from "../../stores/AuthStore";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  TextField,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { validatePwd } from "../../utils";

const Profile = observer(() => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwdErrorText, setPwdErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: authStore.data.name,
    surname: authStore.data.surname,
    phoneNumber: authStore.data.phoneNumber,
    password: authStore.data.password,
  });

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleClickShowPassword = (setShowPassword) =>
    setShowPassword((show) => !show);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const password: string = data.get("password") as string;
    const phoneNumber: string = data.get("phoneNumber") as string;
    const name: string = data.get("name") as string;
    const surname: string = data.get("surname") as string;

    if (pwdErrorText) {
      return;
    } else if (!password || !phoneNumber || !name || !surname) {
      return setError("All fields are required.");
    }

    setLoading(true);
    try {
      setError("");
      authStore.data.name = name;
      authStore.data.surname = surname;
      authStore.data.phoneNumber = phoneNumber;
      authStore.data.password = password;
      // some update acc logic with api
      setLoading(false);
      navigate("/auth"); // can be removed later
    } catch (error) {
      setError("Some error occurred.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: authStore.data.name,
      surname: authStore.data.surname,
      phoneNumber: authStore.data.phoneNumber,
      password: authStore.data.password,
    });
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div className={styles.formTopContainer}>
        <span className={styles.formTextLarge}>
          Profile of {authStore.data.email}
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Surname *"
          name="surname"
          autoComplete="surname"
          autoFocus
          value={formData.surname}
          onChange={(e) =>
            setFormData({ ...formData, surname: e.target.value })
          }
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Phone Number *"
          name="phoneNumber"
          autoComplete="phoneNumber"
          autoFocus
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          // error={!!emailErrorText}
          // helperText={emailErrorText}
          // onChange={(e) => validateEmail(e.target.value, setEmailErrorText)}
        />
        <FormControl variant="outlined" className={styles.pwdInputContainer}>
          <InputLabel
            htmlFor="outlined-adornment-password"
            error={!!pwdErrorText}
          >
            Password *
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? "text" : "password"}
            name="password"
            error={!!pwdErrorText}
            onChange={(e) => {
              validatePwd(e.target.value, setPwdErrorText);
              setFormData({ ...formData, password: e.target.value });
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => handleClickShowPassword(setShowPassword)}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
            value={formData.password}
            defaultValue={authStore.data.password}
          />
          {pwdErrorText && (
            <FormHelperText error>{pwdErrorText}</FormHelperText>
          )}
        </FormControl>
        {error && <div className={styles.formError}>{error}</div>}
        <span className={styles.btnsContainer}>
          <Button
            variant="contained"
            color="error"
            style={{ margin: "20px 0" }}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="outlined"
            color="success"
            style={{ margin: "20px 0" }}
            // onClick={() => setLoading(true)}
            loading={loading}
          >
            Update
          </LoadingButton>
        </span>
      </div>
    </form>
  );
});

export default Profile;
