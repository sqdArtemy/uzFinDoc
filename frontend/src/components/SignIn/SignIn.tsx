import { useState } from 'react'
import styles from './SignIn.module.scss'
import {
    Button,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react'
import authStore from '../../stores/AuthStore'
import { useLoader } from '../Loader/Loader'
import { useNavigate } from 'react-router-dom'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { validateEmail } from '../../utils'

const SignIn = observer(() => {
    const navigate = useNavigate()
    const { showLoader, hideLoader } = useLoader()
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [emailErrorText, setEmailErrorText] = useState<string>('')

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault()
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show)

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)
        const email: string = data.get('email') as string
        const password: string = data.get('password') as string
        console.log({
            email: email,
            password: password,
        })
        if (!email || !password) {
            return setError('Both password and email must be entered.')
        }

        showLoader()
        try {
            setError('')
            hideLoader()

            authStore.data = {
                ...authStore.data,
                email: email,
                password: password,
            }

            // some auth check with api
            navigate('/auth/sign-up')
        } catch (error) {
            setError('Invalid email or password.')
            hideLoader()
        }
    }

    return (
        <form className={styles.formContainer} onSubmit={handleSubmit}>
            <div className={styles.formTopContainer}>
                <span className={styles.formTextLarge}>
                    Log in to your account
                </span>
                <span className={styles.formTextRegular}>
                    Don't have an account?{' '}
                    <Link to="../initial" relative="path">
                        Sign up
                    </Link>
                </span>
            </div>
            <div className={styles.formInputContainer}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    label="Email *"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    error={!!emailErrorText}
                    helperText={emailErrorText}
                    onChange={(e) =>
                        validateEmail(e.target.value, setEmailErrorText)
                    }
                />
                <FormControl variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">
                        Password *
                    </InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
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
                </FormControl>
                {error && <div className={styles.formError}>{error}</div>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{ margin: '15px 0' }}
                >
                    Continue
                </Button>
            </div>
        </form>
    )
})

export default SignIn
