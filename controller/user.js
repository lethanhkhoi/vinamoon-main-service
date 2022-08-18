const user = require("../dataModel/userCol");
const ObjectID = require("mongodb").ObjectId;
const { cloudinary } = require("../utils/cloudinary");
const { config } = require("../config/constant");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

async function create(req, res, next) {
  try {
    const _user = {};

    if (req.files) {
      _user["avatarPath"] = req.files[0].path;
      _user["avatarFilename"] = req.files[0].filename;
    }

    for (const key in req.body) {
      const value = req.body[key];
      try {
        _user[key] = JSON.parse(value);
      } catch (err) {
        _user[key] = value;
      }
    }

    let hashPassword = bcrypt.hashSync(
      _user.password || config.DEFAULT_PASSWORD,
      salt
    );

    _user = {
      ..._user,
      password: hashPassword,
    };

    const result = await user.create(_user);
    if (!result) {
      throw new ErrorHandler(204, "Cannot create user");
    }
    return res.json({ errorCode: null, result });
  } catch (error) {
    return null;
  }
}

async function getAll(req, res, next) {
  try {
    let users = await user.getAll();
    if (!users) {
      throw new ErrorHandler(204, "Cannot get all users");
    }
    return res.json({ errorCode: null, users });
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const _user = {};
    const objectId = new ObjectID(req.body._id);
    const oldUser = (await user.getAll({ _id: objectId }))[0];

    for (const key in req.body) {
      const value = req.body[key];
      try {
        _user[key] = JSON.parse(value);
      } catch (err) {
        _user[key] = value;
      }
    }

    if (req.files && req.files.length > 0) {
      if (oldUser["avatarFilename"]) {
        try {
          await cloudinary.uploader.destroy(oldUser["avatarFilename"]);
        } catch (err) {
          console.log("Cannot delete old image");
        }
      }
      _user["avatarPath"] = req.files[0].path;
      _user["avatarFilename"] = req.files[0].filename;
    }

    const result = await user.update(_user);
    if (!result) {
      throw new ErrorHandler(204, "Cannot update user");
    }
    return res.json({ errorCode: null, result });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  getAll,
  update,
};
