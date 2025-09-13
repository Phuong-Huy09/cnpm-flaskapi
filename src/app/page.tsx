import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Clock, Star, CheckCircle, GraduationCap, MessageCircle, Award } from "lucide-react"
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 dark:bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">On Demand Tutor</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Trang chủ
            </a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Tính năng
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              Cách hoạt động
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Đánh giá
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" className="inline-flex">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="inline-flex bg-primary hover:bg-primary/90 text-primary-foreground">
                Đăng ký
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/20">
            Nền tảng gia sư hàng đầu Việt Nam
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 leading-tight">
            Tìm gia sư chất lượng <span className="text-primary">theo yêu cầu</span>
          </h1>

          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto leading-relaxed">
            Kết nối học sinh với các gia sư có trình độ cao. Học tập cá nhân hóa với giá cả hợp lý và nhận được hỗ trợ
            ngay lập tức.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <BookOpen className="w-5 h-5 mr-2" />
              Tìm gia sư ngay
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Users className="w-5 h-5 mr-2" />
              Trở thành gia sư
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Gia sư chất lượng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">Học sinh hài lòng</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-muted-foreground">Đánh giá trung bình</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Tại sao chọn On Demand Tutor?</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Chúng tôi cung cấp trải nghiệm học tập tốt nhất với các tính năng vượt trội
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Gia sư được xác minh</CardTitle>
                <CardDescription>
                  Tất cả gia sư đều được kiểm tra bằng cấp, chứng chỉ và thông tin cá nhân để đảm bảo chất lượng
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Hỗ trợ ngay lập tức</CardTitle>
                <CardDescription>
                  Tìm và kết nối với gia sư phù hợp chỉ trong vài phút, sẵn sàng hỗ trợ bạn ngay lập tức
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Giá cả hợp lý</CardTitle>
                <CardDescription>
                  Học phí linh hoạt theo giờ với mức giá phù hợp với mọi học sinh và gia đình
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Trò chuyện trực tiếp</CardTitle>
                <CardDescription>
                  Trao đổi trực tiếp với gia sư trước khi quyết định thuê để đảm bảo sự phù hợp
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Đánh giá & Phản hồi</CardTitle>
                <CardDescription>
                  Hệ thống đánh giá minh bạch giúp bạn chọn gia sư tốt nhất dựa trên kinh nghiệm thực tế
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Đa dạng môn học</CardTitle>
                <CardDescription>
                  Từ toán học, tiếng Anh đến các môn chuyên ngành, chúng tôi có gia sư cho mọi lĩnh vực
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Cách thức hoạt động</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Chỉ với 3 bước đơn giản, bạn đã có thể bắt đầu học tập với gia sư chất lượng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Tìm kiếm gia sư</h3>
              <p className="text-muted-foreground">
                Tìm kiếm gia sư theo môn học, khu vực hoặc tên. Xem hồ sơ, đánh giá và video giới thiệu.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Kết nối & Trao đổi</h3>
              <p className="text-muted-foreground">
                Trò chuyện trực tiếp với gia sư để thảo luận về nhu cầu học tập và lịch trình phù hợp.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-primary-foreground text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Bắt đầu học</h3>
              <p className="text-muted-foreground">
                Thuê gia sư theo giờ và bắt đầu hành trình học tập cá nhân hóa của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-muted/40">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Học sinh nói gì về chúng tôi</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Hàng nghìn học sinh đã cải thiện kết quả học tập với sự hỗ trợ của gia sư chất lượng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Cô gia sư toán rất tận tâm và kiên nhẫn. Con em đã cải thiện điểm số rõ rệt chỉ sau 2 tháng học."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">M</span>
                  </div>
                  <div>
                    <div className="font-semibold">Chị Mai</div>
                    <div className="text-sm text-muted-foreground">Phụ huynh học sinh lớp 9</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Thầy dạy tiếng Anh rất hay, giúp em tự tin giao tiếp hơn. Giá cả hợp lý và lịch học linh hoạt."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">A</span>
                  </div>
                  <div>
                    <div className="font-semibold">Anh Tuấn</div>
                    <div className="text-sm text-muted-foreground">Học sinh lớp 12</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Nền tảng rất dễ sử dụng, tìm gia sư nhanh chóng. Các gia sư đều có trình độ cao và nhiệt tình."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">L</span>
                  </div>
                  <div>
                    <div className="font-semibold">Chị Linh</div>
                    <div className="text-sm text-muted-foreground">Sinh viên đại học</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Sẵn sàng bắt đầu hành trình học tập?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn học sinh đã cải thiện kết quả học tập với On Demand Tutor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <BookOpen className="w-5 h-5 mr-2" />
              Tìm gia sư ngay
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              <Users className="w-5 h-5 mr-2" />
              Đăng ký làm gia sư
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 px-4 border-t">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">On Demand Tutor</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Nền tảng kết nối học sinh với gia sư chất lượng, mang đến trải nghiệm học tập tốt nhất.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Dành cho học sinh</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Tìm gia sư</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cách thức hoạt động</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Bảng giá</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hỗ trợ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Dành cho gia sư</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Đăng ký làm gia sư</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Hướng dẫn</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Thu nhập</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Cộng đồng</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Liên hệ</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@ondemandtutor.vn</li>
                <li>Hotline: 1900 1234</li>
                <li>Địa chỉ: Hà Nội, Việt Nam</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 On Demand Tutor. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
