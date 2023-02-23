
const UserService = require("../services/user.service");

const { client } = require("../utils/mongodb.util");

const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

//Create and Save a new User

exports.create = async (req, res, next) => {
    if(!req.body?.username){
        return next(new ApiError(400, "Username can not be empty"));
    }
  
    if(!req.body?.password){
        return next(new ApiError(400, "Password can not be empty"));
    }

    try{
        const userService =  new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(document);
    }
    catch (error){
        return next(
            new ApiError(500, "An error occurred while creating the User11111")
        );
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try{
        const userService =  new UserService(MongoDB.client);
        const {username} = req.query;
        if(username){
            documents = await userService.findByUsername(username);
        }else{
            documents = await userService.find({});
        }
    }catch (error){
        return next(
            new ApiError(500, "An error occurred while retrieving users")
        );
    }
    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const userService = new UserService(MongoDB.client);
        const document = await userService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404,"user not found"));
        }
        return res.send(document);
    }catch (error){
        return next(
            new ApiError(
                500,
                `Error retrieving user with id = ${req.params.id}`
            )
        );
    }
};

exports.findUser = async (req, res, next) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    try{
        const userService = new UserService(MongoDB.client);
        const user = await userService.findUserr({ username, password });
        // console.log(user);
       
        if(!user){
            res.status(401).json({
                message: "Login not successful",
                error: "User not found",
              })
        }else{
            res.status(200).json({
                message: "Login successful",
                user,
              })
        }
        return res.send(user);
    }catch (error){
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
          })
    }
};





exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    try{
        const userService = new UserService(MongoDB.client);
        const document = await userService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "user not found"));
        }
        return res.send({message: "user was updated sucessfully"});
    }catch (error){
        return next(
            new ApiError(500, `Error updating user with id=${req.params.id}`)
        );
    }
};

exports.delete = async(req, res, next) => {
    try{
        const userService = new UserService(MongoDB.client);
        const document = await userService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, "user not found"));
        }
        return res.send({messege: "user was deleted successfully"});

    }catch (error){
        return next(new ApiError(500, `Could not delete user with id = ${req.params.id}`))

    }
};

exports.deleteAll = async(_req, res, next) => {
    try{
        const userService = new UserService(MongoDB.client);
        const deleteCount = await userService.deleteAll();
        return res.send({
            messege: `${deleteCount} user were deleted successfully`,
        });

    }catch (error){
        return next(
            new ApiError(500, "An error occurred while removing all users")
        );
    }
};



