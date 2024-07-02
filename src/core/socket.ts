import {io, Socket} from 'socket.io-client'
import {DataUtils} from '../constants/Utils/DataUtils'
import {KeyUtils} from '../constants/Utils/KeyUtils'
import {UiUtils} from '../constants/Utils/UiUtils'

let socket: Socket

const createSocketConnection = async () => {
  if (socket?.connected) return
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)
  if (token) {
    socket = io('https://farm-21-chat-server.onrender.com', {
      extraHeaders: {
        Authorization: token,
      },
      transports: ['websocket'],
      forceNew : true,
      upgrade : false
    })
    try {
      socket.connect()
      socket.on('connect', () => {
        console.log('Connected to socket')
        UiUtils.showToast("Connected to socket")
      })
    } catch (error) {
      console.error(error)
      UiUtils.showToast('Error in connecting to socket')
    }
  }
}

const listenToEvent = (event: string, callback: (response: any) => void) => {
  if (socket?.connected) {
    socket.on(event, callback)
  } else {
      createSocketConnection().then(() => socket.on(event, callback))
  }
}

const removeEvent = (event : string) => {
    if (socket?.connected) {
        socket.off(event)
    }
}

const sendMessageToUser = (message: string, userId: string) => {
  const messageObject = {
    receiver: userId,
    message: message,
  }
  if (socket?.connected) {
    socket.emit('send message', messageObject)
  } else {
    if (!socket) {
      createSocketConnection().then(() =>
        socket.emit('send message', messageObject)
      )
    } else {
      try {
        socket.connect()
        socket.emit('send message', messageObject)
      } catch (error) {
        console.error(error)
        UiUtils.showToast('Error in sending message')
      }
    }
  }
}

const sendAckToServer = (messageId: string) => {
  const ackObject = {
    chatId: messageId,
  }
  if (socket?.connected) {
    socket.emit('receive message', ackObject)
  } else {
    if (!socket) {
      createSocketConnection().then(() =>
        socket.emit('receive message', ackObject)
      )
    } else {
      try {
        socket.connect()
        socket.emit('receive message', ackObject)
      } catch (error) {
        console.error('Error in creating socket connection', error)
      }
    }
  }
}
const emitEventWithouData = (event: string) => {
  if (socket?.connected) {
    socket.emit(event)
  } else {
    if (!socket) {
      createSocketConnection().then(() => socket.emit(event))
    } else {
      try {
        socket.connect()
        socket.emit(event)
      } catch (error) {
        console.error(error)
        UiUtils.showToast('Error in retrieving messages')
      }
    }
  }
}
const disconnectFromSocket = () => {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export {
  createSocketConnection,
  listenToEvent,
  sendMessageToUser,
  disconnectFromSocket,
  emitEventWithouData,
  sendAckToServer,
  removeEvent
}
