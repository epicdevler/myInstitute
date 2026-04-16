"use server";
import { User } from "@/lib/models/User";
import { firebaseAuthAdmin, firestoreDBAdmin } from "@/lib/repositories/remote/config.server";
import { handleAuthError } from "@/lib/utils/handleAuthError";
import { Timestamp } from "firebase-admin/firestore";

export default async function updateStaffAction(
  userId: string,
  details: Omit<User, "id" | "createAt" | "password">,
) {
  try {
    
    const record = await firebaseAuthAdmin.updateUser(userId, {
      email: details.email,
    //   phoneNumber: details.phone,
      displayName: `${details?.staff?.title ?? ""} ${details.lastName}`.trim(),
      emailVerified: true,
    });


    const newUser = {
      ...details,
      updatedAt: Timestamp.now(),
    };

    await firestoreDBAdmin.collection("users").doc(record.uid).update(newUser);

    return { success: true };
  } catch (error) {
    
    return {
      success: false,
      message: handleAuthError(error),
    };
  }
}
