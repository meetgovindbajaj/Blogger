const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createdompurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createdompurify(new JSDOM().window);
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    markdown: {
      type: String,
      required: true,
    },
    createdOn: {
      type: Date,
      default: () => Date.now(),
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    sanitizedHtml: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
blogSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
  }
  next();
});
const Blog = mongoose.model("BLOGS", blogSchema);
module.exports = Blog;
