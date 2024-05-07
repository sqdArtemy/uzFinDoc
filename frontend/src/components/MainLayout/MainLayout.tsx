import styles from './MainLayout.module.scss';
import projectLogo from '../../assets/project-logo.png';
import { observer } from 'mobx-react';
import { Outlet, useNavigate } from 'react-router-dom';
import userStore from '../../stores/UserStore.ts';
import { Avatar } from '@mui/material';
import { stringAvatar } from '../../utils.ts';
import OrganizationAction from '../OrganizationAction/OrganizationAction.tsx';
import { useState } from 'react';

const MainLayout = observer(() => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    function handleClose() {
        setIsOpen(false);
    }

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
                        onClick={() => {
                            if (userStore.data.organization?.id)
                                return navigate('/main/organization');
                            setIsOpen(true);
                        }}
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
                        {userStore.data.nameFirstName +
                            ' ' +
                            userStore.data.nameLastName ?? 'example@gmail.com'}
                    </span>
                    <Avatar
                        {...stringAvatar(
                            `${userStore.data.nameFirstName} ${userStore.data.nameLastName}`
                        )}
                    />
                </span>
            </span>
            <div className={styles.mainContainer}>
                <Outlet />
            </div>
            <OrganizationAction
                open={isOpen}
                handleClose={handleClose}
                initialData={null}
            />
        </div>
    );
});

export default MainLayout;
