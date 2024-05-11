import styles from './MainLayout.module.scss';
import projectLogo from '../../assets/project-logo.svg';
import { observer } from 'mobx-react';
import { Outlet, useNavigate } from 'react-router-dom';
import userStore from '../../stores/UserStore.ts';
import { Avatar, Box, Button, IconButton, Menu } from '@mui/material';
import { stringAvatar } from '../../utils.ts';
import OrganizationAction from '../OrganizationAction/OrganizationAction.tsx';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const MainLayout = observer(() => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    function handleClose() {
        setIsModalOpen(false);
    }

    return (
        <div className={styles.bodyContainer}>
            <span className={styles.topContainer}>
                <span className={styles.topLeftContainer}>
                    <img
                        className={styles.projectLogo}
                        src={projectLogo}
                        onClick={() => navigate('/main/translate')}
                        alt={'project logo'}
                    ></img>
                    <span
                        className={styles.textLarge}
                        onClick={() => navigate('/main/translate')}
                    >
                        Translate
                    </span>
                    <span
                        className={styles.textLarge}
                        onClick={() => {
                            if (userStore.storeData.organization?.id)
                                return navigate('/main/organization');
                            setIsModalOpen(true);
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
                <span className={styles.topProfileContainer}>
                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        gap="1rem"
                        alignItems={'center'}
                        onClick={() => navigate('/main/profile')}
                    >
                        <span className={styles.textRegular}>
                            {userStore.storeData.nameFirstName +
                                ' ' +
                                userStore.storeData.nameLastName ??
                                'example@gmail.com'}
                        </span>
                        <Avatar
                            {...stringAvatar(
                                `${userStore.data.nameFirstName} ${userStore.data.nameLastName}`
                            )}
                        />
                    </Box>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => setAnchorEl(null)}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: 60,
                                    width: '15ch',
                                },
                            },
                        }}
                    >
                        <Button
                            size={'large'}
                            variant={'text'}
                            color={'error'}
                            onClick={() => {
                                userStore.logout();
                                navigate('/auth/sign-in');
                                setAnchorEl(null);
                            }}
                            fullWidth
                        >
                            Logout
                        </Button>
                    </Menu>
                </span>
            </span>
            <div className={styles.mainContainer}>
                <Outlet />
            </div>
            <OrganizationAction
                open={isModalOpen}
                handleClose={handleClose}
                initialData={null}
            />
        </div>
    );
});

export default MainLayout;
