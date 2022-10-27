import Users from "../models/UserModel.js";

export const verifyUser = async(req, res, next)=>{
    if(!req.session.userId){
        return res.status(401).json({msg: "Mohon Login Ke Akun Anda"});
        
    }
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User Tidak Ditemukan"});
    req.userId = user.id;
    next();
}

export const adminOnly = async(req, res, next)=>{
    const user = await Users.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan!"});
    if(user.email !== "admin@gmail.com") return res.status(403).json({msg:"Maaf Hanya admin yang boleh"});
    next();
}