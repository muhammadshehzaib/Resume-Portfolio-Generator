'use client';

import { motion } from "framer-motion";
import DropZone from '../upload/DropZone';
import UploadProgress from '../upload/UploadProgress';

interface IngestionModuleProps {
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  error?: string;
  fileName?: string;
  onFileSelect: (file: File) => void;
}

export default function IngestionModule({ status, error, fileName, onFileSelect }: IngestionModuleProps) {
  return (
    <motion.section 
      id="upload"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-200px" }}
      transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
      className="px-8 py-32 md:px-20 lg:py-56 flex flex-col lg:flex-row gap-24 items-start bg-white"
    >
      <div className="lg:w-1/3 sticky top-32">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-8"
        >
          <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-black flex items-center gap-4">
            <span className="w-8 h-[1px] bg-black"></span>
            Phase 01
          </div>
          <h2 className="text-5xl font-medium tracking-tighter text-black leading-tight">Data <br /> Ingestion.</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Our parser decodes your professional history into a standardized semantic structure. Precision is the primary directive.
          </p>
        </motion.div>
      </div>

      <div className="lg:w-2/3 w-full group">
        <motion.div 
          whileHover={{ y: -5 }}
          className="border border-gray-100 p-12 lg:p-20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] bg-white rounded-sm relative overflow-hidden"
        >
          <div className="relative z-10">
            <DropZone onFileSelect={onFileSelect} disabled={status !== 'idle'} />
            <div className="mt-12">
              <UploadProgress status={status} error={error} fileName={fileName} />
            </div>
          </div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 blur-[100px] rounded-full pointer-events-none"
          />
        </motion.div>
      </div>
    </motion.section>
  );
}
