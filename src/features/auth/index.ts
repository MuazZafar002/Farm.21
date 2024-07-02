// @ts-expect-error TS(7034): Variable 'auth' implicitly has type 'any' in some ... Remove this comment to see the full error message
import { db} from '../../constants'
import { doc, getDoc, setDoc, updateDoc} from 'firebase/firestore'

const getUser = async (uid: any) => {
  let error = undefined

  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  let user = await getDoc(doc(db, 'users', uid))
    // @ts-expect-error TS(7030): Not all code paths return a value.
    .then(docSnap => {
      if (docSnap?.exists()) {
        return docSnap.data()
      } else {
        error = 'Document does not exist'
      }
    })
    .catch(err => {
      error = err
    })

  if (error) {
    throw error
  }

  return user
}

const setDesc = async (uid: any, desc: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  const userDoc = doc(db, 'users', uid)
  await updateDoc(userDoc, {desc})
}





export {getUser, setDesc}
