/**
 * ui/design-system/primitives/FileUpload.tsx
 *
 * WHAT: Generic drag-and-drop file upload with preview.
 *       The old project had PhotoUpload & NationalityDocumentUpload as two separate
 *       components that shared 95% of the same code. This is the single source of truth.
 *
 * HOW TO USE:
 *
 *   import { FileUpload } from '@/ui/design-system/primitives/FileUpload'
 *   import { ImageIcon } from 'lucide-react'
 *
 *   // Basic usage
 *   <FileUpload
 *     file={file}
 *     onChange={setFile}
 *     icon={ImageIcon}
 *     title="រូបថត"
 *   />
 *
 *   // With resize transform (e.g. 4x6 photo)
 *   <FileUpload
 *     file={file}
 *     onChange={setFile}
 *     icon={ImageIcon}
 *     title="រូបថត (4×6)"
 *     hint="JPEG/PNG • auto-resize"
 *     buttonLabel="ជ្រើសរើសរូបថត"
 *     transform={resizeTo4x6}
 *     previewWidth={413}
 *     previewHeight={531}
 *   />
 *
 *   // See Uploads.tsx for ready-made PhotoUpload & NationalityDocumentUpload wrappers
 */

'use client';

import { useId, useRef, useMemo, useEffect, useState } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/design-system/primitives/Button';

function fmtBytes(b: number) {
  if (!b) return '0 B';
  const u = ['B', 'KB', 'MB'];
  const p = Math.min(Math.floor(Math.log(b) / Math.log(1024)), 2);
  return `${(b / 1024 ** p).toFixed(p ? 1 : 0)} ${u[p]}`;
}

export interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
  icon: LucideIcon;
  title: string;
  hint?: string;
  buttonLabel?: string;
  prompt?: string;
  accept?: string;
  /** Optional async transform applied before storing (e.g. resize) */
  transform?: (file: File) => Promise<File>;
  previewWidth?: number;
  previewHeight?: number;
  className?: string;
}

export function FileUpload({
  file,
  onChange,
  icon: Icon,
  title,
  hint,
  buttonLabel = 'ជ្រើសរើសឯកសារ',
  prompt = 'ចុចឬអូសឯកសារមកទីនេះ',
  accept = 'image/*',
  transform,
  previewWidth = 800,
  previewHeight = 600,
  className,
}: FileUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview]
  );

  const handleFile = async (f: File) => {
    try {
      onChange(transform ? await transform(f) : f);
    } catch {
      onChange(f);
    }
  };

  return (
    <section className={cn('border-border bg-card w-full rounded-2xl border shadow-sm', className)}>
      {/* Header */}
      <div className="border-border flex items-center gap-2 border-b px-4 py-3">
        <Icon className="text-primary h-5 w-5" />
        <div>
          <h3 className="text-foreground text-sm font-semibold">{title}</h3>
          {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        {!file ? (
          <label
            htmlFor={`fu-${id}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer?.files?.[0];
              if (f) handleFile(f);
            }}
            className={cn(
              'bg-muted/50 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-6 transition',
              'hover:border-primary/40 hover:bg-primary/5',
              isDragging && 'border-primary bg-primary/5'
            )}
          >
            <input
              ref={inputRef}
              id={`fu-${id}`}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => {
                const f = e.currentTarget.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="bg-card text-primary ring-border flex h-12 w-12 items-center justify-center rounded-full shadow ring-1">
              <UploadCloud className="h-5 w-5" />
            </div>
            <p className="text-muted-foreground text-center text-sm">{prompt}</p>
            <Button type="button" variant="outline" size="sm">
              {buttonLabel}
            </Button>
          </label>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="group border-border bg-muted/50 hover:border-primary/30 hover:bg-primary/5 w-full rounded-xl border p-3 text-left transition"
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => {
                const f = e.currentTarget.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="border-border bg-card relative overflow-hidden rounded-lg border">
              <Image
                src={preview!}
                alt={title}
                width={previewWidth}
                height={previewHeight}
                className="h-full w-full object-cover"
                unoptimized
              />
              <div className="bg-foreground/20 pointer-events-none absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition group-hover:opacity-100">
                <CheckCircle2 className="text-chart-2 h-5 w-5" />
                <span className="text-primary-foreground text-xs font-semibold">
                  ចុចដើម្បីប្តូរ
                </span>
              </div>
            </div>
            <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
              <span className="truncate font-medium">{file.name}</span>
              <span className="ml-2 shrink-0">{fmtBytes(file.size)}</span>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
