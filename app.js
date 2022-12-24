const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const content = require(__dirname + "/content.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/blogWebsiteDB");

const postSchema = {
    title: {
        type: String,
        required: [true, "The field 'title' is required, please check the entered data"]
    },
    body: {
        type: String,
        required: [true, "The field 'body' is required, please check the entered data"]
    }
}
const Post = mongoose.model("Post", postSchema)


// ENDPOINTS: GET
app.get("/", (req, res) => {
    Post.find({}, (err, foundPosts) => {
        if (!err) {
            res.render("home", {
                homeMessage: content.homeStartingContent,
                posts: foundPosts,
            });
        }
    })   
});

app.get("/about", (req, res) => {
    res.render("about", {
        aboutMessage: content.aboutContent,
    });
});

app.get("/contact", (req, res) => {
    res.render("contact", {
        contactMessage: content.contactContent,
    });
});

app.get("/compose", (req, res) => {
    res.render("compose");
});

app.get("/posts/:postId", (req, res) => {
    postId = req.params.postId;
    Post.findOne({_id: postId}, (err, foundPost) => {
        if (!err) {
            res.render("post", {
                post: foundPost,
            });
        }
    });
});

// ENDPOINTS: POST
app.post("/compose", (req, res) => {
    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody,
    })
    post.save(err => {
        if (!err) {
            res.redirect("/");
        }
    });   
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
