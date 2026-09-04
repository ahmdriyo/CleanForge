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
import { getAuth } from "firebase-admin/auth";
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
const adminAuth = getAuth();

// Demo users for testing login
const DEMO_USERS = [
  {
    email: "demo@cleanforge.dev",
    password: "Demo123!",
    displayName: "Demo User",
    emailVerified: true,
  },
  {
    email: "test@cleanforge.dev",
    password: "Test123!",
    displayName: "Test User",
    emailVerified: true,
  },
];

const ensureDemoUsers = async (): Promise<string[]> => {
  const uids: string[] = [];
  console.log("\n👤 Ensuring demo users...");
  for (const demo of DEMO_USERS) {
    try {
      let user;
      try {
        user = await adminAuth.getUserByEmail(demo.email);
        console.log(`  ↻ ${demo.email} already exists (${user.uid})`);
      } catch {
        user = await adminAuth.createUser({
          email: demo.email,
          password: demo.password,
          displayName: demo.displayName,
          emailVerified: demo.emailVerified,
        });
        console.log(`  ✓ Created ${demo.email} (${user.uid}) — password: ${demo.password}`);
      }
      // Ensure Firestore user doc
      await db.doc(`users/${user.uid}`).set(
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          provider: "password",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );
      uids.push(user.uid);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`  ✗ Failed ${demo.email}:`, msg);
    }
  }
  return uids;
};

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
  const argUid = process.argv[2];

  // If specific UID provided, seed only that user
  if (argUid && !argUid.startsWith("--")) {
    try {
      await seedForUser(argUid);
      process.exit(0);
    } catch (e) {
      console.error("❌ Seed failed:", e);
      process.exit(1);
    }
    return;
  }

  // Otherwise seed demo users + any SEED_UID
  try {
    const demoUids = await ensureDemoUsers();
    for (const uid of demoUids) {
      await seedForUser(uid);
    }

    // Also seed custom UID if provided via env
    const extraUid = process.env.SEED_UID;
    if (extraUid && !demoUids.includes(extraUid)) {
      await seedForUser(extraUid);
    }

    console.log("\n🎉 All demo users seeded!");
    console.log("   demo@cleanforge.dev / Demo123!");
    console.log("   test@cleanforge.dev / Test123!");
    console.log("\n💡 Login at /login with one of these accounts");
    process.exit(0);
  } catch (e) {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  }
};

main();
