// //sU DUNG CAC api CUA THU VIEN MONGODB DE THUC HIEN CAC THAO TAC CSDL MONGODB

// const { ObjectId } = require("mongodb");

// class ContactService {
//     constructor(client) {
//         this.Contact = client.db().collection("contacts");
//     }


//     extractContactData(payload) {
//         const contact = {
//             name: payload.name,
//             email: payload.email,
//             address: payload.address,
//             phone: payload.phone,
//             favorite: payload.favorite,
//         };

//         //Remove undefined fields
//         Object.keys(contact).forEach(
//             (key) => contact[key] === undefined && delete contact[key]
//         );
//         return contact;
//     }

//     async create(payload) {
//         const contact = this.extractContactData(payload);
//         const result = await this.Contact.findOneAndUpdate(
//             contact,
//             {
//                 $set: { favorite: contact.favorite === true }
//             },
//             {
//                 returnDocument: "after", upsert: true
//             }
//         );
//         return result.value;
//     }


//     async find(filter) {
//         const cursor = await this.Contact.find(filter);
//         return await cursor.toArray();
//     }

//     async findByName(name) {
//         return await this.find({
//             name: { $regex: new RegExp(name), $options: "i" },
//         });
//     }

//     async findById(id) {
//         return await this.Contact.findOne({
//             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//         });
//     }
//     async update(id, payload) {
//         const filter = {
//             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//         };
//         const update = this.extractContactData(payload);
//         const result = await this.Contact.findOneAndUpdate(
//             filter,
//             { $set: update },
//             { returnDocument: "after" }
//         );
//         return result.value;
//     }

//     async delete(id) {
//         const result = await this.Contact.findOneAndDelete({
//             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//         });
//         return result.value;
//     }
//     async findFavorite() {
//         return await this.find({ favorite: true });
//     }

//     async deleteAll() {
//         const result = await this.Contact.deleteMany({});
//         return result.deletedCount;
//     }

//     //Mo rong
//     extractUserContactData(payload, userId) {
//         console.log(userId);
//         const contact = {
//             name: payload.name,
//             email: payload.email,
//             address: payload.address,
//             phone: payload.phone,
//             favorite: payload.favorite,
//             userId: new ObjectId(userId)
//         };

//         Object.keys(contact).forEach(
//             (key) => contact[key] === undefined && delete contact[key]
//         );
//         console.log(contact);
//         return contact;
//     }
//     async findAllContactsOfUser(userId) {
//         return await this.find({
//             userId: new ObjectId(userId)
//         });
//     }
//     async findByNameInContact(name, userId) {
//         return await this.find({
//             name: { $regex: new RegExp(name), $options: "i" },
//             userId: new ObjectId(userId)
//         });
//     }
//     async createContact(payload, userId) {
//         console.log(userId);
//         const contact = this.extractUserContactData(payload, userId);
//         const result = await this.Contact.findOneAndUpdate(
//             contact,
//             { $set: { favorite: contact.favorite === true } },
//             { returnDocument: "after", upsert: true }
//         );
//         return result.value;
//     }
//     async findByContactId(id, userId) {
//         return await this.Contact.findOne({
//             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//             userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
//         });
//     }
//     async updateContact(id, payload, userId) {
//         const filter = {
//             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//             userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
//         };
//         const update = this.extractUserContactData(payload, userId);
//         const rs = await this.Contact.findOneAndUpdate(
//             filter,
//             { $set: update },
//             { returnDocument: "after" }
//         );
//         return rs.value;

//     }
//     async deleteContact(id, userId) {
//         const result = await this.Contact.findOneAndDelete({
//             _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
//             userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
//         });
//         return result.value;
//     }

//     async deleteAllContacts(userId) {
//         const result = await this.Contact.deleteMany({
//             userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
//         });
//         return result.deletedCount;
//     }

//     async findAllFavoriteContacts(userId) {
//         return await this.find({
//             favorite: true,
//             userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
//         });
//     }


// }


// module.exports = ContactService;