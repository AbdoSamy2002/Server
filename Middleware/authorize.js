const conn=require('../DB/DataBaseConn');
const util=require('util');

const Authoried= async (req,res,next)=>{

    const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
    const {token}=req.headers;
    const user=await query('select * from user where token =? ',[token]);
    if(user[0]){
        next();
    }else{
        res.status(403).json({
            msg:"You are Not Authorize"
        })  
    }




}

module.exports=Authoried;