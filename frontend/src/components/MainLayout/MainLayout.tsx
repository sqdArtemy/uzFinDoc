import styles from './MainLayout.module.scss';
import projectLogo from '../../assets/project-logo.png';
import profileLogo from '../../assets/profile-logo.png';
import { observer } from 'mobx-react';
import { Outlet, useNavigate } from 'react-router-dom';
import authStore from '../../stores/AuthStore';

const MainLayout = observer(() => {
    const navigate = useNavigate();

    return (
        <div className={styles.bodyContainer}>
            <span className={styles.topContainer}>
                <span className={styles.topLeftContainer}>
                    {' '}
                    <img className={styles.projectLogo} src={projectLogo}></img>
                    <span
                        className={styles.textLarge}
                        onClick={() => navigate('/main/translate')}
                    >
                        Translate
                    </span>
                    <span className={styles.textLarge}>Organization</span>
                    <span className={styles.textLarge}>History</span>
                </span>
                <span
                    className={styles.topProfileContainer}
                    onClick={() => navigate('/main/profile')}
                >
                    <img src={profileLogo}></img>
                    <span className={styles.textRegular}>
                        {authStore.data.email ?? 'example@gmail.com'}
                    </span>
                </span>
            </span>
            <div className={styles.mainContainer}>
                <Outlet />
            </div>
        </div>
    );
});

export default MainLayout;
