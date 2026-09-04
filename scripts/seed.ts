/**
 * CleanForge Firestore Seeder
 * Seeds dummy data into Firestore for a given user UID
 * Usage: npm run seed -- demo-user-id
 *        npm run seed:demo (seeds demo-user)
 *        tsx scripts/seed.ts <uid>
 *
 * Requires .env filled with Firebase Admin credentials
 */

import "dotenv/config";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { dummyStandards } from "../src/data-dummy/standards-dummy";
import { dummyMcps } from "../src/data-dummy/mcps-dummy";
import { dummyMessages } from "../src/data-dummy/journals-dummy";
import { dummyFolderTree } from "../src/data-dummy/forge-dummy";

// Initialize Firebase Admin (same logic as src/server/infra/firebase-admin.ts)
if (!getApps().length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    const privateKey = privateKeyRaw.replace(/\\n/g, "\n");
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
    console.log("✓ Firebase Admin initialized with FIREBASE_ADMIN_*");
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
      initializeApp({ credential: cert(credentials) });
      console.log("✓ Firebase Admin initialized with GOOGLE_APPLICATION_CREDENTIALS");
    } catch {
      initializeApp();
      console.log("✓ Firebase Admin initialized with applicationDefault");
    }
  } else {
    initializeApp();
    console.log("✓ Firebase Admin initialized with applicationDefault");
  }
}

const db = getFirestore();

const seedForUser = async (uid: string) => {
  console.log(`\n🌱 Seeding data for user: ${uid}\n`);

  // 1. Seed Standards
  console.log("📁 Seeding standards...");
  for (const std of dummyStandards) {
    const ref = db.doc(`users/${uid}/standards/${std.id}`);
    await ref.set(
      {
        ...std,
        folderStructure: dummyFolderTree,
      },
      { merge: true },
    );
    console.log(`  ✓ ${std.name} (${std.id})`);
  }

  // 2. Seed MCPs
  console.log("\n🔌 Seeding MCPs...");
  for (const mcp of dummyMcps) {
    const ref = db.doc(`users/${uid}/mcps/${mcp.id}`);
    await ref.set(mcp, { merge: true });
    console.log(`  ✓ ${mcp.name} (${mcp.id})`);
  }

  // 3. Seed Journals (one per standard)
  console.log("\n💬 Seeding journals...");
  for (const std of dummyStandards.slice(0, 3)) {
    const journalId = `journal-${std.id}`;
    const ref = db.doc(`users/${uid}/journals/${journalId}`);
    await ref.set(
      {
        id: journalId,
        standardId: std.id,
        uid,
        messages: dummyMessages,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
    console.log(`  ✓ Journal for ${std.name} (${journalId}) with ${dummyMessages.length} messages`);
  }

  console.log(`\n✅ Seeding complete for user: ${uid}`);
  console.log(`   Standards: ${dummyStandards.length}`);
  console.log(`   MCPs: ${dummyMcps.length}`);
  console.log(`   Journals: 3`);
  console.log(`\n💡 Next: login with Firebase Auth as this UID's email, or set this UID as demo-user and test /api/standards with Bearer token`);
};

const main = async () => {
  const uid = process.argv[2] || process.env.SEED_UID || "demo-user";
  if (!uid) {
    console.error("❌ Please provide UID: npm run seed -- <uid>");
    process.exit(1);
  }

  try {
    await seedForUser(uid);
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  }
};

main();
