import { useEffect, useState } from 'react';
import styles from './SignUpPwd.module.scss';
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { observer } from 'mobx-react';
import authStore from '../../stores/AuthStore';
import { useLoader } from '../Loader/Loader';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { validatePwd, validateVerifyPwd } from '../../utils';
import { autorun } from 'mobx';

const SignUpPwd = observer(() => {
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [pwdErrorText, setPwdErrorText] = useState('');
    const [verifyPwdErrorText, setVerifyPwdErrorText] = useState('');
    const [pwd, setPwd] = useState('');
    const [verifyPwd, setVerifyPwd] = useState('');

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const handleClickShowPassword = (setShowPassword) =>
        setShowPassword((show) => !show);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const password: string = data.get('password') as string;
        const verifyPassword: string = data.get('verifyPassword') as string;

        if (!password || !verifyPassword) {
            return setError('Both fields should be filled.');
        }

        authStore.data.password = password;
        authStore.register({
            email: authStore.storeData.email,
            phone: authStore.storeData.phone,
            password: password,
            nameFirstName: authStore.storeData.nameFirstName,
            nameLastName: authStore.storeData.nameLastName,
            nameMiddleName: 'something',
        });
    };

    useEffect(() => {
        autorun(() => {
            if (authStore.state === 'error') {
                setError(authStore.errorMessage);
                hideLoader();
            } else if (authStore.state === 'success') {
                navigate('/profile');
                hideLoader();
            } else if (authStore.state === 'loading') {
                setError('');
                showLoader();
            }
        });
    }, []);

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formTopContainer}>
                <span className={styles.formTextLarge}>Sign Up</span>
            </div>
            <div className={styles.formInputContainer}>
                <div className={styles.fieldsContainer}>
                    <FormControl variant="outlined">
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
                                setPwd(e.target.value);
                                validatePwd(e.target.value, setPwdErrorText);
                                validateVerifyPwd(
                                    e.target.value,
                                    verifyPwd,
                                    setVerifyPwdErrorText
                                );
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            handleClickShowPassword(
                                                setShowPassword
                                            )
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
                        />
                        {pwdErrorText && (
                            <FormHelperText error>
                                {pwdErrorText}
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel
                            htmlFor="outlined-adornment-password"
                            error={!!verifyPwdErrorText}
                        >
                            Verify Password *
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={showVerifyPassword ? 'text' : 'password'}
                            name="verifyPassword"
                            error={!!verifyPwdErrorText}
                            onChange={(e) => {
                                setVerifyPwd(e.target.value);
                                validateVerifyPwd(
                                    pwd,
                                    e.target.value,
                                    setVerifyPwdErrorText
                                );
                            }}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            handleClickShowPassword(
                                                setShowVerifyPassword
                                            )
                                        }
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showVerifyPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Verify Password"
                        />
                        {verifyPwdErrorText && (
                            <FormHelperText error>
                                {verifyPwdErrorText}
                            </FormHelperText>
                        )}
                    </FormControl>
                </div>
                <div className={styles.pwdReqsContainer}>
                    <ul>
                        <li>At least 8 characters</li>
                        <li>At least 1 uppercase letter</li>
                        <li>At least 1 lowercase letter</li>
                        <li>At least 1 special symbol</li>
                    </ul>
                </div>
                {error && <div className={styles.formError}>{error}</div>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: '15px 0' }}
                >
                    Create account
                </Button>
                <Button
                    className={styles.backBtn}
                    variant="text"
                    color="primary"
                    style={{ margin: '15px 0' }}
                    startIcon={<ArrowBackIosNewIcon />}
                    onClick={() => navigate('/auth/sign-up/details')}
                >
                    Back
                </Button>
            </div>
        </form>
    );
});

export default SignUpPwd;