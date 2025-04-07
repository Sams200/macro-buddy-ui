export interface SignInRequest {
    username: string;
    password: string;
    captcha: string;
}

export interface SignUpRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    recaptchaToken: string;
}

export interface PasswordChangeRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}