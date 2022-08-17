const user = require("../dataModel/userCol");

async function create(req, res, next) {
  try {
    const _user = {}

    if (req.files) {
      _user['avatarPath'] = req.files[0].path
      _user['avatarFilename'] = req.files[0].filename
    }

    for (const key in req.body) {
      const value = req.body[key]
      try {
        _user[key] = JSON.parse(value)
      } catch (err) {
        _user[key] = value
      }
    }

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
    const _user = req.body;
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
