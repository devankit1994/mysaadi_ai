import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

function getBearerToken(authorizationHeader: string | null) {
  if (!authorizationHeader) return null;
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const accessToken = getBearerToken(req.headers.get("authorization"));
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing Authorization Bearer token" },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    // Validate that the caller is an authenticated admin
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
      }
    );

    if (isAdminError || !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the user from auth (this will cascade to profiles if foreign keys are setup, 
    // but we can explicitly delete from profiles first just in case)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", id);
      
    if (profileError) {
      console.error("Failed to delete profile:", profileError);
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message || "Failed to delete user" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: any) {
    console.error("Delete user error:", err);
    return NextResponse.json(
      { error: err?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
