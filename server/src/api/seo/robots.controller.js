exports.getRobotsTxt = (req, res) => {
  const content = `
User-agent: *
Allow: /

# Allow AI crawlers explicitly
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: meta-externalagent
Allow: /

# Allow AI input and training
Content-Signal: search=yes,ai-input=yes,ai-train=yes

Sitemap: https://dreamxec.com/sitemap.xml
`;

  res.header("Content-Type", "text/plain");
  res.send(content.trim());
};