"use server";

export async function forgetPassword(email: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/password-resets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      // 获取后端返回的具体错误内容（如果有）
      const errorData = await res.json().catch(() => null);
      
      console.error("[Server Action Error] forgetPassword failed:", {
        email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
        status: res.status,
        statusText: res.statusText,
        errorData,
      });

      throw new Error('Failed to forget password');
    }

    return await res.json();
  } catch (error) {
    console.error("[Server Action Exception] forgetPassword:", {
       email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
      error: error instanceof Error ? error.message : error,
    });
    
    throw error;
  }
}