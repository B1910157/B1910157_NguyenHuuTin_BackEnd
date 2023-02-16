//Create and Save a new Contact
exports.create = async (req, res, next) => {
    res.send({ messege: "Create handler" });
};

exports.findAll = async (req, res, next) => {
    res.send({ messege: "FindAll handler" });
};

exports.findOne = async (req, res, next) => {
    res.send({ messege: "FindOne handler" });
};

exports.update = async (req, res, next) => {
    res.send({ messege: "Update handler" });
};

exports.delete = (req, res) => {
    res.send({ messege: "Delete handler" });
};

exports.deleteAll = (req, res) => {
    res.send({ messege: "DeleteAll handler" });
};

exports.findAllFavorite = (req, res) => {
    res.send({ messege: "FindOneFavorite handler" });
};


