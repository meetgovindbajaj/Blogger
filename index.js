const express = require("express");
const app = express();
const dotenv = require("./config");
const articleRouters = require("./routers/articles");
const Blog = require("./model/blogSchema");
const mo = require("method-override");
app.use((req, res, next) => {
  dotenv;
  next();
});
require("./db/conn");

const PORT = process.env.PORT || 5000;
const c = new Date();
function time() {
  function convertTZ(date, tzString) {
    return new Date(
      (typeof date === "string" ? new Date(date) : date).toLocaleString(
        "en-US",
        { timeZone: tzString }
      )
    );
  }
  const a = convertTZ(c, "Asia/Kolkata");
  return a.getHours() + ":" + a.getMinutes() + ":" + a.getSeconds();
}
app.set("view engine", "ejs");
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(mo("_method"));
app.use("/articles", articleRouters);
app.get("/", async (req, res) => {
  const articles = await Blog.find().sort({ createdOn: "desc" });
  return res.render("articles/index", { articles: articles });
});
app.listen(PORT, () => {
  console.log(
    `\n\nWE ARE ONLINE ~ \n\nURL\t: http://localhost:${PORT}\nTIME\t: ${time()}\n`
  );
});
