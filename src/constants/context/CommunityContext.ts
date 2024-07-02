import {createContext} from 'react'

interface CommunityContextProps {
  name: string
  subscribers: number
  setName: (name: string) => void
  setSubscribers: (subscribers: number) => void
  imageUri : string
  setImageUri : (uri : string) => void
  communityId : string
  setCommunityId : (id : string) => void
}

const CommunityContext = createContext<CommunityContextProps>({
  name: '',
  subscribers: 0,
  setName: () => {},
  setSubscribers: () => {},
  imageUri : '',
  setImageUri : () => {},
  communityId : '',
  setCommunityId : () => {}
})

export {CommunityContext}
