import styles from './Organization.module.scss';
import { observer } from 'mobx-react';
import { Avatar, Button, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { stringAvatar } from '../../utils.ts';
import FileList from '../FileList/FileList.tsx';
import userStore from '../../stores/UserStore.ts';
import OrganizationAction from '../OrganizationAction/OrganizationAction.tsx';
import organizationMembersStore from '../../stores/OrganizationMembersStore.ts';
import { autorun } from 'mobx';
import { useErrorModal } from '../Error/Error.tsx';
import { useLoader } from '../Loader/Loader.tsx';
import { IGetUserResponse } from '../../api/interfaces/responses/users.ts';

const Organization = observer(() => {
    const [buttonState, setButtonState] = useState('Members');
    const [isOpen, setIsOpen] = useState(false);
    const [members, setMembers] = useState<IGetUserResponse[]>([]);
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();

    function handleClose() {
        setIsOpen(false);
    }

    useEffect(() => {
        return autorun(() => {
            if (organizationMembersStore.state === 'error') {
                showErrorModal(organizationMembersStore.errorMessage);
                hideLoader();
            } else if (organizationMembersStore.state === 'loading') {
                showLoader();
            } else if (organizationMembersStore.state === 'success') {
                setMembers(organizationMembersStore.data);
                hideLoader();
            }
        });
    }, []);

    useEffect(() => {
        if (userStore.data.organization)
            organizationMembersStore.getAllMembers(
                userStore.data.organization.id
            );
    }, [userStore.storeData]);

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.upperContainer}>
                <div className={styles.organizationInfoContainer}>
                    <Avatar
                        {...stringAvatar(
                            userStore.data.organization?.name ?? ''
                        )}
                        variant={'square'}
                        sx={{ width: 90, height: 90 }}
                    />
                    <div className={styles.organizationInfoRightContainer}>
                        <span className={styles.headerText}>
                            {userStore.data.organization?.name ?? 'undefined'}
                        </span>
                        <span className={styles.descriptionText}>
                            {userStore.data.organization?.email ?? 'undefined'}
                        </span>
                        <Button
                            variant={'outlined'}
                            size={'small'}
                            fullWidth
                            color={'primary'}
                            onClick={() => setIsOpen(true)}
                        >
                            Update Info
                        </Button>
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
                            {members.map((member) => (
                                <span
                                    key={member.id}
                                    className={styles.memberContainer}
                                >
                                    <span
                                        className={styles.memberLeftContainer}
                                    >
                                        <Avatar
                                            {...stringAvatar(
                                                member.nameFirstName +
                                                    ' ' +
                                                    member.nameLastName
                                            )}
                                        />
                                        <span
                                            className={
                                                styles.memberTextContainer
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.memberNameContainer
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.headerText
                                                    }
                                                >
                                                    {member.nameFirstName +
                                                        ' ' +
                                                        member.nameLastName}
                                                </span>{' '}
                                                {member.email ===
                                                userStore.data.email ? (
                                                    <Chip
                                                        label="Owner"
                                                        color={'primary'}
                                                        variant="outlined"
                                                    />
                                                ) : (
                                                    <></>
                                                )}
                                            </span>
                                            <span
                                                className={
                                                    styles.descriptionText
                                                }
                                            >
                                                {member.email}
                                            </span>
                                        </span>
                                    </span>
                                    <Button
                                        size={'large'}
                                        variant="contained"
                                        color={'error'}
                                        onClick={() => {
                                            organizationMembersStore.deleteMember(
                                                member.organization!.id,
                                                member.email
                                            );
                                        }}
                                    >
                                        REMOVE MEMBER
                                    </Button>
                                </span>
                            ))}
                        </div>
                    </>
                ) : (
                    <FileList
                        organizationId={userStore.data.organization?.id}
                    />
                )}
            </div>
            <OrganizationAction
                open={isOpen}
                handleClose={handleClose}
                initialData={{
                    name: userStore.data.organization?.name ?? '',
                    email: userStore.data.organization?.email ?? '',
                }}
            />
        </div>
    );
});

export default Organization;
