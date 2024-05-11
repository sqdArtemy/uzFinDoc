import styles from './Organization.module.scss';
import { observer } from 'mobx-react';
import { Avatar, Box, Button, Chip, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { stringAvatar } from '../../utils.ts';
import FileList from '../FileList/FileList.tsx';
import userStore from '../../stores/UserStore.ts';
import OrganizationAction from '../OrganizationAction/OrganizationAction.tsx';
import organizationMembersStore from '../../stores/OrganizationMembersStore.ts';
import { autorun } from 'mobx';
import { useErrorModal } from '../Error/Error.tsx';
import { useLoader } from '../Loader/Loader.tsx';
import { useNavigate } from 'react-router-dom';

const Organization = observer(() => {
    const [buttonState, setButtonState] = useState('Members');
    const [isOpen, setIsOpen] = useState(false);
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();
    const [memberEmail, setMemberEmail] = useState('');
    const [ownerId, setOwnerId] = useState<number | undefined>(
        userStore.data.organization?.owner?.id
    );
    const navigate = useNavigate();

    function handleClose() {
        setIsOpen(false);
    }

    useEffect(() => {
        setOwnerId(userStore.data.organization?.owner?.id);
        if (userStore.data.organization)
            organizationMembersStore.getAllMembers(
                userStore.data.organization.id
            );
        return autorun(() => {
            if (organizationMembersStore.state === 'error') {
                showErrorModal(organizationMembersStore.errorMessage);
                hideLoader();
                organizationMembersStore.currentState = 'pending';
            } else if (organizationMembersStore.state === 'loading') {
                showLoader();
                organizationMembersStore.currentState = 'pending';
            } else if (organizationMembersStore.state === 'success') {
                hideLoader();
                organizationMembersStore.currentState = 'pending';
            }
        });
    }, []);

    useEffect(() => {
        if (userStore.data.organization) {
            organizationMembersStore.getAllMembers(
                userStore.data.organization.id
            );
        }
        if (userStore.data.organization?.owner)
            setOwnerId(userStore.data.organization.owner.id);
    }, [userStore.storeData]);

    function handleAddMember(email) {
        organizationMembersStore.addMember(
            userStore.data.organization!.id,
            email
        );
    }

    function handleDeleteMember(email: string) {
        organizationMembersStore.deleteMember(
            userStore.data.organization!.id,
            email
        );
    }

    function handleDelete(isOwner: boolean) {
        if (isOwner) {
            userStore.deleteOrganization(userStore.data.organization!.id);
        } else {
            organizationMembersStore.deleteMember(
                userStore.data.organization!.id,
                userStore.data.email
            );
        }
        navigate('/main/translate');
    }

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.upperContainer}>
                <Box
                    flexDirection={'row'}
                    sx={{
                        height: '100%',
                        width: '100%',
                        paddingRight: '5rem',
                    }}
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'flex-start'}
                >
                    <Box
                        flexDirection={'column'}
                        sx={{
                            height: '100%',
                        }}
                        display={'flex'}
                        justifyContent={'space-between'}
                    >
                        <div className={styles.organizationInfoContainer}>
                            <Avatar
                                {...stringAvatar(
                                    userStore.data.organization?.name ?? ''
                                )}
                                variant={'square'}
                                sx={{ width: 90, height: 90 }}
                            />
                            <div
                                className={
                                    styles.organizationInfoRightContainer
                                }
                            >
                                <span className={styles.headerText}>
                                    {userStore.data.organization?.name ??
                                        'undefined'}
                                </span>
                                <span className={styles.descriptionText}>
                                    {userStore.data.organization?.email ??
                                        'undefined'}
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
                                    buttonState === 'Documents'
                                        ? 'primary'
                                        : 'inherit'
                                }
                                onClick={() => setButtonState('Documents')}
                            >
                                Documents
                            </Button>
                            <Button
                                size={'small'}
                                variant={'text'}
                                color={
                                    buttonState === 'Members'
                                        ? 'primary'
                                        : 'inherit'
                                }
                                onClick={() => setButtonState('Members')}
                            >
                                Members
                            </Button>
                        </span>
                    </Box>
                    <Button
                        variant={'contained'}
                        size={'large'}
                        color={'error'}
                        sx={{
                            marginTop: '3rem',
                        }}
                        onClick={() =>
                            handleDelete(userStore.data.id === ownerId)
                        }
                    >
                        {userStore.data.id === ownerId
                            ? 'Remove Organization'
                            : 'Leave Organization'}
                    </Button>
                </Box>
            </div>
            <div className={styles.horizontalSolidBar}></div>
            <div className={styles.bottomContainer}>
                {buttonState === 'Members' ? (
                    <>
                        <Box
                            flexDirection={'row'}
                            gap={'0.5rem'}
                            display={'flex'}
                        >
                            <TextField
                                variant="outlined"
                                size={'small'}
                                label={'Member Email'}
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                            />
                            <Button
                                size={'medium'}
                                variant="contained"
                                color={'primary'}
                                className={styles.bottomContainerAddButton}
                                onClick={() => handleAddMember(memberEmail)}
                            >
                                Add member
                            </Button>
                        </Box>
                        <div className={styles.membersListContainer}>
                            {[...organizationMembersStore.data]
                                .sort((a, b) => {
                                    if (a.id === ownerId) return -1;
                                    if (b.id === ownerId) return 1;
                                    return 0;
                                })
                                .map((member) => (
                                    <span
                                        key={member.id}
                                        className={styles.memberContainer}
                                    >
                                        <span
                                            className={
                                                styles.memberLeftContainer
                                            }
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
                                                    {ownerId === member.id ? (
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
                                        {member.id !== ownerId &&
                                            userStore.data.id === ownerId && (
                                                <Button
                                                    size={'large'}
                                                    variant="contained"
                                                    color={'error'}
                                                    onClick={() =>
                                                        handleDeleteMember(
                                                            member.email
                                                        )
                                                    }
                                                >
                                                    REMOVE MEMBER
                                                </Button>
                                            )}
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
