import styles from './MainLayout.module.scss';
import projectLogo from '../../assets/project-logo.png';
import { observer } from 'mobx-react';
import { Outlet, useNavigate } from 'react-router-dom';
import authStore from '../../stores/AuthStore';
import { Avatar } from '@mui/material';
import { stringAvatar } from '../../utils.ts';

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
                    <span
                        className={styles.textLarge}
                        onClick={() => navigate('/main/organization')}
                    >
                        Organization
                    </span>
                    <span
                        className={styles.textLarge}
                        onClick={() => navigate('/main/history')}
                    >
                        History
                    </span>
                </span>
                <span
                    className={styles.topProfileContainer}
                    onClick={() => navigate('/main/profile')}
                >
                    <span className={styles.textRegular}>
                        {authStore.data.nameFirstName +
                            ' ' +
                            authStore.data.nameLastName ?? 'example@gmail.com'}
                    </span>
                    <Avatar
                        {...stringAvatar(
                            `${authStore.data.nameFirstName} ${authStore.data.nameLastName}`
                        )}
                    />
                </span>
            </span>
            <div className={styles.mainContainer}>
                <Outlet />
            </div>
        </div>
    );
});

export default MainLayout;
