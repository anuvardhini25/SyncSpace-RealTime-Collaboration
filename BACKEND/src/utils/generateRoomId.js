const crypto = require("crypto");

const generateRoomId = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const randomBytes = crypto.randomBytes(length);
  let roomId = "";

  for (let i = 0; i < length; i++) {
    roomId += characters[randomBytes[i] % characters.length];
  }

  return roomId;
};

module.exports = generateRoomId;
