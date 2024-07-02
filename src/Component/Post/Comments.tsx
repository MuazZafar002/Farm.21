import React, {useEffect, useState} from 'react'
import {View, Text, TextInput, TouchableOpacity, Image} from 'react-native'
import Popup from '../common/Popup'
import Icon from '@expo/vector-icons/Ionicons'
import tw from 'twrnc'
import Loading from '../common/Loading'
import {useAppSelector} from '../../redux/hooks'
import {IComment} from '../../interfaces/comment'
import {
  getComments,
  getReplies,
  createComment,
  createReply,
  createVote,
  deleteComment,
} from '../../core/commentBackend'
import {UserIcon} from '../../../assets/iconWrappers/UserIcon'
export default function Comments({id}: any) {
  const [comments, setComments] = useState<IComment[]>([])
  const [commentText, setCommentText] = useState<string>('')
  const [replyText, setReplyText] = useState<string>('')
  const [replyTo, setReplyTo] = useState<number>(-1)
  const [loading, setLoading] = useState<boolean>(true)
  const [commentIdMap, setCommentIdMap] = useState<{[index: number]: string}>(
    {}
  )
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [isDeletePopupVisible, setDeletePopupVisible] = useState<boolean>(false)
  const theme = useAppSelector(state => state.theme)
  const user1 = useAppSelector(state => state.user)
  const user_email = user1.user.email
  const profile = user1.user.profile
  const fetchReplies = async (commentId: string) => {
    try {
      const fetchedReplies = await getReplies(commentId)
      return fetchedReplies
    } catch (error) {
      console.error('Error fetching replies for comment:', error)
      return []
    }
  }
  const fetchComments = async () => {
    try {
      // setLoading(true);
      const fetchedComments = await getComments(id)
      // console.log(fetchedComments, "comments fetched");
      const updatedComments = fetchedComments.map((comment, index) => {
        setCommentIdMap(prevMap => ({
          ...prevMap,
          [index]: comment.id, // Map comment index to comment ID
        }))
      })

      // Update comments state with fetched comments
      setComments(
        fetchedComments.map(comment => ({
          ...comment,
          user_comments: comment.user_comments,
          comment: comment.comment,
          votes: comment.votes,
          id: comment.id,
          replies: [], // Initialize replies as empty array
        }))
      )

      // Use Promise.all to fetch replies for all comments concurrently
      const promises = fetchedComments.map(async comment => {
        const replies = await fetchReplies(comment.id)
        // console.log(replies, "replies feteched")

        // Map each reply to match the desired structure
        const mappedReplies = replies.map(reply => ({
          id: reply.id, // Assuming reply ID
          user_comments: reply.user_comments, // Assuming user who made the reply
          comment: reply.comment, // Assuming reply content
          votes: reply.votes, // Assuming vote count for the reply
          voteGiven:reply.voteGiven,
          profile:reply.profile
        }))

        return {id: comment.id, replies: mappedReplies}
      })

      // Wait for all replies to be fetched and mapped
      const temp: any = {}
      await Promise.all(promises).then(results => {
        results.forEach(({id, replies}) => {
          temp[id] = replies
        })
      })

      // Update comments state by matching comment IDs with temp keys
      setComments(prevComments =>
        prevComments.map(comment => {
          const matchingReplies = temp[comment.id] || []
          return {
            ...comment,
            replies: matchingReplies,
          }
        })
      )
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchComments()
  }, [])

  const addComment = async () => {
    if (commentText.trim() !== '') {
      await createComment(id, commentText)
      setCommentText('')
      fetchComments()
    }
  }

  const addReply = async (index: number) => {
    if (replyText.trim() !== '') {
      // Retrieve comment ID from commentIdMap using commentIndex
      const commentId = commentIdMap[index]

      // Call the backend function to post the reply
      if (commentId) {
        await createReply(commentId, replyText)

        // Clear reply text and reset replyTo state
        setReplyText('')
        setReplyTo(-1)
      } else {
        console.error('comment id not found ')
      }
      // Refetch comments to update with the newly added reply
      fetchComments()
    }
  }

  const handleVote = async (type: string, id: string) => {
    if (type === 'up') {
      await createVote(true, id)
    } else if (type === 'down') {
      await createVote(false, id)
    } else {
      console.error('id not found')
    }
    fetchComments()
  }

  const handleDelete = async () => {
    await deleteComment(selectedItemId) // Delete the reply
    setDeletePopupVisible(false) // Close the delete popup
    fetchComments() // Fetch updated comments after deletion
  }

  const handleCancel = () => {
    setSelectedItemId('')
    setDeletePopupVisible(false)
  }
  if (loading) {
    return <Loading />
  }

  return (
    <View style={tw`flex-1 p-4 bg-[${theme.appearance.background}]`}>
      {/* Comment Input */}
      <View
        style={[
          tw`flex-row border rounded-md items-center mb-4`,
          {borderColor: theme.appearance.border},
        ]}>
        <TextInput
          value={commentText}
          onChangeText={setCommentText}
          style={tw`flex-1 p-2 text-[${theme.appearance.primaryTextColor}]`}
          placeholder="Add a comment..."
          placeholderTextColor={theme.appearance.primaryTextColor}
        />
        <TouchableOpacity onPress={addComment} style={tw`p-2`}>
          <Icon
            name="send"
            size={24}
            color={theme.appearance.primaryTextColor}
          />
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
      {comments.map((comment, index) => (
        <View key={index} style={tw`mt-4`}>
          <View style={tw`flex-row items-start`}>
            <View style={tw`mr-2`}>
              <TouchableOpacity
                onPress={() => handleVote('up', comment.id)}
                style={tw`p-2`}>
                <Icon
                  name="caret-up"
                  size={24}
                  color={
                    comment.voteGiven === true
                      ? theme.appearance.upVoteReact
                      : comment.voteGiven === false
                        ? theme.appearance.bodyColor
                        : theme.appearance.bodyColor
                  }
                />
              </TouchableOpacity>
              <Text
                style={tw`text-[${theme.appearance.primaryTextColor}] text-center`}>
                {comment?.votes}
              </Text>
              <TouchableOpacity
                onPress={() => handleVote('down', comment.id)}
                style={tw`p-2 `}>
                <Icon
                  name="caret-down"
                  size={24}
                  color={
                    comment.voteGiven === true
                      ? theme.appearance.bodyColor
                      : comment.voteGiven === false
                        ? theme.appearance.heartReact
                        : theme.appearance.bodyColor
                  }
                />
              </TouchableOpacity>
            </View>

            {comment.profile ? (
              <Image
                source={{uri: comment.profile}}
                style={tw`w-8 h-8 rounded-full`}
              />
            ) : (
              <UserIcon width={20} height={20} /> // Render your default user icon component here
            )}
            <View style={tw`ml-2 mt-1 mb-4`}>
              <Text style={tw`text-[${theme.appearance.primaryTextColor}]`}>
                {comment.user_comments.name}
              </Text>
              <View style={tw`w-[90%] grow flex mt-2`}>
                <Text
                  style={tw`text-[${theme.appearance.primaryTextColor}] mt-4`}>
                  {comment.comment}
                </Text>
              </View>
            </View>
            {user_email === comment.user_comments.email && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedItemId(comment.id)
                  setDeletePopupVisible(true)
                }}>
                <Icon
                  name="trash"
                  size={16}
                  color="red"
                  style={tw`ml-3 mt-1 `}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Replies Section */}
          {comment.replies.map((reply: IComment, replyIndex: number) => (
            <View key={replyIndex} style={tw`ml-10 mt-2`}>
              <View style={tw`flex-row items-start`}>
                <View style={tw`mr-2`}>
                  <TouchableOpacity
                    onPress={() => handleVote('up', reply.id)}
                    style={tw`p-2`}>
                    <Icon
                      name="caret-up"
                      size={24}
                      color={
                        reply.voteGiven === true
                          ? theme.appearance.upVoteReact
                          : reply.voteGiven === false
                            ? theme.appearance.bodyColor
                            : theme.appearance.bodyColor
                      }
                    />
                  </TouchableOpacity>
                  <Text
                    style={tw`text-[${theme.appearance.primaryTextColor}] text-center`}>
                    {reply.votes}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleVote('down', reply.id)}
                    style={tw`p-2`}>
                    <Icon
                      name="caret-down"
                      size={24}
                      color={
                        reply.voteGiven === true
                          ? theme.appearance.bodyColor
                          : reply.voteGiven === false
                            ? theme.appearance.heartReact
                            : theme.appearance.bodyColor
                      }
                    />
                  </TouchableOpacity>
                </View>
                {reply.profile ? (
                  <Image
                    source={{uri: reply.profile}}
                    style={tw`w-8 h-8 rounded-full`}
                  />
                ) : (
                  <UserIcon width={20} height={20} /> // Render your default user icon component here
                )}
                <View style={tw`ml-2 mt-1 mb-4`}>
                  <Text style={tw`text-[${theme.appearance.primaryTextColor}]`}>
                    {reply.user_comments.name}
                  </Text>
                  <View style={tw`w-[85%] grow flex mt-2`}>
                    <Text
                      style={tw`text-[${theme.appearance.primaryTextColor}]`}>
                      {reply.comment}
                    </Text>
                  </View>
                </View>
                {user_email === reply.user_comments.email && (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItemId(reply.id)
                      setDeletePopupVisible(true)
                    }}>
                    <Icon
                      name="trash"
                      size={16}
                      color="red"
                      style={tw`ml-3 mt-1 `}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
          {/* Reply Input */}
          {replyTo === index && (
            <View
              style={[
                tw`flex-row border rounded-md items-center mb-4`,
                {borderColor: theme.appearance.border},
              ]}>
              <TextInput
                value={replyText}
                onChangeText={setReplyText}
                style={tw`flex-1 p-2 text-[${theme.appearance.primaryTextColor}]`}
                placeholder="Reply..."
                placeholderTextColor={theme.appearance.primaryTextColor}
              />
              <TouchableOpacity onPress={() => addReply(index)} style={tw`p-2`}>
                <Icon
                  name="send"
                  size={24}
                  color={theme.appearance.primaryTextColor}
                />
              </TouchableOpacity>
            </View>
          )}
          {/* Reply Button */}
          {replyTo !== index && (
            <TouchableOpacity
              onPress={() => setReplyTo(index)}
              style={tw`mt-2`}>
              <Text style={tw`text-[${theme.appearance.primaryTextColor}]`}>
                Add Reply
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      {selectedItemId && (
        <Popup
          visible={isDeletePopupVisible}
          onClose={() => setSelectedItemId('')}
          header="Confirm Delete"
          paragraph="Are you sure you want to delete?"
          button1Text="Delete"
          button1OnPress={handleDelete}
          button2Text="Cancel"
          button2OnPress={handleCancel}
        />
      )}
    </View>
  )
}
