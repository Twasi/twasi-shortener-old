const mongoose = require("mongoose");
const validUrl = require("valid-url");
const UrlShorten = mongoose.model("UrlShorten");
const shortid = require("shortid");

const baseUrl = "https://twasi.net"
const errorUrl = `${baseUrl}/404`;
const shortenUrl = "http://localhost:7000/s";
const panelUrl = "https://panel-beta.twasi.net?ref=";

module.exports = app => {
  app.get("/", async (req, res) => {
    res.redirect("https://twasi.net");
  });
  app.get("/ref/:name", async (req, res) => {
    res.redirect(`${panelUrl}${req.params.name}`);
  })
  app.get("/:path", async (req, res) => {
    return res.redirect(`${baseUrl}/${req.params.path}`);
  });
  app.get("/s/:code", async (req, res) => {
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
          shortUrl = shortenUrl + "/" + urlCode;
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
};
