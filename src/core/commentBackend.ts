import axios from "axios";
import { IComment } from "../interfaces/comment";
import { DataUtils } from "../constants/Utils/DataUtils";
import { KeyUtils } from "../constants/Utils/KeyUtils";

let token:string;

DataUtils.getData(KeyUtils.keys.bearerToken).then(response => {
  if(response){
    token = response;
  }
});

const baseURL = 'https://farm-21-api.onrender.com'; 
// const baseURL = 'https://farm-21-api-production.up.railway.app'

export const getComments = async (postId: string): Promise<IComment[]> => {
  try {
   
    const response = await fetch(`${baseURL}/api/comment/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json());
    return response.comments;
    // const response = await axios.get<{ comments: IComment[] }>(`${baseURL}/api/comment/${postId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });
    // return response.data.comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (postId: string, comment: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${baseURL}/api/comment/${postId}`, {
      comment,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const getReplies = async (commentId: string): Promise<IComment[]> => {
  try {
    // const response = await axios.get<{ replies: IComment[] }>(`${baseURL}/api/comment/reply/${commentId}`, {
    //   headers: {
    //     Authorization: `Bearer ${token}`
    //   }
    // });
    // return response.data.replies;
    const response = await fetch(`${baseURL}/api/comment/reply/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json());
    return response.replies;
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
};

export const createReply = async (parentCommentId: string, reply: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${baseURL}/api/comment/reply/${parentCommentId}`, {
      reply
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error creating reply:', error);
    throw error;
  }
};

export const createVote = async ( isPositive: boolean,commentId: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${baseURL}/api/comment/vote/${commentId}`, {
      "vote":isPositive
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error posting vote:', error);
    throw error;
  }
};
export const deleteComment = async (commentId: string): Promise<string> => {
  try {
    const response = await axios.delete(`${baseURL}/api/comment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      return 'Comment successfully deleted';
    } else if (response.status === 401) {
      return 'Unauthorized access';
    } else if (response.status === 404) {
      return 'Comment not found';
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};