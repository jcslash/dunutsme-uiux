import * as privyService from '../services/privyService.js';

/**
 * 驗證 Privy 訪問令牌的中間件
 */
export async function authenticatePrivyToken(req, res, next) {
  try {
    // 從 Authorization header 獲取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header',
      });
    }
    
    const token = authHeader.substring(7); // 移除 "Bearer " 前綴
    
    // 驗證 token
    const claims = await privyService.verifyPrivyToken(token);
    
    // 將用戶信息附加到請求對象
    req.user = {
      privyId: claims.userId,
      appId: claims.appId,
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
}

/**
 * 可選的認證中間件（不強制要求認證）
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const claims = await privyService.verifyPrivyToken(token);
      
      req.user = {
        privyId: claims.userId,
        appId: claims.appId,
      };
    }
    
    next();
  } catch (error) {
    // 認證失敗但不阻止請求
    console.warn('Optional auth failed:', error.message);
    next();
  }
}

export default {
  authenticatePrivyToken,
  optionalAuth,
};
