// Shared, reactive Firebase sign-in state for the whole app.
import { ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, isConfigured } from "./firebase";

export const currentUser = ref(null);

if (isConfigured) {
  onAuthStateChanged(auth, (u) => (currentUser.value = u));
}

export const signOutUser = () => signOut(auth);
