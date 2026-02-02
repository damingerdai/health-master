"use server";

export async function getCurrentUser(accessToken: string) {
  try {
    console.log('getCurrentUser with accessToken:', accessToken);
    console.log('Backend host:', process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST);
     const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      console.error('getCurrentUser failed:', res.statusText);
      return null;
    }

    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('getCurrentUser error:', err);
    return null;
  }
}   