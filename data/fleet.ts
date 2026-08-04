import type { LucideIcon } from "lucide-react";
import { Anchor, Ship, Waves } from "lucide-react";

export interface FleetVessel {
  name: string;
  type: string;
  capacity: string;
  route: string;
  image: string;
  icon: LucideIcon;
}

export interface FleetGroupData {
  title: string;
  summary: string;
  vessels: FleetVessel[];
}

const riverImages = [
  "/images/cai-mep-terminal-aerial.jpg",
  "/images/container-port-ship.jpg",
  "/images/cai-mep-port-panorama.jpg",
];

const seaImages = [
  "/images/cai-mep-ship-cranes.jpg",
  "/images/cai-mep-port-panorama.jpg",
  "/images/cai-mep-terminal-aerial.jpg",
];

export const fleetGroups: FleetGroupData[] = [
  {
    title: "Tàu biển",
    summary: "04 tàu chở hàng rời khai thác tuyến nội địa và quốc tế.",
    vessels: [
      {
        name: "VTA Neptune",
        type: "Tàu chở hàng rời",
        capacity: "23620 DWT",
        route: "Nội địa và Quốc tế",
        image: seaImages[0],
        icon: Ship,
      },
      {
        name: "VTA Oceanus",
        type: "Tàu chở hàng rời",
        capacity: "24034 DWT",
        route: "Nội địa và Quốc tế",
        image: seaImages[1],
        icon: Ship,
      },
      {
        name: "VTA Star city",
        type: "Tàu chở hàng rời",
        capacity: "24157 DWT",
        route: "Nội địa và Quốc tế",
        image: seaImages[2],
        icon: Ship,
      },
      {
        name: "VTA poseidon",
        type: "Tàu chở hàng rời",
        capacity: "24241 DWT",
        route: "Nội địa và Quốc tế",
        image: seaImages[0],
        icon: Ship,
      },
    ],
  },
  {
    title: "Tàu sông",
    summary: "08 đoàn sà lan phục vụ vận tải nội địa linh hoạt.",
    vessels: [
      { name: "VTA 01", type: "Đoàn Sà Lan", capacity: "5632 DWT", route: "Nội địa", image: riverImages[0], icon: Waves },
      { name: "VTA 02", type: "Đoàn Sà Lan", capacity: "5632 DWT", route: "Nội địa", image: riverImages[1], icon: Anchor },
      { name: "VTA 03", type: "Đoàn Sà Lan", capacity: "5180 DWT", route: "Nội địa", image: riverImages[2], icon: Waves },
      { name: "VTA 04", type: "Đoàn Sà Lan", capacity: "5180 DWT", route: "Nội địa", image: riverImages[0], icon: Anchor },
      { name: "VTA 05", type: "Đoàn Sà Lan", capacity: "4040 DWT", route: "Nội địa", image: riverImages[1], icon: Waves },
      { name: "VTA 06", type: "Đoàn Sà Lan", capacity: "5632 DWT", route: "Nội địa", image: riverImages[2], icon: Anchor },
      { name: "VTA 07", type: "Đoàn Sà Lan", capacity: "4040 DWT", route: "Nội địa", image: riverImages[0], icon: Waves },
      { name: "VTA 08", type: "Đoàn Sà Lan", capacity: "4040 DWT", route: "Nội địa", image: riverImages[1], icon: Anchor },
    ],
  },
];
