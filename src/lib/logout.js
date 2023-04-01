import { goto } from '$app/navigation';
import { auth } from '$lib/firebaseConfig';
export async function logout() {
  try {
    await auth.signOut();
    console.log('User logged out successfully');
    goto('/')
  } catch (error) {
    console.error('Error logging out:', error);
  }
}