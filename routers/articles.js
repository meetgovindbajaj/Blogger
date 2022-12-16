const express = require("express");
const router = express.Router();
const Blog = require("../model/blogSchema");
const marked = require("marked");
const slugify = require("slugify");
const createdompurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createdompurify(new JSDOM().window);
router.get("/new", async (req, res) => {
  res.render("articles/new", { article: new Blog() });
});

router.get("/:slug", async (req, res) => {
  const article = await Blog.find({ slug: req.params.slug });
  if (article === null) {
    res.redirect(`/articles`);
  }
  res.render("articles/show", { article: article[0] });
});

router
  .get("/edit/:id", async (req, res) => {
    const article = await Blog.findById(req.params.id);
    res.render("articles/edit", { article: article });
  })
  .post("/:id", async (req, res) => {
    let article = await Blog.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
        slug:slugify(req.body.title, { lower: true, strict: true }),
        sanitizedHtml:dompurify.sanitize(marked.parse(req.body.markdown))
      }
    );
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      console.log(err);
      res.render(`articles/edit`, { article: article });
    }
  });

router
  .get("/", async (req, res) => {
    res.render("articles/new");
  })
  .post(
    "/",
    async (req, res, next) => {
      req.article = new Blog();
      next();
    },
    saveArticleAndRedirect("new")
  );

router.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;
    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (err) {
      res.render(`articles/${path}`, { article: article });
    }
  };
}
module.exports = router;
