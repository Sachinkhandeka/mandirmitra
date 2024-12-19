const Temple = require("../models/temple");

// get sitemap controller 
module.exports.getSitemapController = async ( req, res )=> {
    try {
        const temples = await Temple.find(); 

        // Create URLs dynamically
        const urls = [];
        urls.push({ loc: "/", changefreq: "daily", priority: 1.0 });
        urls.push({ loc: "/landingpage", changefreq: "monthly", priority: 0.7 });

        // Add temple routes
        temples.forEach((temple) => {
            const templeId = temple._id;
            urls.push({ loc: `/temple/${templeId}`, changefreq: "weekly", priority: 0.8 });
            urls.push({ loc: `/temple/${templeId}/posts`, changefreq: "weekly", priority: 0.9 });
            urls.push({ loc: `/temple/${templeId}/videos`, changefreq: "weekly", priority: 0.9 });
            urls.push({ loc: `/temple/${templeId}/photos`, changefreq: "weekly", priority: 0.9 });
            urls.push({ loc: `/temple/${templeId}/festivals`, changefreq: "weekly", priority: 0.9 });
            urls.push({ loc: `/temple/${templeId}/gods`, changefreq: "weekly", priority: 0.9 });
            urls.push({ loc: `/temple/${templeId}/pujaris`, changefreq: "weekly", priority: 0.9 });
            urls.push({ loc: `/temple/${templeId}/managment`, changefreq: "weekly", priority: 0.9 });
            urls.push({ loc: `/temple/${templeId}/about`, changefreq: "weekly", priority: 0.9 });
        });

        // Generate XML
        let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
        urls.forEach((url) => {
            sitemap += `<url>\n`;
            sitemap += `<loc>https://www.mandirmitra.co.in${url.loc}</loc>\n`;
            sitemap += `<changefreq>${url.changefreq}</changefreq>\n`;
            sitemap += `<priority>${url.priority}</priority>\n`;
            sitemap += `</url>\n`;
        });
        sitemap += `</urlset>`;

        // Serve the sitemap
        res.header("Content-Type", "application/xml");
        res.send(sitemap);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating sitemap");
    }
}