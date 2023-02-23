const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/contact.route");
const usersRouter =  require("./app/routes/user.route");
const login = require("./app/routes/login.route");
const ApiError = require("./app/api-error");

const session = require('express-session');

const app = express();  
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application." });
});




// app.post('/api/users/login', async (req, res, next) => {
// 	// res.json({ message: "Login page"});
//     if(!req.body?.username){
//         return next(new ApiError(400, "Username can not be empty"));
//     }
  
//     if(!req.body?.password){
//         return next(new ApiError(400, "Password can not be empty"));
//     }
//     try{
//         var query = req.body;
//         // console.log(query);
//         const userService =  new UserService(MongoDB.client);
//         const document = await userService.findOne({username: 'B1910157'});
//         console.log(document);
//         return res.send(document);
//         // res.json({ message: "successful." });
       
       
//     }catch (error){
//         return next(
//             new ApiError(500, "Login fail")
//         );
//     }


// });

// app.use("/login", login);


app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);
app.use("/api/users/login", login);


// handle 404 response
app.use((req, res, next) => {
    // Code ở đây sẽ chạy khi không có route được định nghĩa nào
    // khớp với yêu cầu. Gọi next() để chuyển sang middleware xử lý lỗi
    return next(new ApiError(404, "Resource not found"));
});
// define error-handling middleware last, after other app.use() and routes calls
app.use((error, req, res, next) => {
    // Middleware xử lý lỗi tập trung.
    // Trong các đoạn code xử lý ở các route, gọi next(error)
    // sẽ chuyển về middleware xử lý lỗi này
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;