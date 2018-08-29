const mongoose = require("mongoose");
const validUrl = require("valid-url");
const UrlShorten = mongoose.model("UrlShorten");
const shortid = require("shortid");

const baseUrl = "https://twasi.net"
const errorUrl = `${baseUrl}/404`;
const shortenUrl = `https://twa.si`;
const defaultShortenUrl = `${shortenUrl}/s`;
const customShortenUrl = `${shortenUrl}/c`;
const panelUrl = "https://panel-beta.twasi.net?ref=";

module.exports = app => {
  app.get("/", async (req, res) => {
    return res.redirect(baseUrl);
  });
  app.get("/twitter", async (req, res) => {
    return res.redirect("https://twitter.com/TwasiNET");
  });
  app.get("/blog", async (req, res) => {
    return res.redirect("https://medium.com/Twasi");
  });
  app.get("/ref/:name", async (req, res) => {
    return res.redirect(`${panelUrl}${req.params.name}`);
  })
  app.get("/sd", async (req, res) => {
    return res.redirect("https://diespendendose.net");
  })
  app.get("/comtreffen", async (req, res) => {
    return res.redirect("https://docs.google.com/forms/d/e/1FAIpQLScJwDfZb-48prNZl8v4pwmkkalIUX6glsfSxi6zPGzUj1f8ng/viewform?usp=sf_link");
  })
  app.get("/c/:code", async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      return res.redirect(item.originalUrl);
    } else {
      return res.redirect(errorUrl);
    }
  });
  app.get("/api/item/:code", async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(401).json("Invalid code");
    }
  });
  app.post("/api/item", async (req, res) => {
    const { originalUrl } = req.body;
    const urlCode = shortid.generate();
    const updatedAt = new Date();
    if (validUrl.isUri(originalUrl)) {
      try {
        const item = await UrlShorten.findOne({ originalUrl: originalUrl });
        if (item) {
          res.status(200).json(item);
        } else {
          shortUrl = customShortenUrl + "/" + urlCode;
          const item = new UrlShorten({
            originalUrl,
            shortUrl,
            urlCode,
            updatedAt
          });
          await item.save();
          res.status(201).json(item);
        }
      } catch (err) {
        res.status(401).json("Invalid User Id");
      }
    } else {
      return res
        .status(401)
        .json(
          "Invalid Original Url"
        );
    }
  });
  app.get("/:path", async (req, res) => {
    return res.redirect(`${baseUrl}/${req.params.path}`);
  });
};
