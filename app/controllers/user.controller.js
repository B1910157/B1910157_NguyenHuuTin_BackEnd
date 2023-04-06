
const UserService = require("../services/user.service");

const { client } = require("../utils/mongodb.util");

const MongoDB = require("../utils/mongodb.util");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.username) {
        return next(new ApiError(400, "Username can not be empty"));
    }

    if (!req.body?.password) {
        return next(new ApiError(400, "Password can not be empty"));
    }

    try {
        const userService = new UserService(MongoDB.client);
        const document = await userService.create(req.body);
        return res.send(document);
        // return res.send(`Inserted new user have Id: ${document.insertedId}`);
    }
    catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the User11111")
        );
    }
};

exports.login = async (req, res, next) => {
    console.log(req.body)
    if (!req.body?.username || !req.body?.password) {
        return next(new ApiError(400, "Input username/password"))
    }
    try {
        const userService = new UserService(MongoDB.client);
        const user = await userService.findUsername(req.body.username);
        const comparePass = await bcrypt.compare(req.body.password, user.password);
        if (!user) {
            return next(new ApiError(401, "Username notfound"));
        }
        else if (!comparePass) {
            return next(new ApiError(400, "password fail"));
        }
        else {
            const token = jwt.sign({ id: user._id }, "secret", { expiresIn: 864000 });
            return res.send({
                status: 'success', message: "Login successfully", token: token
            });
        }
    } catch (error) {
        return next(new ApiError(500, "Login error"))
    }
}

exports.logout = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        console.log(auth)
        if (!auth) {
            return next(new ApiError(401, "Unauthorized"))
        }
        const token = auth.split(" ")[1];
        const decoded_user = jwt.decode(token);
        console.log('decoded: ', decoded_user)
        return res.send({ message: "Logout success" })

    } catch (error) {
        return next(new ApiError(500, "logout fail"))
    }
}

exports.findAll = async (req, res, next) => {
    let documents = [];

    try {
        const userService = new UserService(MongoDB.client);
        const { username } = req.query;
        if (username) {
            documents = await userService.findByUsername(username);
        } else {
            documents = await userService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving users")
        );
    }
    return res.send(documents);
};

// exports.findOne = async (req, res, next) => {
//     try {
//         const userService = new UserService(MongoDB.client);
//         const document = await userService.findById(req.params.id);
//         if (!document) {
//             return next(new ApiError(404, "user not found"));
//         }
//         return res.send(document);
//     } catch (error) {
//         return next(
//             new ApiError(
//                 500,
//                 `Error retrieving user with id = ${req.params.id}`
//             )
//         );
//     }
// };

// exports.login = async (req, res, next) => {
//     if (!req.body?.username || !req.body?.password) {
//         return next(new ApiError(400, "Invalid register"));
//     }

//     try{

//         const userService = new UserService(MongoDB.client);
//         const document = await userService.findByName(req.body.username);

//         // console.log(document.password);

//         if(req.body.password == document.password)
//             return res.send({message: "login successfully"});
//         return res.send({message: "account invalid"});
//     }catch (error){
//         res.json({
//             message: "An error occurred",
//             error: error.message,
//           })
//     }
// };





// exports.update = async (req, res, next) => {
//     if (Object.keys(req.body).length === 0) {
//         return next(new ApiError(400, "Data to update can not be empty"));
//     }
//     try {
//         const userService = new UserService(MongoDB.client);
//         const document = await userService.update(req.params.id, req.body);
//         if (!document) {
//             return next(new ApiError(404, "user not found"));
//         }
//         return res.send({ message: "user was updated sucessfully" });
//     } catch (error) {
//         return next(
//             new ApiError(500, `Error updating user with id=${req.params.id}`)
//         );
//     }
// };

// exports.delete = async (req, res, next) => {
//     try {
//         const userService = new UserService(MongoDB.client);
//         const document = await userService.delete(req.params.id);
//         if (!document) {
//             return next(new ApiError(404, "user not found"));
//         }
//         return res.send({ messege: "user was deleted successfully" });

//     } catch (error) {
//         return next(new ApiError(500, `Could not delete user with id = ${req.params.id}`))

//     }
// };

// exports.deleteAll = async (_req, res, next) => {
//     try {
//         const userService = new UserService(MongoDB.client);
//         const deleteCount = await userService.deleteAll();
//         return res.send({
//             messege: `${deleteCount} user were deleted successfully`,
//         });

//     } catch (error) {
//         return next(
//             new ApiError(500, "An error occurred while removing all users")
//         );
//     }
// };



