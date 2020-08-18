const {sign} = require("jsonwebtoken")
const admin = require("../FirebaseAdminApp")
const {updateSessionTokenForUserDocument} = require("../libs/UserUtils")

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
    expiresIn: "4d",
  })
}

const sendSessionToken = async (req, res) => {
  const currentUser = req['currentUser']
  if (!currentUser) return null;
  const sessionToken = createSessionToken(currentUser.uid)
  await updateSessionTokenForUserDocument(currentUser.uid, sessionToken)

  res.clearCookie("sessionToken")
  res.cookie('sessionToken', sessionToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 2628000000)  // One month
  })
}

module.exports = {
  decodeIdToken,
  sendSessionToken
}