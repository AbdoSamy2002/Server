const router=require('express').Router();
const { query } = require('express');
const conn=require('../DB/DataBaseConn')
const {body,validationResult}=require('express-validator')
const util=require('util'); //Helper Function
const Authoried=require('../Middleware/authorize');
const Admin=require('../Middleware/admin');

router.post('/add',async (req,res)=>{
try{
const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
const checkMedicineNameExsit=await query('select * from medicine where medicineName=?',[req.body.medicineName]);

if(checkMedicineNameExsit.length>0){
    return res.status(404).json({
     msg:"this name is exis"
    })
}
const MedicineObj={
    medicineID:req.body.medicineID,
    medicineName:req.body.medicineName,
    medcineDesc:req.body.medcineDesc,
    price:req.body.price,
    expirationDate:req.body.ex,
    categoryID:req.body.categoryID
}
await query('Insert Into medicine set ?',MedicineObj,(err)=>{
    if(err){
        return res.status(404).json("not Inesrted")
     } else{
        return res.status(200).json('Data Inserted')
      }
})


}catch(errors){
    res.status(400).json({
        err:errors
    })
}
})


router.put('/edit/:id',async (req,res)=>{
try{

   
const id=req.params.id
const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
// const checkMedicineNameExsit=await query('select * from medicine where medicineName=?',[req.body.medicineName]);

// if(checkMedicineNameExsit.length>0){
//     return res.status(404).json({
//      msg:"this name is exis"
//     })
// }
// const checkCategoryID=await query('select * from medicine where categoryID=?',[req.body.categoryID]);
// if(checkCategoryID==0){
//     return res.status(404).json({
//         msg:"this category Not Found"
//        }) 
// }
const MedicineObj={

    medicineName:req.body.medicineName,
    medcineDesc:req.body.medcineDesc,
    price:req.body.price,
    expirationDate:req.body.ex,
    categoryID:req.body.categoryID
}
await query(' update medicine set medicineName=?,medcineDesc=?,price=?,expirationDate=?,categoryID=? where medicineID=?   ',
[MedicineObj.medicineName,MedicineObj.medcineDesc,MedicineObj.price,MedicineObj.expirationDate,MedicineObj.categoryID,id],
(err)=>{
    if(err){
        res.json({msg:err})
    }else{
        return res.status(200).json("DataUpdated")
    }
})


}catch(errors){
    res.status(400).json({
        err:errors
    })
}
})


router.delete('/delete/:id',async (req,res)=>{

try{
const id=req.params.id;
const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
const resu=await query('delete from medicine where medicineID=?',id)
if(resu.affectedRows=="0"){
    return res.status(404).json("Already Deleted")
}else{
  return res.status(200).json('Data Deleted')
}
   



}catch(error){

res.status(500).json({error:error})

}



})

router.get('/',async (req,res)=>{
try{
    const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
     const medicineData=await query("select * from medicine");
     if(medicineData.length==0){
        return res.json("No Data Until  now");
     }else{
     return res.json(medicineData)
     }
}catch(error){

    res.status(500).json({error:error})
}





})
router.get('/medicineCategory',async (req,res)=>{
    try{
        const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
         const medicineData=await query("select * from category  join medicine on category.categoryID=medicine.categoryID ");
         if(medicineData.length==0){
            return res.json("No Data Until  now");
         }else{
         return res.json(medicineData)
         }
    }catch(error){
    
        res.status(500).json({error:error})
    }
    
    
    
    
    
    })
router.get('/medicineDetails/:medicineID',async (req,res)=>{
    try{
        const MedId=req.params.medicineID;
        const query = util.promisify(conn.query).bind(conn);//tranform  query to Promise
         const medicineData=await query("select * from medicine join category on medicine.categoryID=category.categoryID where medicineID=? ",[MedId]);
         if(medicineData.length==0){
            return res.json("No Data Until  now");
         }else{
         return res.json(medicineData)
         }
    }catch(error){
    
        res.status(500).json({error:error})
    }
    
    
    
    
    
    })

    router.get('/count',async (req,res)=>{

        const query = util.promisify(conn.query).bind(conn)
        const resu=await query('select medicineID from medicine ');
         if(resu.length>0){
    
           res.json(resu[resu.length-1].medicineID+1)
    
         }else{
            res.json(1)
         }
    })



module.exports=router;