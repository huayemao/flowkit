  export const testVideoUrls = async (urls: string[]) => {
    const testResults: { url: string; isAccessible: boolean; responseTime: number; size: number; filename: string; }[] = [];
    const timeout = 5000; // 5秒超时

    // 同时测试所有链接
    const testPromises = urls.map(async (url, index) => {
      const startTime = performance.now();
      try {
        // 使用HEAD请求测试链接
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
          headers: {
            'Range': 'bytes=0-1023' // 只获取前1KB的数据进行测试
          }
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const endTime = performance.now();
          const contentLength = response.headers.get('content-length');

          testResults.push({
            url,
            isAccessible: true,
            responseTime: endTime - startTime,
            size: contentLength ? parseInt(contentLength) : 0,
            filename: url.split('/').pop() || `sample-video-${index}.mp4`
          });
        } else {
          testResults.push({
            url,
            isAccessible: false,
            responseTime: Infinity,
            size: 0,
            filename: url.split('/').pop() || `sample-video-${index}.mp4`
          });
        }
      } catch (error) {
        console.warn(`Failed to access ${url}:`, error);
        testResults.push({
          url,
          isAccessible: false,
          responseTime: Infinity,
          size: 0,
          filename: url.split('/').pop() || `sample-video-${index}.mp4`
        });
      }
    });

    await Promise.all(testPromises);

    // 按响应时间排序，选择最快的可访问链接
    return testResults
      .filter(result => result.isAccessible)
      .sort((a, b) => a.responseTime - b.responseTime);
  };