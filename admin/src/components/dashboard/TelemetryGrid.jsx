import React, { forwardRef, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Radio, FileText, ShieldCheck, Users } from 'lucide-react';

const METRICS_CONFIG = [
  {
    id: 'sessions',
    label: 'Active Sessions',
    value: 12,
    suffix: '',
    change: '+2 this hour',
    description: 'Zero-trust authenticated nodes',
    icon: Radio,
  },
  {
    id: 'audits',
    label: 'Immutable Audit Logs',
    value: 1842,
    suffix: '',
    change: '100% cryptographic ledger',
    description: 'Tamper-evident record count',
    icon: FileText,
  },
  {
    id: 'uptime',
    label: 'Clearance Gateway Health',
    value: 99.98,
    suffix: '%',
    change: 'Zero anomalies reported',
    description: 'System operational SLA',
    icon: ShieldCheck,
  },
  {
    id: 'admins',
    label: 'Provisioned Personnel',
    value: 8,
    suffix: '',
    change: 'TOTP armed & enforced',
    description: 'Active administrative roster',
    icon: Users,
  },
];

const TelemetryGrid = forwardRef((props, ref) => {
  const statNumbersRef = useRef([]);

  useGSAP(
    () => {
      statNumbersRef.current.forEach((el, index) => {
        if (!el) return;
        const targetValue = METRICS_CONFIG[index].value;
        const isDecimal = targetValue % 1 !== 0;
        const counterObj = { val: 0 };

        gsap.to(counterObj, {
          val: targetValue,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.innerText = isDecimal
              ? counterObj.val.toFixed(2)
              : Math.floor(counterObj.val).toLocaleString();
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:gap-6"
    >
      {METRICS_CONFIG.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="group relative overflow-hidden rounded-2xl border border-[#E6E2D8] bg-[#FFFFFF] p-6 shadow-[0_10px_30px_rgba(48,48,48,0.03)] transition-all duration-300 hover:border-[#D5CEBF] hover:shadow-[0_15px_35px_rgba(48,48,48,0.06)] sm:p-6 md:p-6 lg:p-6 xl:p-7 2xl:p-8"
          >
            <div className="flex items-center justify-between text-[#707884]">
              <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-[#707884] sm:text-[11px] 2xl:text-xs">
                {item.label}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E6E2D8] bg-[#F7F5F0] text-[#707884] group-hover:border-[#E85D04]/30 group-hover:text-[#E85D04] 2xl:h-10 2xl:w-10">
                <Icon className="h-4 w-4 2xl:h-5 2xl:w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span
                ref={(el) => (statNumbersRef.current[index] = el)}
                className="font-serif text-3xl font-normal tracking-tight text-[#303030] sm:text-3xl md:text-4xl lg:text-4xl 2xl:text-5xl"
              >
                0
              </span>
              {item.suffix && (
                <span className="font-serif text-xl text-[#707884] 2xl:text-2xl">
                  {item.suffix}
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#E6E2D8] pt-3 font-sans text-[11px] text-[#707884] 2xl:text-xs">
              <span>{item.change}</span>
              <span className="flex items-center gap-1 font-medium text-[#E85D04]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#E85D04]" />
                Live
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
});

TelemetryGrid.displayName = 'TelemetryGrid';

export default TelemetryGrid;