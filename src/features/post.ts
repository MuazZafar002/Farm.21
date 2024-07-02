import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  setDoc,
  where,
} from 'firebase/firestore'
import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
  uploadString,
} from 'firebase/storage'
// @ts-expect-error TS(7034): Variable 'db' implicitly has type 'any' in some lo... Remove this comment to see the full error message
import {db, storage} from '../constants'
import {uuidv4} from '@firebase/util'

const getPost = async () => {
  const q = query(
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    collection(db, 'post'),
    orderBy('createdAt', 'desc'),
    limit(50)
  )
  const querySnapshot = await getDocs(q)

  let data: any = []
  querySnapshot.forEach(doc =>
    data.push({id: doc.id, ...doc.data(), attachments: []})
  )

  data = await Promise.all(
    // @ts-expect-error TS(7006): Parameter 'post' implicitly has an 'any' type.
    data.map(async post => {
      // @ts-expect-error TS(7005): Variable 'storage' implicitly has an 'any' type.
      const res = await listAll(ref(storage, `/post/${post.id}/`))
      post.attachments = await Promise.all(
        res.items.map(async itemRef => await getDownloadURL(itemRef))
      )
      return post
    })
  )

  return data
}

const getUserPost = async (uid: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  const q = query(collection(db, 'post'), where('user_id', '==', uid))
  const querySnapshot = await getDocs(q)

  let data: any = []
  querySnapshot.forEach(doc =>
    data.push({id: doc.id, ...doc.data(), attachments: []})
  )

  data = await Promise.all(
    // @ts-expect-error TS(7006): Parameter 'post' implicitly has an 'any' type.
    data.map(async post => {
      // @ts-expect-error TS(7005): Variable 'storage' implicitly has an 'any' type.
      const res = await listAll(ref(storage, `/post/${post.id}/`))
      post.attachments = await Promise.all(
        res.items.map(async itemRef => await getDownloadURL(itemRef))
      )
      return post
    })
  )

  // @ts-expect-error TS(7006): Parameter 'a' implicitly has an 'any' type.
  data.sort((a, b) => {
    if (a.createdAt < b.createdAt) return b
    return a
  })

  return data
}

const isPostLiked = async (postId: any, uid: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  return await getDoc(doc(db, 'post', postId, 'likes', uid))
    .then(docSnap => {
      if (docSnap?.exists()) {
        return true
      } else {
        return false
      }
    })
    .catch(() => false)
}

const likePost = async (postId: any, uid: any, like: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  await runTransaction(db, async transaction => {
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    const docSnap = await transaction.get(doc(db, 'post', postId, 'likes', uid))
    if (docSnap.exists()) {
      throw 'Document does exist!'
    }

    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    await transaction.set(doc(db, 'post', postId, 'likes', uid), {})
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    await transaction.update(doc(db, 'post', postId), {likes: like + 1})
  })
}

const disLikePost = async (postId: any, uid: any, like: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  await runTransaction(db, async transaction => {
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    const docSnap = await transaction.get(doc(db, 'post', postId, 'likes', uid))
    if (!docSnap.exists()) {
      throw 'Document does not exist!'
    }

    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    await transaction.delete(doc(db, 'post', postId, 'likes', uid), {})
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    await transaction.update(doc(db, 'post', postId), {likes: like - 1})
  })
}

function urlToBlob(url: any) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.onerror = reject
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve(xhr.response)
      }
    }
    xhr.open('GET', url)
    xhr.responseType = 'blob' // convert type
    xhr.send()
  })
}

const createPost = async (uid: any, title: any, content: any, image: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  await runTransaction(db, async transaction => {
    const uuid = uuidv4()

    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    await transaction.set(doc(db, 'post', uuid), {
      user_id: uid,
      title,
      content,
      likes: 1,
      createdAt: new Date().getTime(),
    })

    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    await transaction.set(doc(db, 'post', uuid, 'likes', uid), {})

    if (image) {
      const blob = await urlToBlob(image)
      await uploadBytes(
        // @ts-expect-error TS(7005): Variable 'storage' implicitly has an 'any' type.
        ref(storage, `post/${uuid}/${image.split('/').pop()}`),
        // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
        blob
      )
    }
  })
}

const createComment = async (postId: any, commentId: any, comment: any, name: any, uid: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  await setDoc(doc(db, 'post', postId, 'comments', commentId), {
    comment,
    user: name,
    user_id: uid,
    createdAt: new Date().getTime(),
  })
}

const createReply = async (postId: any, commentId: any, replyId: any, reply: any, name: any, uid: any) => {
  await setDoc(
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    doc(db, 'post', postId, 'comments', commentId, 'replies', replyId),
    {reply, user: name, user_id: uid, createdAt: new Date().getTime()}
  )
}

const upvoteComment = async (postId: any, commentId: any, uid: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  await setDoc(doc(db, 'post', postId, 'comments', commentId, 'votes', uid), {
    vote: true,
  })
}

const downvoteComment = async (postId: any, commentId: any, uid: any) => {
  // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
  await setDoc(doc(db, 'post', postId, 'comments', commentId, 'votes', uid), {
    vote: false,
  })
}

const upvoteReply = async (postId: any, commentId: any, replyId: any, uid: any) => {
  await setDoc(
    doc(
      // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
      db,
      'post',
      postId,
      'comments',
      commentId,
      'replies',
      replyId,
      'votes',
      uid
    ),
    {vote: true}
  )
}

const downvoteReply = async (postId: any, commentId: any, replyId: any, uid: any) => {
  await setDoc(
    doc(
      // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
      db,
      'post',
      postId,
      'comments',
      commentId,
      'replies',
      replyId,
      'votes',
      uid
    ),
    {vote: false}
  )
}

const getCommentVotes = async (postId: any, commentId: any, uid: any) => {
  const upvotesQuery = query(
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    collection(db, 'post', postId, 'comments', commentId, 'votes'),
    where('vote', '==', true)
  )
  const upvotes = await getCountFromServer(upvotesQuery)

  const downvotesQuery = query(
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    collection(db, 'post', postId, 'comments', commentId, 'votes'),
    where('vote', '==', false)
  )
  const downvotes = await getCountFromServer(downvotesQuery)

  let upVoted = false
  let downVoted = false
  const vote = await getDoc(
    // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
    doc(db, 'post', postId, 'comments', commentId, 'votes', uid)
  )
  if (vote.exists()) {
    if (vote.data().vote) upVoted = true
    else downVoted = true
  }

  return {
    votes: upvotes.data().count - downvotes.data().count,
    upVoted,
    downVoted,
  }
}

const getReplyVotes = async (postId: any, commentId: any, replyId: any, uid: any) => {
  const upvotesQuery = query(
    collection(
      // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
      db,
      'post',
      postId,
      'comments',
      commentId,
      'replies',
      replyId,
      'votes'
    ),
    where('vote', '==', true)
  )
  const upvotes = await getCountFromServer(upvotesQuery)

  const downvotesQuery = query(
    collection(
      // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
      db,
      'post',
      postId,
      'comments',
      commentId,
      'replies',
      replyId,
      'votes'
    ),
    where('vote', '==', false)
  )
  const downvotes = await getCountFromServer(downvotesQuery)

  let upVoted = false
  let downVoted = false
  const vote = await getDoc(
    doc(
      // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
      db,
      'post',
      postId,
      'comments',
      commentId,
      'replies',
      replyId,
      'votes',
      uid
    )
  )
  if (vote.exists()) {
    if (vote.data().vote) upVoted = true
    else downVoted = true
  }

  return {
    votes: upvotes.data().count - downvotes.data().count,
    upVoted,
    downVoted,
  }
}

const getComments = async (postId: any, uid: any) => {
  const snapshot = await getDocs(
    query(
      // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
      collection(db, 'post', postId, 'comments'),
      orderBy('createdAt', 'asc')
    )
  )

  let data: any = []
  snapshot.forEach(doc => data.push({id: doc.id, ...doc.data(), replies: []}))

  data = await Promise.all(
    // @ts-expect-error TS(7006): Parameter 'doc' implicitly has an 'any' type.
    data.map(async doc => {
      const commentVote = await getCommentVotes(postId, doc.id, uid)

      const replies = await getDocs(
        query(
          // @ts-expect-error TS(7005): Variable 'db' implicitly has an 'any' type.
          collection(db, 'post', postId, 'comments', doc.id, 'replies'),
          orderBy('createdAt', 'desc')
        )
      )

      replies.forEach(reply =>
        doc.replies.push({id: reply.id, ...reply.data()})
      )

      doc.replies = await Promise.all(
        doc.replies.map(async (reply: any) => {
          const replyVotes = await getReplyVotes(postId, doc.id, reply.id, uid)
          return {...reply, ...replyVotes}
        })
      )

      doc = {...doc, ...commentVote}
      return doc
    })
  )

  return data
}

export {
  getPost,
  isPostLiked,
  likePost,
  disLikePost,
  createPost,
  getUserPost,
  createComment,
  createReply,
  getComments,
  upvoteComment,
  downvoteComment,
  upvoteReply,
  downvoteReply,
}
