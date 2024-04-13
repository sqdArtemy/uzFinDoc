import React from "react";
import styles from "./AuthLayout.module.scss";
import projectLogo from "../../assets/project-logo.png";
import { observer } from "mobx-react";
import { Outlet } from "react-router-dom";

const AuthLayout = observer(() => {
  return (
    <div className={styles.authContainer}>
      <span className={styles.topContainer}>
        <img src={projectLogo}></img>
      </span>
      <div className={styles.mainContainer}>
        <Outlet />
      </div>
    </div>
  );
});

export default AuthLayout;
