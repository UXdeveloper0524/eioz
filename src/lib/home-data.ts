const CAT = "https://eioz8037.live-website.com/wp-content/uploads/2026/05";
const UP = "https://eiozenergy.com/wp-content/uploads/2026/05";

export const CATEGORIES = [
  { name: "Indoor Lights", slug: "indoor-lights", img: `${CAT}/INDOOR.png` },
  { name: "Outdoor Lightings", slug: "outdoor-lightings", img: `${CAT}/OUTDOOR.png` },
  { name: "Decorative Lightings", slug: "decorative-lightings", img: `${CAT}/DECORATIVE-POLES.png` },
  { name: "Facade Lightings", slug: "facade-lightings", img: `${CAT}/FACADE.png` },
  { name: "Street Lights", slug: "street-lights", img: `${CAT}/STREET-LIGHTS.png` },
  { name: "Obstruction", slug: "obstruction", img: `${CAT}/OBSTRUCTION.png` },
  { name: "Landscape", slug: "landscape", img: `${CAT}/LANDSCAPE.png` },
  { name: "Industry", slug: "industry", img: `${CAT}/INDUSTRY.png` },
];

export const FEATURES = [
  { name: "Indoor Lights", slug: "indoor-lights", img: `${UP}/Vibia_Top_Decken__und_Wandleuchte_LED-920e3ea607f15445ae776bfd19a3179f.webp` },
  { name: "Outdoor Lightings", slug: "outdoor-lightings", img: `${CAT}/OUTDOOR.png` },
  { name: "Decorative Lightings", slug: "decorative-lightings", img: `${UP}/Occhio_Mito_Raggio_Lusso_Bogenleuchte_LED-f920a1f128a595c76d3e3bb07d5ec2a4.webp` },
];

// Partner logos from the live site (pipe-distributor logo 0021 intentionally excluded).
const P = (f: string, name: string) => ({ src: `${UP}/${f}`, name });
export const PARTNERS = [
  P("0032_schreder_logo-removebg-preview.png", "Schreder"),
  P("0001_Roveoz-Logo_Transparent-BG-01.png", "Roveoz"),
  P("0007_Glantro_Logo_File_40_x_60mm-2025.pdf_-_Page_1_of_1-removebg-preview.png", "Glandro"),
  P("0027_logo-disano-removebg-preview.png", "Disano"),
  P("0026_logo-onok-lighting-removebg-preview.png", "ONOK Lighting"),
  P("0024_Osram-removebg-preview.png", "Osram"),
  P("0023_png-clipart-logo-philips-wordmark-brand-light-emitting-diode-headphones-blue-electronics-thumbnail-removebg-previe.png", "Philips"),
  P("0015_Arcluce-logo-removebg-preview.png", "Arcluce"),
  P("0019_trilux_logo_8183f4ad-removebg-preview.png", "Trilux"),
  P("0020_tridonic_logo_rgb_1600x900px-removebg-preview.png", "Tridonic"),
  P("0014_arkos-light-oman-1024x124-removebg-preview-1.png", "Arkos Light"),
  P("0013_brand_logo_linealight-removebg-preview.png", "Linea Light"),
  P("0010_cropped-logo-ligman-4-removebg-preview.png", "Ligman"),
  P("0011_Clampco-Sistemi-Firma-Email-removebg-preview.png", "Clampco"),
  P("0009_frater-logo-website-01-1920w.png", "Frater"),
  P("0008_Gecem-Sade-Logo-1-removebg-preview.png", "Gecem"),
  P("0000_Point-Lighting.png", "Point Lighting"),
  P("0022_puk-removebg-preview.png", "PUK"),
  P("0002_Layer-1.png", "Lighting partner"),
  P("0012_Layer-3.png", "Lighting partner"),
  P("0017_Layer-2.png", "Lighting partner"),
  P("0016_1755161068771_339041206.png", "Lighting partner"),
  P("0018_unnamed-removebg-preview.png", "Lighting partner"),
  P("0028_logo1115555-removebg-preview-copy.png", "Lighting partner"),
  P("0029_logo111-removebg-preview.png", "Lighting partner"),
  P("0030_logo55-removebg-preview.png", "Lighting partner"),
  P("0031_logo__1_-removebg-preview.png", "Lighting partner"),
];

const C = (file: string, name: string) => ({ src: `${CAT}/Client-${file}.png`, name });
export const CLIENTS_QATAR = [
  C("ASHGHAL", "Ashghal"), C("AWQAF", "Awqaf"), C("KAHRAMA", "Kahrama"), C("QAPCO", "QAPCO"),
  C("QATALUM", "Qatalum"), C("QATAR-PETROLEUM", "Qatar Petroleum"), C("QATAR-STEEL", "Qatar Steel"),
  C("QATAR-UNIVERSITY", "Qatar University"), C("QATARGAS", "Qatargas"), C("QCHEM", "QChem"),
];
export const CLIENTS_UAE_OMAN = [
  C("ABU-DHABI-PORTS", "Abu Dhabi Ports"), C("ADNOC", "ADNOC"), C("ALDAR-PROPERTIES", "Aldar Properties"),
  C("CHINA-STATE-CONSTRUCTION", "China State Construction"),
  C("DUBAI-CIVIL-AVIATION-AUTHORITY", "Dubai Civil Aviation Authority"),
  C("DUBAI-MUNICIPALITY", "Dubai Municipality"), C("EMAAR", "Emaar"),
  C("ROADS-TRANSPORT-AUTHORITY-RTA", "Roads & Transport Authority (RTA)"),
  C("ROYAL-OMAN-OFFICE", "Royal Oman Office"),
  C("SHARJAH-ELECTRICITY-WATER-GAS-AUTHORITY", "Sharjah Electricity, Water & Gas Authority"),
];


