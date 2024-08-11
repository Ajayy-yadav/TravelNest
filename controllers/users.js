const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("../users/user.ejs");
    // res.send("form")
}

module.exports.signup=async(req,res,next)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    let registeredUser= await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if (err){
        return next(err)
        }
    req.flash("success","welcome to wanderlust!");
    res.redirect("/listings");
    })
    // console.log(registeredUser);
    }catch(err){
    req.flash("error",err.message);
    res.redirect('/signup');
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("../users/login.ejs");
}

module.exports.Login=async(req,res)=>{
    req.flash("success","welcome back to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
        return next(err)
        }
    req.flash("success","you are logged out!");
    res.redirect("/listings");
    });
}