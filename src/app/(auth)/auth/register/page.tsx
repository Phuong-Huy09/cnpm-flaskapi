"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      toast.error("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    setIsLoading(true);

    try {
      // Placeholder for API call to register
      // Replace with actual API call when backend is ready
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        toast.success("Đăng ký thành công!");
        router.push("/auth/login");
      } else {
        const data = await response.json();
        setError(data.message || "Đăng ký thất bại. Vui lòng thử lại.");
        toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Đăng ký tài khoản
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                type="text"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Tạo mật khẩu"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Nhập lại mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 font-medium text-center">
                {error}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
