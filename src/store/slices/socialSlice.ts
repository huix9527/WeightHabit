import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Friend, LeaderboardEntry, Post, SocialState } from '@/types';
import { socialService } from '@/services/socialService';

// 初始状态
const initialState: SocialState = {
  friends: [],
  leaderboard: [],
  posts: [],
  isLoading: false,
  error: null,
};

// 异步actions

// 获取好友列表
export const fetchFriends = createAsyncThunk(
  'social/fetchFriends',
  async () => {
    const response = await socialService.getFriends();
    return response.data;
  }
);

// 搜索用户
export const searchUsers = createAsyncThunk(
  'social/searchUsers',
  async (keyword: string) => {
    const response = await socialService.searchUsers(keyword);
    return response.data;
  }
);

// 发送好友请求
export const sendFriendRequest = createAsyncThunk(
  'social/sendFriendRequest',
  async (userId: string) => {
    const response = await socialService.sendFriendRequest(userId);
    return response.data;
  }
);

// 处理好友请求
export const handleFriendRequest = createAsyncThunk(
  'social/handleFriendRequest',
  async (data: { friendshipId: string; action: 'accept' | 'reject' }) => {
    const response = await socialService.handleFriendRequest(data.friendshipId, data.action);
    return response.data;
  }
);

// 删除好友
export const removeFriend = createAsyncThunk(
  'social/removeFriend',
  async (friendId: string) => {
    const response = await socialService.removeFriend(friendId);
    return { friendId };
  }
);

// 获取排行榜
export const fetchLeaderboard = createAsyncThunk(
  'social/fetchLeaderboard',
  async (params?: { type?: string; friends_only?: boolean; page?: number }) => {
    const response = await socialService.getLeaderboard(params);
    return response.data;
  }
);

// 获取我的排名
export const fetchMyRank = createAsyncThunk(
  'social/fetchMyRank',
  async (type?: string) => {
    const response = await socialService.getMyRank(type);
    return response.data;
  }
);

// 获取动态列表
export const fetchPosts = createAsyncThunk(
  'social/fetchPosts',
  async (params?: { type?: string; page?: number }) => {
    const response = await socialService.getPosts(params);
    return response.data;
  }
);

// 发布动态
export const createPost = createAsyncThunk(
  'social/createPost',
  async (data: { content: string; images?: string[]; post_type?: string }) => {
    const response = await socialService.createPost(data);
    return response.data;
  }
);

// 点赞动态
export const likePost = createAsyncThunk(
  'social/likePost',
  async (postId: string) => {
    const response = await socialService.likePost(postId);
    return { postId };
  }
);

// 评论动态
export const commentPost = createAsyncThunk(
  'social/commentPost',
  async (data: { postId: string; content: string; parentId?: string }) => {
    const response = await socialService.commentPost(data.postId, data.content, data.parentId);
    return response.data;
  }
);

// 创建slice
const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    // 清除错误
    clearError: (state) => {
      state.error = null;
    },
    
    // 重置社交状态
    resetSocial: (state) => {
      state.friends = [];
      state.leaderboard = [];
      state.posts = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 获取好友列表
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
        state.error = null;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取好友列表失败';
      });

    // 搜索用户
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '搜索用户失败';
      });

    // 发送好友请求
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '发送好友请求失败';
      });

    // 处理好友请求
    builder
      .addCase(handleFriendRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleFriendRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(handleFriendRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '处理好友请求失败';
      });

    // 删除好友
    builder
      .addCase(removeFriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = state.friends.filter(friend => friend.friend_id !== action.payload.friendId);
        state.error = null;
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '删除好友失败';
      });

    // 获取排行榜
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaderboard = action.payload.data;
        state.error = null;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取排行榜失败';
      });

    // 获取动态列表
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload.data;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '获取动态列表失败';
      });

    // 发布动态
    builder
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '发布动态失败';
      });

    // 点赞动态
    builder
      .addCase(likePost.fulfilled, (state, action) => {
        const postIndex = state.posts.findIndex(post => post.id === action.payload.postId);
        if (postIndex !== -1) {
          const post = state.posts[postIndex];
          if (post.is_liked) {
            post.likes_count -= 1;
            post.is_liked = false;
          } else {
            post.likes_count += 1;
            post.is_liked = true;
          }
        }
      });

    // 评论动态
    builder
      .addCase(commentPost.fulfilled, (state, action) => {
        // 更新动态的评论数
        const postIndex = state.posts.findIndex(post => post.id === action.payload.post_id);
        if (postIndex !== -1) {
          state.posts[postIndex].comments_count += 1;
        }
      });
  },
});

// 导出actions
export const { 
  clearError, 
  resetSocial 
} = socialSlice.actions;

// 导出selectors
export const selectSocial = (state: { social: SocialState }) => state.social;
export const selectFriends = (state: { social: SocialState }) => state.social.friends;
export const selectLeaderboard = (state: { social: SocialState }) => state.social.leaderboard;
export const selectPosts = (state: { social: SocialState }) => state.social.posts;
export const selectSocialLoading = (state: { social: SocialState }) => state.social.isLoading;
export const selectSocialError = (state: { social: SocialState }) => state.social.error;

export default socialSlice.reducer;


