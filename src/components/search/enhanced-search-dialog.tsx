"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Building2, TrendingUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { universalSearchClient } from "@/lib/services/search-service-client";
import { type SearchResponse } from "@/lib/services/search-service";
import { getUrlFromDbFieldName } from "@/config/signals-config";

export function EnhancedSearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResponse>({ stocks: [], signals: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const router = useRouter();

  // 键盘快捷键
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 重置状态当对话框打开时
  useEffect(() => {
    if (open) {
      setQuery("");
      setSearchResults({ stocks: [], signals: [] });
      setIsLoading(false);
      setHasSearched(false);
    }
  }, [open]);

  // 执行搜索
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults({ stocks: [], signals: [] });
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await universalSearchClient(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("搜索失败:", error);
      setSearchResults({ stocks: [], signals: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 处理回车键搜索
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        performSearch(query);
      }
    },
    [query, performSearch],
  );

  // 导航到股票页面
  const navigateToStock = (symbol: string) => {
    router.push(`/stocks/${encodeURIComponent(symbol)}`);
    setOpen(false);
  };

  // 导航到信号页面
  const navigateToSignal = (signalId: number, signalType: string, category: "intraday" | "daily") => {
    const urlSignalType = getUrlFromDbFieldName(signalType);
    if (urlSignalType) {
      router.push(`/signals/${category}/${urlSignalType}/${signalId}`);
    } else {
      // 如果映射失败，使用简化路由
      router.push(`/signals/${category}/${signalId}`);
    }
    setOpen(false);
  };

  // 计算是否有结果
  const hasResults = searchResults.stocks.length > 0 || searchResults.signals.length > 0;

  return (
    <>
      <div
        className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        搜索股票和信号
        <kbd className="bg-muted-foreground inline-flex h-5 items-center gap-1 rounded border px-1.5 text-[10px] font-medium select-none">
          <span className="text-xs">⌘</span>J
        </kbd>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="输入股票代码/名称或信号ID，按回车搜索..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={handleKeyDown}
        />

        <CommandList>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
              <div className="text-muted-foreground text-sm">正在搜索...</div>
            </div>
          ) : !hasSearched ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8">
              <Search className="text-muted-foreground/50 h-8 w-8" />
              <div className="text-muted-foreground text-sm">输入关键词后按回车搜索</div>
              <div className="text-muted-foreground/70 text-xs">支持中文名称、股票代码、信号ID等</div>
            </div>
          ) : !hasResults ? (
            <CommandEmpty>
              <div className="flex flex-col items-center justify-center gap-2 py-6">
                <Search className="text-muted-foreground/50 h-6 w-6" />
                <div className="text-muted-foreground text-sm">未找到相关结果</div>
                <div className="text-muted-foreground/70 text-xs">请尝试其他关键词</div>
              </div>
            </CommandEmpty>
          ) : (
            <>
              {/* 股票结果 */}
              {searchResults.stocks.length > 0 && (
                <>
                  <CommandGroup heading={`股票 (${searchResults.stocks.length})`}>
                    {searchResults.stocks.map((stock) => (
                      <CommandItem
                        key={stock.symbol}
                        value={stock.symbol}
                        onSelect={() => navigateToStock(stock.symbol)}
                        className="flex items-center gap-3 p-3"
                      >
                        <Building2 className="h-4 w-4 text-blue-500" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{stock.symbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {stock.market || "未知市场"}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground truncate text-sm">{stock.name || "未知名称"}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {searchResults.signals.length > 0 && <CommandSeparator />}
                </>
              )}

              {/* 信号结果 */}
              {searchResults.signals.length > 0 && (
                <CommandGroup heading={`信号 (${searchResults.signals.length})`}>
                  {searchResults.signals.map((signal) => (
                    <CommandItem
                      key={signal.id}
                      value={`signal-${signal.id}`}
                      onSelect={() => navigateToSignal(signal.id, signal.signal_type, signal.category)}
                      className="flex items-center gap-3 p-3"
                    >
                      <TrendingUp
                        className={`h-4 w-4 ${
                          signal.direction === "long"
                            ? "text-green-500"
                            : signal.direction === "short"
                              ? "text-red-500"
                              : "text-gray-500"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">信号 #{signal.id}</span>
                          <Badge variant={signal.category === "intraday" ? "default" : "secondary"} className="text-xs">
                            {signal.category === "intraday" ? "日内" : "日线"}
                          </Badge>
                          <Badge variant={signal.status === "active" ? "default" : "outline"} className="text-xs">
                            {signal.status === "active" ? "活跃" : "已过期"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {signal.symbol} - {signal.signal_type} - 置信度: {signal.confidence}%
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
