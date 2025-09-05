const CACHE_NAME = 'stock-signals-v1.0.7';
const urlsToCache = [
  '/',
  '/signals/intraday',
  '/signals/daily',
  '/stocks',
  '/analysis/dashboard',
  '/manifest.json',
  // 添加关键的静态资源
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// 安装事件 - 缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: 缓存核心文件');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: 删除旧缓存', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', (event) => {
  // 只处理GET请求
  if (event.request.method !== 'GET') {
    return;
  }

  // API请求使用网络优先策略
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // 如果网络请求成功，更新缓存
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // 网络请求失败，尝试从缓存获取
          return caches.match(event.request);
        })
    );
    return;
  }

  // 静态资源使用缓存优先策略
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 缓存命中，返回缓存的资源
        if (response) {
          return response;
        }

        // 缓存未命中，从网络获取
        return fetch(event.request)
          .then((response) => {
            // 检查响应是否有效
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应并缓存
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: 后台同步数据');
    event.waitUntil(
      // 这里可以添加后台同步逻辑，比如同步离线时的操作
      syncData()
    );
  }
});

// 推送通知
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '新的交易信号提醒',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '查看详情',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '忽略',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('股票信号分析', options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // 打开应用到信号页面
    event.waitUntil(
      clients.openWindow('/signals/intraday')
    );
  }
});

// 数据同步函数
async function syncData() {
  try {
    // 同步关键数据
    const response = await fetch('/api/signals?limit=50');
    if (response.ok) {
      const data = await response.json();
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/signals?limit=50', new Response(JSON.stringify(data)));
      console.log('Service Worker: 数据同步完成');
    }
  } catch (error) {
    console.error('Service Worker: 数据同步失败', error);
  }
}

// 定期更新缓存
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});