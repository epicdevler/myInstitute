"use server";
import { firebaseAuthAdmin, firestoreDBAdmin } from "@/lib/repositories/remote/config.server";
import { handleAuthError } from "@/lib/utils/handleAuthError";

export default async function deleteStaffAction(
  userId: string,
) {
  try {

    await firebaseAuthAdmin.deleteUser(userId);
    await firestoreDBAdmin.collection("users").doc(userId).delete({exists: true});

    return { success: true };
  } catch (error) {
    
    return {
      success: false,
      message: handleAuthError(error),
    };
  }
}
