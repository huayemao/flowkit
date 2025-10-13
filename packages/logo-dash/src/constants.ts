export const DOMAIN_NAME = 'logo.utities.online';
export const SITE_ID = 'logoDash';

// 图标相关常量
import * as LucideIcons from "lucide-react";
import { fas } from '@fortawesome/free-solid-svg-icons';
import { IconCategories } from "./components/logo-parts/types";

// 从 LucideIcons 中获取所有图标组件
export type IconKey = keyof typeof LucideIcons;
export const lucideIconKeys = Object.keys(LucideIcons) as IconKey[];
export const lucideValidIcons = lucideIconKeys.filter(
  (key) => !!LucideIcons[key] && !key.endsWith("Icon")
);

// 从 Font Awesome 中获取所有图标组件
export const faValidIcons = Object.keys(fas).map(key => `${key.replace(/^fa-/, '').replace(/([A-Z])/g, '-$1').toLowerCase()}`);

// 合并所有有效的图标
export const validIcons = [...lucideValidIcons, ...faValidIcons];

// 将图标分组以提高可用性
export const iconCategories: IconCategories = {
  technology: [
    "Code",
    "Cpu",
    "Monitor",
    "Laptop",
    "Smartphone",
    "Tablet",
    "Wifi",
    "Cloud",
    "Database",
    "fa-code",
    "fa-microchip",
    "fa-laptop",
    "fa-tablet-alt",
    "fa-mobile-alt",
    "fa-wifi",
    "fa-cloud",
    "fa-database"
  ],
  business: [
    "Briefcase",
    "TrendingUp",
    "DollarSign",
    "LineChart",
    "BarChart",
    "PieChart",
    "Target",
    "Award",
    "fa-briefcase",
    "fa-chart-line",
    "fa-dollar-sign",
    "fa-chart-pie",
    "fa-chart-bar",
    "fa-bullseye",
    "fa-award"
  ],
  nature: [
    "Leaf",
    "Tree",
    "Sun",
    "CloudRain",
    "Snowflake",
    "Flower",
    "Mountain",
    "Droplets",
    "Wind",
    "fa-leaf",
    "fa-tree",
    "fa-sun",
    "fa-cloud-rain",
    "fa-snowflake",
    "fa-mountain",
    "fa-tint"
  ],
  animals: ["Cat", "Dog", "Bird", "Fish", "Rabbit", "PawPrint", "Zap", "fa-cat", "fa-dog", "fa-dove", "fa-fish", "fa-rabbit", "fa-paw", "fa-bolt"],
  symbols: [
    "Circle",
    "Square",
    "Triangle",
    "Star",
    "Heart",
    "Diamond",
    "Shield",
    "Key",
    "Lock",
    "fa-circle",
    "fa-square",
    "fa-star",
    "fa-heart",
    "fa-gem",
    "fa-shield-alt",
    "fa-key",
    "fa-lock"
  ],
  food: [
    "Coffee",
    "Apple",
    "Cheese",
    "Bread",
    "Pizza",
    "IceCream",
    "Wine",
    "Beer",
    "fa-coffee",
    "fa-apple-alt",
    "fa-cheese",
    "fa-bread-slice",
    "fa-pizza-slice",
    "fa-ice-cream",
    "fa-wine-glass-alt",
    "fa-beer"
  ],
  fitness: ["Activity", "Dumbbell", "Yoga", "Running", "Swimmer", "Bicycle", "fa-heartbeat", "fa-dumbbell", "fa-running", "fa-swimmer", "fa-bicycle"],
  music: ["Music", "Headphones", "Guitar", "Drum", "Microphone", "fa-music", "fa-headphones", "fa-guitar", "fa-drum", "fa-microphone"],
  travel: ["Car", "Plane", "Train", "Ship", "Compass", "Map", "Umbrella", "fa-car", "fa-plane", "fa-train", "fa-ship", "fa-compass", "fa-map", "fa-umbrella"]
};

// 添加其他分类
iconCategories.other = validIcons.filter(
  (icon) => !icon.startsWith('Lucide') && !Object.values(iconCategories).flat().includes(icon)
);