"use client";

import { useEffect, useState } from "react";

interface PWAStatus {
  serviceWorkerSupport: boolean;
  serviceWorkerRegistered: boolean;
  manifestExists: boolean;
  beforeInstallPromptSupport: boolean;
  installPromptReceived: boolean;
  isStandalone: boolean;
  userAgent: string;
}

export default function PWATestPage() {
  const [status, setStatus] = useState<PWAStatus>({
    serviceWorkerSupport: false,
    serviceWorkerRegistered: false,
    manifestExists: false,
    beforeInstallPromptSupport: false,
    installPromptReceived: false,
    isStandalone: false,
    userAgent: ''
  });

  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const checkPWAStatus = async () => {
      const newStatus: PWAStatus = {
        serviceWorkerSupport: 'serviceWorker' in navigator,
        serviceWorkerRegistered: false,
        manifestExists: false,
        beforeInstallPromptSupport: 'BeforeInstallPromptEvent' in window,
        installPromptReceived: false,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent
      };

      // 检查Service Worker注册状态
      if (newStatus.serviceWorkerSupport) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          newStatus.serviceWorkerRegistered = !!registration;
          if (registration) {
            addLog('Service Worker已注册');
          } else {
            addLog('Service Worker未注册');
          }
        } catch (error) {
          addLog(`Service Worker检查失败: ${error}`);
        }
      }

      // 检查manifest.json
      try {
        const response = await fetch('/manifest.json');
        newStatus.manifestExists = response.ok;
        if (response.ok) {
          addLog('manifest.json可访问');
        } else {
          addLog('manifest.json不可访问');
        }
      } catch (error) {
        addLog(`manifest.json检查失败: ${error}`);
      }

      setStatus(newStatus);
      addLog('PWA状态检查完成');
    };

    // 监听beforeinstallprompt事件
    const handleBeforeInstallPrompt = (e: Event) => {
      addLog('收到beforeinstallprompt事件');
      setStatus(prev => ({ ...prev, installPromptReceived: true }));
    };

    // 监听appinstalled事件
    const handleAppInstalled = () => {
      addLog('应用已安装');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    checkPWAStatus();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const testInstallPrompt = () => {
    addLog('尝试触发安装提示...');
    // 如果有延迟的安装提示，尝试触发
    if ('deferredPrompt' in window && (window as any).deferredPrompt) {
      (window as any).deferredPrompt.prompt();
    } else {
      addLog('没有可用的安装提示');
    }
  };

  const StatusItem = ({ label, value, isGood }: { label: string; value: boolean | string; isGood?: boolean }) => (
    <div className="flex justify-between items-center py-2 border-b">
      <span className="font-medium">{label}</span>
      <span className={`px-2 py-1 rounded text-sm ${
        typeof value === 'boolean' 
          ? (isGood !== undefined ? (isGood === value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : (value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'))
          : 'bg-gray-100 text-gray-800'
      }`}>
        {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
      </span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">PWA 安装状态检查</h1>
      
      {/* PWA状态概览 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">PWA 支持状态</h2>
        <div className="space-y-1">
          <StatusItem label="Service Worker支持" value={status.serviceWorkerSupport} />
          <StatusItem label="Service Worker已注册" value={status.serviceWorkerRegistered} />
          <StatusItem label="Manifest文件存在" value={status.manifestExists} />
          <StatusItem label="BeforeInstallPrompt支持" value={status.beforeInstallPromptSupport} />
          <StatusItem label="收到安装提示" value={status.installPromptReceived} />
          <StatusItem label="独立显示模式" value={status.isStandalone} />
        </div>
      </div>

      {/* 浏览器信息 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">浏览器信息</h2>
        <p className="text-sm text-gray-600 break-all">{status.userAgent}</p>
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">Chrome PWA安装要求：</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Service Worker已注册 {status.serviceWorkerRegistered ? '✓' : '✗'}</li>
            <li>• 有效的manifest.json {status.manifestExists ? '✓' : '✗'}</li>
            <li>• 至少包含192x192和512x512图标 ✓</li>
            <li>• HTTPS或localhost ✓</li>
            <li>• 用户参与度足够（访问网站至少30秒）</li>
          </ul>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">测试操作</h2>
        <div className="space-y-3">
          <button 
            onClick={testInstallPrompt}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            测试安装提示
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            刷新页面
          </button>
        </div>
      </div>

      {/* 实时日志 */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">实时日志</h2>
        <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="mb-1">{log}</div>
          ))}
        </div>
        <button 
          onClick={() => setLogs([])}
          className="mt-3 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          清空日志
        </button>
      </div>

      {/* 安装指南 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
        <h2 className="text-xl font-semibold text-yellow-900 mb-4">Chrome安装指南</h2>
        <div className="text-yellow-800 space-y-2 text-sm">
          <p><strong>如果地址栏没有安装按钮，请尝试：</strong></p>
          <ol className="list-decimal list-inside space-y-1 ml-4">
            <li>确保在页面上停留至少30秒</li>
            <li>刷新页面并等待Service Worker注册完成</li>
            <li>使用Chrome菜单 → "安装股票信号分析系统"</li>
            <li>或使用快捷键 Ctrl/Cmd + Shift + A（如果可用）</li>
          </ol>
          <p className="mt-3"><strong>开发者工具检查：</strong>按F12 → Application → Manifest 查看详细信息</p>
        </div>
      </div>
    </div>
  );
}