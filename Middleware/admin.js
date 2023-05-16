const conn=require('../DB/DataBaseConn');
const util=require('util');

const Admin= async (req,res,next)=>{

    const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
    const {token}=req.headers;
    const admin=await query('select * from user where token =? ',[token]);
    if(admin[0]&&admin[0].type=="1"){
        next();
    }else{
        res.status(403).json({
            msg:"You are Not Have A Permission"
        })
    }




}

module.exports=Admin;