"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export type ProfileFormState = {
  success?: boolean;
  message?: string;
  errors?: {
    username?: string[];
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    gender?: string[];
  };
};

export async function updateProfile(prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken || !session.user) {
    return { success: false, message: "Unauthorized" };
  }

  const data = {
    // id: session.user.id,
    username: formData.get("username") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    gender: formData.get("gender") as string,
  };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_REACT_APP_BACKEND_HOST}/api/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Update profile error:", errorData, data);
      return { 
        success: false, 
        message: errorData.message || "Failed to update profile" 
      };
    }
    revalidatePath("/profile");
    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { success: false, message: "Something went wrong" };
  }
}
