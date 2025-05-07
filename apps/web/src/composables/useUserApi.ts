import type { ApiResponse, UserResponse } from '@bookmark/schemas';

export const useUserApi = () => {
  const { $api } = useNuxtApp(); // 获取注入的 $api 实例

  // 3. API 请求统一管理：获取用户列表
  const fetchUsers = () => {
    return useAsyncData('users', () => $api<ApiResponse<UserResponse[]>>('/user/all', { method: 'GET' }));
  };

  // 3. API 请求统一管理：获取单个用户信息
  const fetchUserById = (id: number | string) => {
    // 模板字符串拼接 URL
    return $api<ApiResponse<UserResponse>>(`/user/${id}`, {
      method: 'GET',
    });
    // const { data, pending, error, refresh } = useFetch(() => `/users/${id}`, { $fetch: $api }); // 结合 useFetch
    // return { data, pending, error, refresh };
  };

  // 3. API 请求统一管理：创建用户
  const createUser = (userData: Omit<UserResponse, '_id'>) => {
    return $api<ApiResponse<UserResponse>>('/user/create', {
      method: 'POST',
      body: userData,
    });
  };

  // 3. API 请求统一管理：更新用户
  const updateUser = (id: number | string, userData: Partial<UserResponse>) => {
    return $api<ApiResponse<UserResponse>>(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  };

  // 返回这些封装好的函数
  return {
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
  };
};
