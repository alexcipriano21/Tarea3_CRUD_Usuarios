const UserRepository = require("../repositories/user.repository");
const UserFactory = require("../factories/user.factory");

exports.getUsers = async (req, res) => {
  try {
    const users = await UserRepository.getAll(req.query.search);
    res.json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = UserFactory.createUser(req.body);
    const result = await UserRepository.create(user);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const result = await UserRepository.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await UserRepository.delete(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};