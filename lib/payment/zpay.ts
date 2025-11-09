import crypto from 'crypto';

export interface PaymentParams {
  name: string;
  money: string;
  type: 'alipay' | 'wxpay';
  out_trade_no: string;
  notify_url: string;
  return_url: string;
  param?: string;
}

export interface PaymentNotification {
  pid: string;
  name: string;
  money: string;
  out_trade_no: string;
  trade_no: string;
  param?: string;
  trade_status: string;
  type: string;
  sign: string;
  sign_type: string;
}

const ZPAY_URL = 'https://zpayz.cn/submit.php';
const ZPAY_PID = process.env.ZPAY_PID!;
const ZPAY_PKEY = process.env.ZPAY_PKEY!;

/**
 * 生成 MD5 签名
 */
export function generateSign(params: Record<string, any>): string {
  // 1. 过滤掉 sign、sign_type 和空值
  const filteredParams: Record<string, any> = {};
  Object.keys(params).forEach(key => {
    if (key !== 'sign' && key !== 'sign_type' && params[key] !== undefined && params[key] !== '') {
      filteredParams[key] = params[key];
    }
  });

  // 2. 按照参数名 ASCII 码从小到大排序
  const sortedKeys = Object.keys(filteredParams).sort();

  // 3. 拼接成 URL 键值对格式
  const queryString = sortedKeys
    .map(key => `${key}=${filteredParams[key]}`)
    .join('&');

  // 4. 拼接商户密钥并进行 MD5 加密
  const signString = queryString + ZPAY_PKEY;
  const sign = crypto.createHash('md5').update(signString).digest('hex');

  return sign;
}

/**
 * 验证签名
 */
export function verifySign(params: Record<string, any>): boolean {
  const receivedSign = params.sign;
  const calculatedSign = generateSign(params);
  return receivedSign === calculatedSign;
}

/**
 * 创建支付链接
 */
export function createPaymentUrl(params: PaymentParams): string {
  const fullParams = {
    ...params,
    pid: ZPAY_PID,
    sign_type: 'MD5',
  };

  // 生成签名
  const sign = generateSign(fullParams);

  // 拼接完整参数
  const allParams = {
    ...fullParams,
    sign,
  };

  // 构建 URL
  const queryString = Object.keys(allParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key as keyof typeof allParams] as string)}`)
    .join('&');

  return `${ZPAY_URL}?${queryString}`;
}

/**
 * 获取价格方案配置
 */
export function getPricingPlans() {
  return [
    {
      id: 'basic',
      name: '基础版',
      price: 20,
      credits: 10,
      description: '适合个人开发者',
    },
    {
      id: 'pro',
      name: '专业版',
      price: 40,
      credits: 30,
      description: '适合专业团队',
    },
  ];
}

/**
 * 根据金额获取对应的点数
 */
export function getCreditsFromAmount(amount: number): number {
  const plans = getPricingPlans();
  const plan = plans.find(p => p.price === amount);
  return plan?.credits || 0;
}

