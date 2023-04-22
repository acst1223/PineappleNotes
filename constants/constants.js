module.exports = Object.freeze({
    USERNAME_MIN_LEN: 3,
    USERNAME_MAX_LEN: 20,
    EMAIL_MIN_LEN: 6,
    EMAIL_MAX_LEN: 255,
    PASSWORD_PLAIN_MIN_LEN: 6,
    PASSWORD_PLAIN_MAX_LEN: 20,
    PASSWORD_CIPHER_MIN_LEN: 60,
    PASSWORD_CIPHER_MAX_LEN: 60,
    STATUS_PENDING: 'Pending',
    STATUS_ACTIVE: 'Active',

    BCRYPT_N_ROUNDS: 10,

    USERNAME_REGISTERED_ERROR: "Username has already been registered.",
    EMAIL_REGISTERED_ERROR: "Email has already been registered.",
    CONFIRMATION_CODE_ERROR: "Username or confirmation code error.",
    CONFIRMATION_CODE_SUCCESS: "Your account has been confirmed."
})