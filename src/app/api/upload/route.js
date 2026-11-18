import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    if (!file || typeof file === "string") return NextResponse.json({ message: "No image provided" }, { status: 400 });
    if (!file.type.startsWith("image/")) return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: "Image must be under 5MB" }, { status: 400 });
    if (!process.env.IMGBB_API_KEY) return NextResponse.json({ message: "Image upload is not configured" }, { status: 500 });

    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, { method: "POST", body: fd });
    const json = await res.json();
    if (!json?.success) return NextResponse.json({ message: "Image upload failed" }, { status: 502 });
    return NextResponse.json({ url: json.data.display_url || json.data.url });
  } catch {
    return NextResponse.json({ message: "Image upload failed" }, { status: 500 });
  }
}
