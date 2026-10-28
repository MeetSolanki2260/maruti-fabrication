import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";
export const Input = ({ label, ...p }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => <label>{label}<input {...p} /></label>;
export const Select = ({ label, children, ...p }: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) => <label>{label}<select {...p}>{children}</select></label>;
export const Textarea = ({ label, ...p }: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) => <label>{label}<textarea {...p} /></label>;
