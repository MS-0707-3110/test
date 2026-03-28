// AAPM TG-101 Table 2 - Dose Constraints for SBRT
// Units: Gy (unless noted)
// Volume constraints: cc
// Source: Benedict SH, et al. Med Phys. 2010;37(8):4078-4101.

const TG101_DATA = {
  // ===== SERIAL ORGANS =====
  serial: [
    {
      id: "spinal_cord",
      name: "脊髄",
      nameEn: "Spinal Cord",
      category: "serial",
      note: "PRV (計画リスク体積)",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 14, unit: "Gy" },
          { type: "volume_dose", label: "0.35cc に対する線量", volume: 0.35, limit: 10, unit: "Gy" },
          { type: "volume_dose", label: "1.2cc に対する線量", volume: 1.2, limit: 7, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 21.9, unit: "Gy" },
          { type: "volume_dose", label: "0.35cc に対する線量", volume: 0.35, limit: 18, unit: "Gy" },
          { type: "volume_dose", label: "1.2cc に対する線量", volume: 1.2, limit: 12.3, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 26, unit: "Gy" },
          { type: "volume_dose", label: "0.35cc に対する線量", volume: 0.35, limit: 23, unit: "Gy" },
          { type: "volume_dose", label: "1.2cc に対する線量", volume: 1.2, limit: 14.4, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 30, unit: "Gy" },
          { type: "volume_dose", label: "0.35cc に対する線量", volume: 0.35, limit: 22.5, unit: "Gy" },
          { type: "volume_dose", label: "1.2cc に対する線量", volume: 1.2, limit: 14.5, unit: "Gy" },
        ],
      },
    },
    {
      id: "cauda_equina",
      name: "馬尾",
      nameEn: "Cauda Equina",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 16, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 14, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 24, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 21.9, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 26.8, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 23.6, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 31.5, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 30, unit: "Gy" },
        ],
      },
    },
    {
      id: "sacral_plexus",
      name: "仙骨神経叢",
      nameEn: "Sacral Plexus",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 18, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 14.4, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 24, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 22.5, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 27.3, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 24, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 32, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 29.5, unit: "Gy" },
        ],
      },
    },
    {
      id: "esophagus",
      name: "食道",
      nameEn: "Esophagus",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 15.4, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 11.9, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 25.2, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 17.7, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 30.4, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 18.8, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 35, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 19.5, unit: "Gy" },
        ],
      },
    },
    {
      id: "brachial_plexus",
      name: "腕神経叢",
      nameEn: "Brachial Plexus",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 17.5, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 14, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 24, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 20.4, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 27.2, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 23.6, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 32, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 30.5, unit: "Gy" },
        ],
      },
    },
    {
      id: "heart_pericardium",
      name: "心臓/心膜",
      nameEn: "Heart/Pericardium",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 22, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 16, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 30, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 24, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 34, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 28, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 38, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 32, unit: "Gy" },
        ],
      },
    },
    {
      id: "great_vessels",
      name: "大血管",
      nameEn: "Great Vessels",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 37, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 31, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 45, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 39, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 49, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 43, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 53, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 47, unit: "Gy" },
        ],
      },
    },
    {
      id: "trachea_bronchus",
      name: "気管・主気管支",
      nameEn: "Trachea/Ipsilateral Bronchus",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 20.2, unit: "Gy" },
          { type: "volume_dose", label: "4cc に対する線量", volume: 4, limit: 10.5, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 30, unit: "Gy" },
          { type: "volume_dose", label: "4cc に対する線量", volume: 4, limit: 15, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 34.8, unit: "Gy" },
          { type: "volume_dose", label: "4cc に対する線量", volume: 4, limit: 15, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 40, unit: "Gy" },
          { type: "volume_dose", label: "4cc に対する線量", volume: 4, limit: 16.5, unit: "Gy" },
        ],
      },
    },
    {
      id: "skin",
      name: "皮膚",
      nameEn: "Skin",
      category: "serial",
      note: "表面から0.5cm以内",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 26, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 23, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 33, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 30, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 36, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 33, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 40, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 36.5, unit: "Gy" },
        ],
      },
    },
    {
      id: "stomach",
      name: "胃",
      nameEn: "Stomach",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 12.4, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 11.2, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 22.2, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 16.5, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 27.2, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 18.4, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 32, unit: "Gy" },
          { type: "volume_dose", label: "10cc に対する線量", volume: 10, limit: 18, unit: "Gy" },
        ],
      },
    },
    {
      id: "small_bowel",
      name: "小腸",
      nameEn: "Small Bowel",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 15.4, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 11.9, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 25.2, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 17.7, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 30, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 19.2, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 35, unit: "Gy" },
          { type: "volume_dose", label: "5cc に対する線量", volume: 5, limit: 19.5, unit: "Gy" },
        ],
      },
    },
    {
      id: "colon",
      name: "大腸",
      nameEn: "Colon",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 18.4, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 14.3, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 28.2, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 24, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 32, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 27.2, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 38, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 25, unit: "Gy" },
        ],
      },
    },
    {
      id: "rectum",
      name: "直腸",
      nameEn: "Rectum",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 18.4, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 14.3, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 28.8, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 24, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 32, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 27.2, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 38, unit: "Gy" },
          { type: "volume_dose", label: "20cc に対する線量", volume: 20, limit: 25, unit: "Gy" },
        ],
      },
    },
    {
      id: "bladder",
      name: "膀胱",
      nameEn: "Bladder",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 18.4, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 11.4, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 28.2, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 16.8, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 32, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 18.4, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 38, unit: "Gy" },
          { type: "volume_dose", label: "15cc に対する線量", volume: 15, limit: 18.3, unit: "Gy" },
        ],
      },
    },
    {
      id: "penile_bulb",
      name: "陰茎海綿体",
      nameEn: "Penile Bulb",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 14.4, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 11.4, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 21, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 17.4, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 23.6, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 19.2, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 26, unit: "Gy" },
          { type: "volume_dose", label: "3cc に対する線量", volume: 3, limit: 20, unit: "Gy" },
        ],
      },
    },
    {
      id: "femoral_head",
      name: "大腿骨頭",
      nameEn: "Femoral Head & Neck",
      category: "serial",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 14, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 27, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 32, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 36, unit: "Gy" },
        ],
      },
    },
    {
      id: "ribs",
      name: "肋骨",
      nameEn: "Ribs",
      category: "serial",
      note: "骨折リスク",
      constraints: {
        1: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 22, unit: "Gy" },
          { type: "volume_dose", label: "1cc に対する線量", volume: 1, limit: 22, unit: "Gy" },
        ],
        3: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 40, unit: "Gy" },
          { type: "volume_dose", label: "1cc に対する線量", volume: 1, limit: 28.8, unit: "Gy" },
        ],
        4: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 40, unit: "Gy" },
          { type: "volume_dose", label: "1cc に対する線量", volume: 1, limit: 32, unit: "Gy" },
        ],
        5: [
          { type: "point_max", label: "最大点線量 (Dmax)", limit: 43, unit: "Gy" },
          { type: "volume_dose", label: "1cc に対する線量", volume: 1, limit: 35, unit: "Gy" },
        ],
      },
    },
  ],

  // ===== PARALLEL ORGANS =====
  parallel: [
    {
      id: "lung_both",
      name: "両側肺",
      nameEn: "Lung (Both)",
      category: "parallel",
      note: "腫瘍体積を除いた合計肺体積",
      constraints: {
        1: [
          { type: "dose_volume", label: "V13.5Gy < 1500cc", dose: 13.5, limit: 1500, unit: "cc" },
          { type: "dose_volume", label: "V7.4Gy < 1000cc", dose: 7.4, limit: 1000, unit: "cc" },
        ],
        3: [
          { type: "dose_volume", label: "V11.6Gy < 1500cc", dose: 11.6, limit: 1500, unit: "cc" },
          { type: "dose_volume", label: "V7.4Gy < 1000cc", dose: 7.4, limit: 1000, unit: "cc" },
        ],
        4: [
          { type: "dose_volume", label: "V12.4Gy < 1500cc", dose: 12.4, limit: 1500, unit: "cc" },
          { type: "dose_volume", label: "V7.4Gy < 1000cc", dose: 7.4, limit: 1000, unit: "cc" },
        ],
        5: [
          { type: "dose_volume", label: "V12.5Gy < 1500cc", dose: 12.5, limit: 1500, unit: "cc" },
          { type: "dose_volume", label: "V7.4Gy < 1000cc", dose: 7.4, limit: 1000, unit: "cc" },
        ],
      },
    },
    {
      id: "liver",
      name: "肝臓",
      nameEn: "Liver",
      category: "parallel",
      constraints: {
        1: [
          { type: "dose_volume", label: "V9.1Gy < 700cc", dose: 9.1, limit: 700, unit: "cc" },
        ],
        3: [
          { type: "dose_volume", label: "V19.2Gy < 700cc", dose: 19.2, limit: 700, unit: "cc" },
        ],
        4: [
          { type: "dose_volume", label: "V20Gy < 700cc", dose: 20, limit: 700, unit: "cc" },
        ],
        5: [
          { type: "dose_volume", label: "V21Gy < 700cc", dose: 21, limit: 700, unit: "cc" },
        ],
      },
    },
    {
      id: "renal_cortex",
      name: "腎皮質（両側）",
      nameEn: "Renal Cortex (Both)",
      category: "parallel",
      constraints: {
        1: [
          { type: "dose_volume", label: "V8.4Gy < 200cc", dose: 8.4, limit: 200, unit: "cc" },
        ],
        3: [
          { type: "dose_volume", label: "V16Gy < 200cc", dose: 16, limit: 200, unit: "cc" },
        ],
        4: [
          { type: "dose_volume", label: "V17.5Gy < 200cc", dose: 17.5, limit: 200, unit: "cc" },
        ],
        5: [
          { type: "dose_volume", label: "V18Gy < 200cc", dose: 18, limit: 200, unit: "cc" },
        ],
      },
    },
  ],
};

// フラクション別の線量制約を全OARで取得
function getAllConstraints(fx) {
  const all = [];
  [...TG101_DATA.serial, ...TG101_DATA.parallel].forEach(organ => {
    if (organ.constraints[fx]) {
      all.push({ ...organ, activeConstraints: organ.constraints[fx] });
    }
  });
  return all;
}
