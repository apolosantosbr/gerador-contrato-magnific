"use client";

import { useState, useRef, useCallback } from "react";
import ContractTemplate, { type ContractData, type ChoppItem } from "./ContractTemplate";

const EMPTY_CHOPP: ChoppItem = { sabor: "", quantidade: "", valor: "" };

const INITIAL_DATA: ContractData = {
  nomeCompleto: "",
  nacionalidade: "brasileiro(a)",
  estadoCivil: "",
  profissao: "",
  rg: "",
  cpf: "",
  endereco: "",
  telefone: "",
  dataEvento: "",
  horarioInicio: "",
  valor: "",
  dataContrato: new Date().toLocaleDateString("pt-BR"),
  incluiChopp: false,
  chopps: [{ ...EMPTY_CHOPP }],
};

function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7)
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function maskCurrency(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function maskDate(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

const FIELDS: {
  key: keyof ContractData;
  label: string;
  placeholder: string;
  mask?: (v: string) => string;
  type?: string;
  half?: boolean;
}[] = [
  { key: "nomeCompleto", label: "Nome Completo", placeholder: "João da Silva" },
  {
    key: "nacionalidade",
    label: "Nacionalidade",
    placeholder: "brasileiro(a)",
    half: true,
  },
  {
    key: "estadoCivil",
    label: "Estado Civil",
    placeholder: "solteiro(a)",
    half: true,
  },
  { key: "profissao", label: "Profissão", placeholder: "engenheiro(a)", half: true },
  { key: "rg", label: "RG", placeholder: "MG-12.345.678", half: true },
  {
    key: "cpf",
    label: "CPF",
    placeholder: "000.000.000-00",
    mask: maskCPF,
    half: true,
  },
  {
    key: "telefone",
    label: "Telefone",
    placeholder: "(32) 99999-0000",
    mask: maskPhone,
    half: true,
  },
  {
    key: "endereco",
    label: "Endereço Completo",
    placeholder: "Rua X, 123, Centro, Juiz de Fora/MG",
  },
  {
    key: "dataEvento",
    label: "Data do Evento",
    placeholder: "15/06/2026",
    mask: maskDate,
    half: true,
  },
  {
    key: "horarioInicio",
    label: "Horário de Início",
    placeholder: "18:00",
    type: "time",
    half: true,
  },
  {
    key: "valor",
    label: "Valor do Espaço (R$)",
    placeholder: "3.000,00",
    mask: maskCurrency,
    half: true,
  },
  {
    key: "dataContrato",
    label: "Data do Contrato",
    placeholder: "11/04/2026",
    mask: maskDate,
    half: true,
  },
];

export default function GeradorContrato() {
  const [data, setData] = useState<ContractData>(INITIAL_DATA);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");
  const [toast, setToast] = useState("");
  const [generating, setGenerating] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const stringFields = Object.entries(data).filter(
    ([k, v]) => typeof v === "string" && k !== "incluiChopp"
  );
  const filledCount = stringFields.filter(([, v]) => (v as string).trim()).length;
  const totalFields = stringFields.length;
  const progress = Math.round((filledCount / totalFields) * 100);

  const handleChange = useCallback(
    (key: keyof ContractData, value: string, mask?: (v: string) => string) => {
      setData((prev) => ({ ...prev, [key]: mask ? mask(value) : value }));
    },
    []
  );

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }, []);

  const handleClear = useCallback(() => {
    setData({ ...INITIAL_DATA, chopps: [{ ...EMPTY_CHOPP }] });
    showToast("Formulário limpo");
  }, [showToast]);

  const toggleChopp = useCallback(() => {
    setData((prev) => ({ ...prev, incluiChopp: !prev.incluiChopp }));
  }, []);

  const addChopp = useCallback(() => {
    setData((prev) => ({ ...prev, chopps: [...prev.chopps, { ...EMPTY_CHOPP }] }));
  }, []);

  const removeChopp = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      chopps: prev.chopps.filter((_, i) => i !== index),
    }));
  }, []);

  const updateChopp = useCallback(
    (index: number, field: keyof ChoppItem, value: string) => {
      setData((prev) => ({
        ...prev,
        chopps: prev.chopps.map((c, i) =>
          i === index
            ? { ...c, [field]: field === "valor" ? maskCurrency(value) : value }
            : c
        ),
      }));
    },
    []
  );

  const choppTotal = data.chopps.reduce((sum, c) => {
    const v = parseFloat(c.valor.replace(/\./g, "").replace(",", ".")) || 0;
    return sum + v;
  }, 0);
  const espacoTotal = parseFloat(data.valor.replace(/\./g, "").replace(",", ".")) || 0;
  const valorFinal = espacoTotal + (data.incluiChopp ? choppTotal : 0);

  const handleExportPDF = useCallback(async () => {
    if (!contractRef.current) return;
    setGenerating(true);

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = contractRef.current;

      const clientName = data.nomeCompleto.trim() || "contrato";
      const fileName = `Contrato_${clientName.replace(/\s+/g, "_")}.pdf`;

      const opt = {
        margin: [10, 12, 10, 12],
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      };

      await html2pdf().set(opt).from(element).save();
      showToast("PDF gerado com sucesso!");
    } catch {
      showToast("Erro ao gerar PDF");
    } finally {
      setGenerating(false);
    }
  }, [data.nomeCompleto, showToast]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          borderBottom: "1px solid var(--border)",
        }}
        className="px-4 py-4 sm:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              <span style={{ color: "var(--accent)" }}>Espaço Magnific</span>{" "}
              <span style={{ color: "var(--text-secondary)" }}>|</span>{" "}
              <span className="text-base sm:text-lg font-normal" style={{ color: "var(--text-secondary)" }}>
                Gerador de Contrato
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)" }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: progress === 100 ? "var(--success)" : "var(--accent)",
                }}
              />
              {filledCount}/{totalFields} campos
            </div>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div
        className="flex sm:hidden border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
      >
        <button
          onClick={() => setActiveTab("form")}
          className="flex-1 py-3 text-sm font-semibold text-center transition-colors"
          style={{
            color: activeTab === "form" ? "var(--accent)" : "var(--text-muted)",
            borderBottom: activeTab === "form" ? "2px solid var(--accent)" : "2px solid transparent",
          }}
        >
          Formulário
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className="flex-1 py-3 text-sm font-semibold text-center transition-colors"
          style={{
            color: activeTab === "preview" ? "var(--accent)" : "var(--text-muted)",
            borderBottom: activeTab === "preview" ? "2px solid var(--accent)" : "2px solid transparent",
          }}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col sm:flex-row max-w-7xl mx-auto w-full">
        {/* Form Panel */}
        <div
          className={`w-full sm:w-[420px] sm:min-w-[420px] overflow-y-auto p-4 sm:p-6 sm:border-r ${activeTab === "form" ? "block" : "hidden sm:block"}`}
          style={{
            borderColor: "var(--border)",
            background: "var(--bg-primary)",
            maxHeight: "calc(100vh - 65px)",
          }}
        >
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                Progresso
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: progress === 100 ? "var(--success)" : "var(--accent)" }}
              >
                {progress}%
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-tertiary)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background:
                    progress === 100
                      ? "var(--success)"
                      : "linear-gradient(90deg, var(--accent-dark), var(--accent))",
                }}
              />
            </div>
          </div>

          {/* Section: Dados do Contratante */}
          <div className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ color: "var(--accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Dados do Contratante
            </h2>
            <div className="flex flex-wrap gap-3">
              {FIELDS.slice(0, 8).map((f) => (
                <div key={f.key} className={f.half ? "w-[calc(50%-6px)]" : "w-full"}>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f.label}
                  </label>
                  {f.key === "estadoCivil" ? (
                    <select
                      value={data[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value)}
                    >
                      <option value="">Selecione...</option>
                      <option value="solteiro(a)">Solteiro(a)</option>
                      <option value="casado(a)">Casado(a)</option>
                      <option value="divorciado(a)">Divorciado(a)</option>
                      <option value="viúvo(a)">Viúvo(a)</option>
                      <option value="união estável">União Estável</option>
                    </select>
                  ) : (
                    <input
                      type={f.type || "text"}
                      placeholder={f.placeholder}
                      value={data[f.key]}
                      onChange={(e) => handleChange(f.key, e.target.value, f.mask)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section: Dados do Evento */}
          <div className="mb-6">
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2"
              style={{ color: "var(--accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Dados do Evento
            </h2>
            <div className="flex flex-wrap gap-3">
              {FIELDS.slice(8).map((f) => (
                <div key={f.key} className={f.half ? "w-[calc(50%-6px)]" : "w-full"}>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    placeholder={f.placeholder}
                    value={data[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.value, f.mask)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section: SleutjesBeer Chopp */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                style={{ color: "var(--accent)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
                  <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
                  <line x1="6" y1="2" x2="6" y2="4" />
                  <line x1="10" y1="2" x2="10" y2="4" />
                  <line x1="14" y1="2" x2="14" y2="4" />
                </svg>
                SleutjesBeer — Chopp
              </h2>
              <button
                onClick={toggleChopp}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer"
                style={{
                  background: data.incluiChopp ? "var(--accent)" : "var(--bg-tertiary)",
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                  style={{
                    transform: data.incluiChopp ? "translateX(22px)" : "translateX(2px)",
                  }}
                />
              </button>
            </div>

            {data.incluiChopp && (
              <div className="fade-in">
                <div
                  className="rounded-lg p-3 mb-3 text-xs"
                  style={{ background: "rgba(201, 168, 76, 0.1)", border: "1px solid rgba(201, 168, 76, 0.2)", color: "var(--accent-light)" }}
                >
                  Inclua os chopps da SleutjesBeer. O valor será somado ao do espaço no contrato.
                </div>

                {data.chopps.map((chopp, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-3 mb-3"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                        Chopp {index + 1}
                      </span>
                      {data.chopps.length > 1 && (
                        <button
                          onClick={() => removeChopp(index)}
                          className="text-xs px-2 py-0.5 rounded cursor-pointer transition-colors"
                          style={{ color: "var(--error)", background: "rgba(239,68,68,0.1)" }}
                        >
                          Remover
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                          Sabor
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Pilsen, IPA..."
                          value={chopp.sabor}
                          onChange={(e) => updateChopp(index, "sabor", e.target.value)}
                        />
                      </div>
                      <div className="w-20">
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                          Litros
                        </label>
                        <input
                          type="text"
                          placeholder="30"
                          value={chopp.quantidade}
                          onChange={(e) => updateChopp(index, "quantidade", e.target.value)}
                        />
                      </div>
                      <div className="w-28">
                        <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
                          Valor (R$)
                        </label>
                        <input
                          type="text"
                          placeholder="600,00"
                          value={chopp.valor}
                          onChange={(e) => updateChopp(index, "valor", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addChopp}
                  className="w-full py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px dashed var(--border)",
                    color: "var(--accent)",
                  }}
                >
                  + Adicionar outro sabor
                </button>

                {/* Resumo de valores */}
                <div
                  className="mt-3 rounded-lg p-3 text-sm"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                >
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "var(--text-secondary)" }}>Espaço</span>
                    <span>R$ {data.valor || "0,00"}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: "var(--text-secondary)" }}>Chopp</span>
                    <span>R$ {choppTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div
                    className="flex justify-between pt-2 mt-2 font-bold"
                    style={{ borderTop: "1px solid var(--border)", color: "var(--accent)" }}
                  >
                    <span>Total</span>
                    <span>R$ {valorFinal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              className="btn-primary flex-1 justify-center pulse-gold"
              onClick={handleExportPDF}
              disabled={generating}
            >
              {generating ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Gerando...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Baixar PDF
                </>
              )}
            </button>
            <button className="btn-secondary" onClick={handleClear}>
              Limpar
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div
          className={`flex-1 overflow-y-auto ${activeTab === "preview" ? "block" : "hidden sm:block"}`}
          style={{
            background: "#e2e8f0",
            maxHeight: "calc(100vh - 65px)",
          }}
        >
          <div className="p-4 sm:p-8">
            <div
              className="rounded-lg overflow-hidden shadow-2xl"
              style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
            >
              <div ref={contractRef}>
                <ContractTemplate data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
