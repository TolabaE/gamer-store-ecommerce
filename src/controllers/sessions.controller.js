
const postRegister = async(req,res) =>{
    const result = req.user;
    res.send({status:"success",payload:result._id});
}

const postLogin = async(req,res) =>{
    const {first_name,last_name,email,image,cart_ID,_id} = req.user;
    req.session.user = {//cuales son las propiedades que tiene el usuario cuando me logeo
        first_name,
        last_name,
        email,
        image,
        cart_ID,
        _id
    }
    res.send({status:"success",name:req.user.first_name})
}

const loginFail = (req,res) =>{
    res.status(500).send({status:"error",error:"A ocurrido un error al intentar logearse"})
}

const getLogout = (req,res) =>{
    //cierro sesion del usuario que esta logeado.
    req.session.destroy(err=>{ 
        if(err) return  res.status(500).send('no pude cerrar tu session');
    })
    res.redirect('/login')
}

const registerFail = (req,res) =>{
    res.status(500).send({status:"error",error:"a ocurrido un error al intentar registrar el usuario"})
}


export default {
    postRegister,
    postLogin,
    loginFail,
    registerFail,
    getLogout
}