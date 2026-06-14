/* ============================================================
   SCARNIKO · DATA LAYER
   Market research + demo accounts (junio 2026)
   ============================================================ */

/* Sectores del radar (categorías mapeadas a ángulos) */
const SECTORS = [
  { key: "mujer",      label: "Mujer" },
  { key: "sneakers",   label: "Sneakers" },
  { key: "street",     label: "Streetwear" },
  { key: "vintage",    label: "Vintage / Y2K" },
  { key: "bolsos",     label: "Bolsos & acc." },
  { key: "hombre",     label: "Hombre" },
  { key: "deporte",    label: "Deporte" },
  { key: "infantil",   label: "Infantil" }
];

/* Marcas: demand 0-100 (cuanto más alto, más cerca del centro del radar),
   trend = variación semanal de búsquedas, heat = temperatura */
const MARKET_BRANDS = [
  { name: "Zara",          sector: "mujer",    demand: 98, trend: +6.4,  heat: "hot",    note: "Nº1 en España, Italia y Francia" },
  { name: "Nike",          sector: "sneakers", demand: 96, trend: +4.1,  heat: "hot",    note: "Air Force 1 y Dunk lideran" },
  { name: "Carhartt",      sector: "street",   demand: 92, trend: +11.8, heat: "hot",    note: "Workwear que vuela en horas" },
  { name: "Levi's",        sector: "vintage",  demand: 90, trend: +2.2,  heat: "hot",    note: "501 vintage, demanda constante" },
  { name: "Adidas",        sector: "sneakers", demand: 88, trend: +3.0,  heat: "hot",    note: "Samba, Gazelle y Spezial" },
  { name: "Stradivarius",  sector: "mujer",    demand: 84, trend: +1.4,  heat: "warm",   note: "Top 3 marcas españolas" },
  { name: "New Balance",   sector: "sneakers", demand: 83, trend: +14.2, heat: "rising", note: "530 y 1906R en plena ola" },
  { name: "Bershka",       sector: "mujer",    demand: 80, trend: -0.8,  heat: "warm",   note: "Volumen alto, precio accesible" },
  { name: "Bimba y Lola",  sector: "bolsos",   demand: 76, trend: +5.1,  heat: "warm",   note: "Bolsos premium, reventa fuerte" },
  { name: "Stüssy",        sector: "street",   demand: 74, trend: +9.7,  heat: "rising", note: "Logo tee = clásico que sube" },
  { name: "Ralph Lauren",  sector: "vintage",  demand: 72, trend: +3.6,  heat: "warm",   note: "Polos y sudaderas vintage" },
  { name: "The North Face",sector: "deporte",  demand: 71, trend: +4.4,  heat: "warm",   note: "Plumíferos Nuptse imbatibles" },
  { name: "Under Armour",  sector: "deporte",  demand: 66, trend: +1.1,  heat: "warm",   note: "Técnica con búsquedas masivas" },
  { name: "Polo Sport",    sector: "vintage",  demand: 64, trend: +12.9, heat: "rising", note: "Y2K deportivo en alza" },
  { name: "Massimo Dutti", sector: "hombre",   demand: 62, trend: +2.0,  heat: "warm",   note: "Calidad/precio en hombre" },
  { name: "Jordan",        sector: "sneakers", demand: 61, trend: +6.8,  heat: "warm",   note: "AJ1 mid, margen alto" },
  { name: "Mango",         sector: "mujer",    demand: 60, trend: -1.2,  heat: "warm",   note: "Básicos y fiesta" },
  { name: "Salomon",       sector: "deporte",  demand: 58, trend: +18.3, heat: "rising", note: "XT-6, la sneaker del momento" },
  { name: "Vans",          sector: "sneakers", demand: 55, trend: -2.4,  heat: "cool",   note: "Old Skool, demanda estable" },
  { name: "Petit Bateau",  sector: "infantil", demand: 52, trend: +3.2,  heat: "warm",   note: "Top en infantil de calidad" },
  { name: "Desigual",      sector: "mujer",    demand: 44, trend: -4.1,  heat: "cool",   note: "A la baja, vender ya" },
  { name: "Tommy Hilfiger",sector: "hombre",   demand: 57, trend: +2.8,  heat: "warm",   note: "Logo clásico, sale solo" }
];

/* Categorías con rotación + tendencia */
const MARKET_CATS = [
  { name: "Ropa de mujer de marca",  pct: 96, trend: +3.1 },
  { name: "Sneakers deportivas",     pct: 91, trend: +7.4 },
  { name: "Streetwear / workwear",   pct: 86, trend: +9.2 },
  { name: "Vintage / estilo Y2K",    pct: 81, trend: +5.6 },
  { name: "Bolsos & accesorios",     pct: 73, trend: +4.0 },
  { name: "Outdoor / técnico",       pct: 69, trend: +12.8 },
  { name: "Ropa de hombre",          pct: 64, trend: +1.7 },
  { name: "Infantil & bebé",         pct: 58, trend: +2.3 },
  { name: "Decoración hogar",        pct: 41, trend: -1.4 }
];

/* Temporadas */
const SEASONS = [
  { m: "Ene–Feb", t: "Rebajas de invierno, básicos, looks San Valentín, ski", icon: "snow" },
  { m: "Mar–Abr", t: "Trenchs, entretiempo, invitada de boda primavera", icon: "spring" },
  { m: "May–Jun", t: "Bañadores, shorts, vestidos de verano, sandalias", icon: "sun" },
  { m: "Jul–Ago", t: "Festivales, playa, Y2K veraniego, gafas de sol", icon: "sun" },
  { m: "Sep–Oct", t: "Jerséis, botas, cazadoras vaqueras, vuelta al cole", icon: "leaf" },
  { m: "Nov–Dic", t: "Abrigos, plumíferos, looks festivos, regalos Navidad", icon: "snow" }
];

const PRICE_TIPS = [
  "Busca prendas similares ya <b>VENDIDAS</b> (filtro de Vinted) para tener un precio real de mercado, no inventado.",
  "Usa precios psicológicos acabados en 5 o 9: <b>19,95 €</b> convierte más que 20 €.",
  "Pon el precio un 10–15 % por encima de tu objetivo para dejar margen de negociación.",
  "Activa <b>“Acepto ofertas”</b>: la mayoría de cierres vienen de quien regatea.",
  "Crea <b>packs por lote</b>: la gente compra varias prendas para ahorrar en envío.",
  "Si una prenda lleva +21 días parada, <b>republica</b> bajando un poco el precio."
];

/* Modelo de demanda por hora para el heatmap del calendario.
   Devuelve matriz 7 días (Lun..Dom) x 17 horas (7..23) con score 0-100 */
function buildHeatMatrix() {
  const days = 7;       // 0=Lun ... 6=Dom
  const hours = 17;     // 7h .. 23h
  const m = [];
  for (let d = 0; d < days; d++) {
    const row = [];
    const isWeekend = d >= 5;
    const isSunday = d === 6;
    for (let h = 0; h < hours; h++) {
      const hour = h + 7;
      let s = 8;
      // pico de mañana camino al trabajo
      if (hour >= 7 && hour <= 9) s += isWeekend ? 14 : 30;
      // mediodía
      if (hour >= 12 && hour <= 14) s += isWeekend ? 30 : 22;
      // tarde
      if (hour >= 16 && hour <= 18) s += 26;
      // pico noche (el oro de Vinted)
      if (hour >= 20 && hour <= 22) s += 52;
      if (hour === 23) s += 22;
      // domingo noche = máximo absoluto
      if (isSunday && hour >= 20 && hour <= 22) s += 24;
      // sábado mañana bueno para hombre
      if (d === 5 && hour >= 10 && hour <= 12) s += 16;
      // ruido sutil
      s += (Math.sin(d * 2.7 + hour * 1.3) * 4);
      row.push(Math.max(0, Math.min(100, Math.round(s))));
    }
    m.push(row);
  }
  return m;
}
const HEAT_MATRIX = buildHeatMatrix();
const HEAT_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const HEAT_HOURS = Array.from({ length: 17 }, (_, i) => i + 7);

/* Franjas destacadas para el planificador */
const BEST_SLOTS = [
  { d: "Domingo",       h: "20:00 – 22:00", note: "El mejor momento global", tag: "TOP" },
  { d: "L–V noche",     h: "20:00 – 23:00", note: "Ideal ropa de mujer", tag: "ALTO" },
  { d: "Sáb mañana",    h: "10:00 – 12:00", note: "Mejor para ropa de hombre", tag: "ALTO" },
  { d: "Mañanas L–V",   h: "07:30 – 09:00", note: "Gente camino al trabajo", tag: "MEDIO" },
  { d: "Viernes tarde", h: "18:00 – 21:00", note: "Pico de sneakers", tag: "ALTO" },
  { d: "Cualquier día", h: "21:30 – 23:00", note: "Infantil (niños dormidos)", tag: "MEDIO" }
];

/* ============================================================
   CUENTAS DEMO (multicuenta) — se siembran en el primer arranque
   ============================================================ */
const DAY = 86400000;
function ago(n) { return Date.now() - n * DAY; }

const SEED_ACCOUNTS = [
  {
    id: "acc_main",
    name: "Scarniko",
    handle: "@scarniko_store",
    color: "teal",
    country: "🇪🇸 España",
    rating: 4.9,
    reviews: 312,
    followers: 1840,
    items: [
      { name: "Sudadera Carhartt WIP", brand: "Carhartt", cat: "Streetwear", cost: 18, price: 64.95, added: ago(2),  sold: false, soldDate: null },
      { name: "Nike Dunk Low Panda",   brand: "Nike",     cat: "Zapatillas", cost: 45, price: 99.0,  added: ago(5),  sold: false, soldDate: null },
      { name: "Vaqueros Levi's 501",   brand: "Levi's",   cat: "Vintage/Y2K",cost: 8,  price: 34.95, added: ago(26), sold: false, soldDate: null },
      { name: "Polo Ralph Lauren",     brand: "Ralph Lauren", cat: "Ropa hombre", cost: 6, price: 27.5, added: ago(11), sold: false, soldDate: null },
      { name: "Bolso Bimba y Lola",    brand: "Bimba y Lola", cat: "Bolsos/Accesorios", cost: 25, price: 79.0, added: ago(40), sold: false, soldDate: null },
      { name: "Adidas Samba OG",       brand: "Adidas",   cat: "Zapatillas", cost: 35, price: 84.95, added: ago(9),  sold: true,  soldDate: ago(3) },
      { name: "Cazadora vaquera Zara", brand: "Zara",     cat: "Ropa mujer", cost: 5,  price: 24.95, added: ago(20), sold: true,  soldDate: ago(8) },
      { name: "Sudadera Nike vintage", brand: "Nike",     cat: "Vintage/Y2K",cost: 7,  price: 39.95, added: ago(33), sold: true,  soldDate: ago(14) }
    ]
  },
  {
    id: "acc_sneak",
    name: "Sneaker Lab",
    handle: "@sneaker_lab_es",
    color: "violet",
    country: "🇪🇸 España",
    rating: 4.8,
    reviews: 196,
    followers: 2630,
    items: [
      { name: "New Balance 530",       brand: "New Balance", cat: "Zapatillas", cost: 55, price: 109.0, added: ago(1),  sold: false, soldDate: null },
      { name: "Salomon XT-6",          brand: "Salomon",  cat: "Zapatillas", cost: 70, price: 149.0, added: ago(3),  sold: false, soldDate: null },
      { name: "Jordan 1 Mid",          brand: "Jordan",   cat: "Zapatillas", cost: 80, price: 159.0, added: ago(7),  sold: false, soldDate: null },
      { name: "Vans Old Skool",        brand: "Vans",     cat: "Zapatillas", cost: 20, price: 39.95, added: ago(28), sold: false, soldDate: null },
      { name: "Nike Air Max 90",       brand: "Nike",     cat: "Zapatillas", cost: 50, price: 95.0,  added: ago(12), sold: true,  soldDate: ago(4) },
      { name: "Adidas Gazelle Bold",   brand: "Adidas",   cat: "Zapatillas", cost: 38, price: 79.95, added: ago(18), sold: true,  soldDate: ago(6) },
      { name: "New Balance 1906R",     brand: "New Balance", cat: "Zapatillas", cost: 90, price: 175.0, added: ago(22), sold: true, soldDate: ago(9) }
    ]
  },
  {
    id: "acc_vint",
    name: "Vintage Drops",
    handle: "@vintage.drops",
    color: "amber",
    country: "🇪🇸 España",
    rating: 4.7,
    reviews: 84,
    followers: 910,
    items: [
      { name: "Chaqueta Polo Sport 90s", brand: "Polo Sport", cat: "Vintage/Y2K", cost: 12, price: 69.0, added: ago(4),  sold: false, soldDate: null },
      { name: "Sudadera Stüssy logo",    brand: "Stüssy",   cat: "Streetwear", cost: 15, price: 54.95, added: ago(6),  sold: false, soldDate: null },
      { name: "Camiseta Harley vintage", brand: "Otro",     cat: "Vintage/Y2K", cost: 4,  price: 44.95, added: ago(30), sold: false, soldDate: null },
      { name: "Plumífero North Face",    brand: "The North Face", cat: "Streetwear", cost: 40, price: 119.0, added: ago(15), sold: false, soldDate: null },
      { name: "Vaqueros Levi's 90s",     brand: "Levi's",   cat: "Vintage/Y2K", cost: 6, price: 39.95, added: ago(45), sold: false, soldDate: null },
      { name: "Polo Ralph vintage",      brand: "Ralph Lauren", cat: "Vintage/Y2K", cost: 5, price: 32.0, added: ago(19), sold: true, soldDate: ago(5) }
    ]
  }
];
