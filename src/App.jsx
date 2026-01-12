import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  MapPin, 
  Train, 
  Calendar, 
  Sun, 
  CloudRain, 
  Cloud, 
  Clock, 
  ArrowRight,
  Info,
  Signpost,
  ExternalLink,
  Search,
  CheckSquare,
  Briefcase,
  RotateCcw
} from 'lucide-react';

// ==========================================
// 0. CSS 樣式注入 (確保樣式正確載入)
// ==========================================
const styleElement = document.createElement('style');
styleElement.textContent = `
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.3); }
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  body { margin: 0; background-color: #0f1016; font-family: system-ui, -apple-system, sans-serif; }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;
document.head.appendChild(styleElement);

// ==========================================
// 1. 行程數據 (Day 1 - Day 11)
// ==========================================

const scheduleData = [
  {
    day: "Day 1",
    date: "1月23日 (五)",
    weather: { type: "cloudy", temp: "10°", desc: "多雲" },
    events: [
      {
        time: "14:25",
        title: "到達成田機場 (NRT)",
        type: "flight",
        remark: "辦理入境手續，領取行李，購買metro pass"
      },
      {
        time: "15:58",
        title: "乘坐 Skyliner",
        type: "transport",
        transportInfo: {
          route: "成田空港 → 日暮里 → 池袋",
          platform: "成田: 4/5號月台 | 日暮里: 11號月台",
          cost: "¥2,570",
          time: "約 50 分鐘",
          note: "Skyliner 全車指定席，需買票"
        }
      },
      {
        time: "17:00",
        title: "池袋百夫長酒店 Check-in",
        type: "hotel",
        address: "Centurion Hotel Ikebukuro",
        mapQuery: "Centurion Hotel Ikebukuro"
      },
      {
        time: "18:00",
        title: "新宿 / 表參道 逛街",
        type: "activity",
        backup: "若太累可改在池袋周邊",
        transportInfo: {
          route: "池袋 (JR 山手線) → 新宿",
          platform: "池袋: 5/6號月台 (外回)",
          cost: "¥170",
          time: "9 分鐘"
        }
      }
    ]
  },
  {
    day: "Day 2",
    date: "1月24日 (六)",
    weather: { type: "sunny", temp: "9°", desc: "晴朗" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "午後",
        title: "澀谷區域",
        type: "activity",
        transportInfo: {
          route: "池袋 (副都心線) → 澀谷",
          platform: "池袋: 5/6號月台",
          cost: "¥210",
          time: "16 分鐘"
        }
      },
      {
        time: "重點",
        title: "DARUMA YARN TOKYO",
        type: "highlight",
        address: "DARUMA STORE TOKYO",
        mapQuery: "DARUMA STORE TOKYO Shibuya",
        remark: "毛線愛好者必去",
        openingHours: "11:00 - 19:00",
        image: "https://image.jimcdn.com/app/cms/image/transf/none/path/sddc28d7a7be52aca/image/i8c9a3e5ec00d7d5f/version/1727265408/image.jpg"
      }
    ]
  },
  {
    day: "Day 3",
    date: "1月25日 (日)",
    weather: { type: "sunny", temp: "11°", desc: "晴時多雲" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "下午",
        title: "Seiryuji (清隆寺)",
        type: "highlight",
        mapQuery: "1-27 Akagi Motomachi, Shinjuku City, Tokyo 162-0817, Japan",
        remark: "需在 16:00 前購買御朱印",
        openingHours: "09:00 - 17:00",
        image: "https://scontent.fhkg4-2.fna.fbcdn.net/v/t39.30808-6/475903702_1150924960019362_5847423516971838397_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=988bpn7dtTMQ7kNvwFCJUrw&_nc_oc=AdnJ2p-jWgBq3o7MgvO4DFjlUYtDoWkYG2Yvw-VWgsyS4cTZrS7A8OTIh4dsbr4RU38&_nc_zt=23&_nc_ht=scontent.fhkg4-2.fna&_nc_gid=_PyAumJdElxC9bUzje3lXA&oh=00_Afoxji68PWLCcBtRlIL2PTxs9Nx1rdadvbSP_WaA-WpI0Q&oe=696A98C9"
      },
      {
        time: "下午",
        title: "萬年山 法輪寺 (Mannenzan Hourinji)",
        type: "highlight",
        mapQuery: "1 Chome-1-15 Nishiwaseda, Shinjuku City, Tokyo 169-0051, Japan",
        remark: "花手水名所，請保持安靜",
        openingHours: "09:00 - 16:00",
        image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSxQ2xMNzDUx8XMCHJZXVzs4bTQ4VlYMbg3tk01Kkb4m2ji2aOCHpFwu06hwc0UHdE5plH58ecC-j4WTf50ZGBqozUHrYDRWtbxqqF2wUflyl9S2Ky5ptDeM-kGOFBw4ozrcow6XHkdKBHgA=s680-w680-h510-rw"
      },
      {
        time: "下午",
        title: "新宿區域",
        type: "activity",
        transportInfo: {
          route: "池袋 (JR 山手線) → 新宿",
          platform: "池袋: 5/6號月台",
          cost: "¥170",
          time: "9 分鐘"
        }
      },
      {
        time: "13:30",
        title: "jojoen",
        type: "highlight",
        mapQuery: "Jojoen Shinjuku Central East Exit Branch",
        remark: "午市燒肉",
        image: "https://tblg.k-img.com/resize/640x360c/restaurant/images/Rvw/279857/34ac488b61f26eb29c785c64774cd7b2.jpg?token=fac39fe&api=v2"
      }
    ]
  },
  {
    day: "Day 4",
    date: "1月26日 (一)",
    weather: { type: "rain", temp: "8°", desc: "小雨" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "午後",
        title: "表參道",
        type: "activity",
        transportInfo: {
          route: "池袋 (副都心線) → 明治神宮前(原宿)",
          platform: "池袋: 5/6號月台",
          cost: "¥210",
          time: "14 分鐘"
        }
      },
      {
        time: "重點",
        title: "Artek Tokyo Store",
        type: "highlight",
        address: "Artek Tokyo Store",
        mapQuery: "Artek Tokyo Store Omotesando",
        remark: "北歐設計家具店 (週二公休)",
        openingHours: "11:00 - 19:00",
        image: "https://lh3.googleusercontent.com/p/AF1QipO7zuKfvDKRM6RWyMivND_478j4NBW1ZmEMQrco=s680-w680-h510-rw"
      }
    ]
  },
  {
    day: "Day 5",
    date: "1月27日 (二)",
    weather: { type: "cloudy", temp: "10°", desc: "多雲" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "12:30",
        title: "哈利波特影城 (Warner Bros.)",
        type: "highlight",
        mapQuery: "Warner Bros. Studio Tour Tokyo",
        remark: "請預留 3-4 小時參觀時間，需提前預約",
        openingHours: "09:30 - 19:30",
        image: "https://lovetogo.tw/202401-tokyo/harry-potter/photo/20240204-1224-7557.jpg",
        transportInfo: {
          route: "池袋 (西武池袋線) → 豐島園站",
          platform: "池袋: 2/3號月台 (西武線)",
          cost: "¥190",
          time: "15 分鐘"
        }
      }
    ]
  },
  {
    day: "Day 6",
    date: "1月28日 (三)",
    weather: { type: "sunny", temp: "9°", desc: "晴朗" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "午後",
        title: "銀座區域",
        type: "activity",
        transportInfo: {
          route: "池袋 (丸之內線) → 銀座",
          platform: "池袋: 1/2號月台",
          cost: "¥210",
          time: "19 分鐘"
        }
      },
      {
        time: "重點",
        title: "G.Itoya (銀座伊東屋)",
        type: "highlight",
        address: "G.Itoya Ginza",
        mapQuery: "G.Itoya Ginza",
        remark: "百年文具店",
        openingHours: "10:00 - 20:00",
        image: "https://media.timeout.com/images/106076425/750/422/image.jpg"
      },
      {
        time: "晚間",
        title: "六本木",
        type: "activity",
        transportInfo: {
          route: "銀座 (日比谷線) → 六本木",
          platform: "銀座: 5/6號月台",
          cost: "¥180",
          time: "9 分鐘"
        }
      },
      {
        time: "重點",
        title: "EVANGELION CROSSING EXPO",
        subtitle: "30週年紀念展 - 六本木博物館",
        type: "highlight",
        mapQuery: "Roppongi Museum",
        remark: "EVA 粉絲必看！",
        openingHours: "10:00 - 18:00 (最後入場 17:30)",
        image: "https://placehold.co/600x300/673ab7/FFF?text=EVANGELION+EXPO"
      }
    ]
  },
  {
    day: "Day 7",
    date: "1月29日 (四)",
    weather: { type: "sunny", temp: "11°", desc: "晴朗" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "午後",
        title: "東京駅地下街",
        type: "activity",
        transportInfo: {
          route: "池袋 (丸之內線) → 東京",
          platform: "池袋: 1/2號月台",
          cost: "¥210",
          time: "17 分鐘"
        }
      },
      {
        time: "重點",
        title: "ALMOND, Brulee Merize",
        type: "highlight",
        mapQuery: "ALMOND Tokyo Station",
        remark: "東京站一番街 Gift Palette 必買甜點",
        openingHours: "09:30 - 20:30",
        image: "https://cdn.cybassets.com/s/files/25322/ckeditor/pictures/content_2e3fce49-1cb4-4abb-b2ed-f382860feb0a.jpg"
      },
      {
        time: "午後",
        title: "OZEKI 東京營業所",
        type: "highlight",
        mapQuery: "OZEKI Tokyo Gallery",
        remark: "野口勇燈",
        openingHours: "09:30 - 17:30",
        image: "https://lh3.googleusercontent.com/gps-cs-s/AG0ilSzbqYa2usHgayDt4DJP8LP8-jC2doEM4nodCR69yC4uOkdvGv73foS4WUwmw6Jss4lWaL1PUTuciTiBXV6s92BoTKl60uAR7xJmeyHKdCOl4YLgyZrlayYSpLUc9LBbzTTyF2BNUw=w408-h306-k-no"
      }
    ]
  },
  {
    day: "Day 8",
    date: "1月30日 (五)",
    weather: { type: "cloudy", temp: "10°", desc: "多雲" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "午後",
        title: "上野區域",
        type: "activity",
        transportInfo: {
          route: "池袋 (JR 山手線) → 上野",
          platform: "池袋: 7/8號月台 (外回)",
          cost: "¥170",
          time: "16 分鐘"
        }
      },
      {
        time: "備案",
        title: "自由之丘 (Jiyugaoka)",
        type: "activity",
        backup: "若不去上野可改去自由之丘雜貨巡禮",
        transportInfo: {
          route: "池袋 (副都心線直通) → 自由之丘",
          platform: "池袋: 5/6號月台",
          cost: "¥360",
          time: "25 分鐘"
        }
      }
    ]
  },
  {
    day: "Day 9",
    date: "1月31日 (六)",
    weather: { type: "cloudy", temp: "9°", desc: "陰天" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "全日",
        title: "表參道 / 原宿",
        type: "activity",
        transportInfo: {
          route: "池袋 (副都心線) → 明治神宮前",
          platform: "池袋: 5/6號月台",
          cost: "¥210",
          time: "14 分鐘"
        }
      }
    ]
  },
  {
    day: "Day 10",
    date: "2月1日 (日)",
    weather: { type: "sunny", temp: "8°", desc: "晴朗" },
    events: [
      {
        time: "11:30",
        title: "酒店出發",
        type: "start"
      },
      {
        time: "午間",
        title: "川越 (小江戶)",
        type: "activity",
        transportInfo: {
          route: "池袋 (東武東上線 急行) → 川越",
          platform: "池袋: 1/2號月台 (東武)",
          cost: "¥490",
          time: "32 分鐘"
        }
      },
      {
        time: "重點",
        title: "Chiikawa Shop Kawagoe",
        type: "highlight",
        mapQuery: "Chiikawa Shop Kawagoe",
        remark: "位於川越藏造街道區域",
        openingHours: "10:00 - 18:00",
        image: "https://cdn.cheapoguides.com/wp-content/uploads/sites/2/2025/08/P1048520-1024x600.jpg"
      }
    ]
  },
  {
    day: "Day 11",
    date: "2月2日 (一)",
    weather: { type: "cloudy", temp: "10°", desc: "多雲" },
    events: [
      {
        time: "11:00",
        title: "池袋百夫長酒店 Check-out",
        type: "hotel",
        remark: "攜帶行李移動"
      },
      {
        time: "11:30",
        title: "澀谷最後巡禮",
        type: "activity",
        transportInfo: {
          route: "池袋 (副都心線) → 澀谷",
          platform: "池袋: 5/6號月台",
          cost: "¥210",
          time: "16 分鐘"
        }
      },
      {
        time: "重點",
        title: "amimono SPIN",
        type: "highlight",
        mapQuery: "amimono SPIN Shibuya",
        remark: "編織愛好者店舖",
        openingHours: "11:00 - 19:00",
        image: "https://placehold.co/600x300/8d6e63/FFF?text=amimono+SPIN"
      },
      {
        time: "15:14",
        title: "乘坐 N'EX (成田特快)",
        type: "transport",
        transportInfo: {
          route: "澀谷 (JR) → 成田空港",
          platform: "澀谷: 3/4號月台",
          cost: "約 ¥3,250",
          time: "約 75 分鐘",
          note: "全車指定席，建議提前買票"
        }
      },
      {
        time: "16:30",
        title: "到達成田機場 (NRT)",
        type: "flight",
        remark: "準備登機返程"
      }
    ]
  }
];

// ==========================================
// 2. 行李清單數據 (預設)
// ==========================================

const defaultPackingList = [
  {
    category: "證件與錢財",
    items: [
      { id: "p1", name: "護照 (Passport)", checked: false },
      { id: "p2", name: "機票 / 登機證", checked: false },
      { id: "p3", name: "現金 (日幣 Yen)", checked: false },
      { id: "p4", name: "信用卡 (海外開通)", checked: false },
      { id: "p5", name: "Suica / Pasmo", checked: false },
      { id: "p6", name: "Visit Japan Web QR", checked: false },
      { id: "p7", name: "酒店預訂確認單", checked: false }
    ]
  },
  {
    category: "電子產品",
    items: [
      { id: "e1", name: "手機 & 充電線", checked: false },
      { id: "e2", name: "行動電源", checked: false },
      { id: "e3", name: "轉接頭 (雙扁腳)", checked: false },
      { id: "e4", name: "SIM 卡 / WiFi", checked: false },
      { id: "e5", name: "相機 & 記憶卡", checked: false }
    ]
  },
  {
    category: "衣物 (冬季)",
    items: [
      { id: "c1", name: "羽絨外套", checked: false },
      { id: "c2", name: "發熱衣 (Heattech)", checked: false },
      { id: "c3", name: "毛衣 / 衛衣", checked: false },
      { id: "c4", name: "長褲 / 裙子", checked: false },
      { id: "c5", name: "內衣褲 / 襪子", checked: false },
      { id: "c6", name: "圍巾 / 手套", checked: false },
      { id: "c7", name: "好走的鞋子", checked: false }
    ]
  },
  {
    category: "個人護理",
    items: [
      { id: "t1", name: "牙刷 / 牙膏", checked: false },
      { id: "t2", name: "護膚品", checked: false },
      { id: "t3", name: "個人藥物", checked: false },
      { id: "t4", name: "口罩 / 濕紙巾", checked: false }
    ]
  },
  {
    category: "雜項",
    items: [
      { id: "m1", name: "摺疊雨傘", checked: false },
      { id: "m2", name: "環保購物袋", checked: false },
      { id: "m3", name: "原子筆", checked: false }
    ]
  }
];

// ==========================================
// 3. UI 組件
// ==========================================

const WeatherIcon = ({ type, className }) => {
  const iconClass = className || "w-4 h-4";
  switch (type) {
    case 'sunny': return <Sun className={`text-yellow-300 ${iconClass}`} />;
    case 'cloudy': return <Cloud className={`text-gray-200 ${iconClass}`} />;
    case 'rain': return <CloudRain className={`text-blue-300 ${iconClass}`} />;
    default: return <Sun className={`text-yellow-300 ${iconClass}`} />;
  }
};

const TransportCard = ({ info }) => (
  <div className="mt-3 mb-2 bg-black/30 rounded-lg p-3 border border-white/10 backdrop-blur-sm shadow-inner">
    <div className="flex items-center gap-2 text-pink-200 text-sm font-semibold mb-1">
      <Train size={16} />
      <span>交通建議</span>
    </div>
    <div className="text-white text-sm pl-6 space-y-1">
      <div className="flex items-start gap-2">
        <ArrowRight size={14} className="mt-1 flex-shrink-0 text-white/60" />
        <span className="font-medium">{info.route}</span>
      </div>
      {info.platform && (
        <div className="flex items-start gap-2 text-yellow-100/90 text-xs my-1">
          <Signpost size={12} className="mt-0.5 flex-shrink-0" />
          <span>{info.platform}</span>
        </div>
      )}
      <div className="flex justify-between items-center text-xs text-white/70 pl-5 pt-1">
        <span className="bg-white/10 px-2 py-0.5 rounded text-white/90 border border-white/10">{info.cost}</span>
        <span>{info.time}</span>
      </div>
      {info.note && <div className="text-xs text-yellow-200/60 pl-5 italic mt-1">* {info.note}</div>}
    </div>
  </div>
);

const EventCard = ({ event }) => {
  const isHighlight = event.type === 'highlight';
  return (
    <div className={`relative pl-4 pb-10 border-l-2 ${isHighlight ? 'border-pink-400' : 'border-white/10'} last:border-0 last:pb-0`}>
      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white/50 ${isHighlight ? 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.6)]' : 'bg-indigo-600'}`}></div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-white/60 bg-black/20 px-2 py-0.5 rounded border border-white/5">{event.time}</span>
          {isHighlight && <span className="text-[10px] font-bold bg-pink-500/90 text-white px-1.5 py-0.5 rounded shadow-sm">重點</span>}
        </div>
        <h3 className={`text-lg font-medium leading-tight mt-1 ${isHighlight ? 'text-pink-100' : 'text-white'}`}>
          {event.title}
        </h3>
        {event.subtitle && <p className="text-sm text-white/60">{event.subtitle}</p>}
        {event.image && (
          <a 
            href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(event.title + " " + (event.subtitle || "") + " " + "Tokyo")}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 mb-2 block rounded-lg overflow-hidden border border-white/10 shadow-lg group relative cursor-pointer"
          >
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-32 object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
               <div className="bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                 <Search size={20} className="text-white" />
               </div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-[10px] text-white/90 backdrop-blur-sm">
                <ExternalLink size={10} />
                <span>Google 圖片</span>
            </div>
          </a>
        )}
        <div className="flex flex-col gap-1 mt-1">
          {event.openingHours && (
             <div className="flex items-center gap-1.5 text-xs text-yellow-200 bg-yellow-500/10 p-1.5 rounded w-fit border border-yellow-500/20">
              <Clock size={12} className="flex-shrink-0" />
              <span>營業時間: {event.openingHours}</span>
            </div>
          )}
          {event.remark && (
            <div className="flex items-start gap-1.5 text-sm text-indigo-200 bg-indigo-500/20 p-2 rounded border border-indigo-500/20">
              <Info size={14} className="mt-0.5 flex-shrink-0" />
              <span>{event.remark}</span>
            </div>
          )}
        </div>
        {event.mapQuery && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 w-fit bg-white/5 hover:bg-white/20 transition-all px-3 py-1.5 rounded-full text-xs text-white border border-white/10 hover:border-white/30"
          >
            <MapPin size={12} />
            <span>Google Map</span>
          </a>
        )}
        {event.transportInfo && <TransportCard info={event.transportInfo} />}
        {event.backup && (
          <div className="mt-2 text-xs text-white/40 italic pl-1 border-l-2 border-white/10">
            備案: {event.backup}
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. Main App Component
// ==========================================

const App = () => {
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [packingItems, setPackingItems] = useState(defaultPackingList);
  
  // LocalStorage Init
  useEffect(() => {
    const saved = localStorage.getItem('tokyo_trip_packing_v1');
    if (saved) {
      try {
        setPackingItems(JSON.parse(saved));
      } catch (e) {
        console.error("Load failed", e);
      }
    }
  }, []);

  // Save on change
  useEffect(() => {
    localStorage.setItem('tokyo_trip_packing_v1', JSON.stringify(packingItems));
  }, [packingItems]);

  const toggleItem = (categoryId, itemId) => {
    setPackingItems(prev => prev.map(cat => {
      if (cat.category === categoryId) {
        return {
          ...cat,
          items: cat.items.map(item => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return cat;
    }));
  };

  const resetChecklist = () => {
    if(window.confirm("確定要重置？")) setPackingItems(defaultPackingList);
  };

  const totalItems = packingItems.reduce((acc, cat) => acc + cat.items.length, 0);
  const checkedItems = packingItems.reduce((acc, cat) => acc + cat.items.filter(i => i.checked).length, 0);
  const progress = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

  const currentDay = scheduleData[selectedDayIndex] || scheduleData[0];

  return (
    <div className="min-h-screen bg-[#0f1016] text-white font-sans selection:bg-pink-500/30 overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[700px] h-[700px] bg-blue-900/30 rounded-full blur-[120px] mix-blend-screen opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto h-screen flex flex-col">
        
        {/* Header */}
        <header className="pt-8 pb-4 px-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60">
            Tokyo Trip
          </h1>
          <p className="text-sm text-white/40 font-medium tracking-widest uppercase mt-1">2026 Winter Itinerary</p>
        </header>

        {/* Tab Nav */}
        <div className="px-6 pb-2 flex gap-4">
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'itinerary' ? 'bg-white/20 text-white shadow-lg border border-white/20' : 'text-white/40 hover:bg-white/5'}`}
          >
             <Calendar size={16} /> 行程表
          </button>
          <button 
            onClick={() => setActiveTab('packing')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'packing' ? 'bg-pink-500/30 text-white shadow-lg border border-pink-500/30' : 'text-white/40 hover:bg-white/5'}`}
          >
             <Briefcase size={16} /> 行李清單
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-4 pb-4 overflow-hidden flex flex-col">
           
           {/* === Itinerary View === */}
           {activeTab === 'itinerary' && (
             <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
                {/* Date Scroll */}
                <div className="py-2 overflow-x-auto no-scrollbar flex gap-3 snap-x pb-4">
                  {scheduleData.map((data, index) => {
                    const isSelected = selectedDayIndex === index;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedDayIndex(index)}
                        className={`flex-shrink-0 snap-center flex flex-col items-center justify-between w-[4.5rem] h-24 p-2 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                          isSelected
                            ? 'bg-white/10 border-pink-400/50 shadow-lg translate-y-[-2px]'
                            : 'bg-white/5 border-white/5 text-white/50'
                        }`}
                      >
                        {isSelected && <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent"></div>}
                        <div className="flex flex-col items-center gap-1 z-10">
                          <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? 'text-pink-300' : ''}`}>{data.day}</span>
                          <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                            {data.date.split('月')[1].split(' ')[0].replace('日','')}
                          </span>
                        </div>
                        <div className="flex flex-col items-center z-10">
                          <WeatherIcon type={data.weather.type} className={`w-5 h-5 mb-0.5 ${isSelected ? 'opacity-100' : 'opacity-60 grayscale'}`} />
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Event List Container */}
                <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-t-[2rem] shadow-2xl flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
                      <div className="flex items-center gap-2 mb-8 sticky top-0 bg-[#16171f]/90 backdrop-blur p-3 -mx-3 rounded-xl border border-white/5 z-20">
                        <div className="bg-pink-500 p-1.5 rounded-lg shadow-lg">
                          <Calendar size={16} className="text-white" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white leading-none">{currentDay.date}</h2>
                          <p className="text-xs text-white/50 mt-1">{currentDay.day} • {currentDay.weather.desc}</p>
                        </div>
                      </div>
                      
                      <div className="mt-2 ml-1">
                        {currentDay.events.map((event, idx) => (
                          <EventCard key={idx} event={event} />
                        ))}
                      </div>
                      <div className="mt-12 mb-6 flex flex-col items-center justify-center opacity-20 gap-3">
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                        <div className="w-2 h-2 rounded-full border border-white"></div>
                      </div>
                    </div>
                </div>
             </div>
           )}

           {/* === Packing View === */}
           {activeTab === 'packing' && (
             <div className="flex-1 flex flex-col overflow-hidden animate-fade-in">
                <div className="mb-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg">
                   <div className="flex justify-between items-end mb-2">
                     <div className="flex flex-col">
                        <span className="text-xs text-white/60 uppercase tracking-wider">準備進度</span>
                        <span className="text-2xl font-bold text-white">{progress}%</span>
                     </div>
                     <div className="text-xs text-white/40">
                       {checkedItems} / {totalItems}
                     </div>
                   </div>
                   <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                     <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                     ></div>
                   </div>
                </div>

                <div className="flex-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-t-[2rem] rounded-b-2xl shadow-2xl flex flex-col overflow-hidden">
                   <div className="flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar">
                      <div className="flex justify-end mb-2">
                        <button onClick={resetChecklist} className="text-xs text-white/30 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-white/10">
                          <RotateCcw size={10} /> 重置
                        </button>
                      </div>

                      <div className="space-y-6 pb-8">
                        {packingItems.map((category) => (
                          <div key={category.category}>
                             <h3 className="text-sm font-bold text-pink-200/80 mb-3 px-2 border-l-2 border-pink-500 pl-2">
                               {category.category}
                             </h3>
                             <div className="space-y-2">
                               {category.items.map((item) => (
                                 <div 
                                    key={item.id}
                                    onClick={() => toggleItem(category.category, item.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer active:scale-[0.98] ${
                                      item.checked 
                                        ? 'bg-green-500/10 border-green-500/30' 
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                 >
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                      item.checked ? 'bg-green-500 border-green-500 text-white' : 'border-white/30 text-transparent'
                                    }`}>
                                      <CheckSquare size={12} fill="currentColor" />
                                    </div>
                                    <span className={`text-sm flex-1 ${item.checked ? 'text-white/40 line-through' : 'text-white'}`}>
                                      {item.name}
                                    </span>
                                 </div>
                               ))}
                             </div>
                          </div>
                        ))}
                      </div>
                      <div className="h-4"></div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. Entry Point Logic
// ==========================================

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Default export for safety
export default App;