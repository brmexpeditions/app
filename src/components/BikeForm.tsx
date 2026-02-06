import { useEffect, useMemo, useState, type ComponentType } from "react";
import type { Motorcycle, VehicleCategory } from "../types";
import { VEHICLE_CATALOG } from "../data/vehicleCatalog";
import {
  IconBike,
  IconCar,
  IconCheckBadge,
  IconDocument,
  IconFleet,
  IconGauge,
  IconRoad,
  IconShield,
  IconSmoke,
  IconWrench,
} from "./ui/Icons";

const uniq = (arr: string[]) => Array.from(new Set(arr)).filter(Boolean);
const sortAZ = (arr: string[]) => [...arr].sort((a, b) => a.localeCompare(b));

interface BikeFormProps {
  bike?: Motorcycle | null;
  onSave: (bike: Motorcycle, newMake?: string, newModel?: string) => void;
  onCancel: () => void;
  makes: string[];
  models: Record<string, string[]>;
}

type VehicleTypeLocal = "private" | "commercial";

type CustomCatalog = Record<
  VehicleCategory,
  { makes: string[]; models: Record<string, string[]> }
>;

const CUSTOM_CATALOG_KEY = "fleet_custom_vehicle_catalog_v1";

type StepId = 1 | 2 | 3 | 4;

const STEP_DEFS: Array<{
  n: StepId;
  label: string;
  title: string;
  subtitle: string;
  Icon: ComponentType<{ className?: string }>;
}> = [
  {
    n: 1,
    label: "Select",
    title: "Select vehicle category",
    subtitle: "Choose whether this is a bike or a car",
    Icon: IconFleet,
  },
  {
    n: 2,
    label: "Basic",
    title: "Basic details",
    subtitle: "Make, model, owner, registration and odometer",
    Icon: IconGauge,
  },
  {
    n: 3,
    label: "Docs",
    title: "Documents",
    subtitle: "Validity dates for reminders",
    Icon: IconDocument,
  },
  {
    n: 4,
    label: "Service",
    title: "Service setup",
    subtitle: "Intervals and last service info",
    Icon: IconWrench,
  },
];

function makeId(): string {
  // randomUUID not available in some mobile webviews
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c: any = globalThis.crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function clampToNumber(value: string): number {
  const n = parseInt(String(value || "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

function IconUserMini({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.5 21a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconChipMini({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 9h6v6H9V9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 4v2M11 4v2M13 4v2M17 4v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 18v2M11 18v2M13 18v2M17 18v2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 7h2M4 11h2M4 13h2M4 17h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 7h2M18 11h2M18 13h2M18 17h2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FieldLabel(props: {
  icon?: ComponentType<{ className?: string }>;
  required?: boolean;
  children: string;
}) {
  const Icon = props.icon;
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
      {Icon ? (
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl"
          style={{
            backgroundColor: "rgba(212,175,55,0.10)",
            border: "1px solid rgba(212,175,55,0.22)",
            color: "#7C5E00",
          }}
        >
          <Icon className="w-4 h-4" />
        </span>
      ) : null}
      <span>
        {props.children}
        {props.required ? <span className="text-red-500"> *</span> : null}
      </span>
    </label>
  );
}

export function BikeForm({
  bike,
  onSave,
  onCancel,
  makes: legacyMakes,
  models: legacyModels,
}: BikeFormProps) {
  const [step, setStep] = useState<StepId>(1);
  const [showNewMake, setShowNewMake] = useState(false);
  const [showNewModel, setShowNewModel] = useState(false);

  const [customCatalog, setCustomCatalog] = useState<CustomCatalog>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_CATALOG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<CustomCatalog>;
        return {
          bike: {
            makes: Array.isArray(parsed.bike?.makes) ? parsed.bike!.makes : [],
            models:
              parsed.bike?.models && typeof parsed.bike.models === "object"
                ? parsed.bike.models
                : {},
          },
          car: {
            makes: Array.isArray(parsed.car?.makes) ? parsed.car!.makes : [],
            models:
              parsed.car?.models && typeof parsed.car.models === "object"
                ? parsed.car.models
                : {},
          },
        };
      }
    } catch {
      // ignore
    }
    return { bike: { makes: [], models: {} }, car: { makes: [], models: {} } };
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_CATALOG_KEY, JSON.stringify(customCatalog));
    } catch {
      // ignore
    }
  }, [customCatalog]);

  const [form, setForm] = useState({
    vehicleCategory: "bike" as VehicleCategory,

    make: "",
    newMake: "",
    model: "",
    newModel: "",

    ownerName: "",
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",

    currentOdometer: "",

    vehicleType: "commercial" as VehicleTypeLocal,

    registrationValidity: "",
    insuranceValidity: "",
    pollutionValidity: "",
    fitnessValidity: "",
    roadTaxValidity: "",

    serviceIntervalMonths: 5,
    serviceIntervalKms: 5000,
    lastServiceDate: "",
    lastServiceKm: "",
  });

  // Load bike into form when editing
  useEffect(() => {
    if (!bike) return;

    const kmReadings = Array.isArray(bike.kmReadings) ? bike.kmReadings : [];
    const latest = [...kmReadings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    setForm({
      vehicleCategory: bike.vehicleCategory || "bike",

      make: bike.make || "",
      newMake: "",
      model: bike.model || "",
      newModel: "",

      ownerName: bike.ownerName || "",
      registrationNumber: bike.registrationNumber || "",
      chassisNumber: bike.chassisNumber || "",
      engineNumber: bike.engineNumber || "",

      currentOdometer: String(latest?.kilometers ?? bike.currentOdometer ?? 0),

      vehicleType: (bike.vehicleType as VehicleTypeLocal) || "commercial",

      registrationValidity: bike.registrationValidity || "",
      insuranceValidity: bike.insuranceValidity || "",
      pollutionValidity: bike.pollutionValidity || "",
      fitnessValidity: bike.fitnessValidity || "",
      roadTaxValidity: bike.roadTaxValidity || "",

      serviceIntervalMonths: bike.serviceIntervalMonths || 5,
      serviceIntervalKms: bike.serviceIntervalKms || 5000,
      lastServiceDate: bike.lastServiceDate || "",
      lastServiceKm: bike.lastServiceKm ? String(bike.lastServiceKm) : "",
    });

    setStep(1);
    setShowNewMake(false);
    setShowNewModel(false);
  }, [bike]);

  const setField = (key: keyof typeof form, value: string | number) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleCategoryChange = (cat: VehicleCategory) => {
    setForm((p) => ({
      ...p,
      vehicleCategory: cat,
      make: "",
      model: "",
      newMake: "",
      newModel: "",
    }));
    setShowNewMake(false);
    setShowNewModel(false);
  };

  const availableMakes = useMemo(() => {
    const cat = form.vehicleCategory;
    const base = VEHICLE_CATALOG[cat]?.makes || [];
    const custom = customCatalog[cat]?.makes || [];
    // legacy saved makes are treated as bike makes (back-compat)
    const legacy = cat === "bike" ? legacyMakes || [] : [];
    return sortAZ(uniq([...base, ...custom, ...legacy]));
  }, [customCatalog, form.vehicleCategory, legacyMakes]);

  const currentMake = (showNewMake ? form.newMake : form.make).trim();

  const availableModels = useMemo(() => {
    const cat = form.vehicleCategory;
    if (!currentMake) return [];
    const base = VEHICLE_CATALOG[cat]?.models?.[currentMake] || [];
    const custom = customCatalog[cat]?.models?.[currentMake] || [];
    const legacy = cat === "bike" ? legacyModels?.[currentMake] || [] : [];
    return sortAZ(uniq([...base, ...custom, ...legacy]));
  }, [customCatalog, form.vehicleCategory, currentMake, legacyModels]);

  const persistCustomMake = (cat: VehicleCategory, mk: string) => {
    const makeTrim = mk.trim();
    if (!makeTrim) return;
    setCustomCatalog((prev) => {
      const existing = prev[cat]?.makes || [];
      if (existing.includes(makeTrim)) return prev;
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          makes: sortAZ(uniq([...existing, makeTrim])),
          models: prev[cat]?.models || {},
        },
      };
    });
  };

  const persistCustomModel = (cat: VehicleCategory, mk: string, md: string) => {
    const makeTrim = mk.trim();
    const modelTrim = md.trim();
    if (!makeTrim || !modelTrim) return;
    setCustomCatalog((prev) => {
      const list = prev[cat]?.models?.[makeTrim] || [];
      if (list.includes(modelTrim)) return prev;
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          makes: prev[cat]?.makes || [],
          models: {
            ...(prev[cat]?.models || {}),
            [makeTrim]: sortAZ(uniq([...list, modelTrim])),
          },
        },
      };
    });
  };

  const handleMakeSelect = (value: string) => {
    if (value === "__new__") {
      setShowNewMake(true);
      setForm((p) => ({ ...p, make: "", model: "" }));
      return;
    }

    setShowNewMake(false);
    setForm((p) => ({ ...p, make: value, newMake: "", model: "", newModel: "" }));
    setShowNewModel(false);
  };

  const handleModelSelect = (value: string) => {
    if (value === "__new__") {
      setShowNewModel(true);
      setForm((p) => ({ ...p, model: "" }));
      return;
    }

    setShowNewModel(false);
    setForm((p) => ({ ...p, model: value, newModel: "" }));
  };

  const inputClass =
    "w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 placeholder:text-gray-400";
  const cardClass =
    "rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-colors focus-within:border-amber-300";

  const stepMeta = STEP_DEFS.find((s) => s.n === step)!;
  const progress = Math.round(((step - 1) / (STEP_DEFS.length - 1)) * 100);

  const save = () => {
    const finalMake = (showNewMake ? form.newMake : form.make).trim();
    const finalModel = (showNewModel ? form.newModel : form.model).trim();

    if (
      !finalMake ||
      !finalModel ||
      !form.registrationNumber.trim() ||
      !String(form.currentOdometer).trim()
    ) {
      alert("Please fill required fields: Make, Model, Registration, Current Odometer");
      return;
    }

    const currentKm = clampToNumber(String(form.currentOdometer));
    const lsKm = clampToNumber(String(form.lastServiceKm));

    const baseReadings = Array.isArray(bike?.kmReadings) ? bike!.kmReadings : [];
    const d = todayISO();

    const next: Motorcycle = {
      id: bike?.id || makeId(),
      vehicleCategory: form.vehicleCategory,
      make: finalMake,
      model: finalModel,

      ownerName: form.ownerName.trim() || undefined,
      registrationNumber: form.registrationNumber.trim().toUpperCase(),
      chassisNumber: form.chassisNumber.trim().toUpperCase(),
      engineNumber: form.engineNumber.trim().toUpperCase() || undefined,

      vehicleType: form.vehicleType,

      registrationValidity: form.registrationValidity || undefined,
      insuranceValidity: form.insuranceValidity || "",
      pollutionValidity: form.pollutionValidity || "",
      fitnessValidity: form.fitnessValidity || "",
      roadTaxValidity: form.roadTaxValidity || "",

      serviceIntervalMonths: form.serviceIntervalMonths,
      serviceIntervalKms: form.serviceIntervalKms,
      lastServiceDate: form.lastServiceDate,
      lastServiceKm: lsKm,

      kmReadings:
        baseReadings.length > 0
          ? [...baseReadings]
          : [{ id: makeId(), date: d, kilometers: currentKm }],
      currentOdometer: currentKm,

      createdAt: bike?.createdAt || new Date().toISOString(),
    };

    // update km readings for current odometer
    const latest = [...next.kmReadings].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    if (!latest || latest.kilometers !== currentKm) {
      const todayIdx = next.kmReadings.findIndex((r) => r.date === d);
      if (todayIdx >= 0) next.kmReadings[todayIdx].kilometers = currentKm;
      else next.kmReadings.push({ id: makeId(), date: d, kilometers: currentKm });
    }

    if (showNewMake) persistCustomMake(form.vehicleCategory, finalMake);
    if (showNewModel) persistCustomModel(form.vehicleCategory, finalMake, finalModel);

    onSave(
      next,
      showNewMake ? form.newMake : undefined,
      showNewModel ? form.newModel : undefined
    );
  };

  const canNext = () => {
    if (step === 1) return true;
    if (step === 2) {
      const finalMake = (showNewMake ? form.newMake : form.make).trim();
      const finalModel = (showNewModel ? form.newModel : form.model).trim();
      return Boolean(
        finalMake &&
          finalModel &&
          form.registrationNumber.trim() &&
          String(form.currentOdometer).trim()
      );
    }
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-[1px]">
      <div className="bg-white w-full max-w-2xl max-h-[95vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-black/5">
        {/* Header */}
        <div
          className="text-white px-4 py-4"
          style={{
            background:
              "linear-gradient(90deg, #0B0B0B 0%, #111827 60%, #0B0B0B 100%)",
            borderBottom: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-wide leading-tight">
                {bike ? "Edit vehicle" : "Add vehicle"}
              </h2>
              <p className="text-xs mt-1" style={{ color: "rgba(253,230,138,0.85)" }}>
                Step {step} of {STEP_DEFS.length} — {stepMeta.label}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white text-2xl leading-none"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Stepper */}
          <div className="mt-4">
            <div className="grid grid-cols-4 gap-2">
              {STEP_DEFS.map((s) => {
                const active = s.n === step;
                return (
                  <button
                    key={s.n}
                    type="button"
                    onClick={() => setStep(s.n)}
                    className={
                      "flex items-center justify-center gap-2 px-2 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors " +
                      (active
                        ? "bg-amber-200 text-gray-900 border-amber-200"
                        : "bg-white/10 text-white border-white/10 hover:bg-white/15")
                    }
                  >
                    <s.Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-amber-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.22)",
                  color: "#7C5E00",
                }}
              >
                <stepMeta.Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">{stepMeta.title}</div>
                <div className="text-sm text-gray-600">{stepMeta.subtitle}</div>
              </div>
            </div>
          </div>

          {/* Step 1: Select */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleCategoryChange("bike")}
                  className={
                    "rounded-2xl border-2 p-4 text-left transition-all shadow-sm hover:shadow-md " +
                    (form.vehicleCategory === "bike"
                      ? "border-amber-300 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-amber-200")
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        "w-12 h-12 rounded-2xl flex items-center justify-center " +
                        (form.vehicleCategory === "bike"
                          ? "bg-gray-900 text-amber-200"
                          : "bg-gray-100 text-gray-700")
                      }
                    >
                      <IconBike className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Bike</div>
                      <div className="text-xs text-gray-600">Two-wheeler</div>
                    </div>
                    {form.vehicleCategory === "bike" ? (
                      <div className="text-amber-700 font-semibold text-xs">Selected</div>
                    ) : null}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange("car")}
                  className={
                    "rounded-2xl border-2 p-4 text-left transition-all shadow-sm hover:shadow-md " +
                    (form.vehicleCategory === "car"
                      ? "border-amber-300 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-amber-200")
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={
                        "w-12 h-12 rounded-2xl flex items-center justify-center " +
                        (form.vehicleCategory === "car"
                          ? "bg-gray-900 text-amber-200"
                          : "bg-gray-100 text-gray-700")
                      }
                    >
                      <IconCar className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Car</div>
                      <div className="text-xs text-gray-600">Four-wheeler</div>
                    </div>
                    {form.vehicleCategory === "car" ? (
                      <div className="text-amber-700 font-semibold text-xs">Selected</div>
                    ) : null}
                  </div>
                </button>
              </div>

              <div
                className="rounded-2xl p-4 text-sm"
                style={{
                  backgroundColor: "rgba(212,175,55,0.10)",
                  border: "1px solid rgba(212,175,55,0.22)",
                }}
              >
                Tip: The next step will show India-focused Make/Model suggestions for your selection.
              </div>
            </div>
          )}

          {/* Step 2: Basic */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={cardClass}>
                <FieldLabel icon={IconFleet} required>
                  Make / Brand
                </FieldLabel>
                {!showNewMake ? (
                  <select
                    className={inputClass}
                    value={form.make}
                    onChange={(e) => handleMakeSelect(e.target.value)}
                  >
                    <option value="">Select make</option>
                    {availableMakes.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    <option value="__new__">Add new make…</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      className={inputClass}
                      value={form.newMake}
                      onChange={(e) => setField("newMake", e.target.value)}
                      placeholder="New make"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-gray-800"
                      onClick={() => setShowNewMake(false)}
                    >
                      ← Back
                    </button>
                  </div>
                )}
              </div>

              <div className={cardClass}>
                <FieldLabel icon={IconFleet} required>
                  Model
                </FieldLabel>
                {!showNewModel ? (
                  <select
                    className={inputClass}
                    value={form.model}
                    onChange={(e) => handleModelSelect(e.target.value)}
                    disabled={!currentMake}
                  >
                    <option value="">Select model</option>
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                    <option value="__new__">Add new model…</option>
                  </select>
                ) : (
                  <div className="space-y-2">
                    <input
                      className={inputClass}
                      value={form.newModel}
                      onChange={(e) => setField("newModel", e.target.value)}
                      placeholder="New model"
                      autoFocus
                    />
                    <button
                      type="button"
                      className="text-xs text-gray-500 hover:text-gray-800"
                      onClick={() => setShowNewModel(false)}
                    >
                      ← Back
                    </button>
                  </div>
                )}
                {!currentMake && (
                  <div className="text-[11px] text-amber-700 mt-2">
                    Select Make first.
                  </div>
                )}
              </div>

              <div className={cardClass}>
                <FieldLabel icon={IconUserMini}>Owner Name</FieldLabel>
                <input
                  className={inputClass}
                  value={form.ownerName}
                  onChange={(e) => setField("ownerName", e.target.value)}
                  placeholder="Owner name"
                />
              </div>

              <div className={cardClass}>
                <FieldLabel icon={IconDocument} required>
                  Registration Number
                </FieldLabel>
                <input
                  className={inputClass + " font-mono uppercase"}
                  value={form.registrationNumber}
                  onChange={(e) =>
                    setField("registrationNumber", e.target.value.toUpperCase())
                  }
                  placeholder="MH01AB1234"
                />
              </div>

              <div className={cardClass}>
                <FieldLabel icon={IconChipMini}>Chassis Number</FieldLabel>
                <input
                  className={inputClass + " font-mono uppercase"}
                  value={form.chassisNumber}
                  onChange={(e) =>
                    setField("chassisNumber", e.target.value.toUpperCase())
                  }
                  placeholder="Chassis"
                />
              </div>

              <div className={cardClass}>
                <FieldLabel icon={IconChipMini}>Engine Number</FieldLabel>
                <input
                  className={inputClass + " font-mono uppercase"}
                  value={form.engineNumber}
                  onChange={(e) =>
                    setField("engineNumber", e.target.value.toUpperCase())
                  }
                  placeholder="Engine"
                />
              </div>

              <div className={cardClass + " sm:col-span-2"}>
                <FieldLabel icon={IconGauge} required>
                  Current Odometer (KM)
                </FieldLabel>
                <input
                  className={inputClass}
                  type="number"
                  min={0}
                  value={form.currentOdometer}
                  onChange={(e) => setField("currentOdometer", e.target.value)}
                  placeholder="15000"
                />
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <div className="space-y-4">
              <div className={cardClass}>
                <FieldLabel icon={IconDocument}>Vehicle Type</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setField("vehicleType", "private")}
                    className={
                      "px-3 py-2 rounded-xl border text-sm font-semibold transition-colors " +
                      (form.vehicleType === "private"
                        ? "bg-gray-900 border-gray-900 text-amber-200"
                        : "bg-white border-gray-200 text-gray-700 hover:border-amber-300")
                    }
                  >
                    Private
                  </button>
                  <button
                    type="button"
                    onClick={() => setField("vehicleType", "commercial")}
                    className={
                      "px-3 py-2 rounded-xl border text-sm font-semibold transition-colors " +
                      (form.vehicleType === "commercial"
                        ? "bg-gray-900 border-gray-900 text-amber-200"
                        : "bg-white border-gray-200 text-gray-700 hover:border-amber-300")
                    }
                  >
                    Commercial
                  </button>
                </div>
                <div className="text-[11px] text-gray-500 mt-2">
                  Private: Registration + Insurance + Pollution. Commercial: Insurance +
                  Pollution + Fitness + Road Tax.
                </div>
              </div>

              {form.vehicleType === "private" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={cardClass}>
                    <FieldLabel icon={IconDocument}>Registration Valid Till</FieldLabel>
                    <input
                      className={inputClass}
                      type="date"
                      value={form.registrationValidity}
                      onChange={(e) =>
                        setField("registrationValidity", e.target.value)
                      }
                    />
                  </div>
                  <div className={cardClass}>
                    <FieldLabel icon={IconShield}>Insurance Valid Till</FieldLabel>
                    <input
                      className={inputClass}
                      type="date"
                      value={form.insuranceValidity}
                      onChange={(e) =>
                        setField("insuranceValidity", e.target.value)
                      }
                    />
                  </div>
                  <div className={cardClass + " sm:col-span-2"}>
                    <FieldLabel icon={IconSmoke}>Pollution Valid Till</FieldLabel>
                    <input
                      className={inputClass}
                      type="date"
                      value={form.pollutionValidity}
                      onChange={(e) =>
                        setField("pollutionValidity", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {form.vehicleType === "commercial" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={cardClass}>
                    <FieldLabel icon={IconShield}>Insurance Valid Till</FieldLabel>
                    <input
                      className={inputClass}
                      type="date"
                      value={form.insuranceValidity}
                      onChange={(e) =>
                        setField("insuranceValidity", e.target.value)
                      }
                    />
                  </div>
                  <div className={cardClass}>
                    <FieldLabel icon={IconSmoke}>Pollution Valid Till</FieldLabel>
                    <input
                      className={inputClass}
                      type="date"
                      value={form.pollutionValidity}
                      onChange={(e) =>
                        setField("pollutionValidity", e.target.value)
                      }
                    />
                  </div>
                  <div className={cardClass}>
                    <FieldLabel icon={IconCheckBadge}>Fitness Valid Till</FieldLabel>
                    <input
                      className={inputClass}
                      type="date"
                      value={form.fitnessValidity}
                      onChange={(e) =>
                        setField("fitnessValidity", e.target.value)
                      }
                    />
                  </div>
                  <div className={cardClass}>
                    <FieldLabel icon={IconRoad}>Road Tax Valid Till</FieldLabel>
                    <input
                      className={inputClass}
                      type="date"
                      value={form.roadTaxValidity}
                      onChange={(e) =>
                        setField("roadTaxValidity", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Service */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={cardClass}>
                  <FieldLabel icon={IconWrench}>Service Interval (Months)</FieldLabel>
                  <select
                    className={inputClass}
                    value={form.serviceIntervalMonths}
                    onChange={(e) =>
                      setField(
                        "serviceIntervalMonths",
                        parseInt(e.target.value, 10)
                      )
                    }
                  >
                    {[3, 4, 5, 6, 9, 12].map((m) => (
                      <option key={m} value={m}>
                        {m} months
                      </option>
                    ))}
                  </select>
                </div>

                <div className={cardClass}>
                  <FieldLabel icon={IconGauge}>Service Interval (KM)</FieldLabel>
                  <select
                    className={inputClass}
                    value={form.serviceIntervalKms}
                    onChange={(e) =>
                      setField("serviceIntervalKms", parseInt(e.target.value, 10))
                    }
                  >
                    {[3000, 4000, 5000, 6000, 8000, 10000].map((km) => (
                      <option key={km} value={km}>
                        {km.toLocaleString()} km
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={cardClass}>
                  <FieldLabel icon={IconWrench}>Last Service Date</FieldLabel>
                  <input
                    className={inputClass}
                    type="date"
                    value={form.lastServiceDate}
                    onChange={(e) => setField("lastServiceDate", e.target.value)}
                  />
                </div>
                <div className={cardClass}>
                  <FieldLabel icon={IconGauge}>Last Service Odometer (KM)</FieldLabel>
                  <input
                    className={inputClass}
                    type="number"
                    min={0}
                    value={form.lastServiceKm}
                    onChange={(e) => setField("lastServiceKm", e.target.value)}
                    placeholder="e.g., 12000"
                  />
                </div>
              </div>

              {String(form.currentOdometer).trim() && (
                <div
                  className="rounded-2xl p-4 text-sm"
                  style={{
                    backgroundColor: "rgba(212,175,55,0.10)",
                    border: "1px solid rgba(212,175,55,0.22)",
                  }}
                >
                  <div className="font-semibold text-gray-900">Quick summary</div>
                  <div className="text-gray-700 mt-1">
                    Current odometer:{" "}
                    <strong>
                      {(clampToNumber(String(form.currentOdometer)) || 0).toLocaleString()} km
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50/95 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-gray-600 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as StepId)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white border border-gray-200 hover:border-amber-300 text-gray-800"
                >
                  ← Prev
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!canNext()) {
                      alert("Please complete required fields in this step.");
                      return;
                    }
                    setStep((s) => (s + 1) as StepId);
                  }}
                  className={
                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-colors " +
                    (canNext()
                      ? "bg-gray-900 hover:bg-black text-amber-200"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed")
                  }
                >
                  Next →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={save}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gray-900 hover:bg-black text-amber-200"
                >
                  Save Vehicle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
