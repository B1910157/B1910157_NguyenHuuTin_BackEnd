//sU DUNG CAC api CUA THU VIEN MONGODB DE THUC HIEN CAC THAO TAC CSDL MONGODB

const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API

    extractUserData(payload) {
        const user = {
            username: payload.username,
            password: payload.password
           
        };

        //Remove undefined fields
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    async create(payload) {
        const user = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            user,
            {
                $set: { username: user.username, password: user.password }
            },
            {
                returnDocument: "after", upsert: true
            }
        );
        return result.value;
    }


    async find(filter) {
        const cursor = await this.User.find(filter);
        return await cursor.toArray();
    }
     
    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // async findByUsername(username, password) {
    
    //     return await this.find({
    //         username: { $regex: new RegExp(username), $options: "i" },
    //         password: { $regex: new RegExp(password)}
    //     });
    // }
   
    


    async update(id, payload) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const update = this.extractUserData(payload);
        const result = await this.User.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        return result.value;
    }

    async delete(id) {
        const result = await this.User.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async findUserr(filter){
        return await this.User.findOne(filter);
        // const rs = await this.User.findOne(filter);
        // return rs.value;

    }
    
    async deleteAll(){
        const result = await this.User.deleteMany({});
        return result.deletedCount;
    }
}


module.exports = UserService;