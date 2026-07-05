'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, ImageIcon } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onError?: (error: string) => void;
}

export default function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        onError?.('Please upload an image file (JPEG, PNG, WebP, etc.)');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        onError?.('Image must be under 5MB.');
        return;
      }

      setUploading(true);
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        onError?.(`Upload failed: ${uploadError.message}`);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      onChange(data.publicUrl);
      setUploading(false);
    },
    [supabase, onChange, onError]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const clearImage = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-[#1A1A2E] mb-1.5">
        Product Image
      </label>

      {value ? (
        /* Preview */
        <div className="relative rounded-2xl overflow-hidden border border-[#E9ECEF] bg-[#F8F9FA] aspect-square max-w-[200px] mx-auto">
          <Image
            src={value}
            alt="Product preview"
            fill
            className="object-contain p-3"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-[#FF6B35] bg-[#FF6B35]/5'
              : 'border-[#E9ECEF] bg-[#F8F9FA] hover:border-[#FF6B35]/50 hover:bg-[#FFF5F2]'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload-input"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#E9ECEF] border-t-[#FF6B35] animate-spin" />
              <p className="text-sm text-[#6C757D]">Uploading…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center">
                {dragOver ? (
                  <Upload size={22} className="text-[#FF6B35]" />
                ) : (
                  <ImageIcon size={22} className="text-[#FF6B35]" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A2E]">
                  {dragOver ? 'Drop image here' : 'Upload product image'}
                </p>
                <p className="text-xs text-[#ADB5BD] mt-1">
                  Drag & drop or click to browse · Max 5MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
