export type Sector = "Residential" | "Commercial" | "Hospitality" | "Infrastructure" | "Industrial" | "Government and Education";
export type Scope = "Design" | "Supply" | "Installation";
export interface Project {
  year: number;
  title: string;
  sector: Sector;
  scope: Scope[];
}
export const SECTORS: Sector[] = ["Residential", "Commercial", "Hospitality", "Infrastructure", "Industrial", "Government and Education"];

const P = (year: number, title: string, sector: Sector): Project => {
  const t = title.toLowerCase();
  const scope: Scope[] = [];
  if (t.includes("design")) scope.push("Design");
  if (t.includes("supply") || t.includes("fabrication")) scope.push("Supply");
  if (t.includes("install")) scope.push("Installation");
  return { year, title, sector, scope };
};

export const PROJECTS: Project[] = [
  P(2015, "Design & supply of interior and landscape lighting, six luxury villas, Al Mesilla", "Residential"),
  P(2015, "Supply and installation of interior and exterior lighting, airport restaurant, Doha", "Hospitality"),
  P(2015, "Supply of outdoor lighting for private engineering office projects", "Commercial"),
  P(2015, "Supply of outdoor lighting, Pearl Qatar Porto Arabia Tower", "Residential"),
  P(2015, "Supply of interior lighting, Al Kafooth villa", "Residential"),
  P(2016, "Design & supply of interior lighting, 23 Royal Oman Police officers club houses", "Government and Education"),
  P(2016, "Design & supply of landscape lighting, 23 (G+1+P) villa compound plus club house and pool", "Residential"),
  P(2016, "Design & supply of landscape lighting, 25 (G+1) villa compound plus club house", "Residential"),
  P(2016, "Supply of landscape lighting, Y Building XII, Al Saad", "Commercial"),
  P(2016, "Supply & installation of landscape lighting, IB Palace at Ain Khaled", "Residential"),
  P(2016, "Supply of lighting systems for Mother Villa, Fanar Fayrous, Plot No. 20", "Residential"),
  P(2017, "Design & supply of interior lighting, Oman Convention & Exhibition Centre, Crown Plaza", "Hospitality"),
  P(2017, "Design & supply of interior lighting, external accommodation building at Qatar Naval Base", "Government and Education"),
  P(2017, "Design, supply and installation of fibre optic lighting system, Al Khor Farm Villa", "Residential"),
  P(2017, "Design, supply and installation of landscape & interior lighting, G+1+P palace building at Al Shakhama", "Residential"),
  P(2017, "Design, supply & installation of Al Wesaya Tower facade lighting", "Commercial"),
  P(2017, "Design & supply of interior lighting, G+1+P private villa, La Plage Villa East Plot No. 18", "Residential"),
  P(2017, "Supply of light fittings, Al Atiyah farm house at Simay Simah", "Residential"),
  P(2018, "Bin Dirham 5 lighting, Al Mansoura, Doha", "Commercial"),
  P(2018, "Supply and installation of light fittings, Wa Baharta 128 13, Pearl Qatar", "Residential"),
  P(2018, "Supply of light fittings, Ford truck garage, Al Mana Group industrial area", "Industrial"),
  P(2018, "Supply of light fittings, OWO Cinema, Muscat, Oman", "Commercial"),
  P(2018, "Design and supply of landscape lighting, IB Palace", "Residential"),
  P(2018, "Design and installation of LED screen", "Commercial"),
  P(2019, "Design & supply of outdoor lighting, G+P private villa, La Plage Villa East Plot No. 18", "Residential"),
  P(2019, "Installation of LED strip light, Manai Corporation car shed", "Commercial"),
  P(2019, "Supply of light fittings, GWC warehouse", "Industrial"),
  P(2019, "High bay light installation, garage industrial area", "Industrial"),
  P(2019, "Supply of underwater lights, IB Palace", "Residential"),
  P(2019, "Design and supply of interior lighting, Subaru car showroom", "Commercial"),
  P(2019, "Design and supply of facade lighting, Ismayil Bin Ali Tower", "Commercial"),
  P(2019, "Design and supply of exit & emergency lights, HMC campus", "Government and Education"),
  P(2019, "Design and supply of interior lighting, Amri Diwan Palace, Corniche", "Government and Education"),
  P(2020, "K5547-ACT Dhukhan Air Base", "Government and Education"),
  P(2020, "Supply of emergency kit for light fixtures, ID & TO existing schools, Package 3 (11 schools)", "Government and Education"),
  P(2020, "CO2 Factory, New Industrial Area", "Industrial"),
  P(2020, "Construction of Pearl showroom", "Commercial"),
  P(2020, "Ain Khaled Gate", "Infrastructure"),
  P(2021, "Construction of VIP area (G+1) villa compound plus club house and pool", "Residential"),
  P(2021, "Khalifa Stadium renovation, exit lighting", "Infrastructure"),
  P(2021, "Khalifa Stadium renovation, emergency lighting", "Infrastructure"),
  P(2021, "Construction of HBK staff accommodation, 65 villas", "Residential"),
  P(2021, "Project at Al Wukair (00850): fabrication & supply of 4m decorative camera pole", "Infrastructure"),
  P(2022, "Kings School", "Government and Education"),
  P(2022, "Four Star Hotel, Salata", "Hospitality"),
  P(2022, "Kings College, exit and emergency", "Government and Education"),
  P(2022, "Al Seneem Park", "Infrastructure"),
  P(2022, "Pearl Villa", "Residential"),
  P(2022, "Ashghal Store (Salwa Office), P47", "Government and Education"),
  P(2023, "Auto Cluster roads and infrastructure (first phase), Umm Al Houl Free Zone", "Infrastructure"),
  P(2023, "EPC 01", "Infrastructure"),
  P(2023, "Al Waab City", "Residential"),
  P(2023, "Hotel apartment spare parts", "Hospitality"),
  P(2023, "HMC Dental", "Government and Education"),
  P(2023, "Doha Festival City Park", "Infrastructure"),
  P(2024, "Dhukhan upgradation", "Infrastructure"),
  P(2024, "LARC University", "Government and Education"),
  P(2024, "Solar tower lights", "Infrastructure"),
  P(2024, "CRS Building, Qatar Steel", "Industrial"),
  P(2024, "Metallurgy shutdown, Dolphin Energy", "Industrial"),
];

export const YEARS = Array.from(new Set(PROJECTS.map((p) => p.year))).sort();

const pick = (y: number, i = 0) => PROJECTS.filter((p) => p.year === y)[i]!;
export const FEATURED_PROJECTS = [pick(2024, 4), pick(2023, 0), pick(2022, 1), pick(2021, 1), pick(2019, 6), pick(2017, 4)];
