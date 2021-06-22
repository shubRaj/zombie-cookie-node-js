const app = require("express")();
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
let logins = {};
app.use(cookieParser());
app.use(function (req, res, next) {
    res.set('Cache-control', 'no-cache')
    next()
  })
app.get("/login", (req, res) => {
    let { user } = req.query;
    if (user) {
        res.cookie("user", user);
        return res.redirect("..");
    }
    return res.send(`<form> Username <input type='text' name='user' placeholder='Username'>
    <button type='submit'>Submit</button></form>`);
});
app.get("/", (req, res) => {
    let etag = req.headers["if-none-match"]
    let {user} = req.cookies
    if (user && logins[etag]!==user){
        etag = crypto.randomBytes(64).toString("hex")
        logins[etag] = user
    }else if (!user && logins[etag]){
        res.cookie("user",logins[etag])
    }else if (!(user || logins[etag])) return res.redirect("/login");
    res.setHeader("etag",etag)
    res.sendFile(__dirname+"/index.html")
})
app.listen(8000, () => {
    console.log("Listening....")
})