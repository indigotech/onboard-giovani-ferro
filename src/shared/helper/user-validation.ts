export function isStrongPassword(password: string) {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    return password.length >= 6 && hasLetter && hasDigit;
}