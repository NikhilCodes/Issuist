import firebaseApp from "../FirebaseConfig";

async function loginToApi(url) {
  const user = firebaseApp.auth.currentUser
  const token = user && (await user.getIdToken());

  if(!token) return null;
  return await (await fetch(url, {
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    },
  })).json()
}

export default loginToApi