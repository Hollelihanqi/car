/**
 * 对 JSON 字符串的 Key 进行字典序排序
 * @param {string} vc - JSON 格式的字符串
 * @returns {string | null} - 排序后的 JSON 字符串
 */
export const jsonStrSort = (vc: string): string | null => {
  if (!vc) {
    return vc;
  }

  try {
    // 1. 将字符串解析为 JS 对象
    const obj = JSON.parse(vc);

    // 2. 递归排序对象的方法
    const sortObjectByKey = (item: any): any => {
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
      const sortedObj: Record<string, any> = {};
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

// 手机号凭证档案的 credentialSchema.id（写死在前端代码中）
const MOBILE_CREDENTIAL_SCHEMA_ID =
  'https://chinavc-dev.bsnbase.com:10201/credentialSchema/k5lgl9l7i94wnm4cetnaii75oswek4ul.json';

/**
 * 检查字符串或对象是否符合手机号凭证档案格式
 * 只检查是否存在 credentialSchema，然后比对 credentialSchema.id
 * @param {string | object} data - 待检查的数据（字符串或对象）
 * @returns {boolean} - 是否符合手机号凭证档案格式
 */
export const isValidCredential = (data: string | object): boolean => {
  if (!data) {
    return false;
  }

  try {
    // 如果是字符串，尝试解析为 JSON
    let parsed: any;
    if (typeof data === 'string') {
      parsed = JSON.parse(data);
    } else if (typeof data === 'object' && data !== null) {
      parsed = data;
    } else {
      return false;
    }

    if (!parsed || typeof parsed !== 'object') {
      return false;
    }

    // 检查是否存在 credentialSchema
    if (
      !parsed.credentialSchema ||
      typeof parsed.credentialSchema !== 'object' ||
      parsed.credentialSchema === null ||
      typeof parsed.credentialSchema.id !== 'string'
    ) {
      return false;
    }

    // 比对 credentialSchema.id
    return parsed.credentialSchema.id === MOBILE_CREDENTIAL_SCHEMA_ID;
  } catch (error) {
    console.error('凭证格式检查出错:', error);
    return false;
  }
};
