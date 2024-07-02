import {DataUtils} from '../constants/Utils/DataUtils'
import {KeyUtils} from '../constants/Utils/KeyUtils'
import {ICreateCommunityResponse} from '../interfaces/community'
import {
  ILoginProps,
  ILoginResponse,
  IRegisterProps,
  IUser,
  IVerifyProps,
} from '../interfaces/user'
import axios from 'axios'

// const url = 'https://farm-21-api-production.up.railway.app/api/'
const url = 'https://farm-21-api.onrender.com/api/'

export const CreateUser = (formData: IRegisterProps): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    axios
      .post('user/signup', formData, {
        baseURL: url,
      })
      .then(response => {
        // Check if response indicates success
        if (response.status === 200) {
          resolve(true) // Resolve the promise with true
        } else {
          resolve(false) // Resolve the promise with false
        }
      })
      .catch(error => {
        if (error.message === 'Request failed with status code 400')
          resolve(false)
        else reject(error) // Reject the promise with the error
      })
  })
}

export const VerifyUser = (formData: IVerifyProps) => {
  return new Promise((resolve, reject) => {
    axios
      .post('user/verify', formData, {
        baseURL: url,
      })
      .then(response => {
        // Check if response indicates success
        if (response.status === 200) {
          resolve(true) // Resolve the promise with true
        } else {
          resolve(false) // Resolve the promise with false
        }
      })
      .catch(error => {
        if(error.message === 'Request failed with status code 400'){
          resolve(false)
        }
        reject(error) // Reject the promise with the error
      })
  })
}

export const LoginUser = (
  formData: ILoginProps
): Promise<ILoginResponse | boolean> => {
  return new Promise((resolve, reject) => {
    axios
      .post('user/signin', formData, {
        baseURL: url,
      })
      .then(response => {
        // Check if response indicates success
        if (response.status === 200) {
          resolve(response) // Resolve the promise with true
        }
      })
      .catch(error => {
        if (error.message === 'Request failed with status code 400')
          resolve(false)
        reject(error) // Reject the promise with the error
      })
  })
}

export const setUserDescription = async (
  token: string,
  description: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'user/profile',
        {desc: description},
        {
          baseURL: url,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(response => {
        if (response.status === 200) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch(error => {
        console.error(error)
        reject(error)
      })
  })
}

export const getUser = async (token: string) => {
  try {
    const response = await axios.get('user/', {
      baseURL: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data as IUser
  } catch (error) {
    console.error(error)
    return null
  }
}

export const createCommunity = async (
  name: string,
  desc: string,
  Profile?: string
): Promise<ICreateCommunityResponse | boolean> => {
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)
  const _formData = new FormData()
  _formData.append('name', name)
  _formData.append('desc', desc)
  if (Profile) {
    _formData.append('Profile', {
      uri: Profile,
      name: 'profile.jpeg',
      type: 'image/jpeg',
    })
  }
  return new Promise((resolve, reject) => {
    if (token) {
      axios
        .post('community/', _formData, {
          baseURL: url,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.status === 201) {
            resolve(response.data)
          } else {
            resolve(false)
          }
        })
        .catch(error => {
          console.error(error)
          resolve(false)
        })
    } else {
      reject(null)
    }
  })
}

export const uploadCommunityImage = async (
  communityId: string,
  formData: FormData
) => {
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)
  return new Promise((resolve, reject) => {
    if (token) {
      axios
        .post(`community/profile/${communityId}`, formData, {
          baseURL: url,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.status === 200) {
            resolve(true)
          } else {
            reject(
              'An error occurred in uploading image. Community is created. Please try later'
            )
          }
        })
        .catch(error => {
          reject(error)
        })
    }
  })
}

export const joinCommunity = async (communityId: string) => {
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)
  return new Promise((resolve, reject) => {
    if (token) {
      axios
        .post(
          `community/join/${communityId}`,
          {},
          {
            baseURL: url,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(response => {
          if (response.status === 200) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .catch(error => reject(error))
    }
  })
}

export const createPost = async (formData: FormData) => {
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)

  try {
    const response = await axios.post('post/', formData, {
      baseURL: url,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data)

    if (response.status === 201) {
      return response.data
    } else {
      return false
    }
  } catch (error) {
    throw error
  }
}

export const likePost = async (postId: string) => {
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)

  try {
    const response = await axios.post(
      `post/like/${postId}`,
      {},
      {
        baseURL: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (response.status === 200) {
      return response.data
    } else {
      return false
    }
  } catch (error) {
    throw error
  }
}

export const updateProfilePicture = async (image : string) => {
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)

  const _formData = new FormData()

  _formData.append('Profile' , {
    uri : image,
    name : 'profile.jpeg',
    type : 'image/jpeg'
  })

  try{
    const response = await axios.post('user/profile' , _formData , {
      baseURL : url,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    } )

    if(response.status === 200){
      return true
    }else{
      return false
    }
  }catch(error){
    throw error
  }
}

export const submitTestimonial = async(testimonial : string , userId : string) => {
  const token = await DataUtils.getData(KeyUtils.keys.bearerToken)

  try{
    const response = await axios.post(`testamonial/${userId}` , {
      testamonial : testimonial
    } , {
      baseURL : url,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (response.status === 200){
      return response.data
    }else{
      return false
    }
  }catch(error){
    throw error
  }
}
