import { useState } from 'react';
import styles from './SignUp.module.scss';
import { Button, TextField } from '@mui/material';
import { observer } from 'mobx-react';
import userStore from '../../stores/UserStore.ts';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { ArrowForwardIos } from '@mui/icons-material';

const SignUp = observer(() => {
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name') as string;
        const surname = data.get('surname') as string;
        const middleName = data.get('middleName') as string;
        const phoneNumber = data.get('phoneNumber') as string;
        console.log({
            email: userStore.storeData.email,
            name,
            surname,
            phoneNumber,
        });
        if (!name || !surname || !phoneNumber) {
            return setError('This is required information.');
        }

        userStore.data = {
            ...userStore.storeData,
            nameFirstName: name,
            nameLastName: surname,
            phone: phoneNumber,
            nameMiddleName: middleName,
        };
        navigate('/auth/sign-up/pwd');
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formTopContainer}>
                <span className={styles.formTextLarge}>Sign Up</span>
                <span className={styles.formTextRegular}>
                    Welcome, {userStore.storeData.email}
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
                    defaultValue={userStore.storeData.nameFirstName}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Surname *"
                    name="surname"
                    autoComplete="surname"
                    autoFocus
                    defaultValue={userStore.storeData.nameLastName}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Middle Name *"
                    name="middleName"
                    autoComplete="middleName"
                    autoFocus
                    defaultValue={userStore.storeData.nameLastName}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Phone Number *"
                    name="phoneNumber"
                    autoComplete="phoneNumber"
                    autoFocus
                    defaultValue={userStore.storeData.phone}
                    onChange={(e) => {
                        const value = e.target.value;
                        for (let i = 0; i < value.length; i++) {
                            if (isNaN(parseInt(value[i]))) {
                                e.target.value = value.slice(0, i);
                                break;
                            }
                        }
                        if (value.length > 12) {
                            e.target.value = value.slice(0, 12);
                        }
                    }}
                />
                {error && <div className={styles.formError}>{error}</div>}
                <span className={styles.btnsContainer}>
                    <Button
                        className={styles.backBtn}
                        variant="text"
                        color="primary"
                        style={{ margin: '15px 0' }}
                        startIcon={<ArrowBackIosNewIcon />}
                        onClick={() => navigate('/auth/initial')}
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ margin: '15px 0' }}
                        endIcon={<ArrowForwardIos />}
                    >
                        Next
                    </Button>
                </span>
            </div>
        </form>
    );
});

export default SignUp;
