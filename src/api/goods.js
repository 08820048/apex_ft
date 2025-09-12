import http from '../utils/http.js';

/**
 * 好物功能相关API服务
 */
class GoodsService {
  /**
   * 获取已审核通过的好物列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码，从0开始
   * @param {number} params.size - 每页大小，默认20，最大100
   * @param {string} params.category - 分类筛选
   * @param {string} params.keyword - 关键词搜索
   * @param {boolean} params.featured - 是否只显示精选
   * @returns {Promise<Object>} 好物列表响应
   */
  async getGoodsList(params = {}) {
    try {
      const response = await http.get('/good-items', params);
      return response;
    } catch (error) {
      console.error('获取好物列表失败:', error);
      throw error;
    }
  }

  /**
   * 提交好物推荐
   * @param {Object} goodItem - 好物信息
   * @param {string} goodItem.name - 好物名称，最大200字符
   * @param {string} goodItem.link - 好物链接，最大500字符
   * @param {string} goodItem.description - 好物描述，最大2000字符
   * @param {string} goodItem.submitterEmail - 提交者邮箱
   * @param {string} goodItem.submitterName - 提交者姓名，最大50字符
   * @param {string} goodItem.category - 分类，最大50字符
   * @param {string} goodItem.tags - 标签，用逗号分隔，最大200字符
   * @param {string} goodItem.coverImage - 封面图片URL，最大500字符（可选）
   * @returns {Promise<Object>} 提交响应
   */
  async submitGood(goodItem) {
    try {
      const response = await http.post('/good-items/submit', goodItem);
      return response;
    } catch (error) {
      console.error('提交好物失败:', error);
      throw error;
    }
  }

  /**
   * 编辑好物
   * @param {number} id - 好物ID
   * @param {Object} goodItem - 更新的好物信息
   * @param {string} goodItem.name - 好物名称，最大200字符
   * @param {string} goodItem.link - 好物链接，最大500字符
   * @param {string} goodItem.description - 好物描述，最大2000字符
   * @param {string} goodItem.submitterEmail - 提交者邮箱（用于权限验证）
   * @param {string} goodItem.category - 分类，最大50字符
   * @param {string} goodItem.tags - 标签，用逗号分隔，最大200字符
   * @param {string} goodItem.coverImage - 封面图片URL，最大500字符（可选）
   * @returns {Promise<Object>} 更新响应
   */
  async updateGood(id, goodItem) {
    try {
      const response = await http.put(`/good-items/${id}`, goodItem);
      return response;
    } catch (error) {
      console.error('编辑好物失败:', error);
      throw error;
    }
  }

  /**
   * 删除好物
   * @param {number} id - 好物ID
   * @param {string} submitterEmail - 提交者邮箱（用于权限验证）
   * @returns {Promise<Object>} 删除响应
   */
  async deleteGood(id, submitterEmail) {
    try {
      const response = await http.delete(`/good-items/${id}?submitterEmail=${encodeURIComponent(submitterEmail)}`);
      return response;
    } catch (error) {
      console.error('删除好物失败:', error);
      throw error;
    }
  }

  /**
   * 获取分类列表
   * @returns {Promise<Array>} 分类列表
   */
  async getCategories() {
    try {
      const response = await http.get('/good-items/categories');
      return response;
    } catch (error) {
      console.error('获取分类列表失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
const goodsService = new GoodsService();

export default goodsService;