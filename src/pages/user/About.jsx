import React from "react";

function About() {
  return (
    <div className="w-full">
      {/* Banner section with overlay content */}
      <div className="w-full relative">
        {/* Banner image */}
        <img
          src="/about-banner.png"
          alt="Hoang Anh Technology Banner"
          className="w-full h-[300px] object-cover"
        />

        {/* Overlay content */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white via-white to-transparent">
          <div className="max-w-[1200px] mx-auto px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-gray-500 py-4">
              <a href="/" className="hover:text-primary">
                Trang chủ
              </a>
              <span>/</span>
              <span>Giới thiệu</span>
            </div>

            {/* Logo */}
            <div className="py-4">
              <img
                src="/logoSec.png"
                alt="Hoang Anh Technology Logo"
                className="w-[300px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-primary mb-8 text-center">
            CÔNG TY TNHH PHÁT TRIỂN CNTT HOÀNG ANH
          </h1>

          <div className="space-y-6 text-gray-700">
            <p className="font-medium">Quý Khách hàng thân mến,</p>

            <p>
              Lời đầu tiên, công ty TNHH Phát triển CNTT Hoàng Anh (Hoàng Anh
              Technology) xin kính gửi tới Quý Khách hàng lời chào trân trọng
              cùng lời chúc sức khỏe và thành công.
            </p>

            <p>
              Hoàng Anh Technology được thành lập và hoạt động với tôn chỉ "trao
              lợi ích – tích niềm tin". Mục tiêu hàng đầu của Công ty chúng tôi
              là cung cấp những sản phẩm và dịch vụ về kỹ thuật – công nghệ phục
              vụ các hoạt động và phát triển của quý khách hàng. Chúng tôi cam
              kết mang đến cho khách hàng những sản phẩm chất lượng cao, dịch vụ
              hậu mãi tận tình với giá thành hợp lý nhất.
            </p>

            <p>
              Chúng tôi xác định giá trị nền tảng cho sự phát triển đó là các cơ
              hội được hợp tác với Quý khách hàng. Và không có bất kỳ khó khăn
              nào có thể ngăn cản chúng tôi mang lại những giá trị thiết thực
              phù hợp với mong muốn và lợi ích của Quý khách hàng. Chúng tôi tin
              tưởng rằng với tập thể đội ngũ đoàn kết, vững mạnh và sự ủng hộ
              của Quý khách hàng, Hoàng Anh Technology chắc chắn sẽ đạt hai được
              nhiều thành công hơn nữa trong tương lai.
            </p>

            <p>
              Chúng tôi xin chân thành cảm ơn Quý Khách hàng đã tin nhiệm và hợp
              tác với chúng tôi trong thời gian qua. Hy vọng Hoàng Anh
              Technology sẽ luôn được sát cánh cùng những thành công của Quý
              Khách hàng.
            </p>

            <p>Trân trọng kính chào.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
