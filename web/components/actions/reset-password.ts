"use server";



export async function resetPassword(params: {
    token: string;
    email: string;
    password: string;
}) {
    const { token, email, password } = params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/password-resets/${token}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirm_password: password }),
    });
    if (!res.ok) {
        throw new Error('Failed to reset password');
    }
    return res.json();
}