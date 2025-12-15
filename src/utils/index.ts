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

/**
 * 检查字符串或对象是否符合凭证内容格式
 * 支持格式：{data: string | object, status: number}
 * - data: 凭证信息（JSON 字符串或对象），认证成功才会有值
 * - status: 0 取消认证, 1 认证成功, 2 认证失败
 * @param {string | object} data - 待检查的数据（字符串或对象）
 * @returns {boolean} - 是否符合凭证格式
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

    // 检查是否是新格式（包含 data 和 status 字段）
    if (!parsed || typeof parsed !== 'object' || !('data' in parsed) || !('status' in parsed)) {
      console.warn('凭证格式检查失败：缺少 data 或 status 字段');
      return false;
    }

    // 检查 status 是否为数字类型
    if (typeof parsed.status !== 'number') {
      console.warn('凭证格式检查失败：status 字段不是数字类型');
      return false;
    }

    // 只有认证成功（status == 1）时才认为有效
    if (parsed.status != 1) {
      console.warn(`凭证认证未成功，status: ${parsed.status} (0=取消, 1=成功, 2=失败)`);
      return false;
    }

    // data 字段可能是字符串或对象，需要分别处理
    let credential: any;
    if (typeof parsed.data === 'string' && parsed.data) {
      // data 是字符串类型，需要解析
      try {
        credential = JSON.parse(parsed.data);
      } catch (error) {
        console.warn('凭证格式检查失败：data 字段中的 JSON 解析失败', error);
        return false;
      }
    } else if (typeof parsed.data === 'object' && parsed.data !== null) {
      // data 已经是对象类型，直接使用
      credential = parsed.data;
    } else {
      console.warn('凭证格式检查失败：data 字段为空或格式不正确');
      return false;
    }

    if (!credential || typeof credential !== 'object') {
      console.warn('凭证格式检查失败：data 字段不是有效对象');
      return false;
    }

    // 检查必需字段是否存在
    const requiredFields = [
      'credentialSchema',
      'credentialSubject',
      'validUntil',
      'id',
      'proof',
      'validFrom',
      'type',
      '@context',
      'issuer'
    ];

    for (const field of requiredFields) {
      if (!(field in credential)) {
        console.warn(`凭证格式检查失败：缺少必需字段 ${field}`);
        return false;
      }
    }

    // 检查字段类型
    // credentialSchema 应该是对象，包含 id 和 type
    if (
      typeof credential.credentialSchema !== 'object' ||
      credential.credentialSchema === null ||
      typeof credential.credentialSchema.id !== 'string' ||
      typeof credential.credentialSchema.type !== 'string'
    ) {
      console.warn('凭证格式检查失败：credentialSchema 格式不正确');
      return false;
    }

    // credentialSubject 应该是对象
    if (typeof credential.credentialSubject !== 'object' || credential.credentialSubject === null) {
      console.warn('凭证格式检查失败：credentialSubject 格式不正确');
      return false;
    }

    // type 应该是数组，且包含 "VerifiableCredential"
    if (!Array.isArray(credential.type) || !credential.type.includes('VerifiableCredential')) {
      console.warn('凭证格式检查失败：type 格式不正确');
      return false;
    }

    // @context 应该是数组
    if (!Array.isArray(credential['@context'])) {
      console.warn('凭证格式检查失败：@context 格式不正确');
      return false;
    }

    // proof 应该是对象
    if (typeof credential.proof !== 'object' || credential.proof === null) {
      console.warn('凭证格式检查失败：proof 格式不正确');
      return false;
    }

    // validUntil 和 validFrom 应该是字符串
    if (typeof credential.validUntil !== 'string' || typeof credential.validFrom !== 'string') {
      console.warn('凭证格式检查失败：validUntil 或 validFrom 格式不正确');
      return false;
    }

    // id 和 issuer 应该是字符串
    if (typeof credential.id !== 'string' || typeof credential.issuer !== 'string') {
      console.warn('凭证格式检查失败：id 或 issuer 格式不正确');
      return false;
    }

    return true;
  } catch (error) {
    console.error('凭证格式检查出错:', error);
    return false;
  }
};
