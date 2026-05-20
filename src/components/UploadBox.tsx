import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { validatePDF } from '../services/pdfService'

interface UploadBoxProps {
  onFileSelected: (file: File) => void
  isLoading?: boolean
}

export default function UploadBox({ onFileSelected, isLoading = false }: UploadBoxProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = (acceptedFiles: File[]) => {
    setError(null)

    if (acceptedFiles.length === 0) {
      setError('No file selected')
      return
    }

    const file = acceptedFiles[0]
    const validation = validatePDF(file)

    if (!validation.valid) {
      setError(validation.error || 'Invalid file')
      toast.error(validation.error || 'Invalid file')
      return
    }

    onFileSelected(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: isLoading,
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
          isDragActive
            ? 'border-indigo-600 bg-indigo-50'
            : 'border-slate-300 hover:border-indigo-400'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={isLoading} />

        <div className="flex justify-center mb-3">
          <Upload size={40} className="text-indigo-600" />
        </div>

        {isDragActive ? (
          <p className="text-indigo-600 font-semibold">Drop your resume here...</p>
        ) : (
          <>
            <p className="font-semibold text-slate-900">Drag and drop your resume</p>
            <p className="text-sm text-slate-600">or click to browse</p>
          </>
        )}

        <p className="text-xs text-slate-500 mt-2">PDF format • Max 5MB</p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  )
}
