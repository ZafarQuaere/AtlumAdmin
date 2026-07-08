import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("Missing .env.local file");
    process.exit(1);
  }

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...rest] = trimmed.split("=");
    if (key && rest.length) {
      process.env[key] = rest.join("=").trim();
    }
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.SEED_ADMIN_EMAIL ?? "zafima20@gmail.com";
const password = process.env.SEED_ADMIN_PASSWORD;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

if (!password) {
  console.error("Missing SEED_ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedAdmin() {
  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers();

  if (listError) {
    console.error("Failed to list users:", listError.message);
    process.exit(1);
  }

  const existing = existingUsers.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase()
  );

  if (existing) {
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existing.id,
      {
        password,
        email_confirm: true,
        app_metadata: { role: "admin" },
        user_metadata: { full_name: "Emerald Admin" },
      }
    );

    if (updateError) {
      console.error("Failed to update existing admin:", updateError.message);
      process.exit(1);
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "admin", full_name: "Emerald Admin" })
      .eq("id", existing.id);

    if (profileError) {
      console.error("Failed to update profile:", profileError.message);
      process.exit(1);
    }

    console.log(`Admin user already exists — updated: ${email}`);
    return;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: "admin" },
    user_metadata: { full_name: "Emerald Admin" },
  });

  if (error) {
    console.error("Failed to create admin user:", error.message);
    process.exit(1);
  }

  const userId = data.user?.id;
  if (userId) {
    await supabase
      .from("profiles")
      .update({ role: "admin", full_name: "Emerald Admin" })
      .eq("id", userId);
  }

  console.log(`Admin user created: ${email}`);
}

seedAdmin();
