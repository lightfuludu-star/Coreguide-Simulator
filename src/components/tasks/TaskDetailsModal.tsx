import React, { useState, useRef } from 'react';
import {
  X,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  CheckCircle2,
  Paperclip,
  Trash2,
  Calendar,
  User,
  Star,
  Send,
  Info,
  Sparkles,
  Link as LinkIcon,
  FileSpreadsheet,
  Image as ImageIcon,
  History,
  RotateCcw,
  Check,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { TaskItem, TaskSubmissionRecord, TaskEvaluation } from '../../types';
import { useSimulation } from '../../context/SimulationContext';
import {
  fileToBase64,
  isFileTypeSupported,
  getFileExtension,
  formatFileSize,
  isGoogleDocumentUrl,
  SUPPORTED_FILE_TYPES_LABEL,
} from '../../services/deliverableEvaluator';

interface TaskDetailsModalProps {
  task: TaskItem | null;
  onClose: () => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const { submitTask, client, activeService } = useSimulation();

  // Submission form state
  const [submissionMethod, setSubmissionMethod] = useState<'file' | 'link'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileDataUrl, setSelectedFileDataUrl] = useState<string | null>(null);
  const [documentLink, setDocumentLink] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'workspace' | 'history'>('overview');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showResubmitForm, setShowResubmitForm] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!task) return null;

  const currentSubmission = task.submission;
  const currentEvaluation = task.evaluation;
  const submissionHistory = task.submissions || (currentSubmission ? [currentSubmission] : []);
  const attemptCount = submissionHistory.length;

  const isEvaluated = task.status === 'evaluated';
  const isRevisionRequested = task.status === 'revision_requested';
  const isApproved = task.submissionState === 'approved' || (isEvaluated && (currentEvaluation?.score || 0) >= 75);

  const handleFileChange = async (file: File) => {
    setEvaluationError(null);
    if (!isFileTypeSupported(file.name)) {
      setEvaluationError(`File type not supported. Please upload PDF, DOCX, XLSX, CSV, PNG or JPG.`);
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setEvaluationError(`File size exceeds 15MB limit. Please upload a smaller deliverable file.`);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setSelectedFile(file);
      setSelectedFileDataUrl(base64);
    } catch (err) {
      setEvaluationError('Could not process this file. Please try selecting it again.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSelectedFileDataUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluationError(null);

    if (submissionMethod === 'file') {
      if (!selectedFile || !selectedFileDataUrl) {
        setEvaluationError('Please select or drag-and-drop your deliverable file (PDF, DOCX, XLSX, CSV, PNG, JPG).');
        return;
      }
    } else {
      if (!documentLink.trim()) {
        setEvaluationError('Please enter your Google Docs or Google Sheets document URL.');
        return;
      }
      if (!documentLink.startsWith('http://') && !documentLink.startsWith('https://')) {
        setEvaluationError('Please enter a valid document URL starting with https://');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const result = await submitTask({
        taskId: task.id,
        submissionType: submissionMethod,
        fileName: selectedFile?.name,
        fileSize: selectedFile ? formatFileSize(selectedFile.size) : undefined,
        fileType: selectedFile ? getFileExtension(selectedFile.name) : undefined,
        fileData: selectedFileDataUrl || undefined,
        documentLink: submissionMethod === 'link' ? documentLink.trim() : undefined,
        submissionMessage: submissionMessage.trim(),
      });

      setIsSubmitting(false);

      if (result.accessible === false) {
        setEvaluationError(result.error || "We couldn't access this document. Please make sure the link has the required access or upload the file instead.");
        return;
      }

      // Reset form fields
      setSelectedFile(null);
      setSelectedFileDataUrl(null);
      setDocumentLink('');
      setSubmissionMessage('');
      setShowResubmitForm(false);
      setActiveTab('overview');
    } catch (err: any) {
      setIsSubmitting(false);
      setEvaluationError(err?.message || 'An error occurred while evaluating your submission. Please try again.');
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = getFileExtension(fileName);
    if (ext === 'xlsx' || ext === 'csv') return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') return <ImageIcon className="w-5 h-5 text-purple-600" />;
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-rose-600" />;
    return <FileText className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div
        id="task-details-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="space-y-1 pr-4">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                Day {task.dayNumber} Deliverable
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {task.category}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  task.priority === 'urgent'
                    ? 'bg-rose-50 text-rose-700 border border-rose-100'
                    : task.priority === 'high'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {task.priority.toUpperCase()} PRIORITY
              </span>
              {isApproved && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Approved ({currentEvaluation?.score}/100)</span>
                </span>
              )}
              {isRevisionRequested && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1">
                  <RotateCcw className="w-3 h-3 text-amber-600" />
                  <span>Revision Requested</span>
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {task.title}
            </h2>
          </div>

          <button
            id="close-task-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-4 sm:px-6 border-b border-slate-200 bg-white space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Task Brief & Client Context</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'workspace'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Submit Your Work</span>
            {currentSubmission && (
              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-mono">
                {attemptCount}
              </span>
            )}
          </button>

          {submissionHistory.length > 0 && (
            <button
              onClick={() => setActiveTab('history')}
              className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
                activeTab === 'history'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Submission History ({submissionHistory.length})</span>
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm text-slate-700 flex-1">
          {/* TAB 1: OVERVIEW & CLIENT CONTEXT */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Client Direction Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800">
                <div className="flex items-center space-x-2.5 mb-2">
                  <img
                    src={client.avatarUrl}
                    alt={client.ceoName}
                    className="w-7 h-7 rounded-full object-cover border border-slate-600"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Client Direction ({client.ceoName}, {client.ceoRole})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {client.companyName} &bull; {client.timezone}
                    </span>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-slate-300 font-mono italic">
                  "{task.clientContext}"
                </p>
              </div>

              {/* Task Brief */}
              <div className="space-y-1.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>Task Brief & Scope of Work</span>
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
                  {task.brief}
                </p>
              </div>

              {/* Required Deliverables */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Required Deliverable Items ({task.deliverables.length})
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {task.deliverables.map((del) => (
                    <div
                      key={del.id}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs"
                    >
                      <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                        {del.type === 'spreadsheet' ? (
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        ) : del.type === 'image' ? (
                          <ImageIcon className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-slate-900">{del.label}</span>
                        <span className="ml-2 text-[10px] text-slate-500 font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                          [{del.type.replace('_', ' ')}]
                        </span>
                      </div>
                      {del.required && (
                        <span className="text-[10px] text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                          Required
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Callout if not yet submitted or if revision requested */}
              {!isEvaluated && !isRevisionRequested && (
                <div className="p-4 bg-indigo-50/70 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-indigo-950">Ready to submit your completed work?</p>
                    <p className="text-[11px] text-indigo-700">
                      Complete your deliverable using Google Docs, Sheets, Canva, Word, or Excel, then upload here.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('workspace')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
                  >
                    <span>Open Submission Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* If Evaluated: Show 5-Dimension Evaluation Feedback */}
              {isEvaluated && currentEvaluation && (
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center space-x-2 text-slate-900">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold text-sm">Official 5-Dimension Evaluation</span>
                    </div>
                    <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm">
                      <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
                      <span>Overall: {currentEvaluation.score} / 100</span>
                    </div>
                  </div>

                  {/* 5 Dimensions Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { label: 'Accuracy', val: currentEvaluation.accuracy },
                      { label: 'Communication', val: currentEvaluation.communication },
                      { label: 'Judgement', val: currentEvaluation.judgement },
                      { label: 'Initiative', val: currentEvaluation.initiative },
                      { label: 'Client Handling', val: currentEvaluation.clientHandling },
                    ].map((dim, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 text-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block truncate">{dim.label}</span>
                        <span className="text-sm font-bold text-indigo-600">{dim.val} / 10</span>
                      </div>
                    ))}
                  </div>

                  {/* Client Reaction Quote */}
                  {currentEvaluation.clientReaction && (
                    <div className="p-3.5 bg-indigo-50/80 rounded-lg border border-indigo-100 flex items-start space-x-2.5">
                      <img
                        src={client.avatarUrl}
                        alt={client.ceoName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                      />
                      <div className="text-xs text-slate-700">
                        <span className="font-bold text-indigo-900 block mb-0.5">{client.ceoName} Reaction:</span>
                        <p className="italic">"{currentEvaluation.clientReaction}"</p>
                      </div>
                    </div>
                  )}

                  {/* AI Coaching Commentary */}
                  <div className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900 block">AI Coaching Assessment:</span>
                    <p>{currentEvaluation.feedback}</p>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                      <span className="font-bold text-emerald-800 block mb-1">Key Strengths Demonstrated:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {currentEvaluation.strengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                      <span className="font-bold text-amber-800 block mb-1">Recommendations & Focus Areas:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {(currentEvaluation.areasToImprove || currentEvaluation.weaknesses || []).map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* If Revision Requested: Prominent Banner */}
              {isRevisionRequested && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-900">Revision Requested by Client</h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        Your previous submission requires updates before final client approval. Review the feedback and upload your revised deliverable.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('workspace');
                      setShowResubmitForm(true);
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Revise & Resubmit Deliverable</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SUBMIT YOUR WORK (ACTIVE WORKSPACE) */}
          {activeTab === 'workspace' && (
            <div className="space-y-5">
              {/* Submission Workspace Intro */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Task Submission Workspace
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Complete the task using the tools available to you (Google Docs, Google Sheets, Canva, Word, Excel, etc.), then submit your finished deliverable here for real 5-dimension evaluation.
                </p>
              </div>

              {/* If loading / evaluating */}
              {isSubmitting && (
                <div className="p-8 rounded-xl bg-indigo-50/50 border border-indigo-100 text-center space-y-3">
                  <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-950">Analyzing & Evaluating Deliverable...</h4>
                    <p className="text-xs text-indigo-700 mt-1">
                      Benchmarking your submission across Accuracy, Communication, Judgement, Initiative, and Client Handling.
                    </p>
                  </div>
                </div>
              )}

              {!isSubmitting && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Submission Method Toggle */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Select Submission Method:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSubmissionMethod('file')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                          submissionMethod === 'file'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload File (PDF, DOCX, XLSX, PNG, JPG)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSubmissionMethod('link')}
                        className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 transition-all ${
                          submissionMethod === 'link'
                            ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <LinkIcon className="w-4 h-4" />
                        <span>Google Docs / Sheets Link</span>
                      </button>
                    </div>
                  </div>

                  {/* FILE UPLOAD ZONE */}
                  {submissionMethod === 'file' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">
                        Deliverable File
                      </label>

                      {selectedFile ? (
                        <div className="p-3.5 rounded-xl bg-white border border-indigo-200 flex items-center justify-between shadow-xs">
                          <div className="flex items-center space-x-3 truncate">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                              {getFileIcon(selectedFile.name)}
                            </div>
                            <div className="truncate">
                              <span className="font-semibold text-xs text-slate-900 block truncate">
                                {selectedFile.name}
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {formatFileSize(selectedFile.size)} &bull; {getFileExtension(selectedFile.name).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                            isDragOver
                              ? 'border-indigo-600 bg-indigo-50/50'
                              : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-indigo-50/10'
                          }`}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.txt,.md"
                            onChange={(e) => {
                              if (e.target.files && e.target.files.length > 0) {
                                handleFileChange(e.target.files[0]);
                              }
                            }}
                            className="hidden"
                          />
                          <Upload className="w-7 h-7 mx-auto text-indigo-600 mb-2" />
                          <p className="font-bold text-xs text-slate-800">
                            Click to browse or drag and drop your deliverable
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            Supported: {SUPPORTED_FILE_TYPES_LABEL} (Max 15MB)
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GOOGLE DOCS / SHEETS LINK INPUT */}
                  {submissionMethod === 'link' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700">
                        Google Docs or Google Sheets URL
                      </label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          id="document-link-input"
                          type="url"
                          value={documentLink}
                          onChange={(e) => setDocumentLink(e.target.value)}
                          placeholder="https://docs.google.com/document/d/... or spreadsheets/d/..."
                          className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Important: Ensure sharing permissions on your Google Doc/Sheet are set to <strong className="text-slate-700">"Anyone with the link can view"</strong> so our evaluation engine can review your work.
                      </p>
                    </div>
                  )}

                  {/* OPTIONAL STUDENT MESSAGE TO CLIENT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Message to Client (Optional)
                    </label>
                    <textarea
                      id="submission-message-input"
                      rows={3}
                      value={submissionMessage}
                      onChange={(e) => setSubmissionMessage(e.target.value)}
                      placeholder="Tell your client anything they should know about your submission (e.g., 'Completed the customer response spreadsheet and prioritized the urgent complaints.')"
                      className="w-full text-xs rounded-xl border border-slate-300 p-3 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  {/* ERROR DISPLAY */}
                  {evaluationError && (
                    <div className="flex items-start space-x-2 text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{evaluationError}</span>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('overview')}
                      className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-colors flex items-center space-x-2 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{attemptCount > 0 ? 'Resubmit Deliverable & Re-Evaluate' : 'Submit Work & Evaluate'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: SUBMISSION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Deliverable Submission History ({submissionHistory.length} Attempts)
                </h4>
                <button
                  onClick={() => setActiveTab('workspace')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1"
                >
                  <span>+ New Submission Attempt</span>
                </button>
              </div>

              <div className="space-y-3">
                {submissionHistory.map((sub, index) => {
                  const evalItem = sub.evaluation;
                  return (
                    <div
                      key={sub.id || index}
                      className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                            Attempt #{sub.attemptNumber || index + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {sub.submissionType === 'file' ? sub.fileName : 'Google Document Link'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                          {evalItem && (
                            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                              Score: {evalItem.score}/100
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Student message */}
                      {sub.submissionMessage && (
                        <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
                          <span className="font-bold text-slate-700 block text-[10px] uppercase">Student Note:</span>
                          "{sub.submissionMessage}"
                        </div>
                      )}

                      {/* Client Reaction & Evaluation Summary */}
                      {evalItem && (
                        <div className="space-y-2 text-xs">
                          {evalItem.clientReaction && (
                            <p className="italic text-slate-700 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                              <strong className="text-indigo-900 not-italic block mb-0.5">{client.ceoName} Reaction:</strong>
                              "{evalItem.clientReaction}"
                            </p>
                          )}
                          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                            <div className="bg-slate-50 p-1 rounded font-medium">Acc: {evalItem.accuracy}</div>
                            <div className="bg-slate-50 p-1 rounded font-medium">Comm: {evalItem.communication}</div>
                            <div className="bg-slate-50 p-1 rounded font-medium">Judg: {evalItem.judgement}</div>
                            <div className="bg-slate-50 p-1 rounded font-medium">Init: {evalItem.initiative}</div>
                            <div className="bg-slate-50 p-1 rounded font-medium">Client: {evalItem.clientHandling}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
