import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

type ExploreProfile = {
  id: string;
  name: string;
  age: number | null;
  city: string | null;
  profession: string | null;
  education: string | null;
  image: string | null;
  interests: string[];
  compatibility: number;
  verified: boolean;
  religion: string | null;
  height: string | null;
};

function toInt(value: string | null): number | null {
  if (!value) return null;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) ? n : null;
}

function toBool(value: string | null): boolean {
  if (!value) return false;
  return (
    value === "1" ||
    value.toLowerCase() === "true" ||
    value.toLowerCase() === "yes"
  );
}

function isoDateOnly(d: Date): string {
  // YYYY-MM-DD (safe for Postgres date comparisons)
  return d.toISOString().slice(0, 10);
}

function ageFromDob(dob: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;

  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

function compatibilityFromId(id: string): number {
  // Deterministic (no "random" on every request), yields 75..99
  let acc = 0;
  for (let i = 0; i < id.length; i += 1) acc = (acc + id.charCodeAt(i)) % 1000;
  return 75 + (acc % 25);
}

export async function GET(req: Request) {
  try {
    const supabaseAdmin = createSupabaseAdminClient();
    const url = new URL(req.url);

    const excludeId = (url.searchParams.get("excludeId") ?? "").trim();
    const q = (url.searchParams.get("q") ?? "").trim();
    const city = (url.searchParams.get("city") ?? "").trim();
    const education = (url.searchParams.get("education") ?? "").trim();
    const profession = (url.searchParams.get("profession") ?? "").trim();
    const religion = (url.searchParams.get("religion") ?? "").trim();

    const verifiedOnly = toBool(url.searchParams.get("verifiedOnly"));
    const ageMin = toInt(url.searchParams.get("ageMin"));
    const ageMax = toInt(url.searchParams.get("ageMax"));

    let query = supabaseAdmin
      .from("profiles")
      .select(
        "id, first_name, last_name, date_of_birth, city, education, profession, is_complete, preferred_religion, photos, interests",
      );

    if (excludeId) query = query.neq("id", excludeId);

    if (q) {
      const like = `%${q}%`;
      query = query.or(
        `first_name.ilike.${like},last_name.ilike.${like},profession.ilike.${like},education.ilike.${like}`,
      );
    }

    if (city) query = query.eq("city", city);
    if (education) query = query.eq("education", education);
    if (profession) query = query.eq("profession", profession);

    // NOTE: There's no explicit `religion` column in `supabase_schema.sql`.
    // We map the UI's "Religion" filter to `preferred_religion` for now.
    if (religion) query = query.eq("preferred_religion", religion);

    if (verifiedOnly) query = query.eq("is_complete", true);

    if (ageMin !== null && ageMax !== null && ageMin <= ageMax) {
      // Age between [ageMin, ageMax] => DOB between [today-ageMax, today-ageMin]
      const now = new Date();
      const dobFrom = new Date(now);
      dobFrom.setFullYear(now.getFullYear() - ageMax);
      const dobTo = new Date(now);
      dobTo.setFullYear(now.getFullYear() - ageMin);

      query = query
        .gte("date_of_birth", isoDateOnly(dobFrom))
        .lte("date_of_birth", isoDateOnly(dobTo));
    }

    const { data, error } = await query
      .order("updated_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profiles: ExploreProfile[] = (data ?? []).map((p: any) => {
      const first = (p.first_name ?? "").trim();
      const last = (p.last_name ?? "").trim();
      const name = [first, last].filter(Boolean).join(" ") || "User";

      const photos: string[] = Array.isArray(p.photos) ? p.photos : [];
      const interests: string[] = Array.isArray(p.interests) ? p.interests : [];

      return {
        id: String(p.id),
        name,
        age: ageFromDob(p.date_of_birth ?? null),
        city: p.city ?? null,
        profession: p.profession ?? null,
        education: p.education ?? null,
        image: photos[0] ?? null,
        interests,
        compatibility: compatibilityFromId(String(p.id)),
        verified: Boolean(p.is_complete),
        religion: p.preferred_religion ?? null,
        height: null,
      };
    });

    return NextResponse.json({ profiles });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 },
    );
  }
}
