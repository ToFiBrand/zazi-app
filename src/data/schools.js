export const SCHOOLS = [
  { id: 'soweto-high', name: 'Soweto High School', province: 'Gauteng', district: 'Johannesburg South' },
  { id: 'khayelitsha-sec', name: 'Khayelitsha Secondary School', province: 'Western Cape', district: 'Metro South' },
  { id: 'umlazi-comm', name: 'Umlazi Comprehensive School', province: 'KwaZulu-Natal', district: 'Umlazi' },
  { id: 'mthatha-high', name: 'Mthatha High School', province: 'Eastern Cape', district: 'OR Tambo' },
  { id: 'polokwane-sec', name: 'Polokwane Secondary School', province: 'Limpopo', district: 'Capricorn' },
  { id: 'mbombela-high', name: 'Mbombela High School', province: 'Mpumalanga', district: 'Ehlanzeni' },
  { id: 'rustenburg-sec', name: 'Rustenburg Secondary School', province: 'North West', district: 'Bojanala' },
  { id: 'bloemfontein-high', name: 'Bloemfontein High School', province: 'Free State', district: 'Mangaung' },
  { id: 'kimberley-sec', name: 'Kimberley Secondary School', province: 'Northern Cape', district: 'Frances Baard' },
]

export const schoolById = (id) => SCHOOLS.find(s => s.id === id)
