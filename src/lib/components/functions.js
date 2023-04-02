// import { https } from 'firebase-functions';
// import { initializeApp, auth } from 'firebase-admin';

// initializeApp();

// export const setUserHasVoted = https.onCall(async (data, context) => {
//   const { userId } = data;

//   if (!context.auth || context.auth.uid !== userId) {
//     return { error: 'Not authorized' };
//   }

//   try {
//     await auth().setCustomUserClaims(userId, { hasVoted: true });
//     return { success: true };
//   } catch (error) {
//     console.error('Error setting custom claim:', error);
//     return { error: 'Failed to set custom claim' };
//   }
// });