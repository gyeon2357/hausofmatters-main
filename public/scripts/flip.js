$(document).ready(function () {
  $("#read").flipBook({
    //Layout Setting
    pdfUrl: "pdf/pdf.pdf",
    lightBox: true,
    layout: 3,
    currentPage: { vAlign: "bottom", hAlign: "left" },
    // BTN SETTING
    btnShare: { enabled: false },
    btnPrint: {
      hideOnMobile: true,
    },
    btnDownloadPages: {
      enabled: true,
      title: "Download pages",
      icon: "fa-download",
      icon2: "file_download",
      url: "images/pdf.rar",
      name: "allPages.zip",
      hideOnMobile: false,
    },
    btnColor: "rgb(255,120,60)",
    sideBtnColor: "rgb(255,120,60)",
    sideBtnSize: 60,
    sideBtnBackground: "rgba(0,0,0,.7)",
    sideBtnRadius: 60,
    btnSound: { vAlign: "top", hAlign: "left" },
    btnAutoplay: { vAlign: "top", hAlign: "left" },
    // SHARING
    btnShare: {
      enabled: true,
      title: "Share",
      icon: "fa-share-alt",
    },
    facebook: {
      enabled: true,
      url: "ismanyan.github.io/Pdf_flipbook.demo.github.io/pdf/pdf.pdf",
    },
    google_plus: {
      enabled: false,
    },
    email: {
      enabled: true,
      url: "https://ismanyan.github.io/Pdf_flipbook.demo.github.io/pdf/pdf.pdf",
      title: "PDF KPK",
      description: "Silahkan click link di bawah untuk melihat / mengunduf pdf",
    },
    twitter: {
      enabled: true,
      url: "https://ismanyan.github.io/Pdf_flipbook.demo.github.io/pdf/pdf.pdf",
    },
    pinterest: {
      enabled: true,
      url: "https://ismanyan.github.io/Pdf_flipbook.demo.github.io/pdf/pdf.pdf",
    },
  });
});
