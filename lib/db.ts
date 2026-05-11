import fs from "fs";
import path from "path";
import Database from "better-sqlite3";
import type { ContactSubmission, PackageDetail, PackageSummary, Review } from "@/app/types";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.sqlite");
const PACKAGE_DIR = path.join(process.cwd(), "public", "packages");

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function rowToPackage(row: any): PackageDetail {
  return {
    id: row.id,
    title: row.title,
    destination: JSON.parse(row.destination),
    duration: row.duration,
    price: row.price,
    coverImage: row.coverImage,
    shortDescription: row.shortDescription,
    overview: row.overview,
    highlights: JSON.parse(row.highlights),
    itinerary: JSON.parse(row.itinerary),
    inclusions: JSON.parse(row.inclusions),
    exclusions: JSON.parse(row.exclusions),
    gallery: JSON.parse(row.gallery),
    termsAndConditions: row.termsAndConditions
      ? JSON.parse(row.termsAndConditions)
      : undefined,
    termsNote: row.termsNote || undefined,
    itineraryPdf: row.itineraryPdf || undefined,
    highlighted: Boolean(row.highlighted),
    published: Boolean(row.published),
  };
}

function rowToSummary(row: any): PackageSummary {
  return {
    id: row.id,
    title: row.title,
    destination: JSON.parse(row.destination),
    duration: row.duration,
    price: row.price,
    image: row.coverImage,
    shortDescription: row.shortDescription,
    highlighted: Boolean(row.highlighted),
    published: Boolean(row.published),
  };
}

function rowToReview(row: any): Review {
  return {
    id: row.id,
    name: row.name,
    email: row.email || undefined,
    rating: row.rating,
    review: row.review,
    image: row.image || undefined,
    packageId: row.package_id || undefined,
    highlightedHome: Boolean(row.highlighted_home),
    highlightedPackage: Boolean(row.highlighted_package),
    approved: Boolean(row.approved),
    createdAt: row.created_at,
  };
}

function rowToContact(row: any): ContactSubmission {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone || undefined,
    subject: row.subject,
    message: row.message,
    read: Boolean(row.read),
    createdAt: row.created_at,
  };
}

function openDatabase() {
  ensureDataDirectory();
  const db = new Database(DB_FILE);
  db.exec(`
    CREATE TABLE IF NOT EXISTS packages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      destination TEXT NOT NULL,
      duration TEXT NOT NULL,
      price TEXT NOT NULL,
      coverImage TEXT NOT NULL,
      shortDescription TEXT NOT NULL,
      overview TEXT NOT NULL,
      highlights TEXT NOT NULL,
      itinerary TEXT NOT NULL,
      inclusions TEXT NOT NULL,
      exclusions TEXT NOT NULL,
      gallery TEXT NOT NULL,
      termsAndConditions TEXT,
      termsNote TEXT,
      itineraryPdf TEXT,
      highlighted INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT DEFAULT '',
      rating REAL NOT NULL,
      review TEXT NOT NULL,
      image TEXT DEFAULT '',
      highlighted_home INTEGER DEFAULT 0,
      highlighted_package INTEGER DEFAULT 0,
      approved INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  return db;
}

function seedDatabase(db: Database.Database) {
  try {
    const indexPath = path.join(PACKAGE_DIR, "index.json");
    if (!fs.existsSync(indexPath)) return;
    const source = JSON.parse(fs.readFileSync(indexPath, "utf-8")) as {
      packages: Array<{ id: string }>;
    };

    const insert = db.prepare(
      `INSERT OR IGNORE INTO packages (
        id,
        title,
        destination,
        duration,
        price,
        coverImage,
        shortDescription,
        overview,
        highlights,
        itinerary,
        inclusions,
        exclusions,
        gallery,
        termsAndConditions,
        termsNote,
        itineraryPdf,
        highlighted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    const details = source.packages.map((item) => item.id).filter(Boolean);
    for (const packageId of details) {
      const packagePath = path.join(PACKAGE_DIR, `${packageId}.json`);
      if (!fs.existsSync(packagePath)) continue;
      const raw = fs.readFileSync(packagePath, "utf-8");
      const pkg = JSON.parse(raw) as PackageDetail;
      insert.run(
        pkg.id,
        pkg.title,
        JSON.stringify(pkg.destination),
        pkg.duration,
        pkg.price,
        pkg.coverImage,
        pkg.shortDescription,
        pkg.overview,
        JSON.stringify(pkg.highlights || []),
        JSON.stringify(pkg.itinerary || []),
        JSON.stringify(pkg.inclusions || []),
        JSON.stringify(pkg.exclusions || []),
        JSON.stringify(pkg.gallery || []),
        pkg.termsAndConditions ? JSON.stringify(pkg.termsAndConditions) : null,
        pkg.termsNote || null,
        pkg.itineraryPdf || null,
        pkg.highlighted ? 1 : 0,
      );
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

function migrateDatabase(db: Database.Database) {
  const cols = db.pragma("table_info(packages)") as Array<{ name: string }>;
  const hasTheme = cols.some((c) => c.name === "theme");

  if (hasTheme) {
    const hasItineraryPdf = cols.some((c) => c.name === "itineraryPdf");
    const hasHighlighted = cols.some((c) => c.name === "highlighted");
    const pdfExpr = hasItineraryPdf ? "itineraryPdf" : "NULL";
    const hlExpr = hasHighlighted ? "COALESCE(highlighted, 0)" : "0";
    db.transaction(() => {
      db.exec(`
        CREATE TABLE packages_v2 (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          destination TEXT NOT NULL,
          duration TEXT NOT NULL,
          price TEXT NOT NULL,
          coverImage TEXT NOT NULL,
          shortDescription TEXT NOT NULL,
          overview TEXT NOT NULL,
          highlights TEXT NOT NULL,
          itinerary TEXT NOT NULL,
          inclusions TEXT NOT NULL,
          exclusions TEXT NOT NULL,
          gallery TEXT NOT NULL,
          termsAndConditions TEXT,
          termsNote TEXT,
          itineraryPdf TEXT,
          highlighted INTEGER DEFAULT 0
        )
      `);
      db.exec(`
        INSERT INTO packages_v2
          (id,title,destination,duration,price,coverImage,shortDescription,
           overview,highlights,itinerary,inclusions,exclusions,gallery,
           termsAndConditions,termsNote,itineraryPdf,highlighted)
        SELECT
          id,title,destination,duration,price,coverImage,shortDescription,
          overview,highlights,itinerary,inclusions,exclusions,gallery,
          termsAndConditions,termsNote,${pdfExpr},${hlExpr}
        FROM packages
      `);
      db.exec("DROP TABLE packages");
      db.exec("ALTER TABLE packages_v2 RENAME TO packages");
    })();
    return;
  }

  if (!cols.some((c) => c.name === "itineraryPdf")) {
    db.exec("ALTER TABLE packages ADD COLUMN itineraryPdf TEXT");
  }
  if (!cols.some((c) => c.name === "highlighted")) {
    db.exec("ALTER TABLE packages ADD COLUMN highlighted INTEGER DEFAULT 0");
  }
  if (!cols.some((c) => c.name === "published")) {
    db.exec("ALTER TABLE packages ADD COLUMN published INTEGER DEFAULT 0");
    db.exec("UPDATE packages SET published = 1");
  }

  const reviewCols = db.pragma("table_info(reviews)") as Array<{ name: string }>;
  if (!reviewCols.some((c) => c.name === "package_id")) {
    db.exec("ALTER TABLE reviews ADD COLUMN package_id TEXT");
  }
}

function seedReviews(db: Database.Database) {
  try {
    const count = (
      db.prepare("SELECT COUNT(*) as count FROM reviews").get() as {
        count: number;
      }
    ).count;
    if (count > 0) return;

    const reviewsPath = path.join(process.cwd(), "public", "reviews.json");
    if (!fs.existsSync(reviewsPath)) return;

    const source = JSON.parse(fs.readFileSync(reviewsPath, "utf-8")) as {
      reviews: Array<{
        name: string;
        rating: number;
        review: string;
        image?: string;
      }>;
    };

    const insert = db.prepare(
      `INSERT INTO reviews (name, email, rating, review, image, highlighted_home, highlighted_package, approved)
       VALUES (?, '', ?, ?, ?, 1, 0, 1)`,
    );

    for (const r of source.reviews) {
      insert.run(r.name, r.rating, r.review, r.image || "");
    }
  } catch (error) {
    console.error("Failed to seed reviews:", error);
  }
}

const db = openDatabase();
migrateDatabase(db);
seedDatabase(db);
seedReviews(db);

export function getPackageById(id: string): PackageDetail | null {
  const row = db.prepare("SELECT * FROM packages WHERE id = ?").get(id);
  return row ? rowToPackage(row) : null;
}

export function getPackageSummaries(): PackageSummary[] {
  return db
    .prepare("SELECT * FROM packages WHERE published = 1 ORDER BY title ASC")
    .all()
    .map(rowToSummary);
}

export function getAllPackageSummaries(): PackageSummary[] {
  return db
    .prepare("SELECT * FROM packages ORDER BY title ASC")
    .all()
    .map(rowToSummary);
}

export function getPackageDetails(): PackageDetail[] {
  return db
    .prepare("SELECT * FROM packages ORDER BY title ASC")
    .all()
    .map(rowToPackage);
}

export function savePackage(pkg: PackageDetail) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO packages (
      id,
      title,
      destination,
      duration,
      price,
      coverImage,
      shortDescription,
      overview,
      highlights,
      itinerary,
      inclusions,
      exclusions,
      gallery,
      termsAndConditions,
      termsNote,
      itineraryPdf,
      highlighted,
      published
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    pkg.id,
    pkg.title,
    JSON.stringify(pkg.destination || []),
    pkg.duration,
    pkg.price,
    pkg.coverImage,
    pkg.shortDescription,
    pkg.overview,
    JSON.stringify(pkg.highlights || []),
    JSON.stringify(pkg.itinerary || []),
    JSON.stringify(pkg.inclusions || []),
    JSON.stringify(pkg.exclusions || []),
    JSON.stringify(pkg.gallery || []),
    pkg.termsAndConditions ? JSON.stringify(pkg.termsAndConditions) : null,
    pkg.termsNote || null,
    pkg.itineraryPdf || null,
    pkg.highlighted ? 1 : 0,
    pkg.published ? 1 : 0,
  );
}

export function deletePackage(id: string) {
  db.prepare("DELETE FROM packages WHERE id = ?").run(id);
}

export function exportDatabasePath() {
  return DB_FILE;
}

// ── Reviews ────────────────────────────────────────────────────────────────

export function getHomeReviews(): Review[] {
  return db
    .prepare(
      "SELECT * FROM reviews WHERE approved = 1 AND highlighted_home = 1 ORDER BY created_at DESC",
    )
    .all()
    .map(rowToReview);
}

export function getPackageReviews(packageId: string): Review[] {
  return db
    .prepare(
      "SELECT * FROM reviews WHERE approved = 1 AND package_id = ? ORDER BY created_at DESC",
    )
    .all(packageId)
    .map(rowToReview);
}

export function getAllReviews(): Review[] {
  return db
    .prepare("SELECT * FROM reviews ORDER BY created_at DESC")
    .all()
    .map(rowToReview);
}

export function saveReview(
  review: Omit<Review, "id" | "createdAt">,
): number {
  const result = db
    .prepare(
      `INSERT INTO reviews (name, email, rating, review, image, package_id, highlighted_home, highlighted_package, approved)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      review.name,
      review.email || "",
      review.rating,
      review.review,
      review.image || "",
      review.packageId || null,
      review.highlightedHome ? 1 : 0,
      review.highlightedPackage ? 1 : 0,
      review.approved ? 1 : 0,
    );
  return result.lastInsertRowid as number;
}

export function updateReview(
  id: number,
  updates: Partial<
    Pick<Review, "approved" | "highlightedHome" | "highlightedPackage">
  >,
): void {
  const fields: string[] = [];
  const values: (number | undefined)[] = [];

  if (updates.approved !== undefined) {
    fields.push("approved = ?");
    values.push(updates.approved ? 1 : 0);
  }
  if (updates.highlightedHome !== undefined) {
    fields.push("highlighted_home = ?");
    values.push(updates.highlightedHome ? 1 : 0);
  }
  if (updates.highlightedPackage !== undefined) {
    fields.push("highlighted_package = ?");
    values.push(updates.highlightedPackage ? 1 : 0);
  }

  if (fields.length === 0) return;

  db.prepare(`UPDATE reviews SET ${fields.join(", ")} WHERE id = ?`).run(
    ...values,
    id,
  );
}

export function deleteReview(id: number): void {
  db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
}

// ── Contacts ───────────────────────────────────────────────────────────────

export function saveContact(
  contact: Omit<ContactSubmission, "id" | "createdAt">,
): void {
  db.prepare(
    `INSERT INTO contact_submissions (name, email, phone, subject, message)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(
    contact.name,
    contact.email,
    contact.phone || "",
    contact.subject,
    contact.message,
  );
}

export function getAllContacts(): ContactSubmission[] {
  return db
    .prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC")
    .all()
    .map(rowToContact);
}

export function updateContact(id: number, read: boolean): void {
  db.prepare("UPDATE contact_submissions SET read = ? WHERE id = ?").run(
    read ? 1 : 0,
    id,
  );
}

export function deleteContact(id: number): void {
  db.prepare("DELETE FROM contact_submissions WHERE id = ?").run(id);
}

// ── Dashboard stats ────────────────────────────────────────────────────────

export function getDashboardStats(): {
  packages: number;
  reviews: number;
  pendingReviews: number;
  contacts: number;
  unreadContacts: number;
} {
  const packages = (
    db.prepare("SELECT COUNT(*) as count FROM packages").get() as {
      count: number;
    }
  ).count;
  const reviews = (
    db.prepare("SELECT COUNT(*) as count FROM reviews").get() as {
      count: number;
    }
  ).count;
  const pendingReviews = (
    db
      .prepare("SELECT COUNT(*) as count FROM reviews WHERE approved = 0")
      .get() as { count: number }
  ).count;
  const contacts = (
    db
      .prepare("SELECT COUNT(*) as count FROM contact_submissions")
      .get() as { count: number }
  ).count;
  const unreadContacts = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM contact_submissions WHERE read = 0",
      )
      .get() as { count: number }
  ).count;

  return { packages, reviews, pendingReviews, contacts, unreadContacts };
}
