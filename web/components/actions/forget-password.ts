"use server";

export async function forgetPassword(email: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/password-resets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });
    if (!res.ok) {
        throw new Error('Failed to forget password');
    }
    return res.json();
}