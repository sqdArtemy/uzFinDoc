import styles from './Organization.module.scss';
import { observer } from 'mobx-react';
import { Avatar, Button, Chip } from '@mui/material';
import { useState } from 'react';
import { stringAvatar } from '../../utils.ts';
import FileList from '../FileList/FileList.tsx';

const Organization = observer(() => {
    const [buttonState, setButtonState] = useState('Members');

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.upperContainer}>
                <div className={styles.organizationInfoContainer}>
                    <Avatar
                        {...stringAvatar('Organization Name')}
                        variant={'square'}
                        sx={{ width: 80, height: 80 }}
                    />
                    <div className={styles.organizationInfoRightContainer}>
                        <span className={styles.headerText}>
                            Organization Name
                        </span>
                        <span className={styles.descriptionText}>
                            org@gmail.com
                        </span>
                    </div>
                </div>

                <span className={styles.upperButtonsContainer}>
                    <Button
                        size={'small'}
                        variant={'text'}
                        color={
                            buttonState === 'Documents' ? 'success' : 'primary'
                        }
                        onClick={() => setButtonState('Documents')}
                    >
                        Documents
                    </Button>
                    <Button
                        size={'small'}
                        variant={'text'}
                        color={
                            buttonState === 'Members' ? 'success' : 'primary'
                        }
                        onClick={() => setButtonState('Members')}
                    >
                        Members
                    </Button>
                </span>
            </div>
            <div className={styles.horizontalSolidBar}></div>
            <div className={styles.bottomContainer}>
                {buttonState === 'Members' ? (
                    <>
                        <Button
                            size={'medium'}
                            variant="contained"
                            color={'success'}
                            className={styles.bottomContainerAddButton}
                        >
                            Add member
                        </Button>
                        <div className={styles.membersListContainer}>
                            <span className={styles.memberContainer}>
                                <span className={styles.memberLeftContainer}>
                                    <Avatar {...stringAvatar('User Name')} />
                                    <span
                                        className={styles.memberTextContainer}
                                    >
                                        <span
                                            className={
                                                styles.memberNameContainer
                                            }
                                        >
                                            <span className={styles.headerText}>
                                                User Name
                                            </span>{' '}
                                            <Chip
                                                label="Owner"
                                                color={'primary'}
                                                variant="outlined"
                                            />
                                        </span>
                                        <span
                                            className={styles.descriptionText}
                                        >
                                            example@gmail.com
                                        </span>
                                    </span>
                                </span>
                                <span className={styles.descriptionText}>
                                    2024/05/01
                                </span>
                            </span>
                        </div>
                    </>
                ) : (
                    <FileList />
                )}
            </div>
        </div>
    );
});

export default Organization;
