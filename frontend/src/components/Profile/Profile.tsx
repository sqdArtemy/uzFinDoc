import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import { observer } from 'mobx-react';
import userStore from '../../stores/UserStore.ts';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    TextField,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Avatar,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { stringAvatar, validatePwd } from '../../utils';
import { autorun } from 'mobx';

const Profile = observer(() => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pwdErrorText, setPwdErrorText] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: 'undefined',
        surname: 'undefined',
        phoneNumber: 'undefined',
        password: '',
        middleName: 'undefined',
    });

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleClickShowPassword = (setShowPassword) =>
        setShowPassword((show) => !show);

    const handleUpdate = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password: string = data.get('password') as string;
        const phoneNumber: string = data.get('phoneNumber') as string;
        const name: string = data.get('name') as string;
        const surname: string = data.get('surname') as string;
        const middleName: string = data.get('middleName') as string;

        if (password && pwdErrorText) {
            return;
        } else if (!phoneNumber || !name || !surname || !middleName) {
            return setError('All fields are required.');
        }

        console.log(userStore.data);
        console.log(phoneNumber, name, surname);
        userStore.updateUser(userStore.storeData.id, {
            phone: phoneNumber,
            nameFirstName: name,
            nameLastName: surname,
            nameMiddleName: middleName,
            password: password,
        });
    };

    useEffect(() => {
        return autorun(() => {
            if (userStore.state === 'error') {
                setError(userStore.errorMsg);
                setLoading(false);
                userStore.currentState = 'pending';
            } else if (userStore.state === 'success') {
                navigate('/main/profile');
                setLoading(false);
                setFormData({
                    name: userStore.data.nameFirstName,
                    surname: userStore.data.nameLastName,
                    phoneNumber: userStore.data.phone,
                    password: formData.password,
                    middleName: userStore.data.nameMiddleName,
                });
                userStore.currentState = 'pending';
            } else if (userStore.state === 'loading') {
                setError('');
                setLoading(true);
                userStore.currentState = 'pending';
            }
        });
    }, []);

    useEffect(() => {
        setFormData({
            name: userStore.data.nameFirstName,
            surname: userStore.data.nameLastName,
            phoneNumber: userStore.data.phone,
            password: formData.password,
            middleName: userStore.data.nameMiddleName,
        });
    }, []);

    useEffect(() => {}, []);

    return (
        <form className={styles.formContainer} onSubmit={handleUpdate}>
            <div className={styles.formTopContainer}>
                <span className={styles.formTextLarge}>Profile</span>
                <span className={styles.profileContainer}>
                    <Avatar
                        {...stringAvatar(
                            `${userStore.data.nameFirstName} ${userStore.data.nameLastName}`
                        )}
                    />
                    <span className={styles.formTextRegular}>
                        {userStore.data.email ?? 'example@gmail.com'}
                    </span>
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
                    onChange={(e) => {
                        setError('');
                        setFormData({ ...formData, name: e.target.value });
                    }}
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
                    onChange={(e) => {
                        setError('');
                        setFormData({ ...formData, surname: e.target.value });
                    }}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Middle Name *"
                    name="middleName"
                    autoComplete="middleName"
                    autoFocus
                    value={formData.middleName}
                    onChange={(e) => {
                        setError('');
                        setFormData({
                            ...formData,
                            middleName: e.target.value,
                        });
                    }}
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
                    onChange={(e) => {
                        setError('');
                        setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                        });
                    }}
                    // error={!!emailErrorText}
                    // helperText={emailErrorText}
                    // onChange={(e) => validateEmail(e.target.value, setEmailErrorText)}
                />
                <FormControl
                    variant="outlined"
                    className={styles.pwdInputContainer}
                >
                    <InputLabel
                        htmlFor="outlined-adornment-password"
                        error={!!pwdErrorText}
                    >
                        Password
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        error={!!pwdErrorText}
                        onChange={(e) => {
                            setError('');
                            validatePwd(e.target.value, setPwdErrorText);
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            });
                        }}
                        fullWidth
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() =>
                                        handleClickShowPassword(setShowPassword)
                                    }
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOff />
                                    ) : (
                                        <Visibility />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                        value={formData.password || ''}
                        defaultValue={formData.password}
                    />
                    {pwdErrorText && (
                        <FormHelperText error>{pwdErrorText}</FormHelperText>
                    )}
                </FormControl>
                {error && <div className={styles.formError}>{error}</div>}
                <span className={styles.btnsContainer}>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{ margin: '20px 0' }}
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
