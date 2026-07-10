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
        label: "Về công ty",
        href: "#company",
        children: ["Sứ mệnh và tầm nhìn", "Giá trị cốt lõi", "Lãnh đạo"],
      },
      {
        label: "Dịch vụ",
        href: "#services",
        children: [
          "Vận tải đường biển",
          "Khai thác cảng",
          "Khai thác kho bãi",
          "Dịch vụ logistics",
        ],
      },
      {
        label: "Đội tàu",
        href: "#fleet",
        children: ["Tàu biển", "Tàu sông"],
      },
      {
        label: "Tin tức",
        href: "#news",
        children: ["Hoạt động", "Sự kiện", "Truyền thông", "Tuyển dụng"],
      },
      {
        label: "Quản lý thông minh",
        href: "#smart",
        children: [
          "My VTA Port",
          "Tra cứu lịch tàu",
          "Theo dõi hàng hóa",
          "Biểu cước vận tải",
        ],
      },
      { label: "Liên hệ", href: "#contact", children: [] },
    ],
    hero: {
      eyebrow: "Kết nối cảng biển · Tối ưu chuỗi cung ứng",
      headline: "Vững bước thành công",
      body:
        "VTA Global Port mang đến giải pháp vận chuyển và khai thác hiệu quả, tối ưu dòng chảy hàng hóa từ cảng đến điểm giao nhận. Chúng tôi nâng cao năng lực vận hành, ứng dụng công nghệ, phát triển hạ tầng và trở thành đối tác tin cậy của khách hàng trong và ngoài nước.",
      cta: "Liên hệ với chúng tôi",
      imageAlt: "Tàu container đang được khai thác tại cảng biển",
      routeLabel: "Dòng chảy hàng hóa",
      routeValue: "Cảng → Điểm giao nhận",
      operatingLabel: "Năng lực",
      operatingValue: "Vận hành đồng bộ",
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
      title: "Một đầu mối. Một dòng vận hành xuyên suốt.",
      body:
        "Với hệ thống dịch vụ đồng bộ cùng đội ngũ chuyên nghiệp, chúng tôi kết nối vận tải, khai thác cảng và logistics để hàng hóa được lưu chuyển an toàn, hiệu quả và đúng tiến độ.",
      values: ["An toàn", "Hiệu quả vận hành", "Đổi mới", "Phát triển bền vững"],
      imageAlt: "Mạng lưới phương tiện vận tải nhìn từ trên cao",
      visualLabel: "VTA / Logistics tích hợp",
    },
    services: {
      eyebrow: "Năng lực tích hợp",
      title: "Dịch vụ của chúng tôi",
      description:
        "Với hệ thống dịch vụ đồng bộ cùng đội ngũ chuyên nghiệp, VTA Global Port mang đến các giải pháp vận chuyển và khai thác hiệu quả, giúp tối ưu dòng chảy hàng hóa từ cảng đến điểm giao nhận. Chúng tôi không ngừng nâng cao năng lực vận hành, ứng dụng công nghệ và phát triển hạ tầng để đáp ứng chuỗi cung ứng hiện đại.",
      imageAlt: "Hàng hóa được quản lý trong trung tâm kho vận",
      items: [
        {
          title: "Vận tải đường biển",
          description:
            "Giải pháp linh hoạt, an toàn và hiệu quả, đáp ứng nhu cầu vận chuyển hàng hóa trong nước và quốc tế.",
        },
        {
          title: "Khai thác cảng",
          description:
            "Quy trình chuyên nghiệp phục vụ tiếp nhận tàu, xếp dỡ hàng hóa và điều phối hoạt động cảng an toàn, hiệu quả.",
        },
        {
          title: "Khai thác kho bãi",
          description:
            "Hệ thống lưu trữ vận hành khoa học, quản lý hàng hóa xuyên suốt từ tiếp nhận, lưu kho đến phân phối.",
        },
        {
          title: "Dịch vụ logistics",
          description:
            "Giải pháp đồng bộ từ cảng đến điểm giao nhận, kết nối khai thác cảng, vận tải đường thủy và quản lý kho bãi.",
        },
      ],
    },
    fleet: {
      eyebrow: "Năng lực trên mọi thủy trình",
      title: "Đội tàu của chúng tôi",
      description:
        "Sở hữu đội tàu biển và tàu sông được đầu tư đồng bộ, VTA Global Port cung cấp năng lực vận tải linh hoạt. Hệ thống gồm 4 tàu biển trọng tải lớn cùng các phương tiện đường thủy nội địa, kết nối hiệu quả cảng biển, cảng sông và khu vực sản xuất để tối ưu chuỗi cung ứng.",
      cta: "Trao đổi nhu cầu vận tải",
      imageAlt: "Toàn cảnh cảng container nhìn từ trên cao",
      vesselCount: "04",
      vesselCountLabel: "tàu biển trọng tải lớn",
      watermark: "BIỂN / SÔNG",
      groups: [
        {
          title: "Tàu biển",
          description:
            "Năng lực vận chuyển tải trọng lớn, phục vụ luồng hàng trong nước và kết nối quốc tế.",
        },
        {
          title: "Tàu sông",
          description:
            "Phương tiện đường thủy nội địa linh hoạt, kết nối cảng biển với cảng sông và khu sản xuất.",
        },
      ],
    },
    news: {
      eyebrow: "Góc nhìn VTA",
      title: "Tin tức về chúng tôi",
      description:
        "Thông tin vận hành, hoạt động ngành và các cập nhật từ VTA Global Port sẽ được chia sẻ tại đây.",
      items: [
        {
          category: "Hoạt động",
          title: "Góc nhìn từ hoạt động khai thác cảng và logistics",
          description:
            "Nội dung về quy trình vận hành, an toàn và tối ưu luồng hàng đang được biên tập.",
          status: "Nội dung sắp cập nhật",
        },
        {
          category: "Sự kiện",
          title: "Kết nối chuyên môn trong chuỗi cung ứng",
          description:
            "Thông tin hội thảo và hoạt động kết nối ngành sẽ được công bố sau khi xác nhận.",
          status: "Nội dung sắp cập nhật",
        },
        {
          category: "Truyền thông",
          title: "Tài liệu và câu chuyện về vận tải hiện đại",
          description:
            "Các nội dung truyền thông chính thức của VTA Global Port sẽ xuất hiện tại chuyên mục này.",
          status: "Nội dung sắp cập nhật",
        },
      ],
    },
    smart: {
      eyebrow: "Vận hành dựa trên dữ liệu",
      title: "Hệ thống quản lý thông minh của chúng tôi",
      description:
        "Ứng dụng công nghệ và quy trình quản lý hiện đại để tối ưu hoạt động khai thác cảng, điều phối phương tiện và quản lý hàng hóa, giúp nâng cao hiệu quả vận hành và hỗ trợ khách hàng trong suốt quá trình logistics.",
      interfaceLabel: "Bảng điều phối VTA",
      systemOnline: "Hạ tầng dịch vụ đang kết nối",
      tools: [
        {
          title: "My VTA Port",
          description: "Không gian quản lý tập trung cho khách hàng và đối tác.",
        },
        {
          title: "Tra cứu lịch tàu",
          description: "Tiếp cận lịch trình dự kiến trong một luồng tra cứu rõ ràng.",
        },
        {
          title: "Theo dõi hàng hóa",
          description: "Theo dõi tiến trình lô hàng khi hệ thống dữ liệu được kết nối.",
        },
        {
          title: "Biểu cước vận tải",
          description: "Tham khảo biểu cước theo nhu cầu và tuyến vận chuyển.",
        },
      ],
    },
    contact: {
      eyebrow: "Bắt đầu từ một cuộc trao đổi",
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
      confirmationNote: "Thông tin đang được xác nhận",
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
      tagline: "Kết nối năng lực cảng. Kiến tạo dòng chảy hàng hóa.",
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
        label: "Company",
        href: "#company",
        children: ["Mission & vision", "Core values", "Leadership"],
      },
      {
        label: "Services",
        href: "#services",
        children: ["Sea freight", "Port operations", "Warehousing", "Logistics"],
      },
      {
        label: "Fleet",
        href: "#fleet",
        children: ["Sea-going vessels", "River vessels"],
      },
      {
        label: "News",
        href: "#news",
        children: ["Operations", "Events", "Media", "Careers"],
      },
      {
        label: "Smart management",
        href: "#smart",
        children: ["My VTA Port", "Vessel schedule", "Cargo tracking", "Freight tariffs"],
      },
      { label: "Contact", href: "#contact", children: [] },
    ],
    hero: {
      eyebrow: "Connecting ports · Optimising supply chains",
      headline: "Steady steps to success",
      body:
        "VTA Global Port delivers efficient transport and operations solutions that optimise cargo flows from port to destination. We strengthen operational capacity, apply technology, develop infrastructure and aim to be a trusted partner for customers in Vietnam and abroad.",
      cta: "Contact us",
      imageAlt: "Container vessels being handled at a seaport",
      routeLabel: "Cargo flow",
      routeValue: "Port → Destination",
      operatingLabel: "Capability",
      operatingValue: "Integrated operations",
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
      title: "One partner. One continuous operating flow.",
      body:
        "Through integrated services and an experienced team, we connect transport, port operations and logistics so cargo can move safely, efficiently and on schedule.",
      values: ["Safety", "Operational excellence", "Innovation", "Sustainability"],
      imageAlt: "Transport network viewed from above",
      visualLabel: "VTA / Integrated Logistics",
    },
    services: {
      eyebrow: "Integrated capability",
      title: "Our services",
      description:
        "With integrated services and a professional team, VTA Global Port delivers efficient transport and operations solutions that optimise cargo flows from port to destination. We continually strengthen our operations, apply technology and develop infrastructure for modern supply chains.",
      imageAlt: "Cargo managed inside a logistics warehouse",
      items: [
        {
          title: "Sea freight",
          description:
            "Flexible, safe and efficient solutions for domestic and international cargo transport.",
        },
        {
          title: "Port operations",
          description:
            "Professional processes for vessel reception, cargo handling and safe, efficient port coordination.",
        },
        {
          title: "Warehousing",
          description:
            "Scientifically operated storage and end-to-end cargo management from receipt to distribution.",
        },
        {
          title: "Logistics services",
          description:
            "Integrated port-to-destination solutions connecting port operations, water transport and warehousing.",
        },
      ],
    },
    fleet: {
      eyebrow: "Capability across waterways",
      title: "Our fleet",
      description:
        "VTA Global Port operates a consistently invested fleet of sea-going and river vessels for flexible cargo transport. Four high-capacity sea-going vessels and inland waterway craft connect seaports, river ports and production areas to optimise supply chains.",
      cta: "Discuss transport needs",
      imageAlt: "Aerial overview of a container terminal",
      vesselCount: "04",
      vesselCountLabel: "high-capacity sea-going vessels",
      watermark: "SEA / RIVER",
      groups: [
        {
          title: "Sea-going vessels",
          description:
            "High-capacity transport serving domestic cargo flows and international connections.",
        },
        {
          title: "River vessels",
          description:
            "Flexible inland waterway craft connecting seaports, river ports and production areas.",
        },
      ],
    },
    news: {
      eyebrow: "VTA perspectives",
      title: "News about us",
      description:
        "Operational insights, industry activity and updates from VTA Global Port will be shared here.",
      items: [
        {
          category: "Operations",
          title: "Perspectives from port and logistics operations",
          description:
            "Editorial content on operating processes, safety and cargo flow optimisation is in preparation.",
          status: "Content coming soon",
        },
        {
          category: "Events",
          title: "Building professional supply-chain connections",
          description:
            "Industry workshop and networking information will be published once confirmed.",
          status: "Content coming soon",
        },
        {
          category: "Media",
          title: "Resources and stories about modern transport",
          description:
            "Official VTA Global Port media will be published in this section.",
          status: "Content coming soon",
        },
      ],
    },
    smart: {
      eyebrow: "Data-led operations",
      title: "Our smart management system",
      description:
        "We apply technology and modern management processes to optimise port operations, vehicle coordination and cargo management, improving operating efficiency and supporting customers throughout their logistics journey.",
      interfaceLabel: "VTA operations board",
      systemOnline: "Service infrastructure is connecting",
      tools: [
        {
          title: "My VTA Port",
          description: "A central management space for customers and partners.",
        },
        {
          title: "Vessel schedule",
          description: "Access planned schedules through a clear lookup flow.",
        },
        {
          title: "Cargo tracking",
          description: "Follow shipment progress once the data service is connected.",
        },
        {
          title: "Freight tariffs",
          description: "Review tariffs based on transport needs and routes.",
        },
      ],
    },
    contact: {
      eyebrow: "Start with a conversation",
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
      confirmationNote: "Information pending confirmation",
      formTitle: "Send an enquiry",
      fullName: "Full name",
      companyName: "Company name",
      position: "Position",
      emailField: "Email",
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
      tagline: "Connecting port capability. Creating seamless cargo flows.",
      navigationLabel: "Footer navigation",
      copyright: "© 2026 VTA Global Port. All rights reserved.",
      top: "Back to top",
    },
  },
};
