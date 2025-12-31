'use strict';

/**
 * 用户云函数
 * 处理所有用户相关的业务逻辑
 */

const db = uniCloud.database();
const userCollection = db.collection('users');

exports.main = async (event, context) => {
  const { action, data } = event;

  // 获取当前用户信息
  const { uid } = context;

  try {
    switch (action) {
      // 获取用户信息
      case 'getInfo':
        return await getUserInfo(uid);

      // 更新用户信息
      case 'update':
        return await updateUserInfo(uid, data);

      // 微信登录/注册
      case 'wxLogin':
        return await wxLogin(data);

      default:
        return {
          code: 400,
          message: '未知操作'
        };
    }
  } catch (error) {
    console.error('云函数执行错误:', error);
    return {
      code: 500,
      message: error.message || '服务器错误'
    };
  }
};

/**
 * 获取用户信息
 */
async function getUserInfo(userId) {
  const res = await userCollection.doc(userId).get();

  if (res.data.length === 0) {
    return {
      code: 404,
      message: '用户不存在'
    };
  }

  return {
    code: 0,
    data: res.data[0]
  };
}

/**
 * 更新用户信息
 */
async function updateUserInfo(userId, updates) {
  const res = await userCollection.doc(userId).update({
    ...updates,
    updateTime: new Date().toISOString()
  });

  return {
    code: 0,
    data: res.updated > 0
  };
}

/**
 * 微信登录/注册
 */
async function wxLogin(data) {
  const { code, userInfo } = data;

  // 调用微信登录
  const wxLoginRes = await uniCloud.httpclient.request(`https://api.weixin.qq.com/sns/jscode2session`, {
    method: 'GET',
    data: {
      appid: 'YOUR_APPID', // 替换为你的小程序 appid
      secret: 'YOUR_SECRET', // 替换为你的小程序 secret
      js_code: code,
      grant_type: 'authorization_code'
    },
    dataType: 'json'
  });

  if (wxLoginRes.status !== 200 || wxLoginRes.data.errcode) {
    return {
      code: 500,
      message: '微信登录失败'
    };
  }

  const { openid, session_key } = wxLoginRes.data;

  // 查询用户是否存在
  const userRes = await userCollection.where({ openid }).get();

  let userId;
  const now = new Date().toISOString();

  if (userRes.data.length === 0) {
    // 新用户，创建记录
    const addRes = await userCollection.add({
      openid,
      nickname: userInfo?.nickName || '微信用户',
      avatar: userInfo?.avatarUrl || '',
      createTime: now,
      updateTime: now
    });
    userId = addRes.id;
  } else {
    // 老用户，更新信息
    userId = userRes.data[0]._id;
    await userCollection.doc(userId).update({
      nickname: userInfo?.nickName || userRes.data[0].nickname,
      avatar: userInfo?.avatarUrl || userRes.data[0].avatar,
      updateTime: now
    });
  }

  // 生成自定义 token（可选，用于客户端持久化登录）
  const token = uniCloud.utils.generateToken(
    {
      uid: userId,
      openid
    },
    {
      expiresIn: 7 * 24 * 60 * 60 // 7天过期
    }
  );

  return {
    code: 0,
    data: {
      userId,
      token,
      openid
    }
  };
}
