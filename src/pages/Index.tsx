import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";

const CLINIC_IMG = "https://cdn.poehali.dev/projects/2a12294a-315c-43a4-8358-1d053e21c963/files/4c9788f9-f5a4-49f2-bcf0-9b4f716bdcd0.jpg";
const DOCTOR_IMG = "https://cdn.poehali.dev/projects/2a12294a-315c-43a4-8358-1d053e21c963/files/e1a82294-2ee0-4daa-9504-3954baabe342.jpg";
const DIAG_IMG = "https://cdn.poehali.dev/projects/2a12294a-315c-43a4-8358-1d053e21c963/files/5edcd9b0-3400-4fa3-a852-a4e64c41ffed.jpg";

const doctors = [
  { id: 1, name: "Анна Сергеевна Миронова", spec: "Кардиолог", exp: "15 лет", rating: 4.9, reviews: 312, price: 2500, clinic: "МедиКлиник Центр", nearest: "Сегодня, 14:30", avatar: DOCTOR_IMG, tags: ["Взрослые", "Дети от 12"], discount: 20 },
  { id: 2, name: "Дмитрий Алексеевич Воронов", spec: "Невролог", exp: "12 лет", rating: 4.8, reviews: 248, price: 2200, clinic: "МедиКлиник Север", nearest: "Завтра, 10:00", avatar: DOCTOR_IMG, tags: ["Взрослые"], discount: 0 },
  { id: 3, name: "Елена Владимировна Орлова", spec: "Педиатр", exp: "20 лет", rating: 5.0, reviews: 520, price: 1900, clinic: "МедиКлиник Центр", nearest: "Сегодня, 16:00", avatar: DOCTOR_IMG, tags: ["Дети до 18"], discount: 15 },
  { id: 4, name: "Сергей Иванович Зайцев", spec: "Ортопед", exp: "8 лет", rating: 4.7, reviews: 180, price: 2800, clinic: "МедиКлиник Юг", nearest: "Завтра, 12:30", avatar: DOCTOR_IMG, tags: ["Взрослые"], discount: 0 },
];

const clinics = [
  { id: 1, name: "МедиКлиник Центр", address: "ул. Тверская, 15, Москва", metro: "Тверская", rating: 4.9, reviews: 1240, img: CLINIC_IMG, services: 85, doctors: 42, open: "08:00 – 21:00", lat: 55.7651, lon: 37.6061 },
  { id: 2, name: "МедиКлиник Север", address: "пр. Мира, 87, Москва", metro: "Алексеевская", rating: 4.8, reviews: 890, img: CLINIC_IMG, services: 70, doctors: 35, open: "07:00 – 22:00", lat: 55.7985, lon: 37.6353 },
  { id: 3, name: "МедиКлиник Юг", address: "ул. Варшавская, 34, Москва", metro: "Варшавская", rating: 4.7, reviews: 654, img: CLINIC_IMG, services: 60, doctors: 28, open: "09:00 – 20:00", lat: 55.6521, lon: 37.6187 },
];

const services = [
  { id: 1, icon: "Heart", name: "Кардиология", desc: "ЭКГ, УЗИ сердца, мониторинг", price: 1500, discount: 0, color: "from-rose-400 to-pink-500" },
  { id: 2, icon: "Brain", name: "Неврология", desc: "МРТ, ЭЭГ, консультации", price: 1800, discount: 10, color: "from-violet-400 to-purple-500" },
  { id: 3, icon: "Eye", name: "Офтальмология", desc: "Проверка зрения, коррекция", price: 1200, discount: 0, color: "from-sky-400 to-blue-500" },
  { id: 4, icon: "Baby", name: "Педиатрия", desc: "Осмотр детей, вакцинация", price: 1400, discount: 25, color: "from-emerald-400 to-teal-500" },
  { id: 5, icon: "Bone", name: "Ортопедия", desc: "Лечение суставов, позвоночника", price: 2000, discount: 0, color: "from-amber-400 to-orange-500" },
  { id: 6, icon: "Stethoscope", name: "Терапия", desc: "Общий осмотр, лечение ОРВИ", price: 1100, discount: 15, color: "from-cyan-400 to-sky-500" },
];

const diagnostics = [
  { id: 1, name: "МРТ всего тела", desc: "Полная диагностика органов и систем. Результат за 24 часа.", price: 8500, discount: 15, duration: "60 мин", img: DIAG_IMG, badge: "Популярное" },
  { id: 2, name: "УЗИ комплексное", desc: "Органы брюшной полости, малого таза, щитовидная железа.", price: 3200, discount: 0, duration: "40 мин", img: DIAG_IMG, badge: null },
  { id: 3, name: "КТ грудной клетки", desc: "Высокоточная томография лёгких и сердца.", price: 5800, discount: 20, duration: "30 мин", img: DIAG_IMG, badge: "Срочно" },
  { id: 4, name: "Лабораторные анализы", desc: "Клинический, биохимический анализ крови. Онлайн результаты.", price: 850, discount: 0, duration: "15 мин", img: DIAG_IMG, badge: null },
];

const times = ["09:00","09:30","10:00","10:30","11:00","12:00","14:00","14:30","15:00","15:30","16:00","17:00"];

function fmt(n: number) { return n.toLocaleString("ru-RU") + " ₽"; }
function discounted(price: number, pct: number) { return Math.round(price * (1 - pct / 100)); }

function PriceTag({ price, discount, size = "md", prefix = "от " }: { price: number; discount: number; size?: "sm" | "md" | "lg"; prefix?: string }) {
  const finalPrice = discount > 0 ? discounted(price, discount) : price;
  const sz = { sm: { main: "text-xs", old: "text-[10px]", badge: "text-[9px] px-1.5 py-0.5" }, md: { main: "text-sm", old: "text-xs", badge: "text-[10px] px-2 py-0.5" }, lg: { main: "text-lg", old: "text-sm", badge: "text-xs px-2.5 py-1" } }[size];
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {discount > 0 && (
        <span className={`bg-rose-500 text-white font-bold rounded-lg ${sz.badge} leading-none`}>−{discount}%</span>
      )}
      <span className={`font-golos font-bold ${sz.main} text-foreground`}>{prefix}{fmt(finalPrice)}</span>
      {discount > 0 && (
        <span className={`${sz.old} text-muted-foreground line-through`}>{fmt(price)}</span>
      )}
    </div>
  );
}

type Tab = "home" | "doctors" | "clinics" | "services" | "diagnostics" | "doctor" | "clinic" | "booking";
type Doctor = typeof doctors[0];
type Clinic = typeof clinics[0];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(doctors[0]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic>(clinics[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", phone: "", comment: "" });
  const [booked, setBooked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = doctors.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.spec.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goDoctor = (doc: Doctor) => { setSelectedDoctor(doc); setActiveTab("doctor"); };
  const goClinic = (c: Clinic) => { setSelectedClinic(c); setActiveTab("clinic"); };
  const goBooking = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setSelectedTime(null);
    setBookingStep(1);
    setBooked(false);
    setActiveTab("booking");
  };

  const handleBook = () => {
    if (bookingStep === 1 && selectedTime) setBookingStep(2);
    else if (bookingStep === 2 && formData.name && formData.phone) { setBooked(true); setBookingStep(3); }
  };

  const navItems = [
    { id: "home", icon: "Home", label: "Главная" },
    { id: "doctors", icon: "UserRound", label: "Врачи" },
    { id: "clinics", icon: "Building2", label: "Клиники" },
    { id: "services", icon: "Grid3x3", label: "Услуги" },
    { id: "diagnostics", icon: "Microscope", label: "Диагностика" },
  ];

  return (
    <div className="min-h-screen mesh-bg font-rubik">
      {/* Desktop Header */}
      <header className="hidden md:block sticky top-0 z-50 glass-card border-b border-white/40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-10 h-10 grad-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="Cross" size={18} className="text-white" />
            </div>
            <span className="font-golos font-bold text-xl">МедиКлиник</span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? "grad-primary text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/60"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            onClick={() => setActiveTab("doctors")}
            className="grad-primary text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Icon name="CalendarPlus" size={16} />
            Записаться
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 glass-card border-b border-white/40">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-8 h-8 grad-primary rounded-xl flex items-center justify-center">
              <Icon name="Cross" size={14} className="text-white" />
            </div>
            <span className="font-golos font-bold text-base">МедиКлиник</span>
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/60 text-muted-foreground">
            <Icon name="Bell" size={18} />
          </div>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        {/* HOME */}
        {activeTab === "home" && (
          <div>
            {/* Hero */}
            <section className="grad-primary px-4 md:px-12 pt-8 pb-16 md:pt-14 md:pb-24">
              <div className="max-w-7xl mx-auto md:grid md:grid-cols-2 md:gap-12 md:items-center">
                <div className="text-white mb-8 md:mb-0">
                  <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1 mb-4">
                    <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">Свободно для записи прямо сейчас</span>
                  </div>
                  <h1 className="font-golos font-bold text-3xl md:text-5xl leading-tight mb-3">
                    Запишитесь к врачу<br />онлайн за 2 минуты
                  </h1>
                  <p className="text-white/80 text-sm md:text-base mb-6">
                    Более 200 специалистов, 3 клиники в Москве.<br className="hidden md:block" />Выбирайте удобное время и забудьте об очередях.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab("doctors")} className="bg-white text-primary font-semibold px-6 py-3 rounded-2xl text-sm hover:bg-white/90 transition-all shadow-lg">
                      Найти врача
                    </button>
                    <button onClick={() => setActiveTab("services")} className="bg-white/15 text-white font-medium px-6 py-3 rounded-2xl text-sm border border-white/30 hover:bg-white/25 transition-all">
                      Все услуги
                    </button>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img src={CLINIC_IMG} alt="Клиника" className="w-full h-72 object-cover" />
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl">
                    <div className="flex items-center gap-2 mb-0.5">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-xs font-medium text-emerald-600">Онлайн запись</span>
                    </div>
                    <p className="font-golos font-bold text-lg">Сегодня, 14:30</p>
                    <p className="text-muted-foreground text-xs">4 свободных слота</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <div className="max-w-7xl mx-auto px-4 md:px-12">
              <div className="bg-white rounded-3xl shadow-xl -mt-8 md:-mt-10 p-4 md:p-6 grid grid-cols-3 gap-2 md:gap-6">
                {[
                  { icon: "UserRound", value: "200+", label: "Врачей", color: "text-blue-500" },
                  { icon: "Star", value: "4.9", label: "Рейтинг", color: "text-amber-500" },
                  { icon: "CalendarCheck", value: "50K+", label: "Записей", color: "text-emerald-500" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <Icon name={s.icon as never} size={20} className={`${s.color} mx-auto mb-1`} />
                    <p className="font-golos font-bold text-xl md:text-2xl">{s.value}</p>
                    <p className="text-muted-foreground text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 py-6 md:py-10">
              <h2 className="font-golos font-bold text-lg md:text-xl mb-4">Быстрый доступ</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { icon: "UserRound", label: "Запись к врачу", sub: "Выбрать специалиста", tab: "doctors", color: "from-cyan-400 to-blue-500" },
                  { icon: "Microscope", label: "Диагностика", sub: "МРТ, УЗИ, КТ", tab: "diagnostics", color: "from-violet-400 to-purple-500" },
                  { icon: "TestTube", label: "Анализы", sub: "Лаборатория", tab: "services", color: "from-emerald-400 to-teal-500" },
                  { icon: "Building2", label: "Клиники", sub: "3 адреса", tab: "clinics", color: "from-rose-400 to-pink-500" },
                ].map((item, i) => (
                  <button key={i} onClick={() => setActiveTab(item.tab as Tab)} className="bg-white rounded-3xl p-4 text-left card-hover shadow-sm border border-border/50">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                      <Icon name={item.icon as never} size={20} className="text-white" />
                    </div>
                    <p className="font-golos font-semibold text-sm">{item.label}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{item.sub}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Doctors preview */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 pb-6 md:pb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-golos font-bold text-lg md:text-xl">Популярные врачи</h2>
                <button onClick={() => setActiveTab("doctors")} className="text-primary text-sm font-medium flex items-center gap-1">
                  Все <Icon name="ChevronRight" size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.slice(0, 2).map((doc, i) => (
                  <DoctorCard key={doc.id} doc={doc} index={i} onSelect={() => goDoctor(doc)} onBook={() => goBooking(doc)} />
                ))}
              </div>
            </section>

            {/* Clinics preview */}
            <section className="max-w-7xl mx-auto px-4 md:px-12 pb-8 md:pb-14">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-golos font-bold text-lg md:text-xl">Наши клиники</h2>
                <button onClick={() => setActiveTab("clinics")} className="text-primary text-sm font-medium flex items-center gap-1">
                  Все <Icon name="ChevronRight" size={16} />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto scroll-hide pb-2">
                {clinics.map((c, i) => (
                  <div
                    key={c.id}
                    onClick={() => goClinic(c)}
                    className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden cursor-pointer card-hover w-72 shrink-0 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <p className="absolute bottom-3 left-3 font-golos font-bold text-sm text-white">{c.name}</p>
                      <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Icon name="Star" size={10} className="text-amber-400 fill-amber-400" />{c.rating}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <Icon name="MapPin" size={12} /><p className="text-xs">м. {c.metro}</p>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{c.doctors} врачей</span>
                        <span className="text-emerald-600 font-medium">{c.open}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* DOCTORS LIST */}
        {activeTab === "doctors" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="mb-5">
              <h1 className="font-golos font-bold text-2xl md:text-3xl mb-1">Наши специалисты</h1>
              <p className="text-muted-foreground text-sm">Найдите подходящего врача</p>
            </div>
            <div className="relative mb-4">
              <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Врач или специальность..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
              />
            </div>
            <div className="flex gap-2 mb-5 overflow-x-auto scroll-hide">
              {["Все", "Терапевт", "Кардиолог", "Невролог", "Педиатр", "Ортопед"].map(s => (
                <button key={s} className="shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border border-border bg-white hover:border-primary hover:text-primary transition-all">
                  {s}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDoctors.map((doc, i) => (
                <DoctorCard key={doc.id} doc={doc} index={i} onSelect={() => goDoctor(doc)} onBook={() => goBooking(doc)} />
              ))}
            </div>
          </div>
        )}

        {/* CLINICS LIST */}
        {activeTab === "clinics" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="mb-5">
              <h1 className="font-golos font-bold text-2xl md:text-3xl mb-1">Клиники</h1>
              <p className="text-muted-foreground text-sm">{clinics.length} клиники в Москве</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {clinics.map((clinic, i) => (
                <div
                  key={clinic.id}
                  onClick={() => goClinic(clinic)}
                  className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden cursor-pointer card-hover animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative h-44 overflow-hidden">
                    <img src={clinic.img} alt={clinic.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <p className="absolute bottom-3 left-3 font-golos font-bold text-base text-white">{clinic.name}</p>
                    <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Icon name="Star" size={11} className="text-amber-400 fill-amber-400" />{clinic.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                      <Icon name="MapPin" size={13} /><p className="text-xs">{clinic.address}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted/40 rounded-xl p-2">
                        <p className="font-golos font-bold text-sm">{clinic.doctors}</p>
                        <p className="text-muted-foreground text-[10px]">врачей</p>
                      </div>
                      <div className="bg-muted/40 rounded-xl p-2">
                        <p className="font-golos font-bold text-sm">{clinic.services}</p>
                        <p className="text-muted-foreground text-[10px]">услуг</p>
                      </div>
                      <div className="bg-muted/40 rounded-xl p-2">
                        <p className="font-golos font-bold text-sm text-emerald-600 text-[10px] leading-tight">{clinic.open}</p>
                        <p className="text-muted-foreground text-[10px]">режим</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="mb-5">
              <h1 className="font-golos font-bold text-2xl md:text-3xl mb-1">Медицинские услуги</h1>
              <p className="text-muted-foreground text-sm">Полный спектр медицинской помощи</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {services.map((s, i) => (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl p-4 shadow-sm border border-border/50 card-hover cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                    <Icon name={s.icon as never} size={22} className="text-white" fallback="Stethoscope" />
                  </div>
                  <h3 className="font-golos font-semibold text-sm mb-1">{s.name}</h3>
                  <p className="text-muted-foreground text-xs mb-3 leading-relaxed">{s.desc}</p>
                  <PriceTag price={s.price} discount={s.discount} size="sm" />
                </div>
              ))}
            </div>
            <div className="rounded-3xl grad-primary p-6 md:p-8 text-white">
              <h2 className="font-golos font-bold text-xl md:text-2xl mb-2">Комплексная программа здоровья</h2>
              <p className="text-white/80 text-sm mb-4">Полное обследование организма со скидкой 30% — 12 специалистов и лабораторные анализы</p>
              <button className="bg-white text-primary font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-all">
                Узнать подробнее
              </button>
            </div>
          </div>
        )}

        {/* DIAGNOSTICS */}
        {activeTab === "diagnostics" && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="mb-5">
              <h1 className="font-golos font-bold text-2xl md:text-3xl mb-1">Диагностика</h1>
              <p className="text-muted-foreground text-sm">Современное оборудование, точные результаты</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {diagnostics.map((d, i) => (
                <div
                  key={d.id}
                  className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden card-hover animate-fade-in"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex gap-4 p-4">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                      {d.badge && (
                        <div className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${d.badge === "Срочно" ? "bg-rose-500" : "bg-primary"}`}>
                          {d.badge}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-golos font-semibold text-sm mb-1">{d.name}</h3>
                      <p className="text-muted-foreground text-xs leading-relaxed mb-3">{d.desc}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <PriceTag price={d.price} discount={d.discount} size="md" />
                          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
                            <Icon name="Clock" size={11} />{d.duration}
                          </div>
                        </div>
                        <button className="grad-primary text-white text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all">
                          Записаться
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCTOR PAGE */}
        {activeTab === "doctor" && (
          <DoctorPage doctor={selectedDoctor} onBack={() => setActiveTab("doctors")} onBook={() => goBooking(selectedDoctor)} />
        )}

        {/* CLINIC PAGE */}
        {activeTab === "clinic" && (
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
            <button onClick={() => setActiveTab("clinics")} className="flex items-center gap-2 text-sm text-muted-foreground mb-5 hover:text-foreground transition-colors">
              <Icon name="ChevronLeft" size={18} />Назад к списку
            </button>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-5">
              <div className="h-52 md:h-64 relative overflow-hidden">
                <img src={selectedClinic.img} alt={selectedClinic.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="font-golos font-bold text-xl md:text-2xl">{selectedClinic.name}</h1>
                </div>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { icon: "Star", value: selectedClinic.rating, label: "Рейтинг" },
                    { icon: "UserRound", value: selectedClinic.doctors, label: "Врачей" },
                    { icon: "Stethoscope", value: selectedClinic.services, label: "Услуг" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-muted/40 rounded-2xl p-3 text-center">
                      <Icon name={stat.icon as never} size={18} className="text-primary mx-auto mb-1" />
                      <p className="font-golos font-bold text-base">{stat.value}</p>
                      <p className="text-muted-foreground text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    { icon: "MapPin", main: selectedClinic.address, sub: `Метро ${selectedClinic.metro}` },
                    { icon: "Clock", main: `Режим работы: ${selectedClinic.open}`, sub: null },
                    { icon: "Phone", main: "+7 (495) 123-45-67", sub: null },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Icon name={item.icon as never} size={16} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">{item.main}</p>
                        {item.sub && <p className="text-xs text-muted-foreground">{item.sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full grad-primary text-white font-semibold py-3.5 rounded-2xl text-sm hover:opacity-90 transition-all shadow-lg">
                  Записаться в эту клинику
                </button>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-sm p-5">
              <h3 className="font-golos font-semibold text-base mb-4">Специалисты клиники</h3>
              <div className="space-y-3">
                {doctors.slice(0, 3).map(doc => (
                  <button key={doc.id} onClick={() => goDoctor(doc)} className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-muted/40 transition-colors text-left">
                    <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-2xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.name}</p>
                      <p className="text-muted-foreground text-xs">{doc.spec}</p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BOOKING */}
        {activeTab === "booking" && (
          <div className="max-w-lg mx-auto px-4 md:px-6 py-6 animate-fade-in">
            <button onClick={() => setActiveTab("doctor")} className="flex items-center gap-2 text-sm text-muted-foreground mb-5 hover:text-foreground transition-colors">
              <Icon name="ChevronLeft" size={18} />Назад
            </button>

            {!booked ? (
              <>
                <div className="bg-white rounded-3xl p-4 mb-5 flex items-center gap-3 shadow-sm">
                  <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <p className="font-golos font-semibold text-sm">{selectedDoctor.name}</p>
                    <p className="text-muted-foreground text-xs">{selectedDoctor.spec}</p>
                    <p className="text-primary font-medium text-xs mt-0.5">{selectedDoctor.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  {[1, 2].map(s => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${bookingStep >= s ? "grad-primary text-white" : "bg-muted text-muted-foreground"}`}>{s}</div>
                      <span className={`text-xs ${bookingStep >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                        {s === 1 ? "Время" : "Данные"}
                      </span>
                      {s < 2 && <div className={`w-8 h-0.5 rounded ${bookingStep > s ? "bg-primary" : "bg-border"}`} />}
                    </div>
                  ))}
                </div>

                {bookingStep === 1 && (
                  <div>
                    <h2 className="font-golos font-bold text-lg mb-4">Выберите дату и время</h2>
                    <div className="flex gap-2 mb-5 overflow-x-auto scroll-hide">
                      {["Сег, 30 апр", "Зав, 1 мая", "2 мая", "3 мая", "5 мая"].map((d, i) => (
                        <button key={d} className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-medium border transition-all ${i === 0 ? "grad-primary text-white border-transparent" : "bg-white border-border hover:border-primary"}`}>
                          {d}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-6">
                      {times.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedTime(t)}
                          className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${selectedTime === t ? "grad-primary text-white border-transparent shadow-md" : "bg-white border-border hover:border-primary hover:text-primary"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleBook}
                      disabled={!selectedTime}
                      className="w-full grad-primary text-white font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg"
                    >
                      Продолжить
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div>
                    <h2 className="font-golos font-bold text-lg mb-4">Ваши данные</h2>
                    <div className="bg-primary/8 rounded-2xl p-3 mb-5 flex items-center gap-3">
                      <Icon name="Clock" size={16} className="text-primary" />
                      <p className="text-sm font-medium">Сегодня, {selectedTime}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Ваше имя *</label>
                        <input type="text" placeholder="Иван Иванов" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Телефон *</label>
                        <input type="tel" placeholder="+7 (999) 000-00-00" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Комментарий</label>
                        <textarea placeholder="Опишите ваши жалобы..." value={formData.comment} onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                      </div>
                    </div>
                    <button onClick={handleBook} disabled={!formData.name || !formData.phone} className="w-full grad-primary text-white font-semibold py-3.5 rounded-2xl text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all shadow-lg">
                      Подтвердить запись
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 grad-teal rounded-full flex items-center justify-center mx-auto mb-5 shadow-xl animate-pulse-ring">
                  <Icon name="CheckCheck" size={36} className="text-white" />
                </div>
                <h2 className="font-golos font-bold text-2xl mb-2">Вы записаны!</h2>
                <p className="text-muted-foreground text-sm mb-1">{selectedDoctor.name}</p>
                <p className="font-medium text-primary mb-6">Сегодня, {selectedTime}</p>
                <div className="bg-white rounded-3xl p-5 text-left mb-6 shadow-sm">
                  <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Детали записи</p>
                  <div className="space-y-2.5">
                    {[
                      { icon: "UserRound", label: "Пациент", value: formData.name },
                      { icon: "Phone", label: "Телефон", value: formData.phone },
                      { icon: "Building2", label: "Клиника", value: selectedDoctor.clinic },
                      { icon: "Bell", label: "Уведомление", value: "За 1 час до приёма" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Icon name={item.icon as never} size={15} className="text-primary shrink-0" />
                        <span className="text-muted-foreground text-xs w-24">{item.label}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setActiveTab("home")} className="w-full grad-primary text-white font-semibold py-3.5 rounded-2xl text-sm hover:opacity-90 transition-all shadow-lg">
                  На главную
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-white/40 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`mobile-nav-item ${activeTab === item.id ? "active" : "text-muted-foreground"}`}
            >
              <Icon name={item.icon as never} size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

const DAY_NAMES = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTH_NAMES = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const ALL_SLOTS = ["09:00","09:30","10:00","10:30","11:00","12:00","13:00","14:00","14:30","15:00","15:30","16:00","17:00","18:00"];

function seededRand(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function generateClinicSlots(clinicId: number): { dayNum: number; dayName: string; monthName: string; dayDate: Date; slots: string[] }[] {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const rand = seededRand(clinicId * 100 + i * 7 + d.getDate());
    const slots = ALL_SLOTS.filter(() => rand() > 0.5).slice(0, 5 + Math.floor(rand() * 4));
    days.push({ dayDate: d, dayNum: d.getDate(), dayName: i === 0 ? "Сег" : i === 1 ? "Зав" : DAY_NAMES[d.getDay()], monthName: MONTH_NAMES[d.getMonth()], slots });
  }
  return days;
}

const CLINIC_SLOTS: Record<number, ReturnType<typeof generateClinicSlots>> = Object.fromEntries(
  clinics.map(c => [c.id, generateClinicSlots(c.id)])
);

const DAYS_META = Array.from({ length: 14 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return { dayNum: d.getDate(), dayName: i === 0 ? "Сег" : i === 1 ? "Зав" : DAY_NAMES[d.getDay()], monthName: MONTH_NAMES[d.getMonth()] };
});

type DoctorType = typeof doctors[0];
function DoctorCard({ doc, index, onSelect, onBook }: { doc: DoctorType; index: number; onSelect: () => void; onBook: () => void }) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [mapClinicId, setMapClinicId] = useState<number | null>(null);
  const daysRef = useRef<HTMLDivElement>(null);

  const scrollDays = (dir: "left" | "right") => {
    if (daysRef.current) daysRef.current.scrollBy({ left: dir === "left" ? -100 : 100, behavior: "smooth" });
  };

  const clinicsWithSlots = clinics.map(c => ({
    ...c,
    slots: CLINIC_SLOTS[c.id]?.[selectedDayIdx]?.slots ?? [],
  })).filter(c => c.slots.length > 0);

  const mapClinic = clinics.find(c => c.id === mapClinicId);

  return (
    <div
      className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Top info */}
      <div className="flex gap-3 p-4 pb-3">
        <img src={doc.avatar} alt={doc.name} className="w-[58px] h-[68px] rounded-2xl object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <button onClick={onSelect} className="text-left w-full">
            <p className="font-golos font-semibold text-sm leading-snug hover:text-primary transition-colors">{doc.name}</p>
          </button>
          <p className="text-primary text-xs font-medium mt-0.5">{doc.spec} · {doc.exp}</p>
          <div className="flex items-center gap-1 mt-1">
            <Icon name="Star" size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold">{doc.rating}</span>
            <span className="text-muted-foreground text-xs">({doc.reviews})</span>
          </div>
          <div className="mt-1.5">
            <PriceTag price={doc.price} discount={doc.discount} size="sm" />
          </div>
        </div>
      </div>

      {/* Day picker */}
      <div className="px-4 pb-3 border-t border-border/30 pt-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Выберите день</p>
        <div className="flex items-center gap-1.5">
          <button onClick={() => scrollDays("left")} className="w-6 h-6 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors shrink-0">
            <Icon name="ChevronLeft" size={13} />
          </button>
          <div ref={daysRef} className="flex gap-1.5 overflow-x-auto scroll-hide flex-1">
            {DAYS_META.map((day, i) => {
              const hasAny = clinics.some(c => (CLINIC_SLOTS[c.id]?.[i]?.slots?.length ?? 0) > 0);
              return (
                <button
                  key={i}
                  onClick={() => { setSelectedDayIdx(i); setSelectedClinicId(null); setSelectedSlot(null); }}
                  disabled={!hasAny}
                  className={`shrink-0 w-[44px] flex flex-col items-center py-2 rounded-2xl border transition-all duration-200 ${
                    selectedDayIdx === i
                      ? "grad-primary text-white border-transparent shadow-md scale-105"
                      : !hasAny
                      ? "bg-muted/20 border-border/20 opacity-40 cursor-not-allowed"
                      : "bg-white border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className={`text-[9px] font-medium leading-none mb-0.5 ${selectedDayIdx === i ? "text-white/70" : "text-muted-foreground"}`}>{day.dayName}</span>
                  <span className={`text-sm font-golos font-bold leading-none ${selectedDayIdx === i ? "text-white" : "text-foreground"}`}>{day.dayNum}</span>
                  <span className={`text-[9px] leading-none mt-0.5 ${selectedDayIdx === i ? "text-white/60" : "text-muted-foreground"}`}>{day.monthName}</span>
                  {hasAny && <div className={`w-1 h-1 rounded-full mt-1 ${selectedDayIdx === i ? "bg-white/60" : "bg-emerald-400"}`} />}
                </button>
              );
            })}
          </div>
          <button onClick={() => scrollDays("right")} className="w-6 h-6 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-muted transition-colors shrink-0">
            <Icon name="ChevronRight" size={13} />
          </button>
        </div>
      </div>

      {/* Clinics with slots */}
      <div className="px-4 pb-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Клиники и свободные слоты</p>
        {clinicsWithSlots.length === 0 ? (
          <p className="text-muted-foreground text-xs py-2 text-center">Нет свободных слотов на этот день</p>
        ) : (
          <div className="flex flex-col gap-2">
            {clinicsWithSlots.map(c => {
              const isActive = selectedClinicId === c.id;
              return (
                <div key={c.id} className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isActive ? "border-primary/50 bg-primary/3" : "border-border/50 bg-muted/20"}`}>
                  {/* Clinic header */}
                  <button
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                    onClick={() => {
                      setSelectedClinicId(isActive ? null : c.id);
                      setSelectedSlot(null);
                      setMapClinicId(prev => prev === c.id ? prev : null);
                    }}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? "grad-primary text-white" : "bg-muted text-muted-foreground"}`}>
                      <Icon name="Building2" size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-none">{c.name}</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">м. {c.metro} · {c.open}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-600 text-[10px] font-medium bg-emerald-50 px-2 py-0.5 rounded-full">{c.slots.length} слотов</span>
                      <button
                        onClick={e => { e.stopPropagation(); setMapClinicId(prev => prev === c.id ? null : c.id); }}
                        className={`w-6 h-6 flex items-center justify-center rounded-lg transition-colors ${mapClinicId === c.id ? "bg-primary text-white" : "bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary"}`}
                        title="На карте"
                      >
                        <Icon name="MapPin" size={11} />
                      </button>
                      <Icon name={isActive ? "ChevronUp" : "ChevronDown"} size={13} className="text-muted-foreground" />
                    </div>
                  </button>

                  {/* Yandex map */}
                  {mapClinicId === c.id && (
                    <div className="mx-3 mb-2 rounded-xl overflow-hidden border border-border/40 animate-fade-in">
                      <iframe
                        src={`https://maps.yandex.ru/?ll=${c.lon}%2C${c.lat}&z=15&l=map&pt=${c.lon}%2C${c.lat},pm2rdm~${c.lon}%2C${c.lat},pm2rdl&text=${encodeURIComponent(c.address)}&mode=whatshere`}
                        width="100%"
                        height="160"
                        frameBorder="0"
                        style={{ display: "block" }}
                        title={c.name}
                        allowFullScreen
                      />
                      <div className="flex items-center gap-1.5 px-3 py-2 bg-white/80">
                        <Icon name="MapPin" size={12} className="text-primary shrink-0" />
                        <span className="text-xs text-muted-foreground truncate">{c.address}</span>
                        <a
                          href={`https://maps.yandex.ru/?text=${encodeURIComponent(c.address)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-auto text-[10px] text-primary font-medium shrink-0 hover:underline"
                        >
                          Открыть
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Time slots */}
                  {isActive && (
                    <div className="px-3 pb-3 pt-1 flex flex-wrap gap-1.5 animate-fade-in">
                      {c.slots.map(t => (
                        <button
                          key={t}
                          onClick={() => setSelectedSlot(s => s === t ? null : t)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold border transition-all duration-150 ${
                            selectedSlot === t
                              ? "grad-primary text-white border-transparent shadow-sm scale-105"
                              : "bg-white border-border hover:border-primary hover:text-primary"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-4 pt-2 border-t border-border/40 flex items-center gap-2">
        <div className="flex gap-1.5 flex-wrap flex-1">
          {doc.tags.map((t: string) => (
            <span key={t} className="px-2 py-0.5 rounded-full bg-blue-50 text-primary text-[10px] font-medium">{t}</span>
          ))}
        </div>
        <button
          onClick={() => selectedSlot ? onBook() : onSelect()}
          className={`shrink-0 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm ${
            selectedSlot
              ? "grad-primary text-white hover:opacity-90"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {selectedSlot ? "Записаться" : "Смотреть"}
        </button>
      </div>
    </div>
  );
}

function DoctorPage({ doctor, onBack, onBook }: { doctor: typeof doctors[0]; onBack: () => void; onBook: () => void }) {
  const [pageClinicId, setPageClinicId] = useState<number | null>(null);
  const [pageDayIdx, setPageDayIdx] = useState(0);
  const [pageSlot, setPageSlot] = useState<string | null>(null);
  const [pageClinicOpen, setPageClinicOpen] = useState(false);
  const pageDaysRef = useRef<HTMLDivElement>(null);

  const currentDay = DAYS_DATA[pageDayIdx];
  const pageClinicObj = clinics.find(c => c.id === pageClinicId);

  const scrollPageDays = (dir: "left" | "right") => {
    if (pageDaysRef.current) pageDaysRef.current.scrollBy({ left: dir === "left" ? -120 : 120, behavior: "smooth" });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground mb-5 hover:text-foreground transition-colors">
        <Icon name="ChevronLeft" size={18} />Назад к списку
      </button>

      {/* Hero */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-4">
        <div className="h-52 md:h-64 relative overflow-hidden">
          <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h1 className="font-golos font-bold text-xl md:text-2xl">{doctor.name}</h1>
            <p className="text-white/80 text-sm">{doctor.spec} · {doctor.exp} опыта</p>
          </div>
          {doctor.discount > 0 && (
            <div className="absolute top-4 right-4 bg-rose-500 text-white font-bold text-sm px-3 py-1.5 rounded-2xl shadow-lg">
              −{doctor.discount}%
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Icon name="Star" size={15} className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-sm">{doctor.rating}</span>
              <span className="text-muted-foreground text-xs">({doctor.reviews} отзывов)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {doctor.tags.map(t => (
                <span key={t} className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{t}</span>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Высококвалифицированный специалист с многолетним опытом. Специализируется на диагностике и лечении широкого спектра заболеваний. Применяет современные методы, придерживается принципов доказательной медицины.
          </p>
          <div className="flex items-center justify-between py-3 border-t border-border">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Стоимость приёма</p>
              <PriceTag price={doctor.price} discount={doctor.discount} size="lg" />
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs mb-0.5">Ближайшая запись</p>
              <p className="font-medium text-sm text-emerald-600">{doctor.nearest}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking block */}
      <div className="bg-white rounded-3xl shadow-sm border border-border/50 overflow-hidden mb-4">
        <div className="px-5 pt-5 pb-4">
          <h3 className="font-golos font-semibold text-base mb-3">Выбрать время приёма</h3>

          {/* Clinic */}
          <div className="relative mb-4">
            <p className="text-xs text-muted-foreground font-medium mb-1.5">Клиника</p>
            <button
              onClick={() => setPageClinicOpen(o => !o)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${pageClinicOpen ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/40"}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon name="Building2" size={16} className="text-primary shrink-0" />
                <span className="truncate">{pageClinicObj ? pageClinicObj.name : "Выберите клинику"}</span>
              </div>
              <Icon name={pageClinicOpen ? "ChevronUp" : "ChevronDown"} size={16} className="text-muted-foreground shrink-0 ml-2" />
            </button>
            {pageClinicOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-border z-20 overflow-hidden animate-scale-in">
                {clinics.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setPageClinicId(c.id); setPageClinicOpen(false); setPageSlot(null); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/30 last:border-0 ${pageClinicId === c.id ? "bg-primary/5" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${pageClinicId === c.id ? "bg-primary text-white" : "bg-muted"}`}>
                      <Icon name="Building2" size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{c.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5 truncate">м. {c.metro} · {c.address}</p>
                      <p className="text-emerald-600 text-[11px] mt-0.5">{c.open}</p>
                    </div>
                    {pageClinicId === c.id && <Icon name="Check" size={16} className="text-primary shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Days */}
          <p className="text-xs text-muted-foreground font-medium mb-1.5">Выберите день</p>
          <div className="flex items-center gap-1.5 mb-3">
            <button onClick={() => scrollPageDays("left")} className="w-7 h-7 flex items-center justify-center rounded-xl bg-muted/60 hover:bg-muted transition-colors shrink-0">
              <Icon name="ChevronLeft" size={14} />
            </button>
            <div ref={pageDaysRef} className="flex gap-2 overflow-x-auto scroll-hide flex-1 py-1">
              {DAYS_DATA.map((day, i) => (
                <button
                  key={i}
                  onClick={() => { setPageDayIdx(i); setPageSlot(null); }}
                  disabled={day.slots.length === 0}
                  className={`shrink-0 w-[52px] flex flex-col items-center py-2.5 rounded-2xl border transition-all duration-200 ${
                    pageDayIdx === i
                      ? "grad-primary text-white border-transparent shadow-md scale-105"
                      : day.slots.length === 0
                      ? "bg-muted/30 border-border/30 opacity-40 cursor-not-allowed"
                      : "bg-white border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                >
                  <span className={`text-[10px] font-medium mb-0.5 ${pageDayIdx === i ? "text-white/70" : "text-muted-foreground"}`}>{day.dayName}</span>
                  <span className={`text-base font-golos font-bold leading-none ${pageDayIdx === i ? "text-white" : "text-foreground"}`}>{day.dayNum}</span>
                  <span className={`text-[10px] mt-0.5 ${pageDayIdx === i ? "text-white/60" : "text-muted-foreground"}`}>{day.monthName}</span>
                  {day.slots.length > 0 && (
                    <div className={`w-1 h-1 rounded-full mt-1 ${pageDayIdx === i ? "bg-white/60" : "bg-emerald-400"}`} />
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => scrollPageDays("right")} className="w-7 h-7 flex items-center justify-center rounded-xl bg-muted/60 hover:bg-muted transition-colors shrink-0">
              <Icon name="ChevronRight" size={14} />
            </button>
          </div>

          {/* Time slots */}
          <p className="text-xs text-muted-foreground font-medium mb-2">Свободные слоты</p>
          {currentDay.slots.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentDay.slots.map(t => (
                <button
                  key={t}
                  onClick={() => setPageSlot(s => s === t ? null : t)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                    pageSlot === t
                      ? "grad-primary text-white border-transparent shadow-sm"
                      : "bg-white border-border hover:border-primary hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 py-3 text-muted-foreground text-sm">
              <Icon name="CalendarX" size={16} />Нет свободных слотов на этот день
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={onBook}
            disabled={!pageSlot}
            className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-lg mt-2 ${
              pageSlot ? "grad-primary text-white hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {pageSlot ? `Записаться на ${currentDay.dayName} ${currentDay.dayNum} в ${pageSlot}` : "Выберите время"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-3xl shadow-sm p-5">
        <h3 className="font-golos font-semibold text-base mb-4">Отзывы пациентов</h3>
        {[
          { name: "Мария К.", text: "Отличный специалист, внимательный и профессиональный подход!", date: "2 дня назад" },
          { name: "Андрей В.", text: "Быстро поставил диагноз, назначил эффективное лечение. Рекомендую!", date: "1 неделю назад" },
        ].map((r, i) => (
          <div key={i} className={`pb-4 ${i < 1 ? "border-b border-border mb-4" : ""}`}>
            <div className="flex justify-between mb-1.5">
              <span className="font-medium text-sm">{r.name}</span>
              <span className="text-muted-foreground text-xs">{r.date}</span>
            </div>
            <div className="flex gap-0.5 mb-1.5">
              {[...Array(5)].map((_, j) => <Icon key={j} name="Star" size={12} className="text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}