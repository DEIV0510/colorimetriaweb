// Paletas de referencia por subestación. Los valores son aproximaciones de
// teoría del color estacional, no una fuente exacta ni una guía clínica.
import type { SeasonId } from "@/types/classification";

export const SEASON_PALETTES: Record<SeasonId, string[]> = {
  "primavera-clara": [
    "#FFD9B3", "#FFB7A6", "#FFE08A", "#B6E3C6", "#9FE0D0", "#FFC4D6",
    "#FFF3B0", "#C7E8A3", "#FFCBA4", "#8FD9C4", "#F7B6C2", "#FFE7B3",
    "#A9D8E8", "#FFD1DC", "#FFE9A8", "#C9EAD3",
  ],
  "primavera-calida": [
    "#F2A65A", "#E8703A", "#F6C744", "#7FB77E", "#2FBFB0", "#F0567C",
    "#D96C3F", "#C9A227", "#E7A63B", "#4FAE9B", "#EF8354", "#8CC63F",
    "#F4D35E", "#3EA1A6", "#E85D75", "#C08552",
  ],
  "primavera-brillante": [
    "#FF6B4A", "#00B37E", "#00C2C7", "#FFC300", "#FF3D6E", "#FFB400",
    "#2ED0A0", "#F7374F", "#00A6ED", "#FF9F1C", "#37E2A3", "#F72585",
    "#FFDD00", "#0FB8AD", "#FF5E5B", "#4CC9F0",
  ],
  "verano-claro": [
    "#A9C6E8", "#C9B8E0", "#F3C6D6", "#D6C6E8", "#B8D8D8", "#E8C6D0",
    "#C6D6E8", "#F0D9E0", "#B0C4DE", "#D8BFD8", "#C0DDE8", "#E6D6E8",
    "#AFC9D6", "#F0C9D6", "#C9D6E8", "#DCE3EC",
  ],
  "verano-frio": [
    "#6E85A8", "#8E6C8A", "#B85C7C", "#5E7A9E", "#9C6B8F", "#4F7C82",
    "#7B6E9E", "#C15E7C", "#5B7B9A", "#8A5A78", "#3E6E7E", "#A85A82",
    "#6B7FA0", "#7A5E8A", "#5C8A96", "#9E6E86",
  ],
  "verano-suave": [
    "#9CADB7", "#B79CA0", "#8FA396", "#A8998F", "#B0A0A8", "#7C97A0",
    "#9E8B99", "#A3ADA0", "#8A9CA6", "#B0958E", "#7E8C86", "#9E8C8F",
    "#8B9CA0", "#A69099", "#7F9490", "#AE9D93",
  ],
  "otono-suave": [
    "#B58963", "#8C9A6E", "#C79F6E", "#A97B5A", "#7C8B6A", "#BF9B7A",
    "#9C8A5E", "#C08A6B", "#8A9878", "#B08A5E", "#6E7E5E", "#AE8567",
    "#98865E", "#B99A7C", "#7A8768", "#A67C58",
  ],
  "otono-calido": [
    "#B5541A", "#D19A2B", "#6E7B3B", "#C97A2E", "#8A5A2E", "#2E7A6E",
    "#A9431F", "#C98B1F", "#5E6E2E", "#B0641F", "#7A3E1E", "#4E8A6E",
    "#D4A017", "#9C4B23", "#6E8A3E", "#8F5A1E",
  ],
  "otono-profundo": [
    "#7A2E1E", "#5E2E12", "#2E4A2E", "#8A5E1E", "#4A1E12", "#1E4A3E",
    "#6E1E2E", "#A9431F", "#3E2E12", "#5E4A1E", "#2E5E4A", "#7A4A1E",
    "#4A2E2E", "#8A3E1E", "#1E3E2E", "#6E4A2E",
  ],
  "invierno-brillante": [
    "#E10032", "#0047AB", "#00A86B", "#FF1493", "#000000", "#FFFFFF",
    "#7B00D4", "#00CFFF", "#FFD100", "#C40057", "#0057E7", "#00E0A0",
    "#FF3F8E", "#1B1B1B", "#00B4D8", "#F72585",
  ],
  "invierno-frio": [
    "#0B3D91", "#7A1F5C", "#0E7C61", "#5C0B8A", "#B0004B", "#003049",
    "#4B0082", "#006D77", "#8E0037", "#1D3557", "#5A189A", "#023E7D",
    "#7B0F3C", "#0A4D68", "#3C096C", "#001845",
  ],
  "invierno-profundo": [
    "#000000", "#1A0B2E", "#4B0012", "#0B1F3A", "#2E0B1F", "#0B2E1F",
    "#3A0B2E", "#0B0B3A", "#5C0018", "#0B1A2E", "#2E0018", "#1F0B3A",
    "#4A0B0B", "#0B2E2E", "#3A0B0B", "#1A1A2E",
  ],
};

export const SEASON_NEUTRALS: Record<SeasonId, string[]> = {
  "primavera-clara": ["#FFF8F0", "#F5E6D3", "#E8D5B7", "#C9B896", "#F0EAD6", "#D9CBB3"],
  "primavera-calida": ["#F5E1C8", "#D9B88F", "#B08968", "#8A6D4F", "#FFF3E0", "#C9A97E"],
  "primavera-brillante": ["#FFFFFF", "#E8E8E8", "#3D3D3D", "#1A1A1A", "#F0F0F0", "#C9C9C9"],
  "verano-claro": ["#F5F5F5", "#E0E0E0", "#C4C4C4", "#9E9E9E", "#EDEDED", "#D6D6D6"],
  "verano-frio": ["#E8E8ED", "#C4C4CC", "#8E8E96", "#5A5A62", "#F0F0F5", "#A9A9B2"],
  "verano-suave": ["#E5E0DC", "#C9C0B8", "#A69D94", "#78716A", "#EDE8E3", "#B8AFA6"],
  "otono-suave": ["#EDE3D3", "#D6C4A8", "#B39B7A", "#7A6A52", "#F2E9DB", "#C4B092"],
  "otono-calido": ["#F0E0C0", "#D4B483", "#8A6D3B", "#5C4526", "#E8D2A0", "#B08A4E"],
  "otono-profundo": ["#3E2E1E", "#5E4530", "#241812", "#1A1A1A", "#7A5E3E", "#0F0B08"],
  "invierno-brillante": ["#FFFFFF", "#000000", "#E0E0E0", "#1A1A1A", "#F5F5F5", "#333333"],
  "invierno-frio": ["#FFFFFF", "#0B0B1A", "#C4C4D4", "#5A5A6E", "#E8E8F0", "#2E2E3E"],
  "invierno-profundo": ["#000000", "#1A1A2E", "#FFFFFF", "#2E2E3E", "#0B0B0B", "#E0E0E5"],
};

export const SEASON_METALS: Record<SeasonId, string[]> = {
  "primavera-clara": ["Oro rosado", "Oro claro"],
  "primavera-calida": ["Oro", "Oro rosado"],
  "primavera-brillante": ["Oro amarillo", "Oro rosado"],
  "verano-claro": ["Plata", "Oro rosado claro"],
  "verano-frio": ["Plata", "Platino"],
  "verano-suave": ["Plata mate", "Oro rosado apagado"],
  "otono-suave": ["Oro mate", "Bronce"],
  "otono-calido": ["Oro", "Bronce"],
  "otono-profundo": ["Oro antiguo", "Bronce oscuro"],
  "invierno-brillante": ["Plata", "Oro blanco"],
  "invierno-frio": ["Plata", "Platino"],
  "invierno-profundo": ["Plata oscura", "Oro blanco"],
};

export const SEASON_AVOID: Record<SeasonId, string[]> = {
  "primavera-clara": ["#4A2E1E", "#1A1A1A", "#5C0B8A", "#0B3D91"],
  "primavera-calida": ["#8E8E96", "#C4C4D4", "#4B0082", "#000000"],
  "primavera-brillante": ["#B8AFA6", "#8A6D4F", "#C9C0B8", "#78716A"],
  "verano-claro": ["#B5541A", "#D4A017", "#7A2E1E", "#000000"],
  "verano-frio": ["#F2A65A", "#D19A2B", "#E8703A", "#FFD100"],
  "verano-suave": ["#FF1493", "#00CFFF", "#FFD100", "#E10032"],
  "otono-suave": ["#0047AB", "#FF1493", "#7B00D4", "#00CFFF"],
  "otono-calido": ["#C9B8E0", "#A9C6E8", "#F3C6D6", "#8E6C8A"],
  "otono-profundo": ["#FFF8F0", "#F5E6D3", "#A9C6E8", "#F3C6D6"],
  "invierno-brillante": ["#B79CA0", "#8FA396", "#D9B88F", "#A69D94"],
  "invierno-frio": ["#F2A65A", "#D19A2B", "#B5541A", "#D4A017"],
  "invierno-profundo": ["#FFE08A", "#FFD9B3", "#F5E1C8", "#FFF3B0"],
};
