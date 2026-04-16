"use server";
import { User } from "@/lib/models/User";
import { firebaseAuthAdmin, firestoreDBAdmin } from "@/lib/repositories/remote/config.server";
import { handleAuthError } from "@/lib/utils/handleAuthError";
import bcrypt from "bcryptjs";
import { Timestamp } from "firebase-admin/firestore";

export default async function createStaffAction(
  details: Omit<User, "id" | "createAt">,
) {
  try {
    
    const record = await firebaseAuthAdmin.createUser({
      email: details.email,
      password: details.password,
    //   phoneNumber: details.phone,
      displayName: `${details?.staff?.title ?? ""} ${details.lastName}`.trim(),
      emailVerified: true,
    });

    const passwordHash = await bcrypt.hash(details.password, 10);

    const newUser = {
      ...details,
      password: passwordHash,
      createAt: Timestamp.now(),
    };

    await firestoreDBAdmin.collection("users").doc(record.uid).set(newUser);

    return { success: true };
  } catch (error) {
    
    return {
      success: false,
      message: handleAuthError(error),
    };
  }
}
