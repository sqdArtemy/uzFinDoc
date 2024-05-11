import { z } from 'zod';

function validate(text: string, setErrorText, errorText: string, zodSchema) {
    if (!text) {
        return setErrorText('');
    }
    try {
        zodSchema.parse(text);
        setErrorText('');
    } catch (error) {
        setErrorText(errorText);
    }
}

export function validateEmail(text: string, setErrorText) {
    const emailSchema = z.coerce.string().email();
    return validate(text, setErrorText, 'Invalid email format.', emailSchema);
}

export function validatePwd(text: string, setErrorText) {
    const passwordSchema = z.coerce
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,])[A-Za-z\d@$!%*?&.,]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special symbol'
        );

    return validate(
        text,
        setErrorText,
        'Invalid password format.',
        passwordSchema
    );
}

export function validateVerifyPwd(
    pwd: string,
    verifyPwd: string,
    setErrorText
) {
    if (!verifyPwd) return setErrorText('');
    if (pwd !== verifyPwd) return setErrorText("Passwords don't match.");
    return setErrorText('');
}

function stringToColor(string: string) {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
}

export function stringAvatar(name: string) {
    let initials: string | string[] = name
        .split(' ')
        .map((word) => word[0])
        .join('');

    if (name.length > 1) {
        initials = initials
            .split('')
            .slice(0, 2)
            .map((letter) => letter.toUpperCase())
            .join('');
    } else {
        initials = initials
            .split('')
            .map((letter) => letter.toUpperCase())
            .join('');
    }
    return {
        sx: {
            bgcolor: stringToColor(name),
            width: '3.5rem',
            height: '3.5rem',
        },
        children: initials,
    };
}
