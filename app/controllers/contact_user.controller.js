const ContactUserService = require("../services/contact_user.service")
const { client } = require("../utils/mongodb.util");
const UserService = require("../services/user.service");

const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");
exports.create = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(userId);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        const contactUserService = new ContactUserService(MongoDB.client);
        const contact = await contactUserService.create(userId, req.body);
        console.log("contact", contact)
        const user1 =  await userService.addContact(userId, contact)
        // console.log("helalala:",user1)
        return res.send(contact);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the contact")
        );
    }
};

// Retrieve all Contacts of a specific User from the database.
exports.findAll = async (req, res, next) => {
    let contacts = [];
    try {
        const  userId  = req.user.id;
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(userId);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }
        const contactUserService = new ContactUserService(MongoDB.client);
        contacts = await contactUserService.findAllContactsOfUser(userId);
        return res.send(contacts);
        
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving contacts")
        );
    }
};


exports.findOne = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contactId  = req.params;
      
        const userService = new UserService(MongoDB.client);
        const user = await userService.findById(userId);
        if (!user) {
            return next(new ApiError(404, "User not found"));
        }

        const contactUserService = new ContactUserService(MongoDB.client);
        const contact = await contactUserService.findById(contactId, userId);
        if (!contact) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(contact);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while retrieving the contact")
        );
    }
};





exports.update = async (req, res, next) => {
    const userId = req.user.id;
    const contactId = req.params;
    const { name, email, phone } = req.body;
    if (!name) {
        return next(new ApiError(400, "Name can not be empty"));
    }

    try {
        const contactUserService = new ContactUserService(MongoDB.client);
        const document = await contactUserService.update(
            userId,
            contactId,
            req.body
        );
        if (!document) {
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while updating the contact")
        );
    }
};
exports.delete = async (req, res, next) => {
    const userId = req.user.id;
    console.log("id_user ne: ",userId)
    const contactId = req.params;
    console.log("contact:", contactId)
    try{
        const contactUserService = new ContactUserService(MongoDB.client)
        const contact = await contactUserService.deleteContact(userId, contactId)
        if(!contact){
            return next(new ApiError(404, "contact not found"))
        }
        return res.send({message: "Delete success"})

    }catch(error){
        return next(new ApiError(500, "An error occurred while delete the contact"))
    }

   
}
exports.deleteAll = async (req, res, next) => {
    const userId = req.user.id;
    
    try{
        const contactUserService = new ContactUserService(MongoDB.client)
        const contact = await contactUserService.deleteAllContacts(userId)
        
        return res.send({message: "Delete All contact success"})

    }catch(error){
        return next(new ApiError(500, "An error occurred while deleteall the contact"))
    }

   
}

