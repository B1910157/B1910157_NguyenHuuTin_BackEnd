const { ObjectId } = require("mongodb");
class ContactUserService {
    constructor(client) {
        this.Contacts = client.db().collection("contacts");
    }
    extractUserContactData(payload, userId) {
        // console.log('service: ', userId);
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
            userId: new ObjectId(userId) 
        };

        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        console.log(contact);
        return contact;
    }



    // async create(userId, payload) {
    //     const contact = await this.extractUserContactData(payload, userId);
    //     console.log(contact)
    //     const result = await this.Contacts.insertOne(contact);
    //     return result;
    // }
    async create(userId, payload) {
        const contact = await this.extractUserContactData(payload, userId);
        console.log(contact)
        const result = await this.Contacts.findOneAndUpdate(contact,
            {
                $set: { favorite: contact.favorite === true }
            },
            {
                returnDocument: "after", upsert: true
            });
        return result.value;
    }
    async update(userId, contactId, payload) {
        const filter = {
            _id: ObjectId.isValid(contactId) ? new ObjectId(contactId) : null,
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
        };

        const contact = await this.extractUserContactData(payload, userId);
        console.log("service", contact)
        const result = await this.Contacts.findOneAndUpdate(
            filter,
            { $set: contact },
            { returnDocument: "after" }
        );
        // console.log("1")
        return result.value;
    }



    async getContactsByUser(userId) {

        const result = await this.Contacts.find({ userId: ObjectId(userId) }).toArray();
        return result;
    }

    async updateContactById(id, payload) {
        const contact = {
            name: payload.name,
            phone: payload.phone,
            email: payload.email,
            address: payload.address
        };
        const result = await this.Contacts.updateOne(
            { _id: ObjectId(id) },
            { $set: contact }
        );
        return result.modifiedCount;
    }

    // async deleteContactById(id) {
    //     const result = await this.Contacts.deleteOne({ _id: ObjectId(id) });
    //     return result.deletedCount;
    // }
    // async findAll(userId) {
    //     // console.log("service xin chao: ", userId)
    //     const contacts = await this.Contacts.find({ userId: ObjectId(userId) }).toArray();
    //     return contacts;
    // }

    async findAllContactsOfUser(userId) {
        // const userId1 = new ObjectId(userId)
        // console.log("id:",userId)
        const contact1 = await this.Contacts.find({
            userId: new ObjectId(userId)
        }).toArray();
        return contact1;
    }
    async deleteAllContacts(userId) {
        const result = await this.Contacts.deleteMany({
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
        });
        return result.deletedCount;
    }
    async deleteContact(userId, contactId) {
        // console.log("a")
        const result = await this.Contacts.findOneAndDelete({
            _id: ObjectId.isValid(contactId) ? new ObjectId(contactId) : null,
            userId: new ObjectId(userId)
        });
        return result.value;
    }
    async findById(contactId, userId) {
        // console.log("contact: ", contactId)
        // console.log("idusser", userId)
        return await this.Contacts.findOne({
            _id: ObjectId.isValid(contactId) ? new ObjectId(contactId) : null,
            userId: ObjectId.isValid(userId) ? new ObjectId(userId) : null
        });
    }
}

module.exports = ContactUserService;