const axios = require('axios');
const fs = require('fs');
const path = require('path');

class BilibiliCrawler {
  constructor() {
    this.baseURL = 'https://api.bilibili.com';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };
  }

  async getVideoInfo(bvid) {
    try {
      const url = `${this.baseURL}/x/web-interface/view?bvid=${bvid}`;
      const response = await axios.get(url, { headers: this.headers });
      
      if (response.data.code !== 0) {
        throw new Error(`API返回错误: ${response.data.message}`);
      }
      
      const data = response.data.data;
      
      return {
        bvid: bvid,
        title: data.title,
        description: data.desc || '',
        thumbnail: data.pic,
        duration: data.duration,
        author: {
          name: data.owner.name,
          uid: data.owner.mid.toString(),
          avatar: data.owner.face
        },
        stats: {
          view: data.stat.view,
          like: data.stat.like,
          coin: data.stat.coin,
          share: data.stat.share
        },
        url: `https://www.bilibili.com/video/${bvid}`,
        tags: data.tag?.map(tag => tag.tag_name) || [],
        pubdate: new Date(data.pubdate * 1000),
        
        // 新增：用户评价数据（初始化为0）
        userRatings: {
          生动: 0,
          直指核心: 0,
          初阶: 0,
          高阶: 0,
          容易理解: 0,
          totalLikes: 0
        },
        
        // 分类信息（需要手动填写）
        subject: '',
        chapter: '',
        knowledgePoints: [],
        addedAt: new Date()
      };
    } catch (error) {
      console.error(`获取视频信息失败: ${bvid}`, error.message);
      return null;
    }
  }

  extractBVID(url) {
    const match = url.match(/BV[a-zA-Z0-9]+/);
    return match ? match[0] : null;
  }

  async downloadThumbnail(thumbnailUrl, bvid) {
    try {
      const response = await axios.get(thumbnailUrl, { 
        responseType: 'stream',
        headers: this.headers 
      });
      
      const thumbnailPath = path.join(__dirname, 'thumbnails', `${bvid}.jpg`);
      const writer = fs.createWriteStream(thumbnailPath);
      
      response.data.pipe(writer);
      
      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(thumbnailPath));
        writer.on('error', reject);
      });
    } catch (error) {
      console.error(`下载缩略图失败: ${bvid}`, error.message);
      return null;
    }
  }

  async batchCrawl(urls) {
    const results = [];
    console.log(`开始爬取 ${urls.length} 个视频...`);
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const bvid = this.extractBVID(url);
      
      if (bvid) {
        console.log(`[${i + 1}/${urls.length}] 正在爬取: ${bvid}`);
        
        const info = await this.getVideoInfo(bvid);
        if (info) {
          // 下载缩略图
          const localThumbnail = await this.downloadThumbnail(info.thumbnail, bvid);
          if (localThumbnail) {
            info.localThumbnail = localThumbnail;
          }
          
          results.push(info);
          console.log(`✓ 成功: ${info.title}`);
        } else {
          console.log(`✗ 失败: ${bvid}`);
        }
        
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log(`✗ 无效URL: ${url}`);
      }
    }
    
    return results;
  }

  saveResults(results, filename = 'videos.json') {
    const outputPath = path.join(__dirname, filename);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
    console.log(`\n结果已保存到: ${outputPath}`);
    console.log(`共爬取 ${results.length} 个视频`);
  }
}

// 使用示例
async function main() {
  const crawler = new BilibiliCrawler();
  
  // 示例视频URL列表
  const videoUrls = [
    'https://www.bilibili.com/video/BV147411K7xu/?spm_id_from=333.337.search-card.all.click&vd_source=9a0a4de99598b2ca4ecfe307fa0aa5bd',
    // 可以添加更多视频URL
  ];
  
  try {
    const results = await crawler.batchCrawl(videoUrls);
    crawler.saveResults(results);
    
    // 显示统计信息
    console.log('\n=== 爬取统计 ===');
    console.log(`总计: ${results.length} 个视频`);
    console.log(`成功率: ${(results.length / videoUrls.length * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('爬取过程中出现错误:', error);
  }
}

// 如果直接运行此文件，执行main函数
if (require.main === module) {
  main();
}

module.exports = BilibiliCrawler; 