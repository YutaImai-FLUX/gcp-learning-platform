import { initializeApp, getApps } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]
  return initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID })
}

const adminApp = getAdminApp()
const adminAuth = getAuth(adminApp)
const adminDb = getFirestore(adminApp)

export { adminApp, adminAuth, adminDb }
