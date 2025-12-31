'use strict';

/**
 * 拼车云函数
 * 处理所有拼车相关的业务逻辑
 */

const db = uniCloud.database();
const dbCmd = db.command;
const carpoolCollection = db.collection('carpool');
const userCollection = db.collection('users');

exports.main = async (event, context) => {
  const { action, data } = event;

  // 获取当前用户信息
  const { uid } = context;

  try {
    switch (action) {
      // 获取拼车列表
      case 'getList':
        return await getCarPoolList(data);

      // 获取拼车详情
      case 'getDetail':
        return await getCarPoolDetail(data.id);

      // 发布拼车
      case 'publish':
        return await publishCarPool({ ...data, userId: uid });

      // 更新拼车
      case 'update':
        return await updateCarPool(data.id, data.updates, uid);

      // 取消拼车
      case 'cancel':
        return await cancelCarPool(data.id, uid);

      // 删除拼车
      case 'delete':
        return await deleteCarPool(data.id, uid);

      // 获取我的发布
      case 'getMyList':
        return await getMyCarPoolList(uid, data);

      // 增加浏览次数
      case 'increaseView':
        return await increaseViewCount(data.id);

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
 * 获取拼车列表
 */
async function getCarPoolList(params = {}) {
  const { type, fromLocation, toLocation, page = 1, pageSize = 10 } = params;

  let query = carpoolCollection.where({
    status: 'active' // 只显示进行中的
  });

  // 类型筛选
  if (type) {
    query = query.where({ type });
  }

  // 出发地筛选
  if (fromLocation) {
    query = query.where({
      fromLocation: new RegExp(fromLocation, 'i')
    });
  }

  // 目的地筛选
  if (toLocation) {
    query = query.where({
      toLocation: new RegExp(toLocation, 'i')
    });
  }

  // 分页
  const skip = (page - 1) * pageSize;

  // 获取总数
  const countRes = await query.count();
  const total = countRes.total;

  // 获取数据
  const res = await query.skip(skip).limit(pageSize).orderBy('createTime', 'desc').get();

  return {
    code: 0,
    data: {
      list: res.data,
      total,
      page,
      pageSize
    }
  };
}

/**
 * 获取拼车详情
 */
async function getCarPoolDetail(id) {
  const res = await carpoolCollection.doc(id).get();

  if (res.data.length === 0) {
    return {
      code: 404,
      message: '拼车信息不存在'
    };
  }

  return {
    code: 0,
    data: res.data[0]
  };
}

/**
 * 发布拼车
 */
async function publishCarPool(data) {
  const now = new Date().toISOString();

  const carpool = {
    ...data,
    status: 'active',
    viewCount: 0,
    createTime: now,
    updateTime: now
  };

  const res = await carpoolCollection.add(carpool);

  return {
    code: 0,
    data: {
      id: res.id
    }
  };
}

/**
 * 更新拼车
 */
async function updateCarPool(id, updates, userId) {
  // 验证权限
  const checkRes = await carpoolCollection.doc(id).get();

  if (checkRes.data.length === 0) {
    return {
      code: 404,
      message: '拼车信息不存在'
    };
  }

  if (checkRes.data[0].userId !== userId) {
    return {
      code: 403,
      message: '无权限修改'
    };
  }

  const res = await carpoolCollection.doc(id).update({
    ...updates,
    updateTime: new Date().toISOString()
  });

  return {
    code: 0,
    data: res.updated > 0
  };
}

/**
 * 取消拼车
 */
async function cancelCarPool(id, userId) {
  // 验证权限
  const checkRes = await carpoolCollection.doc(id).get();

  if (checkRes.data.length === 0) {
    return {
      code: 404,
      message: '拼车信息不存在'
    };
  }

  if (checkRes.data[0].userId !== userId) {
    return {
      code: 403,
      message: '无权限取消'
    };
  }

  const res = await carpoolCollection.doc(id).update({
    status: 'cancelled',
    updateTime: new Date().toISOString()
  });

  return {
    code: 0,
    data: res.updated > 0
  };
}

/**
 * 删除拼车
 */
async function deleteCarPool(id, userId) {
  // 验证权限
  const checkRes = await carpoolCollection.doc(id).get();

  if (checkRes.data.length === 0) {
    return {
      code: 404,
      message: '拼车信息不存在'
    };
  }

  if (checkRes.data[0].userId !== userId) {
    return {
      code: 403,
      message: '无权限删除'
    };
  }

  const res = await carpoolCollection.doc(id).remove();

  return {
    code: 0,
    data: res.deleted > 0
  };
}

/**
 * 获取我的发布列表
 */
async function getMyCarPoolList(userId, params = {}) {
  const { page = 1, pageSize = 10 } = params;
  const skip = (page - 1) * pageSize;

  const query = carpoolCollection.where({ userId });

  // 获取总数
  const countRes = await query.count();
  const total = countRes.total;

  // 获取数据
  const res = await query.skip(skip).limit(pageSize).orderBy('createTime', 'desc').get();

  return {
    code: 0,
    data: {
      list: res.data,
      total,
      page,
      pageSize
    }
  };
}

/**
 * 增加浏览次数
 */
async function increaseViewCount(id) {
  const res = await carpoolCollection.doc(id).update({
    viewCount: dbCmd.inc(1)
  });

  return {
    code: 0,
    data: res.updated > 0
  };
}
