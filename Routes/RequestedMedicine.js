// requestmedicine
const router=require('express').Router();
const { query } = require('express');
const conn=require('../DB/DataBaseConn')
const {body,validationResult}=require('express-validator')
const util=require('util'); //Helper Function
const Authoried=require('../Middleware/authorize');
const Admin=require('../Middleware/admin');
const { error } = require('console');

router.post('/addRequest',async(req,res)=>{

 const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise

   const checkUserActive=await query('select * from user where userID=?',req.body.userID);
     if(checkUserActive[0].status==0){
        return res.status(404).json("Your account Not Active To Do this")
     }
     const requestObj={
      medicineID:req.body.medicineID,
      userID:req.body.userID,
      requestDate:new Date(),
      reqStatus:'0',
     }
     const insertReq=await query('insert into requestmedicine set ?',requestObj,(error)=>{
      if(error){
         return res.status(404).json("not Inesrted")
      } else{
         return res.status(200).json('Data Inserted')
       }
     })
    
   





 })


 router.put('/adminEdit/:uid/:mid',async (req,res)=>{

    try{
        const {uid,mid}=req.params;
        const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
        const dataupdate=await query('update requestmedicine set reqStatus=?,AR=? where medicineID=?&&userID=?',[req.body.status,req.body.ar,mid,uid])
      res.json(dataupdate)


    }catch(error){
        return res.status(404).json({error:error})
    }






 })

 router.get("/",async (req,res)=>{
    try{
    const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
    const medicineReqData=await query("select * from requestmedicine join medicine on requestmedicine.medicineID=medicine.medicineID join user on requestmedicine.userID=user.userID ");
    if(medicineReqData.length==0){
       return res.json("No Data Until  now");
    }else{
    return res.json(medicineReqData)
    }


    }catch(error){
        return res.status(404).json({error:error})
    }



 })
 router.get("/userReq/:id",async (req,res)=>{
   const userid=req.params.id;
   try{
   const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
   const medicineReqData=await query("select * from requestmedicine join medicine on requestmedicine.medicineID=medicine.medicineID join user on requestmedicine.userID=user.userID where requestmedicine.userID=? ",userid);
   if(medicineReqData.length===0){
      return res.json('');
   }else{
   return res.json(medicineReqData)
   }


   }catch(error){
       return res.status(404).json({error:error})
   }



})

 router.delete('/deleteReq/:uid/:mid',async(req,res)=>{
  userid=req.params.uid;
  medicineid=req.params.mid;
   const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
   const resu=await query('delete from requestmedicine  where userID=? && medicineID=? ',[userid,medicineid])

 if(resu.affectedRows=="0"){
    return res.status(404).json("Already Deleted")
}else{
  return res.status(200).json('Data Deleted')
}

 })













module.exports=router;