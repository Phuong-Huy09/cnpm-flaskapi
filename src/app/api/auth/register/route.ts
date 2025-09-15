import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Determine API base: prefer env, fall back to incoming request origin
  // Prefer internal API_BASE_URL (container-to-container) then NEXT_PUBLIC_API_URL (browser)
  const envBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL;
  const originHeader = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") || "http";
  const inferredBase = originHeader ? `${protocol}://${originHeader}` : undefined;
  const API_BASE_URL = envBase || inferredBase;

  try {
    const body = await request.json();
    const { fullName, email, password, role } = body;

    if (!email || !password || !fullName || !role) {
      return NextResponse.json({ message: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
    }

    if (!API_BASE_URL) {
      console.error("Registration error: API base URL is not configured. env NEXT_PUBLIC_API_URL is empty and request origin couldn't be inferred.");
      return NextResponse.json({ message: "Server chưa cấu hình backend API" }, { status: 500 });
    }

    // Forward registration request to backend API
    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL.replace(/\/$/, "")}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ username: fullName, email, password, role }),
      });
    } catch (fetchErr) {
      console.error("Registration fetch failed:", fetchErr);
      // ECONNREFUSED or network errors end up here
      return NextResponse.json({ message: `Không thể kết nối tới backend: ${fetchErr}` }, { status: 502 });
    }

    const data = await response.json().catch((err) => {
      console.error("Failed to parse backend response as JSON:", err);
      return null;
    });

    if (!response.ok) {
      const msg = (data && data.message) || "Đăng ký thất bại";
      return NextResponse.json({ message: msg }, { status: response.status });
    }

    return NextResponse.json({ message: "Đăng ký thành công" }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Đã xảy ra lỗi trong quá trình đăng ký" + error }, { status: 500 });
  }
}
