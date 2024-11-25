import { useState } from 'react';
import styles from './AuthInitial.module.scss';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import userStore from '../../stores/UserStore.ts';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils';

const AuthInitial = observer(() => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [inputErrorText, setInputErrorText] = useState<string>('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputErrorText) return;
        const data = new FormData(event.currentTarget);
        const email: string = data.get('email') as string;
        if (!email) {
            return setError('This is required information.');
        }
        setError('');

        userStore.data = {
            ...userStore.storeData,
            email: email,
        };
        navigate('/auth/sign-up');
    };

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formTopContainer}>
                <span className={styles.formTextLarge}>Sign Up</span>
            </div>
            <div className={styles.formInputContainer}>
                <TextField
                    className={styles.formInput}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email *"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    defaultValue={userStore.storeData.email}
                    onChange={(e) =>
                        validateEmail(e.target.value, setInputErrorText)
                    }
                    helperText={inputErrorText}
                    error={!!inputErrorText}
                />
                {error && <div className={styles.formError}>{error}</div>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: '10px 0' }}
                    size={'large'}
                    sx={{
                        fontSize: '1.2rem',
                    }}
                >
                    Continue
                </Button>
                <span className={styles.formTextRegular}>
                    Already have an account?{' '}
                    <Link to="../sign-in" relative="path">
                        Log in
                    </Link>
                </span>
            </div>
        </form>
    );
});

export default AuthInitial;
