

export interface IAllMessagesResponse {
    [key: string]: IMessage[]
}

export interface IMessage {
  id?: string
  sender: string
  receiver: string
  message: string
  createdAt: string
  received: boolean
}


