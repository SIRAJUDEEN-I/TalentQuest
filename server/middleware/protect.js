const protect = (req , res , next) => {
    if(!req.oidc.isAuthenticated()){
        return res.status(401).json({message:"User not authenticated"});
    }
    next();
}


export default protect;