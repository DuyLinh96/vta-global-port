import type { Language, SiteContent } from "./types";

export const content: Record<Language, SiteContent> = {
  vi: {
    common: {
      skipToContent: "Đi đến nội dung chính",
      menu: "Mở menu",
      closeMenu: "Đóng menu",
      language: "Chọn ngôn ngữ",
      vietnamese: "Tiếng Việt",
      english: "English",
      brandHome: "VTA Global Port - Trang chủ",
      primaryNavigation: "Điều hướng chính",
      mobileNavigation: "Điều hướng trên thiết bị di động",
      learnMore: "Khám phá",
      demoConnecting: "đang được kết nối",
    },
    nav: [
      {
        label: "Về chúng tôi",
        href: "/about",
        children: [
          { label: "Sứ mệnh và tầm nhìn", href: "/about#mission-vision" },
          { label: "Giá trị cốt lõi", href: "/about#core-values" },
          { label: "Lãnh đạo", href: "/about#leadership" },
        ],
      },
      {
        label: "Dịch vụ",
        href: "/services",
        children: [
          { label: "VẬN TẢI ĐƯỜNG BIỂN", href: "/services#sea-freight" },
          { label: "KHAI THÁC CẢNG", href: "/services#port-operations" },
          { label: "KHAI THÁC KHO BÃI", href: "/services#warehousing" },
          { label: "DỊCH VỤ LOGISTICS", href: "/services#logistics" },
          { label: "Giá Dịch Vụ", href: "/services/gia-dich-vu" },
        ],
      },
      {
        label: "Đội tàu",
        href: "/fleet",
        children: [
          { label: "Tàu biển", href: "/fleet#sea-vessels" },
          { label: "Tàu sông", href: "/fleet#river-vessels" },
        ],
      },
      {
        label: "Tin tức",
        href: "/news",
        children: [
          { label: "Hoạt động", href: "/news#operations" },
          { label: "Sự kiện", href: "/news#events" },
          { label: "Truyền thông", href: "/news#media" },
          { label: "Tuyển dụng", href: "/news#careers" },
        ],
      },
      {
        label: "Quản lý thông minh",
        href: "/smart-management",
        children: [
          { label: "My VTA Port", href: "/smart-management#my-vta-port" },
          { label: "Tra cứu lịch tàu", href: "/smart-management#schedule" },
          { label: "Theo dõi hàng hóa", href: "/smart-management#tracking" },
          { label: "Biểu cước vận tải", href: "/smart-management#tariffs" },
        ],
      },
      { label: "Liên hệ", href: "/contact", children: [] },
    ],
    hero: {
      eyebrow: "VTA Global Port",
      headline: "Vững bước thành công",
      cta: "Liên hệ với chúng tôi",
      imageAlt: "Tàu container đang được khai thác tại cảng biển",
    },
    tracking: {
      eyebrow: "VTA Control Desk",
      title: "Theo dõi lô hàng",
      label: "Mã lô hàng hoặc vận đơn",
      placeholder: "Nhập mã tham chiếu",
      button: "Theo dõi",
      emptyFeedback: "Vui lòng nhập mã lô hàng hoặc vận đơn.",
      demoFeedback:
        "Tính năng theo dõi đang được kết nối. Không có dữ liệu vận chuyển thực được hiển thị.",
      quoteFeedback: "Đã chuyển đến biểu mẫu yêu cầu tư vấn và báo giá.",
      shortcutsLabel: "Truy cập nhanh",
      shortcuts: [
        {
          id: "quote",
          title: "Yêu cầu báo giá",
          description: "Gửi nhu cầu vận chuyển",
        },
        {
          id: "schedule",
          title: "Lịch tàu",
          description: "Tra cứu hành trình dự kiến",
        },
        {
          id: "port",
          title: "Tra cứu cảng",
          description: "Tìm thông tin khai thác",
        },
      ],
    },
    company: {
      eyebrow: "VTA Global Port",
      title: "Nền tảng tạo nên VTA Global Port",
      subtitle: "Được xây dựng từ tiêu chuẩn vận hành và đội ngũ giàu kinh nghiệm",
      body:
        "Với hệ thống dịch vụ đồng bộ cùng đội ngũ chuyên nghiệp, VTA Global Port mang đến các giải pháp vận chuyển và khai thác hiệu quả, giúp tối ưu dòng chảy hàng hóa từ cảng đến điểm giao nhận. Chúng tôi không ngừng nâng cao năng lực vận hành, ứng dụng công nghệ và phát triển hạ tầng nhằm đáp ứng yêu cầu ngày càng cao của chuỗi cung ứng hiện đại, trở thành đối tác tin cậy của khách hàng trong và ngoài nước.",
      values: ["Chính trực", "An toàn", "Hiệu quả vận hành", "Đổi mới", "Phát triển bền vững"],
      imageAlt: "Mạng lưới phương tiện vận tải nhìn từ trên cao",
      visualLabel: "VTA Global Port",
    },
    services: {
      eyebrow: "Dịch vụ",
      title: "Dịch vụ",
      description:
        "Với hệ thống dịch vụ đồng bộ cùng đội ngũ chuyên nghiệp, VTA Global Port mang đến các giải pháp vận chuyển và khai thác hiệu quả, giúp tối ưu dòng chảy hàng hóa từ cảng đến điểm giao nhận. Chúng tôi không ngừng nâng cao năng lực vận hành, ứng dụng công nghệ và phát triển hạ tầng nhằm đáp ứng yêu cầu ngày càng cao của chuỗi cung ứng hiện đại, trở thành đối tác tin cậy của khách hàng trong và ngoài nước.",
      imageAlt: "Hàng hóa được quản lý trong trung tâm kho vận",
      items: [
        {
          title: "Vận tải đường biển",
          description:
            "VTA Global Port cung cấp dịch vụ vận tải đường biển với giải pháp linh hoạt, an toàn và hiệu quả, đáp ứng nhu cầu vận chuyển hàng hóa trong nước và quốc tế.",
        },
        {
          title: "Khai thác cảng",
          description:
            "VTA Global Port cung cấp dịch vụ khai thác cảng với quy trình vận hành chuyên nghiệp, đáp ứng nhu cầu tiếp nhận tàu, xếp dỡ hàng hóa và điều phối hoạt động cảng một cách an toàn, hiệu quả.",
        },
        {
          title: "Khai thác kho bãi",
          description:
            "VTA Global Port cung cấp dịch vụ quản lý kho bãi với hệ thống lưu trữ được vận hành khoa học, an toàn và hiệu quả.",
        },
      ],
    },
    fleet: {
      eyebrow: "Đội tàu",
      title: "Đội tàu",
      description:
        "Sở hữu đội tàu biển và tàu sông được đầu tư đồng bộ, VTA Global Port cung cấp năng lực vận tải linh hoạt, đáp ứng đa dạng nhu cầu vận chuyển hàng hóa. Hệ thống gồm 4 tàu biển trọng tải lớn cùng nhiều phương tiện vận tải đường thủy nội địa, giúp kết nối hiệu quả giữa cảng biển, cảng sông và các khu vực sản xuất, góp phần tối ưu chuỗi cung ứng và nâng cao hiệu quả logistics.",
      cta: "Liên hệ",
      imageAlt: "Toàn cảnh cảng container nhìn từ trên cao",
      vesselCount: "04",
      vesselCountLabel: "tàu biển trọng tải lớn",
      watermark: "BIỂN / SÔNG",
      groups: [
        { title: "Tàu biển" },
        { title: "Tàu sông" },
      ],
    },
    news: {
      eyebrow: "Tin tức",
      title: "Tin Tức",
      description:
        "Thông tin về các hoạt động của doanh nghiệp; các bài viết về kỹ thuật, xu hướng trong ngành và nghiên cứu.",
      items: [
        {
          title: "Hoạt động",
          status: "Nội dung đang được cập nhật",
        },
        {
          title: "Sự kiện",
          status: "Nội dung đang được cập nhật",
        },
        {
          title: "Truyền thông",
          status: "Nội dung đang được cập nhật",
        },
        {
          title: "Tuyển dụng",
          status: "Nội dung đang được cập nhật",
        },
      ],
    },
    smart: {
      eyebrow: "Quản lý thông minh",
      title: "Hệ thống quản lý thông minh",
      description:
        "Ứng dụng công nghệ và quy trình quản lý hiện đại để tối ưu hoạt động khai thác cảng, điều phối phương tiện và quản lý hàng hóa, giúp nâng cao hiệu quả vận hành và hỗ trợ khách hàng trong suốt quá trình logistics.",
      interfaceLabel: "Bảng điều phối VTA",
      systemOnline: "Hạ tầng dịch vụ đang kết nối",
      tools: [
        { title: "My VTA Port" },
        { title: "Tra cứu lịch tàu" },
        { title: "Theo dõi hàng hóa" },
        { title: "Biểu cước vận tải" },
      ],
    },
    contact: {
      eyebrow: "Liên hệ",
      title: "Liên hệ với chúng tôi",
      description:
        "Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ mọi yêu cầu về dịch vụ cảng, vận tải và logistics. Gửi thông tin của Quý khách ngay hôm nay để nhận tư vấn, báo giá hoặc giải pháp phù hợp cho hoạt động kinh doanh.",
      detailsTitle: "Thông tin liên hệ",
      addressLabel: "Địa chỉ",
      address: "Tỉnh Hải Dương, Việt Nam",
      phoneLabel: "Điện thoại",
      phone: "+84 123 456 789",
      faxLabel: "Fax",
      fax: "+84 123 456 780",
      emailLabel: "Email",
      email: "info@vtagroup.vn",
      formTitle: "Gửi yêu cầu",
      fullName: "Họ và tên",
      companyName: "Tên doanh nghiệp",
      position: "Chức vụ",
      emailField: "Email",
      phoneField: "Số điện thoại",
      message: "Nội dung yêu cầu",
      interest: "Lĩnh vực quan tâm",
      selectPlaceholder: "Chọn lĩnh vực",
      submit: "Gửi thông tin",
      requiredNote: "Các trường có dấu * là bắt buộc.",
      success:
        "Đã ghi nhận biểu mẫu demo. Kênh tiếp nhận đang được kết nối nên thông tin chưa được gửi đến máy chủ.",
      options: [
        { value: "port", label: "Khai thác cảng" },
        { value: "water-transport", label: "Vận tải đường thủy" },
        { value: "logistics", label: "Logistics" },
        { value: "warehouse", label: "Kho bãi" },
        { value: "cargo-handling", label: "Xếp dỡ hàng hóa" },
        { value: "partnership", label: "Hợp tác kinh doanh" },
        { value: "other", label: "Khác" },
      ],
    },
    footer: {
      tagline: "Vững bước thành công",
      navigationLabel: "Điều hướng chân trang",
      copyright: "© 2026 VTA Global Port. Bảo lưu mọi quyền.",
      top: "Về đầu trang",
    },
  },
  en: {
    common: {
      skipToContent: "Skip to main content",
      menu: "Open menu",
      closeMenu: "Close menu",
      language: "Choose language",
      vietnamese: "Tiếng Việt",
      english: "English",
      brandHome: "VTA Global Port - Home",
      primaryNavigation: "Primary navigation",
      mobileNavigation: "Mobile navigation",
      learnMore: "Explore",
      demoConnecting: "is being connected",
    },
    nav: [
      {
        label: "About us",
        href: "/about",
        children: [
          { label: "Mission & vision", href: "/about#mission-vision" },
          { label: "Core values", href: "/about#core-values" },
          { label: "Leadership", href: "/about#leadership" },
        ],
      },
      {
        label: "Services",
        href: "/services",
        children: [
          { label: "SEA FREIGHT", href: "/services#sea-freight" },
          { label: "PORT OPERATIONS", href: "/services#port-operations" },
          { label: "WAREHOUSING", href: "/services#warehousing" },
          { label: "LOGISTICS", href: "/services#logistics" },
          { label: "Service Prices", href: "/services/gia-dich-vu" },
        ],
      },
      {
        label: "Fleet",
        href: "/fleet",
        children: [
          { label: "Sea-going vessels", href: "/fleet#sea-vessels" },
          { label: "River vessels", href: "/fleet#river-vessels" },
        ],
      },
      {
        label: "News",
        href: "/news",
        children: [
          { label: "Operations", href: "/news#operations" },
          { label: "Events", href: "/news#events" },
          { label: "Media", href: "/news#media" },
          { label: "Careers", href: "/news#careers" },
        ],
      },
      {
        label: "Smart management",
        href: "/smart-management",
        children: [
          { label: "My VTA Port", href: "/smart-management#my-vta-port" },
          { label: "Vessel schedule", href: "/smart-management#schedule" },
          { label: "Cargo tracking", href: "/smart-management#tracking" },
          { label: "Freight tariffs", href: "/smart-management#tariffs" },
        ],
      },
      { label: "Contact", href: "/contact", children: [] },
    ],
    hero: {
      eyebrow: "VTA Global Port",
      headline: "Steady steps to success",
      cta: "Contact us",
      imageAlt: "Container vessels being handled at a seaport",
    },
    tracking: {
      eyebrow: "VTA Control Desk",
      title: "Track a shipment",
      label: "Shipment or bill of lading number",
      placeholder: "Enter a reference number",
      button: "Track",
      emptyFeedback: "Enter a shipment or bill of lading number.",
      demoFeedback:
        "Shipment tracking is being connected. No live transport data is displayed.",
      quoteFeedback: "Moved to the consultation and quote request form.",
      shortcutsLabel: "Quick access",
      shortcuts: [
        {
          id: "quote",
          title: "Request a quote",
          description: "Share your transport needs",
        },
        {
          id: "schedule",
          title: "Vessel schedule",
          description: "Check planned journeys",
        },
        {
          id: "port",
          title: "Port lookup",
          description: "Find operations information",
        },
      ],
    },
    company: {
      eyebrow: "VTA Global Port",
      title: "The foundation behind VTA Global Port",
      subtitle: "Built on operational standards and an experienced team",
      body:
        "With an integrated service system and a professional team, VTA Global Port provides efficient transport and operations solutions, helping optimise cargo flows from ports to delivery points. We continuously enhance our operational capacity, apply technology and develop infrastructure to meet the increasing demands of modern supply chains, becoming a trusted partner to customers in Vietnam and abroad.",
      values: ["Integrity", "Safety", "Operational excellence", "Innovation", "Sustainable development"],
      imageAlt: "Transport network viewed from above",
      visualLabel: "VTA Global Port",
    },
    services: {
      eyebrow: "Services",
      title: "Our services",
      description:
        "With an integrated service system and a professional team, VTA Global Port provides efficient transport and operations solutions, helping optimise cargo flows from ports to delivery points. We continuously enhance our operational capacity, apply technology and develop infrastructure to meet the increasing demands of modern supply chains, becoming a trusted partner to customers in Vietnam and abroad.",
      imageAlt: "Cargo managed inside a logistics warehouse",
      items: [
        {
          title: "Sea freight",
          description:
            "VTA Global Port provides sea freight services with flexible, safe and efficient solutions that meet domestic and international cargo transportation needs.",
        },
        {
          title: "Port operations",
          description:
            "VTA Global Port provides port operations services with professional operating processes, meeting the needs of vessel reception, cargo handling and port activity coordination safely and efficiently.",
        },
        {
          title: "Warehousing",
          description:
            "VTA Global Port provides warehouse management services with a storage system operated systematically, safely and efficiently.",
        },
      ],
    },
    fleet: {
      eyebrow: "Fleet",
      title: "Our fleet",
      description:
        "With a consistently invested fleet of sea-going and river vessels, VTA Global Port provides flexible transport capacity to meet diverse cargo transportation needs. The system includes four high-capacity sea-going vessels and numerous inland waterway craft, effectively connecting seaports, river ports and production areas, helping optimise supply chains and improve logistics efficiency.",
      cta: "Contact",
      imageAlt: "Aerial overview of a container terminal",
      vesselCount: "04",
      vesselCountLabel: "high-capacity sea-going vessels",
      watermark: "SEA / RIVER",
      groups: [
        { title: "Sea-going vessels" },
        { title: "River vessels" },
      ],
    },
    news: {
      eyebrow: "News",
      title: "News about us",
      description:
        "Information about company activities; technical articles, industry trends and research.",
      items: [
        {
          title: "Operations",
          status: "Content is being updated",
        },
        {
          title: "Events",
          status: "Content is being updated",
        },
        {
          title: "Media",
          status: "Content is being updated",
        },
        {
          title: "Careers",
          status: "Content is being updated",
        },
      ],
    },
    smart: {
      eyebrow: "Smart management",
      title: "Our smart management system",
      description:
        "We apply technology and modern management processes to optimise port operations, vehicle coordination and cargo management, improving operating efficiency and supporting customers throughout their logistics journey.",
      interfaceLabel: "VTA operations board",
      systemOnline: "Service infrastructure is connecting",
      tools: [
        { title: "My VTA Port" },
        { title: "Vessel schedule" },
        { title: "Cargo tracking" },
        { title: "Freight tariffs" },
      ],
    },
    contact: {
      eyebrow: "Contact",
      title: "Contact us",
      description:
        "Our specialists are ready to support port, transport and logistics requirements. Send us your information today to request advice, a quotation or a solution tailored to your business operations.",
      detailsTitle: "Contact information",
      addressLabel: "Address",
      address: "Hai Duong Province, Vietnam",
      phoneLabel: "Phone",
      phone: "+84 123 456 789",
      faxLabel: "Fax",
      fax: "+84 123 456 780",
      emailLabel: "Email",
      email: "info@vtagroup.vn",
      formTitle: "Send an enquiry",
      fullName: "Full name",
      companyName: "Company name",
      position: "Position",
      emailField: "Business email",
      phoneField: "Phone number",
      message: "Your enquiry",
      interest: "Area of interest",
      selectPlaceholder: "Select an area",
      submit: "Send information",
      requiredNote: "Fields marked * are required.",
      success:
        "The demo form has been recorded. The receiving channel is being connected, so no information has been sent to a server.",
      options: [
        { value: "port", label: "Port operations" },
        { value: "water-transport", label: "Water transport" },
        { value: "logistics", label: "Logistics" },
        { value: "warehouse", label: "Warehousing" },
        { value: "cargo-handling", label: "Cargo handling" },
        { value: "partnership", label: "Business partnership" },
        { value: "other", label: "Other" },
      ],
    },
    footer: {
      tagline: "Steady steps to success",
      navigationLabel: "Footer navigation",
      copyright: "© 2026 VTA Global Port. All rights reserved.",
      top: "Back to top",
    },
  },
};
