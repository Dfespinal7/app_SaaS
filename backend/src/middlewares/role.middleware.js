export function roleMiddleware(allowedRoles=[]){
    return (req,res,next)=>{
        if(!req.user){
            return res.status(409).json({mesage:'No autorizado'})
        }
       
        if(!allowedRoles.includes(req.user.role.toLowerCase())){
            return res.status(409).json({message:'Acceso denegado'})
        }
        next()

    }
}