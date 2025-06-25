import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart,
  Target,
  Shield,
  Zap,
  Clock,
  Calendar,
  Fingerprint,
  Square,
  Minus,
  ArrowUp,
  type LucideIcon,
} from "lucide-react";

import { getSignalsByCategory, getUrlFromDbFieldName, type SignalConfig } from "@/config/signals-config";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

// 图标映射
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Shield,
  Square,
  Minus,
  Clock,
  Calendar,
  Zap,
  ArrowUp,
  LineChart,
};

// 根据信号配置生成导航子项
function createSignalSubItems(signals: SignalConfig[], category: "intraday" | "daily"): NavSubItem[] {
  return signals
    .filter((signal) => signal.enabled)
    .map((signal) => ({
      title: signal.displayName,
      url: `/signals/${category}/${getUrlFromDbFieldName(signal.name) || signal.name.toLowerCase()}`,
      icon: signal.icon ? iconMap[signal.icon] : Target,
    }));
}

// 动态生成信号导航配置
function generateSignalNavigation(): NavMainItem[] {
  const intradaySignals = getSignalsByCategory("intraday");
  const dailySignals = getSignalsByCategory("daily");

  return [
    {
      title: "日内信号",
      url: "/signals/intraday",
      icon: Clock,
      subItems: createSignalSubItems(intradaySignals, "intraday"),
    },
    {
      title: "日线信号",
      url: "/signals/daily",
      icon: Calendar,
      subItems: createSignalSubItems(dailySignals, "daily"),
    },
  ];
}

// 主导航配置
export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "交易信号",
    items: generateSignalNavigation(),
  },
  {
    id: 2,
    label: "分析工具",
    items: [
      {
        title: "市场概览",
        url: "/analysis/overview",
        icon: LineChart,
      },
      {
        title: "信号仪表板",
        url: "/analysis/dashboard",
        icon: Zap,
      },
    ],
  },
  {
    id: 3,
    label: "账户管理",
    items: [
      {
        title: "用户认证",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "登录", url: "/auth/v1/login", newTab: true },
          { title: "注册", url: "/auth/v1/register", newTab: true },
        ],
      },
    ],
  },
];

// 导出工具函数，供其他组件使用
export function getSignalNavigationItems() {
  return generateSignalNavigation();
}

// 根据路径获取对应的信号配置
export function getSignalConfigFromPath(path: string): SignalConfig | null {
  const pathParts = path.split("/");
  if (pathParts.length < 4 || pathParts[1] !== "signals") {
    return null;
  }

  const category = pathParts[2] as "intraday" | "daily";
  const signalName = pathParts[3].toUpperCase();

  const signals = getSignalsByCategory(category);
  return signals.find((signal) => signal.name === signalName) ?? null;
}
