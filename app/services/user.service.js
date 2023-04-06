//sU DUNG CAC api CUA THU VIEN MONGODB DE THUC HIEN CAC THAO TAC CSDL MONGODB
const bcrypt = require('bcrypt')
const { ObjectId } = require("mongodb");

class UserService {
    constructor(client) {
        this.User = client.db().collection("users");
    }
    // Định nghĩa các phương thức truy xuất CSDL sử dụng mongodb API

    async extractUserData(payload) {
        const hashPass = await bcrypt.hash(payload.password, 10)
        const user = {
            username: payload.username,
            password: hashPass,
            contacts: payload.contacts || []

        };

        //Remove undefined fields
        Object.keys(user).forEach(
            (key) => user[key] === undefined && delete user[key]
        );
        return user;
    }

    // async create(payload) {
    //     const user = this.extractUserData(payload);
    //     const result = await this.User.findOneAndUpdate(
    //         user,
    //         {
    //             $set: { username: user.username, password: user.password }
    //         },
    //         {
    //             returnDocument: "after", upsert: true
    //         }
    //     );
    //     return result.value;
    // }

    async create(payload) {
        const user = await this.extractUserData(payload);
        const result = await this.User.insertOne(user);
        return result.insertedId;
    }
    async findUsername(username) {
        const user = await this.User.findOne({ username: username });
        return user;
    }

    // async addToken(userId, token) {
    //     const rs = await this.User.updateOne(
    //         { _id: new ObjectId(userId) },
    //         { $set: { token: token } }
    //     );
    //     return rs.modifiedCount > 0;
    // }

    // async deleteToken(userId, token) {
    //     const rs = await this.User.updateOne({
    //         _id: new ObjectId(userId), token: token
    //     },
    //         {
    //             $unset: { token: 1 }
    //         });
    //     return rs.modifiedCount > 0;
    // }




    async findById(id) {
        return await this.User.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }

    // async update(id, payload) {
    //     const filter = {
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //     };
    //     const update = this.extractUserData(payload);
    //     const result = await this.User.findOneAndUpdate(
    //         filter,
    //         { $set: update },
    //         { returnDocument: "after" }
    //     );
    //     return result.value;
    // }

    // async delete(id) {
    //     const result = await this.User.findOneAndDelete({
    //         _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    //     });
    //     return result.value;
    // }
    async findByName(username) {
        const user = await this.User.findOne({ username: username });
        return user;
    }

    async addContact(userId, contact) {
        const result = await this.User.updateOne(
            { _id: new ObjectId(userId) },
            { $push: { contacts: contact } }
        );
        // console.log("rs",result);
        return result.modifiedCount > 0;
    }
    // async updateContact(userId, contactId, update) {
    //     const result = await this.User.updateOne(
    //         { _id: new ObjectId(userId), "contacts._id": new ObjectId(contactId) },
    //         { $set: { "contacts.$": update } }
    //     );
    //     return result.modifiedCount > 0;
    // }
    // async deleteContact(userId, contactId) {
    //     const result = await this.User.updateOne(
    //         { _id: new ObjectId(userId) },
    //         { $pull: { contacts: { _id: new ObjectId(contactId) } } }
    //     );
    //     return result.modifiedCount > 0;
    // }

}


module.exports = UserService;