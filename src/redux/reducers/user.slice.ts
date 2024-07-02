import { createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces/user";

interface IUserSliceInitialState {
    user : IUser,
    joinedCommunities : string[] | undefined
}

const initialState : IUserSliceInitialState  = {
    user : {
        id: '',
        email: "",
        name: "",
        desc: "",
        isExpert: false,
        createdAt: "",
        coins: 0,
        profile : ''
    },
    joinedCommunities : undefined
}

export const User = createSlice({
    name : 'User',
    initialState : initialState,
    reducers : {
        setUser : (
            state : IUserSliceInitialState,
            action : {payload: IUser}
        ) => {
            state.user = action.payload
        },
        updateUserDescription : (
            state : IUserSliceInitialState,
            action : {payload : string}
        ) => {
            const newInstance = {...state.user}
            newInstance.desc = action.payload
            state.user = newInstance
        },
        setUserCommunities : (
            state : IUserSliceInitialState,
            action : {payload : string[]}
        ) => {
            state.joinedCommunities = action.payload
        },
        appendCommunity : (
            state : IUserSliceInitialState,
            action : {payload : string}
        ) => {
            if(state.joinedCommunities){
                state.joinedCommunities.push(action.payload)
            }else{
                state.joinedCommunities = [action.payload]
            }
        
        }
    }
})

export const {setUser , updateUserDescription , setUserCommunities , appendCommunity} = User.actions

export default User.reducer