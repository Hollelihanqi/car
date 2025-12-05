/**
 * 对 JSON 字符串的 Key 进行字典序排序
 * @param {string} vc - JSON 格式的字符串
 * @returns {string} - 排序后的 JSON 字符串
 */
export const jsonStrsSort = (vc) => {
  if (!vc) {
    return vc;
  }

  try {
    // 1. 将字符串解析为 JS 对象
    const obj = JSON.parse(vc);

    // 2. 递归排序对象的方法
    const sortObjectByKey = (item) => {
      // 如果是 null 或者不是对象（是基本类型），直接返回
      if (item === null || typeof item !== 'object') {
        return item;
      }

      // 如果是数组，不改变数组顺序，但递归处理数组内部的元素
      if (Array.isArray(item)) {
        return item.map(sortObjectByKey);
      }

      // 获取所有 Key 并进行字典序排序
      const keys = Object.keys(item).sort();

      // 构建一个新的对象，按照排序后的 Key 顺序插入值
      const sortedObj = {};
      keys.forEach((key) => {
        // 递归处理值（因为值可能还是对象）
        sortedObj[key] = sortObjectByKey(item[key]);
      });

      return sortedObj;
    };

    // 3. 执行排序
    const sortedData = sortObjectByKey(obj);

    // 4. 序列化回字符串
    return JSON.stringify(sortedData);
  } catch (e) {
    console.error('JSON 解析或处理失败', e);
    return null; // 或者抛出异常，视业务需求而定
  }
};
