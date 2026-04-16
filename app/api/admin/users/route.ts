import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/lib/supabase";

const CreateUserSchema = z.object({
  email: z.string().email(),
  phone: z.string().trim().max(30).optional(),

  // Profile fields (mirrors the onboarding wizard)
  firstName: z.string().trim().max(100).optional().default(""),
  lastName: z.string().trim().max(100).optional().default(""),
  dateOfBirth: z.string().trim().max(30).optional().default(""), // YYYY-MM-DD from <input type="date" />
  gender: z.string().trim().max(50).optional().default(""),
  city: z.string().trim().max(100).optional().default(""),
  state: z.string().trim().max(100).optional().default(""),

  lookingFor: z.string().trim().max(50).optional().default(""),
  ageRangeMin: z.coerce.number().int().min(18).max(99).optional().default(18),
  ageRangeMax: z.coerce.number().int().min(18).max(99).optional().default(35),
  preferredReligion: z.string().trim().max(50).optional().default(""),
  preferredCity: z.string().trim().max(100).optional().default(""),

  photos: z.array(z.string().trim().min(1)).optional().default([]),
  education: z.string().trim().max(100).optional().default(""),
  profession: z.string().trim().max(100).optional().default(""),
  income: z.string().trim().max(100).optional().default(""),
  familyType: z.string().trim().max(50).optional().default(""),
  diet: z.string().trim().max(50).optional().default(""),
  drinking: z.string().trim().max(50).optional().default(""),
  smoking: z.string().trim().max(50).optional().default(""),

  bio: z.string().trim().max(2000).optional().default(""),
  interests: z.array(z.string().trim().min(1)).optional().default([]),

  isComplete: z.boolean().optional().default(true),
});

async function parseRequestPayload(req: Request): Promise<{
  payload: z.infer<typeof CreateUserSchema>;
  photoFiles: File[];
}> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const form = await req.formData();
    const raw = form.get("payload");
    const payloadJson = typeof raw === "string" ? raw : null;
    if (!payloadJson) {
      throw new Error("Missing payload in multipart form-data");
    }

    const parsedJson = JSON.parse(payloadJson);
    const parsed = CreateUserSchema.parse(parsedJson);
    const photoFiles = form
      .getAll("photos")
      .filter((v): v is File => v instanceof File);

    return { payload: parsed, photoFiles };
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateUserSchema.parse(body);
  return { payload: parsed, photoFiles: [] };
}

function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) return null;
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export async function POST(req: Request) {
  try {
    const accessToken = getBearerToken(req.headers.get("authorization"));
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing Authorization Bearer token" },
        { status: 401 },
      );
    }

    let payload: z.infer<typeof CreateUserSchema>;
    let photoFiles: File[];
    try {
      const parsed = await parseRequestPayload(req);
      payload = parsed.payload;
      photoFiles = parsed.photoFiles;
    } catch (e: any) {
      return NextResponse.json(
        { error: e?.message || "Invalid payload" },
        { status: 400 },
      );
    }

    const {
      email,
      phone,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      city,
      state,
      lookingFor,
      ageRangeMin,
      ageRangeMax,
      preferredReligion,
      preferredCity,
      photos,
      education,
      profession,
      income,
      familyType,
      diet,
      drinking,
      smoking,
      bio,
      interests,
      isComplete,
    } = payload;

    const supabaseAdmin = createSupabaseAdminClient();

    // Validate that the caller is an authenticated admin.
    const {
      data: { user: caller },
      error: callerError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (callerError || !caller?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: isAdmin, error: isAdminError } = await supabaseAdmin.rpc(
      "check_is_admin",
      {
        email_input: caller.email,
      },
    );

    if (isAdminError) {
      return NextResponse.json(
        { error: "Failed to verify admin status" },
        { status: 500 },
      );
    }

    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: created, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        phone,
        email_confirm: true,
        phone_confirm: !!phone,
      });

    if (createError || !created.user) {
      const message = createError?.message || "Failed to create user";
      const status = /already\s+registered|already\s+exists/i.test(message)
        ? 409
        : 400;

      return NextResponse.json({ error: message }, { status });
    }

    const newUserId = created.user.id;

    // Upload selected photos (if any) using service role.
    const uploadedPhotoUrls: string[] = [];
    if (photoFiles.length > 0) {
      for (const file of photoFiles) {
        const ext = file.name.split(".").pop() || "jpg";
        const objectPath = `${newUserId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const bytes = new Uint8Array(await file.arrayBuffer());

        const { error: uploadError } = await supabaseAdmin.storage
          .from("photos")
          .upload(objectPath, bytes, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadError) {
          return NextResponse.json(
            {
              error: `User created, but photo upload failed: ${uploadError.message}`,
            },
            { status: 400 },
          );
        }

        const {
          data: { publicUrl },
        } = supabaseAdmin.storage.from("photos").getPublicUrl(objectPath);

        if (publicUrl) uploadedPhotoUrls.push(publicUrl);
      }
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert(
      {
        id: newUserId,
        phone: phone || null,
        first_name: firstName || null,
        last_name: lastName || null,
        date_of_birth: dateOfBirth,
        gender,
        city,
        state,
        looking_for: lookingFor,
        age_range_min: ageRangeMin,
        age_range_max: ageRangeMax,
        preferred_religion: preferredReligion,
        preferred_city: preferredCity,
        photos: uploadedPhotoUrls.length > 0 ? uploadedPhotoUrls : photos,
        education,
        profession,
        income,
        family_type: familyType,
        diet,
        drinking,
        smoking,
        bio,
        interests,
        is_complete: isComplete,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );

    if (profileError) {
      // The auth user exists now; surface a clear error so admin can fix profile fields and retry.
      return NextResponse.json(
        {
          error: `User created, but profile insert failed: ${profileError.message}`,
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ id: newUserId }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 },
    );
  }
}
