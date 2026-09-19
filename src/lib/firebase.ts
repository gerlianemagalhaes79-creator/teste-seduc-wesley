import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  doc,
  getDocFromServer,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
export const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

/* CRITICAL: The app will break without this line */
export const db: Firestore = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
})();

export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo:
        auth?.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection to Firestore as required by Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
      return false;
    }
    return true;
  }
}

// Run connection verification
testConnection().catch((err) => {
  console.warn("Firestore connection check info:", err?.message || err);
});

/**
 * Generates or retrieves a persistent local user ID for consistent per-user Firestore storage
 */
export function getOrCreatePersistentUserId(): string {
  const KEY = "seduc_ce_persistent_uid_v1";
  try {
    let uid = localStorage.getItem(KEY);
    if (!uid) {
      uid = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem(KEY, uid);
    }
    return uid;
  } catch {
    return `user_${Date.now()}`;
  }
}

/**
 * Sign in using Google popup
 */
export async function signInWithGoogle(): Promise<User> {
  const res = await signInWithPopup(auth, googleProvider);
  return res.user;
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Ensures user is authenticated via Google or Anonymous Auth if available,
 * or gracefully falls back to a persistent device user ID if Anonymous provider is restricted in Firebase console.
 */
export function ensureAuthenticatedUser(
  onUserReady?: (user: { uid: string; email?: string | null; displayName?: string | null }) => void
): () => void {
  const fallbackUid = getOrCreatePersistentUserId();

  if (!auth) {
    if (onUserReady) onUserReady({ uid: fallbackUid });
    return () => {};
  }

  let isReadyCalled = false;

  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      isReadyCalled = true;
      if (onUserReady) onUserReady(user);
    } else {
      try {
        const cred = await signInAnonymously(auth);
        isReadyCalled = true;
        if (onUserReady) onUserReady(cred.user);
      } catch {
        // Fall back gracefully to persistent device ID if anonymous auth is restricted
        if (!isReadyCalled && onUserReady) {
          isReadyCalled = true;
          onUserReady({ uid: fallbackUid });
        }
      }
    }
  });

  return unsubscribe;
}

