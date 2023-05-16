const router=require('express').Router();
const { query } = require('express');
const conn=require('../DB/DataBaseConn')
const {body,validationResult}=require('express-validator')
const util=require('util'); //Helper Function

router.get('/',async (req,res)=>{

    try{
        const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
        const user = await query("select * from user ");
        if (user.length == 0) {
            return res.status(404).json({
                errors: [{
                    "msg": "No user Until Now !"
                }]
            })
        }
        res.status(200).json(user)
    }
    catch(error){

        res.status(500).json({ error: error })
    }




})


router.delete('/deleteUser/:id',async(req,res)=>{

    const userID=req.params.id;
const query = util.promisify(conn.query).bind(conn)
 const resu=await query('delete from user  where userID=?',userID)

 if(resu.affectedRows=="0"){
    return res.status(404).json("Already Deleted")
}else{
  return res.status(200).json('Data Deleted')
}
})

router.put('/editState/:id',async (req,res)=>{
    const userID=req.params.id;
    const query = util.promisify(conn.query).bind(conn)
 const resu=await query('update  user set status=?  where userID=?',[req.body.status,userID])
 if(resu.affectedRows=="0"){
    return res.status(404).json("Some Thing IS Wrong")
}else{
  return res.status(200).json('Data Update')
}
})

router.get('/count',async (req,res)=>{

    const query = util.promisify(conn.query).bind(conn)
    const resu=await query('select userID from user ');
     if(resu.length>0){

       res.json(resu[resu.length-1].userID+1)

     }else{
        res.json(1)
     }



})






module.exports=router;