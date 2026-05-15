export const isEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const isStrongPassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};
export const isPhoneNumber = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};
export const isUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
export const isAWSAccountId = (accountId) => {
    return /^\d{12}$/.test(accountId);
};
export const isEmpty = (value) => {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    if (typeof value === 'object')
        return Object.keys(value).length === 0;
    return false;
};
export const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8)
        strength++;
    if (/[a-z]/.test(password))
        strength++;
    if (/[A-Z]/.test(password))
        strength++;
    if (/\d/.test(password))
        strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password))
        strength++;
    if (strength <= 2)
        return 'weak';
    if (strength <= 4)
        return 'medium';
    return 'strong';
};
