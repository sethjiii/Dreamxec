const prisma = require("../../config/prisma");

exports.getSitemap = async (req, res) => {
  try {

    const baseUrl = "https://dreamxec.com";

    const campaigns = await prisma.userProject.findMany({
      where: { status: "APPROVED" },
      select: {
        slug: true,
        updatedAt: true
      }
    });

    const staticPages = [
      "",
      "/start-project",
      "/how-it-works/students",
      "/eligibility",
      "/resources",
      "/fund-innovation",
      "/how-it-works/donors",
      "/why-donate",
      "/corporate-partnerships",
      "/alumni-giving",
      "/become-mentor",
      "/perfect-storm",
      "/careers",
      "/contact",
      "/faq",
      "/success-stories",
      "/press",
      "/terms-And-Conditions"
    ];

    const staticUrls = staticPages
      .map(page => `
        <url>
          <loc>${baseUrl}${page}</loc>
          <changefreq>weekly</changefreq>
          <priority>${page === "" ? "1.0" : "0.7"}</priority>
        </url>
      `)
      .join("");

    const campaignUrls = campaigns
      .map(campaign => `
        <url>
          <loc>${baseUrl}/campaign/${campaign.slug}</loc>
          <lastmod>${campaign.updatedAt?.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `)
      .join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${staticUrls}

${campaignUrls}

</urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");

    res.send(xml);

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error generating sitemap");
  }
};