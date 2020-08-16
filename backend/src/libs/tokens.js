const {sign} = require("jsonwebtoken")
const admin = require("../FirebaseAdminApp")


async function decodeIdToken(req, res, next) {
  if (req.headers?.authorization?.startsWith('Bearer ')) {
    const idToken = req.headers.authorization.split(' ')[1]

    try {
      req['currentUser'] = await admin.auth.verifyIdToken(idToken);
    } catch (err) {
      console.log(err);
    }
  }

  next();
}

const createSessionToken = (uid) => {
  return sign({uid}, process.env.SESSION_TOKEN_SECRET, {
    expiresIn: "1d",
  })
}

const sendSessionToken = (req, res) => {
  const currentUser = req['currentUser']
  if (!currentUser) return null;
  const sessionToken = createSessionToken(currentUser.uid)
  res.clearCookie("sessionToken")
  res.cookie('sessionToken', sessionToken, {
    httpOnly: true,
  })
  console.log("Saving... ", sessionToken)
}

module.exports = {
  decodeIdToken,
  sendSessionToken
}