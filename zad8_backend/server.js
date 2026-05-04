const http = require("http");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");

const PORT = 3000;
const ROOT_DIR = __dirname;
const SUBMISSIONS_PATH = path.join(ROOT_DIR, "submissions.json");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(payload));
};

const appendSubmission = async (submission) => {
  let submissions = [];

  try {
    const raw = await fsp.readFile(SUBMISSIONS_PATH, "utf8");
    submissions = JSON.parse(raw);
    if (!Array.isArray(submissions)) {
      submissions = [];
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  submissions.push(submission);
  await fsp.writeFile(SUBMISSIONS_PATH, `${JSON.stringify(submissions, null, 2)}\n`, "utf8");
};

const handleContactPost = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
    if (body.length > 1e6) {
      req.destroy();
    }
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body || "{}");
      const firstName = typeof data.firstName === "string" ? data.firstName.trim() : "";
      const lastName = typeof data.lastName === "string" ? data.lastName.trim() : "";
      const email = typeof data.email === "string" ? data.email.trim() : "";
      const message = typeof data.message === "string" ? data.message.trim() : "";

      if (!firstName || !lastName || !email || !message) {
        sendJson(res, 400, { message: "Wszystkie pola formularza sa wymagane." });
        return;
      }

      const submission = {
        firstName,
        lastName,
        email,
        message,
        createdAt: new Date().toISOString()
      };

      await appendSubmission(submission);
      sendJson(res, 201, { message: "Formularz wyslany poprawnie. Dane zapisano na serwerze." });
    } catch (error) {
      sendJson(res, 500, { message: "Blad zapisu danych na serwerze." });
    }
  });
};

const serveStaticFile = (req, res) => {
  const requestedPath = req.url === "/" ? "/index.html" : req.url;
  const cleanPath = path.normalize(requestedPath).replace(/^\\+/, "");
  const filePath = path.join(ROOT_DIR, cleanPath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Nie znaleziono zasobu.");
        return;
      }

      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Blad serwera.");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = contentTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
};

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    });
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/contact") {
    handleContactPost(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStaticFile(req, res);
    return;
  }

  sendJson(res, 405, { message: "Metoda HTTP nie jest obslugiwana." });
});

server.listen(PORT, () => {
  console.log(`Serwer dziala: http://localhost:${PORT}`);
});
