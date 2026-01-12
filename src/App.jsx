import React, { useState } from 'react';
import { 
  MapPin, 
  Train, 
  Calendar, 
  Sun, 
  CloudRain, 
  Cloud, 
  Clock, 
  Navigation,
  ArrowRight,
  Info,
  Thermometer,
  Signpost,
  Image as ImageIcon,
  ExternalLink,
  Search
} from 'lucide-react';

// --- 模擬數據 (2026年版) ---

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
        remark: "辦理入境手續，領取行李"
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
        image: "https://placehold.co/600x300/e91e63/FFF?text=DARUMA+YARN+TOKYO"
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
        image: "https://placehold.co/600x300/3f51b5/FFF?text=Seiryuji+Temple"
      },
      {
        time: "下午",
        title: "萬年山 法輪寺 (Mannenzan Hourinji)",
        type: "highlight",
        mapQuery: "1 Chome-1-15 Nishiwaseda, Shinjuku City, Tokyo 169-0051, Japan",
        remark: "花手水名所，請保持安靜",
        openingHours: "09:00 - 16:00",
        image: "https://placehold.co/600x300/673ab7/FFF?text=Hourinji+Temple"
      },
      {
        time: "晚間",
        title: "新宿區域",
        type: "activity",
        transportInfo: {
          route: "池袋 (JR 山手線) → 新宿",
          platform: "池袋: 5/6號月台",
          cost: "¥170",
          time: "9 分鐘"
        }
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
        image: "https://placehold.co/600x300/795548/FFF?text=Artek+Tokyo+Store"
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
        image: "https://placehold.co/600x300/212121/FFF?text=Warner+Bros.+Studio+Tour",
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
        image: "https://placehold.co/600x300/f44336/FFF?text=G.Itoya+Ginza"
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
        image: "https://placehold.co/600x300/ff9800/FFF?text=ALMOND+Brulee"
      },
      {
        time: "午後",
        title: "OZEKI 東京營業所",
        type: "highlight",
        mapQuery: "OZEKI Tokyo Showroom Embroidery",
        remark: "刺繡愛好者參觀 (平日開放)",
        openingHours: "09:30 - 17:30",
        image: "https://placehold.co/600x300/009688/FFF?text=OZEKI+Embroidery"
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
        image: "https://placehold.co/600x300/ffcdd2/000?text=Chiikawa+Kawagoe"
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

// --- 組件 ---

const WeatherIcon = ({ type, className }) => {
  switch (type) {
    case 'sunny': return <Sun className={`text-yellow-300 ${className}`} />;
    case 'cloudy': return <Cloud className={`text-gray-200 ${className}`} />;
    case 'rain': return <CloudRain className={`text-blue-300 ${className}`} />;
    default: return <Sun className={`text-yellow-300 ${className}`} />;
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
      
      {/* 乘車月台資訊 */}
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
      {/* Timeline Dot */}
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
        
        {/* Landmark Image with Google Search Link */}
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
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
               <div className="bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                 <Search size={20} className="text-white" />
               </div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 px-2 py-1 rounded text-[10px] text-white/90 backdrop-blur-sm">
                <ExternalLink size={10} />
                <span>Google 圖片搜尋</span>
            </div>
          </a>
        )}

        <div className="flex flex-col gap-1 mt-1">
          {/* Opening Hours Info */}
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
        
        {/* Address & Map Button */}
        {event.mapQuery && (
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.mapQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 w-fit bg-white/5 hover:bg-white/20 transition-all px-3 py-1.5 rounded-full text-xs text-white border border-white/10 hover:border-white/30"
          >
            <MapPin size={12} />
            <span>Google Map 導航</span>
          </a>
        )}

        {/* Transport Logic */}
        {event.transportInfo && <TransportCard info={event.transportInfo} />}
        
        {/* Backup Plan */}
        {event.backup && (
          <div className="mt-2 text-xs text-white/40 italic pl-1 border-l-2 border-white/10">
            備案: {event.backup}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const currentDay = scheduleData[selectedDayIndex];

  return (
    <div className="min-h-screen bg-[#0f1016] text-white font-sans selection:bg-pink-500/30 overflow-hidden relative">
      
      {/* Background Ambience (Enhanced Liquid Effect) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full blur-[120px] mix-blend-screen animate-pulse duration-[5000ms]"></div>
        <div className="absolute bottom-[-10%] right-[-20%] w-[700px] h-[700px] bg-blue-900/30 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000 duration-[7000ms]"></div>
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-pink-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-md mx-auto h-screen flex flex-col">
        
        {/* Header (Simplified) */}
        <header className="pt-8 pb-2 px-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/60 tracking-tight">
            Tokyo Trip
          </h1>
          <p className="text-sm text-white/40 font-medium tracking-widest uppercase mt-1">2026 Winter Itinerary</p>
        </header>

        {/* Date Selector (with Weather) */}
        <div className="px-6 py-4 overflow-x-auto no-scrollbar flex gap-3 snap-x pb-8">
          {scheduleData.map((data, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={index}
                onClick={() => setSelectedDayIndex(index)}
                className={`flex-shrink-0 snap-center flex flex-col items-center justify-between w-[4.5rem] h-24 p-2 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
                  isSelected
                    ? 'bg-white/10 border-pink-400/50 shadow-[0_0_20px_rgba(236,72,153,0.3)] translate-y-[-4px]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-white/50'
                }`}
              >
                {/* Active Indicator Background */}
                {isSelected && <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none"></div>}

                <div className="flex flex-col items-center gap-1 z-10">
                  <span className={`text-[10px] font-bold tracking-wide uppercase ${isSelected ? 'text-pink-300' : ''}`}>{data.day}</span>
                  <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                    {data.date.split('月')[1].split(' ')[0].replace('日','')}
                  </span>
                </div>
                
                {/* Weather on Button */}
                <div className="flex flex-col items-center z-10">
                  <WeatherIcon type={data.weather.type} className={`w-5 h-5 mb-0.5 ${isSelected ? 'opacity-100' : 'opacity-60 grayscale group-hover:grayscale-0 transition-all'}`} />
                  <span className="text-[10px] font-medium">{data.weather.temp}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Main Content Area - Glass Card */}
        <div className="flex-1 px-4 pb-6 overflow-hidden flex flex-col">
          <div className="flex-1 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative">
            
            {/* Glass Reflection Highlight */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
              <div className="flex items-center gap-2 mb-8 ml-1 sticky top-0 bg-[#16171f]/80 backdrop-blur-xl p-2 -ml-3 -mr-3 rounded-xl border border-white/5 z-20">
                <div className="bg-pink-500 p-1.5 rounded-lg shadow-lg shadow-pink-500/20">
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

              {/* End of Day decoration */}
              <div className="mt-12 mb-6 flex flex-col items-center justify-center opacity-20 gap-3">
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
                <div className="w-2 h-2 rounded-full border border-white"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}