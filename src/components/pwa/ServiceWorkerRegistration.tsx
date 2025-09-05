"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    // 检查 PWA 安装提示
    let deferredPrompt: any = null;
    
    const handleBeforeInstallPrompt = (e: any) => {
      // 阻止默认的安装提示
      e.preventDefault();
      deferredPrompt = e;
      console.log("PWA 安装提示已准备，deferredPrompt 已保存");

      // 显示自定义安装按钮
      showInstallPromotion(deferredPrompt);
    };

    const handleAppInstalled = () => {
      console.log("PWA 应用已安装");
      deferredPrompt = null;
    };

    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // 注册 Service Worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker 注册成功:", registration.scope);

          // 检查更新
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // 新的 Service Worker 已安装，显示更新提示
                  if (confirm("发现新版本，是否立即更新？")) {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("Service Worker 注册失败:", error);
        });

      // 监听 Service Worker 状态变化
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }

    // 添加事件监听器
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // 清理函数
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const showInstallPromotion = (prompt: any) => {
    // 检查是否已经拒绝过
    const lastDismissed = localStorage.getItem("installPromptDismissed");
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    if (lastDismissed && (Date.now() - parseInt(lastDismissed)) < sevenDays) {
      return;
    }
    
    // 检查是否已经有横幅
    if (document.getElementById("install-banner")) {
      return;
    }

    // 可以在这里显示自定义的安装提示 UI
    // 比如在顶部显示一个横幅
    const installBanner = document.createElement("div");
    installBanner.id = "install-banner";
    installBanner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #2563eb, #3b82f6);
      color: white;
      padding: 12px 16px;
      text-align: center;
      z-index: 1000;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      animation: slideDown 0.3s ease-out;
    `;
    installBanner.innerHTML = `
      <style>
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      </style>
      <div style="display: flex; align-items: center; justify-content: space-between; max-width: 1200px; margin: 0 auto;">
        <span>📱 将股票信号分析系统添加到主屏幕，获得原生应用体验</span>
        <div>
          <button id="install-btn" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 6px 12px; border-radius: 6px; margin-right: 8px; cursor: pointer; transition: all 0.2s;">立即安装</button>
          <button id="dismiss-btn" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 4px; transition: opacity 0.2s;">×</button>
        </div>
      </div>
    `;

    // 添加事件监听器
    const installBtn = installBanner.querySelector("#install-btn");
    const dismissBtn = installBanner.querySelector("#dismiss-btn");

    // 添加悬停效果
    installBtn?.addEventListener("mouseenter", () => {
      (installBtn as HTMLElement).style.background = "rgba(255,255,255,0.3)";
    });
    installBtn?.addEventListener("mouseleave", () => {
      (installBtn as HTMLElement).style.background = "rgba(255,255,255,0.2)";
    });

    dismissBtn?.addEventListener("mouseenter", () => {
      (dismissBtn as HTMLElement).style.opacity = "0.7";
    });
    dismissBtn?.addEventListener("mouseleave", () => {
      (dismissBtn as HTMLElement).style.opacity = "1";
    });

    installBtn?.addEventListener("click", async () => {
      if (prompt) {
        try {
          prompt.prompt();
          const { outcome } = await prompt.userChoice;
          console.log(`PWA 安装结果: ${outcome}`);
          
          if (outcome === 'accepted') {
            console.log('用户接受了PWA安装');
          } else {
            console.log('用户拒绝了PWA安装');
          }
        } catch (error) {
          console.error('PWA安装过程中出错:', error);
        }
        
        installBanner.remove();
      } else {
        console.warn('deferredPrompt 不可用');
        alert('请在浏览器地址栏中点击安装图标，或使用浏览器菜单中的"安装应用"选项');
      }
    });

    dismissBtn?.addEventListener("click", () => {
      installBanner.style.animation = "slideDown 0.3s ease-in reverse";
      setTimeout(() => {
        installBanner.remove();
      }, 300);
      // 7天后再次显示
      localStorage.setItem("installPromptDismissed", Date.now().toString());
    });

    document.body.prepend(installBanner);
  };

  return null; // 这是一个纯逻辑组件，不渲染任何 UI
}