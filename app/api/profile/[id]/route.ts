import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

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
  let acc = 0;
  for (let i = 0; i < id.length; i += 1) acc = (acc + id.charCodeAt(i)) % 1000;
  return 75 + (acc % 25);
}

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = createSupabaseAdminClient();
    const params = await context.params;
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const p = data;
    const first = (p.first_name ?? "").trim();
    const last = (p.last_name ?? "").trim();
    const name = [first, last].filter(Boolean).join(" ") || "User";

    const photos: string[] = Array.isArray(p.photos) ? p.photos : [];
    const interests: string[] = Array.isArray(p.interests) ? p.interests : [];

    const profileData = {
      id: String(p.id),
      name,
      age: ageFromDob(p.date_of_birth ?? null) || 25, // default fallback
      city: p.city || "Unknown City",
      state: p.state || "Unknown State",
      profession: p.profession || "Professional",
      company: p.company || "Company",
      education: p.education || "Degree",
      college: p.college || "University",
      images: photos.length > 0 ? photos : ["/placeholder.svg"],
      interests: interests.length > 0 ? interests : ["Reading", "Traveling"],
      compatibility: compatibilityFromId(String(p.id)),
      verified: Boolean(p.is_complete),
      religion: p.preferred_religion || "Not specified",
      height: p.height || "Not specified",
      weight: p.weight || "Not specified",
      maritalStatus: p.marital_status || "Never Married",
      motherTongue: p.mother_tongue || "Not specified",
      familyType: p.family_type || "Nuclear",
      familyStatus: p.family_status || "Middle Class",
      fatherOccupation: p.father_occupation || "Not specified",
      motherOccupation: p.mother_occupation || "Not specified",
      siblings: p.siblings_count !== null ? `${p.siblings_count} Sibling(s)` : "None",
      diet: p.diet || "Not specified",
      drinking: p.drinking_habit || "Not specified",
      smoking: p.smoking_habit || "Not specified",
      bio: p.bio || "Hello, I am looking for a meaningful connection.",
      lookingFor: p.looking_for || "A compatible partner.",
      income: p.annual_income || "Not specified",
      contactLocked: true,
      phone: p.phone_number || "+91 XXXXX XXXXX",
      whatsapp: p.phone_number || "+91 XXXXX XXXXX",
    };

    return NextResponse.json({ profile: profileData });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
