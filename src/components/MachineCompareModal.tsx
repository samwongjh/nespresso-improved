import { Check, Plus, X } from 'lucide-react';
import {
  MACHINE_COMPARISON_SPECS,
  MachineComparisonSpec,
  formatSgd,
} from '../data/catalog';
import { ResilientImage } from './ResilientImage';

interface MachineCompareModalProps {
  isOpen: boolean;
  selectedIds: string[];
  onToggleMachine: (id: string) => void;
  onClose: () => void;
  onAddToCart: (machine: MachineComparisonSpec) => void;
  onOpenSwarovskiPdp: () => void;
}

const SPEC_ROWS: {
  key: keyof MachineComparisonSpec;
  label: string;
  tabular?: boolean;
}[] = [
  { key: 'line', label: 'Coffee System' },
  { key: 'extraction', label: 'Extraction Technology' },
  { key: 'cupSizes', label: 'Supported Cup Sizes' },
  { key: 'heatUpTime', label: 'Heat-Up Time', tabular: true },
  { key: 'waterTank', label: 'Water Tank Capacity', tabular: true },
  { key: 'capsuleContainer', label: 'Used Capsule Capacity', tabular: true },
  { key: 'dimensions', label: 'Dimensions (W × D × H)', tabular: true },
  { key: 'weight', label: 'Weight', tabular: true },
  { key: 'standoutFeature', label: 'Standout Feature' },
];

export function MachineCompareModal({
  isOpen,
  selectedIds,
  onToggleMachine,
  onClose,
  onAddToCart,
  onOpenSwarovskiPdp,
}: MachineCompareModalProps) {
  if (!isOpen) return null;

  const comparedMachines =
    selectedIds.length >= 2
      ? MACHINE_COMPARISON_SPECS.filter((m) => selectedIds.includes(m.id))
      : MACHINE_COMPARISON_SPECS;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1918]/60 backdrop-blur-[2px] p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Compare Nespresso Coffee Machines"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] bg-[#FAF9F6] border border-[#E7E4DF] rounded-sm shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-[#FFFFFF] border-b border-[#E7E4DF] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.14em] text-[#9E7B4F] font-medium">
              Nespresso Singapore Machine Guide
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#1B1918] mt-0.5">
              Compare Coffee Machines
            </h2>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {MACHINE_COMPARISON_SPECS.map((machine) => {
                const active = comparedMachines.some((m) => m.id === machine.id);
                return (
                  <button
                    key={machine.id}
                    type="button"
                    onClick={() => onToggleMachine(machine.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-sm border transition-colors cursor-pointer whitespace-nowrap ${
                      active
                        ? 'bg-[#1B1918] text-[#FAF9F6] border-[#1B1918]'
                        : 'bg-[#FFFFFF] text-[#57524E] border-[#DDD8D0] hover:border-[#1B1918]'
                    }`}
                  >
                    {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    <span>{machine.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#57524E] hover:text-[#1B1918] transition-colors cursor-pointer"
              aria-label="Close machine comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="min-w-[680px] bg-[#FFFFFF] border border-[#E7E4DF] rounded-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E7E4DF] align-top">
                  <th className="w-48 p-5 text-xs font-semibold uppercase tracking-wider text-[#7A746E] bg-[#FAF9F6]">
                    Model Overview
                  </th>
                  {comparedMachines.map((machine) => (
                    <th key={machine.id} className="p-5 font-normal border-l border-[#F0EDE7]">
                      <div className="space-y-3">
                        <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#F2EFE9]">
                          <ResilientImage
                            src={machine.image}
                            alt={machine.name}
                            className="w-full h-full object-cover"
                            fallbackTitle={machine.name}
                          />
                        </div>
                        <div>
                          <div className="text-[11px] uppercase tracking-[0.12em] text-[#9E7B4F] font-medium">
                            {machine.line} Line
                          </div>
                          <div className="text-base font-semibold text-[#1B1918] mt-0.5 leading-snug">
                            {machine.name}
                          </div>
                          <div className="text-sm font-semibold text-[#1B1918] tabular-nums mt-1">
                            {formatSgd(machine.priceSgd)}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              onAddToCart(machine);
                              onClose();
                            }}
                            className="px-3.5 py-2 bg-[#1B1918] hover:bg-[#9E7B4F] text-[#FAF9F6] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Add to Cart
                          </button>
                          {machine.isSwarovskiPdp && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenSwarovskiPdp();
                              }}
                              className="px-3 py-2 border border-[#DDD8D0] hover:border-[#1B1918] text-[#1B1918] text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap"
                            >
                              View Edition
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EDE7] text-xs sm:text-sm">
                {SPEC_ROWS.map((row) => (
                  <tr key={row.key}>
                    <td className="p-4 font-medium text-[#57524E] bg-[#FAF9F6] align-top">
                      {row.label}
                    </td>
                    {comparedMachines.map((machine) => (
                      <td
                        key={`${machine.id}-${row.key}`}
                        className={`p-4 text-[#1B1918] border-l border-[#F0EDE7] align-top leading-relaxed ${
                          row.tabular ? 'tabular-nums' : ''
                        }`}
                      >
                        {String(machine[row.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
