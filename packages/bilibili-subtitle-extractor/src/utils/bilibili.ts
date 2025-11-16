export interface SubtitleItem {
  start: number;
  end: number;
  text: string;
}

export interface VideoInfo {
  title: string;
  duration: number;
  cid: string;
  aid: string;
}

// 第三方API响应接口定义
export interface ThirdPartySubtitleResponse {
  code: number;
  message: string;
  data: {
    vid: string;
    host: string;
    hostAlias: string;
    title: string;
    status: string;
    subtitleItemVoList: SubtitleItemVo[];
  };
}

export interface SubtitleItemVo {
  lang: string;
  langDesc: string;
  content: string;
}

// 代理服务器配置列表
const PROXY_SERVERS = [
  {
    name: 'allorigins',
    url: 'https://api.allorigins.win/get?url=',
    responseParser: (data: any) => {
      try {
        return JSON.parse(data.contents);
      } catch {
        return null;
      }
    }
  },
  {
    name: 'cors-anywhere',
    url: 'https://cors-anywhere.com/',
    responseParser: (data: any) => data
  },
  {
    name: 'thingproxy',
    url: 'https://thingproxy.freeboard.io/fetch/',
    responseParser: (data: any) => {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  },
  {
    name: 'corsproxy',
    url: 'https://corsproxy.io/?',
    responseParser: (data: any) => {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
  }
];

/**
 * 使用代理服务器发起请求
 */
async function fetchWithProxy(url: string, currentProxyIndex = 0): Promise<any> {
  if (currentProxyIndex >= PROXY_SERVERS.length) {
    throw new Error('所有代理服务器都无法访问');
  }

  const proxy = PROXY_SERVERS[currentProxyIndex];
  const proxyUrl = proxy.url + encodeURIComponent(url);
  
  try {
    console.log(`尝试使用代理服务器: ${proxy.name}`);
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`代理服务器 ${proxy.name} 返回错误: ${response.status}`);
    }
    
    const data = await response.text();
    const parsedData = proxy.responseParser(data);
    
    if (!parsedData) {
      throw new Error(`代理服务器 ${proxy.name} 返回的数据格式错误`);
    }
    
    console.log(`代理服务器 ${proxy.name} 请求成功`);
    return parsedData;
  } catch (error) {
    console.warn(`代理服务器 ${proxy.name} 失败:`, error);
    // 尝试下一个代理服务器
    return fetchWithProxy(url, currentProxyIndex + 1);
  }
}

/**
 * 从 B 站视频 URL 中提取 BV 号
 */
export function extractBVID(url: string): string | null {
  const bvMatch = url.match(/BV[0-9A-Za-z]{10}/);
  return bvMatch ? bvMatch[0] : null;
}

/**
 * 获取视频基本信息
 */
export async function getVideoInfo(bvid: string): Promise<VideoInfo | null> {
  try {
    const url = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
    const data = await fetchWithProxy(url);
    
    if (data.code === 0) {
      return {
        title: data.data.title,
        duration: data.data.duration,
        cid: data.data.cid,
        aid: data.data.aid
      };
    }
    return null;
  } catch (error) {
    console.error('获取视频信息失败:', error);
    return null;
  }
}

/**
 * 获取字幕列表
 */
export async function getSubtitleList(bvid: string, cid: string): Promise<any[]> {
  try {
    const url = `https://api.bilibili.com/x/player/v2?bvid=${bvid}&cid=${cid}`;
    const data = await fetchWithProxy(url);
    
    if (data.code === 0 && data.data.subtitle.subtitles) {
      return data.data.subtitle.subtitles;
    }
    return [];
  } catch (error) {
    console.error('获取字幕列表失败:', error);
    return [];
  }
}

/**
 * 获取字幕内容
 */
export async function getSubtitleContent(subtitleUrl: string): Promise<SubtitleItem[]> {
  try {
    const data = await fetchWithProxy(subtitleUrl);
    
    if (data.body) {
      return data.body.map((item: any) => ({
        start: item.from,
        end: item.to,
        text: item.content
      }));
    }
    return [];
  } catch (error) {
    console.error('获取字幕内容失败:', error);
    return [];
  }
}

/**
 * 通过第三方API获取字幕（推荐使用）
 * 这个方法使用第三方服务，避免了直接解析B站API的复杂性
 */
export async function getSubtitleViaThirdParty(videoUrl: string): Promise<{
  success: boolean;
  data?: {
    title: string;
    subtitles: SubtitleItem[];
    languages: string[];
  };
  error?: string;
}> {
  try {
    console.log('使用第三方API获取字幕:', videoUrl);
    
    // 准备请求头和请求体
    const headers = {
      "accept": "application/json",
      "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
      "content-type": "application/json",
      "kdsystem": "Feiyu",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"142\", \"Microsoft Edge\";v=\"142\", \"Not_A Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"Windows\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "sec-fetch-storage-access": "active"
    };

    // 提取BV号
    const bvid = extractBVID(videoUrl);
    if (!bvid) {
      return {
        success: false,
        error: '无效的视频URL，无法提取BV号'
      };
    }

    // 构造请求体 - 这里需要根据实际API文档调整
    // 由于示例中的body是加密的，这里使用简化的请求体
    const requestBody = JSON.stringify({
      vid: bvid,
      host: "bilibili_zm"
    });

    const response = await fetch("https://www.feiyudo.com/api/video/subtitleExtract", {
      method: "POST",
      headers,
      body: requestBody,
      mode: "cors",
      credentials: "omit"
    });

    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }

    const result: ThirdPartySubtitleResponse = await response.json();
    
    if (result.code !== 200) {
      return {
        success: false,
        error: result.message || 'API返回错误'
      };
    }

    // 解析字幕内容
    const subtitleData = result.data;
    const languages = subtitleData.subtitleItemVoList.map(item => item.langDesc);
    
    // 解析SRT格式字幕为标准格式
    let allSubtitles: SubtitleItem[] = [];
    
    subtitleData.subtitleItemVoList.forEach(subtitleVo => {
      const subtitles = parseSRTContent(subtitleVo.content);
      allSubtitles = [...allSubtitles, ...subtitles];
    });

    // 按时间排序
    allSubtitles.sort((a, b) => a.start - b.start);

    return {
      success: true,
      data: {
        title: subtitleData.title,
        subtitles: allSubtitles,
        languages
      }
    };

  } catch (error) {
    console.error('第三方API获取字幕失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    };
  }
}

/**
 * 解析SRT格式内容为SubtitleItem数组
 */
function parseSRTContent(srtContent: string): SubtitleItem[] {
  const subtitles: SubtitleItem[] = [];
  const lines = srtContent.split('\n').filter(line => line.trim());
  
  let i = 0;
  while (i < lines.length) {
    // 跳过序号行
    if (/^\d+$/.test(lines[i])) {
      i++;
      continue;
    }
    
    // 解析时间行
    const timeLine = lines[i];
    const timeMatch = timeLine.match(/(\d+:\d+:\d+,?\d*)\s*-->\s*(\d+:\d+:\d+,?\d*)/);
    
    if (timeMatch) {
      const startTime = parseSRTTime(timeMatch[1]);
      const endTime = parseSRTTime(timeMatch[2]);
      
      // 收集文本行
      i++;
      let text = '';
      while (i < lines.length && !lines[i].match(/^\d+$/) && !lines[i].match(/\d+:\d+:\d+/)) {
        text += (text ? '\n' : '') + lines[i];
        i++;
      }
      
      if (text.trim()) {
        subtitles.push({
          start: startTime,
          end: endTime,
          text: text.trim()
        });
      }
    } else {
      i++;
    }
  }
  
  return subtitles;
}

/**
 * 解析SRT时间格式为秒数
 */
function parseSRTTime(timeStr: string): number {
  // 处理格式: 0:0:12,2 或 0:0:12.2
  const cleanTimeStr = timeStr.replace(',', '.');
  const parts = cleanTimeStr.split(':');
  
  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
  }
  
  return 0;
}

/**
 * 将字幕转换为 SRT 格式
 */
export function convertToSRT(subtitles: SubtitleItem[]): string {
  return subtitles.map((subtitle, index) => {
    const startTime = formatSRTTime(subtitle.start);
    const endTime = formatSRTTime(subtitle.end);
    return `${index + 1}\n${startTime} --> ${endTime}\n${subtitle.text}\n`;
  }).join('\n');
}

/**
 * 将字幕转换为纯文本格式
 */
export function convertToPlainText(subtitles: SubtitleItem[]): string {
  return subtitles.map(subtitle => subtitle.text).join('\n');
}

/**
 * 格式化时间为 SRT 格式
 */
function formatSRTTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}