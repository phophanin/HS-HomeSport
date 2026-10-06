import React from 'react';
import { Wind, Crosshair, Droplets, Activity, Shield, Leaf } from 'lucide-react';
import { Language } from '../types';

interface TechnologySectionProps {
  language: Language;
}

export const TechnologySection: React.FC<TechnologySectionProps> = ({ language }) => {
  const technologies = [
    {
      icon: <Wind className="w-6 h-6 stroke-[1.5]" />,
      nameEn: 'AERO ZOOM FOAM',
      nameKm: 'AERO FOAM',
      descEn: 'Ultra-light responsive air unit for instant propulsion',
      descKm: 'ទ្រនាប់ខ្យល់ទម្ងន់ស្រាល ជួយស្ទុះរហ័សលើទីលាន',
    },
    {
      icon: <Crosshair className="w-6 h-6 stroke-[1.5]" />,
      nameEn: 'GRIP CONTROL',
      nameKm: 'GRIP CONTROL',
      descEn: 'High-friction 3D micro-ridges for surgical touch',
      descKm: 'ស្បែកគ្រាប់កៅស៊ូ គ្រប់គ្រងបាល់បានជាក់លាក់',
    },
    {
      icon: <Droplets className="w-6 h-6 stroke-[1.5]" />,
      nameEn: 'BREATH TECH',
      nameKm: 'BREATH TECH',
      descEn: 'Continuous moisture evacuation cooling weave',
      descKm: 'ក្រណាត់បឺតស្រូបញើស និងបញ្ចេញកម្តៅរហ័ស',
    },
    {
      icon: <Activity className="w-6 h-6 stroke-[1.5]" />,
      nameEn: 'FLEX MOTION',
      nameKm: 'FLEX MOTION',
      descEn: 'Multi-directional chevron stud plate for rapid cuts',
      descKm: 'បាតទ្រនាប់បត់បែនល្អ ងាយកាច់ទិសដៅរត់',
    },
    {
      icon: <Shield className="w-6 h-6 stroke-[1.5]" />,
      nameEn: 'HEEL LOCK SUPPORT',
      nameKm: 'HEEL SUPPORT',
      descEn: 'Molded anatomical counter prevents ankle slippage',
      descKm: 'ទ្រទ្រង់កជើងរឹងមាំ កាត់បន្ថយហានិភ័យរបួស',
    },
    {
      icon: <Leaf className="w-6 h-6 stroke-[1.5]" />,
      nameEn: 'ECO REINFORCED',
      nameKm: 'ECO MATERIALS',
      descEn: 'Long-lasting high-tensile microfiber polymers',
      descKm: 'វត្ថុធាតុដើមគុណភាពខ្ពស់ ជាប់ធន់យូរអង្វែង',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10" id="tech-section">
      <div className="space-y-6">
        <div className="text-left">
          <h2 className="font-athletic text-2xl font-bold tracking-tight text-[#141513] uppercase">
            {language === 'km' ? 'បច្ចេកវិទ្យាសម្រាប់ជ័យជម្នះ' : 'TECHNOLOGY FOR YOUR GAME'}
          </h2>
          <p className="text-xs text-neutral-500 font-khmer mt-0.5">
            {language === 'km'
              ? 'ផលិតឡើងដោយវិស្វកម្មទំនើប ដើម្បីផ្តល់ទំនុកចិត្ត និងផាសុកភាពខ្ពស់'
              : 'Engineered innovations driving professional athletic dominance'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {technologies.map((tech, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
                {tech.icon}
              </div>

              <div>
                <h4 className="font-athletic text-xs font-bold text-neutral-900 tracking-wider uppercase">
                  {language === 'km' ? tech.nameKm : tech.nameEn}
                </h4>
                <p className="text-[11px] text-neutral-500 font-khmer mt-1 leading-snug">
                  {language === 'km' ? tech.descKm : tech.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
