import User from "../models/user.js";


export const renderSignupForm =(req,res)=>{
    res.render("users/signup.ejs");
};


export const signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);

    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to wanderlust!");
        res.redirect("/listings");
    });

    
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    

};



export const renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};


export const login=async(req,res)=>{
        req.flash("success","welome back to wanderlust! you are logged in!");
        res.redirect(res.locals.redirectUrl || "/listings");
    };


export const logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("sucess","you are logged out!");
        res.redirect("/listings");
    })
};