#!/bin/bash

# 修复所有 Radix UI 导入
echo "修复 Radix UI 导入..."

# 修复各个组件的导入
sed -i '' 's/import { Accordion as AccordionPrimitive } from "radix-ui"/import * as AccordionPrimitive from "@radix-ui\/react-accordion"/g' src/components/ui/accordion.tsx
sed -i '' 's/import { AlertDialog as AlertDialogPrimitive } from "radix-ui"/import * as AlertDialogPrimitive from "@radix-ui\/react-alert-dialog"/g' src/components/ui/alert-dialog.tsx
sed -i '' 's/import { AspectRatio as AspectRatioPrimitive } from "radix-ui"/import * as AspectRatioPrimitive from "@radix-ui\/react-aspect-ratio"/g' src/components/ui/aspect-ratio.tsx
sed -i '' 's/import { Avatar as AvatarPrimitive } from "radix-ui"/import * as AvatarPrimitive from "@radix-ui\/react-avatar"/g' src/components/ui/avatar.tsx
sed -i '' 's/import { Checkbox as CheckboxPrimitive } from "radix-ui"/import * as CheckboxPrimitive from "@radix-ui\/react-checkbox"/g' src/components/ui/checkbox.tsx
sed -i '' 's/import { Collapsible as CollapsiblePrimitive } from "radix-ui"/import * as CollapsiblePrimitive from "@radix-ui\/react-collapsible"/g' src/components/ui/collapsible.tsx
sed -i '' 's/import { ContextMenu as ContextMenuPrimitive } from "radix-ui"/import * as ContextMenuPrimitive from "@radix-ui\/react-context-menu"/g' src/components/ui/context-menu.tsx
sed -i '' 's/import { Dialog as DialogPrimitive } from "radix-ui"/import * as DialogPrimitive from "@radix-ui\/react-dialog"/g' src/components/ui/dialog.tsx
sed -i '' 's/import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"/import * as DropdownMenuPrimitive from "@radix-ui\/react-dropdown-menu"/g' src/components/ui/dropdown-menu.tsx
sed -i '' 's/import { HoverCard as HoverCardPrimitive } from "radix-ui"/import * as HoverCardPrimitive from "@radix-ui\/react-hover-card"/g' src/components/ui/hover-card.tsx
sed -i '' 's/import { Label as LabelPrimitive } from "radix-ui"/import * as LabelPrimitive from "@radix-ui\/react-label"/g' src/components/ui/label.tsx
sed -i '' 's/import { Menubar as MenubarPrimitive } from "radix-ui"/import * as MenubarPrimitive from "@radix-ui\/react-menubar"/g' src/components/ui/menubar.tsx
sed -i '' 's/import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui"/import * as NavigationMenuPrimitive from "@radix-ui\/react-navigation-menu"/g' src/components/ui/navigation-menu.tsx
sed -i '' 's/import { Popover as PopoverPrimitive } from "radix-ui"/import * as PopoverPrimitive from "@radix-ui\/react-popover"/g' src/components/ui/popover.tsx
sed -i '' 's/import { Progress as ProgressPrimitive } from "radix-ui"/import * as ProgressPrimitive from "@radix-ui\/react-progress"/g' src/components/ui/progress.tsx
sed -i '' 's/import { RadioGroup as RadioGroupPrimitive } from "radix-ui"/import * as RadioGroupPrimitive from "@radix-ui\/react-radio-group"/g' src/components/ui/radio-group.tsx
sed -i '' 's/import { ScrollArea as ScrollAreaPrimitive } from "radix-ui"/import * as ScrollAreaPrimitive from "@radix-ui\/react-scroll-area"/g' src/components/ui/scroll-area.tsx
sed -i '' 's/import { Select as SelectPrimitive } from "radix-ui"/import * as SelectPrimitive from "@radix-ui\/react-select"/g' src/components/ui/select.tsx
sed -i '' 's/import { Separator as SeparatorPrimitive } from "radix-ui"/import * as SeparatorPrimitive from "@radix-ui\/react-separator"/g' src/components/ui/separator.tsx
sed -i '' 's/import { Dialog as SheetPrimitive } from "radix-ui"/import * as SheetPrimitive from "@radix-ui\/react-dialog"/g' src/components/ui/sheet.tsx
sed -i '' 's/import { Slider as SliderPrimitive } from "radix-ui"/import * as SliderPrimitive from "@radix-ui\/react-slider"/g' src/components/ui/slider.tsx
sed -i '' 's/import { Switch as SwitchPrimitive } from "radix-ui"/import * as SwitchPrimitive from "@radix-ui\/react-switch"/g' src/components/ui/switch.tsx
sed -i '' 's/import { Tabs as TabsPrimitive } from "radix-ui"/import * as TabsPrimitive from "@radix-ui\/react-tabs"/g' src/components/ui/tabs.tsx
sed -i '' 's/import { Toggle as TogglePrimitive } from "radix-ui"/import * as TogglePrimitive from "@radix-ui\/react-toggle"/g' src/components/ui/toggle.tsx
sed -i '' 's/import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui"/import * as ToggleGroupPrimitive from "@radix-ui\/react-toggle-group"/g' src/components/ui/toggle-group.tsx
sed -i '' 's/import { Tooltip as TooltipPrimitive } from "radix-ui"/import * as TooltipPrimitive from "@radix-ui\/react-tooltip"/g' src/components/ui/tooltip.tsx

echo "修复完成！" 