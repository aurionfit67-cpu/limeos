import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  Funnel,
  FunnelChart as ReFunnelChart,
  LabelList,
  Line,
  LineChart as ReLineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const burgundy = "#800020";
const cream = "#f3e6d5";
const paper = "#fff9f2";
const border = "#ead8c5";

export function Loader({ size = 20 }: { size?: number }) {
  return <span aria-label="Loading" role="status" className="life-loader" style={{ width: size, height: size }} />;
}

export function MatrixText({ text }: { text: string }) {
  const [value, setValue] = useState("");
  useEffect(() => {
    let i = 0;
    setValue("");
    const id = window.setInterval(() => {
      setValue(text.slice(0, i++) + text.slice(i).replace(/./g, "·"));
      if (i > text.length) window.clearInterval(id);
    }, 45);
    return () => window.clearInterval(id);
  }, [text]);
  return <span>{value || text}</span>;
}

export function DynamicText({ items, interval = 2600 }: { items: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (items.length < 2) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
    return () => window.clearInterval(id);
  }, [items, interval]);
  return <div className="overflow-hidden"><AnimatePresence mode="wait"><motion.span key={items[index]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{items[index]}</motion.span></AnimatePresence></div>;
}

export function ScrollText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <p ref={ref} className={visible ? "scroll-text scroll-text-visible" : "scroll-text"}>{text.split(/(\s+)/).map((word, i) => <motion.span key={`${word}-${i}`} initial={{ opacity: 0, y: 8 }} animate={visible ? { opacity: 1, y: 0 } : undefined} transition={{ delay: i * 0.018 }}>{word}</motion.span>)}</p>;
}

export function AttractButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return <button className={`button attract-button ${className}`} onClick={onClick} onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOffset({ x: (e.clientX - (r.left + r.width / 2)) * 0.12, y: (e.clientY - (r.top + r.height / 2)) * 0.12 }); }} onMouseLeave={() => setOffset({ x: 0, y: 0 })} style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}>{children}</button>;
}

export function SwitchButton({ checked, onChange, label = "Toggle theme" }: { checked: boolean; onChange: (checked: boolean) => void; label?: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`switch-button ${checked ? "checked" : ""}`} onClick={() => onChange(!checked)}><span /></button>;
}

export function SlideTextButton({ text, onClick }: { text: string; onClick?: () => void }) { if (!onClick) return <span className="text-button text-button-static">{text}</span>; return <button className="text-button" onClick={onClick}><span>{text}</span><span aria-hidden>{text}</span></button>; }
export function Grid() { return <CartesianGrid stroke={border} strokeDasharray="2 5" vertical={false} />; }
export function ProjectionLine({ dataKey, name = "Projected finish" }: { dataKey: string; name?: string }) { return <Line type="monotone" dataKey={dataKey} name={name} stroke="#d45060" strokeDasharray="6 5" dot={false} />; }
export function CustomChartIndicator({ value, label = "" }: { value?: number | string; label?: string }) { return value === undefined ? null : <span className="chart-indicator">{label}{value}</span>; }
export function ChartTooltip() { return <Tooltip cursor={{ stroke: "#d45060", strokeDasharray: "3 3" }} contentStyle={{ background: "var(--card, #fff9f2)", border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: burgundy }} />; }

export function BarChart({ data, dataKey = "value", secondKey, projectedKey }: { data: Record<string, unknown>[]; dataKey?: string; secondKey?: string; projectedKey?: string }) { return <ResponsiveContainer width="100%" height="100%"><ReBarChart data={data}><Grid /><XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} hide /><ChartTooltip /><Bar dataKey={dataKey} name="Planned" fill={burgundy} radius={[3, 3, 0, 0]} />{secondKey && <Bar dataKey={secondKey} name="Completed" fill="#d45060" radius={[3, 3, 0, 0]} />}{projectedKey && <ProjectionLine dataKey={projectedKey} />}</ReBarChart></ResponsiveContainer>; }
export function LineChart({ data, dataKey = "value", secondKey, projectedKey }: { data: Record<string, unknown>[]; dataKey?: string; secondKey?: string; projectedKey?: string }) { return <ResponsiveContainer width="100%" height="100%"><ReLineChart data={data}><Grid /><XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} hide /><ChartTooltip />{secondKey ? <Line type="monotone" dataKey={secondKey} name="Actual" stroke="#d45060" strokeWidth={2} dot={{ r: 2 }} /> : <Line type="monotone" dataKey={dataKey} name="Value" stroke={burgundy} strokeWidth={2} dot={{ r: 2, fill: burgundy }} />}{projectedKey && <ProjectionLine dataKey={projectedKey} />}</ReLineChart></ResponsiveContainer>; }
export function ProfitLossLine({ data }: { data: Record<string, unknown>[] }) { return <LineChart data={data} dataKey="planned" secondKey="actual" />; }
export function RadarChart({ data, maxValue, color = burgundy }: { data: { subject: string; score: number }[]; maxValue?: number; color?: string }) { const scale = maxValue ?? Math.max(1, ...data.map((item) => item.score)); return <ResponsiveContainer width="100%" height="100%"><ReRadarChart data={data} cx="50%" cy="50%" outerRadius="70%"><PolarGrid stroke={border} /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#6f6258" }} /><PolarRadiusAxis domain={[0, scale]} tickCount={4} tick={{ fontSize: 9, fill: "#9c8d81" }} axisLine={false} /><Radar dataKey="score" stroke={color} fill={color} fillOpacity={0.18} strokeWidth={2} /></ReRadarChart></ResponsiveContainer>; }
export function RingChart({ value, max = 100 }: { value: number; max?: number }) { const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100))); return <div className="ring-chart" style={{ background: `conic-gradient(${burgundy} ${pct * 3.6}deg, ${cream} 0)` }}><span>{pct}%</span></div>; }
export function FunnelChart({ data }: { data: { step: string; value: number; completed?: number; detail?: string }[] }) { const max = Math.max(1, ...data.map((d) => d.value)); return <div className="effort-funnel-list">{data.length ? data.map((item) => { const effort = item.value ? Math.round(((item.completed ?? 0) / item.value) * 100) : 0; return <div className="effort-funnel-row" key={item.step}><div className="effort-funnel-label"><strong>{item.step}</strong><span>{item.detail || `${item.completed ?? item.value} / ${item.value}`}</span></div><div className="effort-funnel-track"><span style={{ width: `${Math.max(8, (item.value / max) * 100)}%` }}><i style={{ width: `${effort}%` }} /></span></div></div>; }) : <div className="funnel-empty">Create projects and link tasks to see effort here.</div>}</div>; }
export function HeatmapChart({ data }: { data: { day: string; count: number }[] }) { const max = Math.max(1, ...data.map((d) => d.count)); return <div className="heatmap-grid">{data.map((item, i) => <span key={`${item.day}-${i}`} title={`${item.day}: ${item.count}`} className="heatmap-cell" style={{ background: `rgba(128,0,32,${Math.max(.08, item.count / max)})` }} />)}</div>; }
export function ThreeDBarChart({ data }: { data: Record<string, unknown>[] }) { return <ResponsiveContainer width="100%" height="100%"><ReBarChart data={data} barCategoryGap="22%"><Grid /><XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} /><YAxis allowDecimals={false} hide /><ChartTooltip /><Bar dataKey="planned" name="Planned" fill={burgundy} radius={[4, 4, 0, 0]} /><Bar dataKey="completed" name="Completed" fill="#d45060" radius={[4, 4, 0, 0]} /></ReBarChart></ResponsiveContainer>; }
export function ReferenceMarker({ y }: { y: number }) { return <ReferenceLine y={y} stroke="#d45060" strokeDasharray="3 3" />; }
