import { useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import { observer } from 'mobx-react';
import authStore from '../../stores/AuthStore';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
    TextField,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { validatePwd } from '../../utils';
import { autorun } from 'mobx';
import profileLogo from '../../assets/profile-logo.png';

const Profile = observer(() => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pwdErrorText, setPwdErrorText] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: authStore.data.nameFirstName,
        surname: authStore.data.nameLastName,
        phoneNumber: authStore.data.phone,
        password: authStore.data.password,
        middleName: authStore.data.nameMiddleName,
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

        if (pwdErrorText) {
            return;
        } else if (!password || !phoneNumber || !name || !surname) {
            return setError('All fields are required.');
        }

        console.log(authStore.data);
        console.log(phoneNumber, name, surname);
        authStore.updateUser({
            phone: phoneNumber,
            nameFirstName: name,
            nameLastName: surname,
            nameMiddleName: middleName,
        });
    };

    useEffect(() => {
        autorun(() => {
            if (authStore.state === 'error') {
                setError(authStore.errorMessage);
                setLoading(false);
            } else if (authStore.state === 'success') {
                navigate('/profile');
                setLoading(false);
            } else if (authStore.state === 'loading') {
                setError('');
                setLoading(true);
            }
            setFormData({
                name: authStore.data.nameFirstName,
                surname: authStore.data.nameLastName,
                phoneNumber: authStore.data.phone,
                password: authStore.data.password,
                middleName: authStore.data.nameMiddleName,
            });
        });
    }, []);

    const handleCancel = () => {
        setFormData({
            name: authStore.data.nameFirstName,
            surname: authStore.data.nameLastName,
            phoneNumber: authStore.data.phone,
            password: authStore.data.password,
            middleName: authStore.data.nameMiddleName,
        });
    };

    useEffect(() => {}, []);

    return (
        <form className={styles.formContainer} onSubmit={handleUpdate}>
            <div className={styles.formTopContainer}>
                <span className={styles.formTextLarge}>Profile</span>
                <span className={styles.profileContainer}>
                    <img className={styles.profileLogo} src={profileLogo}></img>
                    <span className={styles.formTextRegular}>
                        {authStore.data.email ?? 'example@gmail.com'}
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
                    value={formData.name || ''}
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
                    value={formData.surname || ''}
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
                    value={formData.middleName || ''}
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
                    value={formData.phoneNumber || ''}
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
                        Password *
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
                    <Button
                        variant="contained"
                        color="error"
                        style={{ margin: '20px 0' }}
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        type="submit"
                        variant="outlined"
                        color="success"
                        style={{ margin: '20px 0' }}
                        // onClick={() => setLoading(true)}
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
