import React, { useState, useRef } from 'react';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  CheckCircle2,
  Paperclip,
  Trash2,
  Star,
  Send,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  FileSpreadsheet,
  Image as ImageIcon,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';
import { TaskItem } from '../../types';
import { TaskDeadlineTimer } from '../TaskDeadlineTimer';
import { BetaExpiredBanner } from '../beta/BetaExpiredBanner';
import {
  fileToBase64,
  isFileTypeSupported,
  getFileExtension,
  formatFileSize,
  isGoogleDocumentUrl,
} from '../../services/deliverableEvaluator';

interface TasksViewProps {
  onOpenTask?: (task: TaskItem) => void;
}

export const TasksView: React.FC<TasksViewProps> = () => {
  const {
    todaysTask,
    tasks,
    client,
    currentDay,
    setActiveTab,
    submitTask,
    activeService,
    betaState,
    setIsBetaAdminModalOpen,
  } = useSimulation();

  // Submission state for Today's Task
  const [submissionMethod, setSubmissionMethod] = useState<'file' | 'link'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFileDataUrl, setSelectedFileDataUrl] = useState<string | null>(null);
  const [documentLink, setDocumentLink] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showResubmitForm, setShowResubmitForm] = useState(false);
  const [showPastTasks, setShowPastTasks] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const task = todaysTask || tasks[0];
  const pastTasks = tasks.filter((t) => t.id !== task?.id);

  if (!task) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-3 max-w-4xl mx-auto">
        <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">No active tasks for today</h2>
        <p className="text-sm text-slate-500">You are all caught up! Advance to the next simulation day when ready.</p>
      </div>
    );
  }

  const isEvaluated = task.status === 'evaluated';
  const isSubmitted = task.status === 'submitted';
  const isRevisionRequested = task.status === 'revision_requested';
  const currentEvaluation = task.evaluation;

  const handleFileChange = async (file: File) => {
    setEvaluationError(null);
    if (!isFileTypeSupported(file.name)) {
      setEvaluationError('File type not supported. Please upload a PDF, DOCX, XLSX, CSV, PNG, or JPG file.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setEvaluationError('File size exceeds 15MB. Please upload a smaller deliverable file.');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setSelectedFile(file);
      setSelectedFileDataUrl(base64);
    } catch {
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
        setEvaluationError(result.error || "We couldn't access this document link. Please make sure anyone with the link can view it or upload the file directly.");
        return;
      }

      // Reset form
      setSelectedFile(null);
      setSelectedFileDataUrl(null);
      setDocumentLink('');
      setSubmissionMessage('');
      setShowResubmitForm(false);
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
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Beta Status Notice Banner */}
      <BetaExpiredBanner onOpenAdmin={() => setIsBetaAdminModalOpen(true)} />

      {/* Top Banner: Day & Client Indicator */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Today's Work • Day {task.dayNumber} of 90</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {task.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Client: <strong className="text-slate-900">{client.ceoName}</strong> ({client.companyName})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <TaskDeadlineTimer task={task} variant="badge" />
          <button
            onClick={() => setActiveTab('chat')}
            className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat with {client.ceoName.split(' ')[0]}</span>
          </button>
        </div>
      </div>

      {/* PRIMARY WORKFLOW: 9-STEP LINEAR ORDER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-8">
        {/* 1. What the client needs */}
        <section id="step-1-needs" className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              What the client needs
            </h2>
          </div>
          <div className="pl-8">
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {task.title}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Category: <span className="font-semibold text-slate-700">{task.category}</span> • Specialization: <span className="font-semibold text-slate-700">{activeService.name}</span>
            </p>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 2. Client request */}
        <section id="step-2-request" className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Client Request
            </h2>
          </div>
          <div className="pl-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-start space-x-3">
              <img
                src={client.avatarUrl}
                alt={client.ceoName}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-300"
                referrerPolicy="no-referrer"
              />
              <div className="text-sm text-slate-800 leading-relaxed">
                <div className="font-bold text-xs text-slate-900 mb-1">
                  Message from {client.ceoName}:
                </div>
                <p className="italic">"{task.clientContext}"</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 3. Context */}
        <section id="step-3-context" className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Context & Background
            </h2>
          </div>
          <div className="pl-8">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {task.brief}
            </p>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 4. Expected deliverable */}
        <section id="step-4-deliverable" className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Expected Deliverable
            </h2>
          </div>
          <div className="pl-8 space-y-2">
            <p className="text-xs text-slate-500">
              You must produce and submit the following deliverable item(s):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {task.deliverables.map((del) => (
                <div
                  key={del.id}
                  className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start space-x-3 text-xs sm:text-sm text-slate-800"
                >
                  <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">{del.label}</span>
                    <span className="text-xs text-slate-500 font-normal">
                      Accepted format: PDF, Word (.docx), Excel (.xlsx/.csv), PNG, JPG or Google Doc link
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 5 & 6. Deadline & Priority */}
        <section id="step-5-6-deadline-priority" className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              5 & 6
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Deadline & Priority
            </h2>
          </div>
          <div className="pl-8 space-y-3">
            {/* Step 5: Task Deadline Timer */}
            <TaskDeadlineTimer task={task} variant="full" />

            {/* Step 6: Priority Level */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3.5">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium block">6. Priority Level</span>
                <span
                  className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-md inline-block mt-0.5 ${
                    task.priority === 'urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : task.priority === 'high'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {task.priority} Priority
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  {task.priority === 'urgent'
                    ? 'Requires immediate attention today'
                    : 'Standard business priority for today'}
                </span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 7. Helpful information */}
        <section id="step-7-info" className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              7
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Helpful Information & Client Guidelines
            </h2>
          </div>
          <div className="pl-8 space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-slate-900">
                <Info className="w-4 h-4 text-indigo-600" />
                <span>Client Operating Rules to Remember:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong className="text-slate-800">Communication Style:</strong> {client.communicationStyle}</li>
                <li><strong className="text-slate-800">Primary Preference:</strong> {client.clientPreferences[0]}</li>
                <li><strong className="text-slate-800">Quality Standard:</strong> Be clear, accurate, and professional. Avoid filler words.</li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 8. Chat with client */}
        <section id="step-8-chat" className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              8
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Chat with Client
            </h2>
          </div>
          <div className="pl-8">
            <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Have questions or need clarification before submitting?
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  You can message {client.ceoName} at any time to confirm preferences or clarify instructions.
                </p>
              </div>
              <button
                id="task-chat-with-client-btn"
                onClick={() => setActiveTab('chat')}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs shrink-0 flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat with Client</span>
              </button>
            </div>
          </div>
        </section>

        <hr className="border-slate-100" />

        {/* 9. Submit work */}
        <section id="step-9-submit" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                9
              </span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Submit Your Work
              </h2>
            </div>
            {isEvaluated && !showResubmitForm && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                ✓ Graded: {currentEvaluation?.score}/100
              </span>
            )}
          </div>

          <div className="pl-8 space-y-6">
            {/* If task is already evaluated and student is NOT currently resubmitting, show the Grade & Feedback Card */}
            {isEvaluated && !showResubmitForm && currentEvaluation && (
              <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/20 p-6 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Performance Evaluation Result
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {isRevisionRequested ? 'Revision Requested by Client' : 'Deliverable Approved & Graded'}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-emerald-200 shadow-xs shrink-0">
                    <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
                    <span className="text-xl font-bold text-slate-900">{currentEvaluation.score} / 100</span>
                  </div>
                </div>

                {/* 5 Dimensions Breakdown */}
                <div>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                    5-Dimension Scorecard:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    {[
                      { label: 'Accuracy', val: currentEvaluation.accuracy || 9 },
                      { label: 'Communication', val: currentEvaluation.communication || 9 },
                      { label: 'Judgement', val: currentEvaluation.judgement || 9 },
                      { label: 'Initiative', val: currentEvaluation.initiative || 8 },
                      { label: 'Client Handling', val: currentEvaluation.clientHandling || 9 },
                    ].map((dim, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[10px] font-medium text-slate-500 block truncate">{dim.label}</span>
                        <span className="text-sm font-bold text-slate-900">{dim.val} / 10</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timing & Turnaround Performance */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider mr-1">
                    Delivery Timing:
                  </span>
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      currentEvaluation.submittedOnTime !== false
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {currentEvaluation.submittedOnTime !== false
                        ? `On-Time Delivery (${currentEvaluation.actualDurationMinutes || task.actualDurationMinutes || task.estimatedMinutes || 30} min turnaround)`
                        : `Delivered +${currentEvaluation.minutesLate || task.minutesLate || 0}m past cutoff (${currentEvaluation.actualDurationMinutes || task.actualDurationMinutes || 45} mins total)`}
                    </span>
                  </span>

                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <span>
                      Deadline Mode:{' '}
                      <strong className="text-slate-900 font-bold">
                        {task.deadlineType === 'hard' ? 'Hard (Urgent Turnaround)' : task.deadlineType === 'none' ? 'Flexible Timeline' : 'Soft Deadline'}
                      </strong>
                    </span>
                  </span>
                </div>

                {/* Written Feedback */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-slate-700 block">Feedback:</span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    "{currentEvaluation.feedback}"
                  </p>
                </div>

                {/* Client Reaction Quote */}
                {currentEvaluation.clientReaction && (
                  <div className="bg-indigo-50/70 p-4 rounded-xl border border-indigo-100 flex items-start space-x-3">
                    <img
                      src={client.avatarUrl}
                      alt={client.ceoName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="text-xs sm:text-sm text-slate-800">
                      <span className="font-bold text-indigo-900 block mb-0.5">{client.ceoName} says:</span>
                      <p className="italic">"{currentEvaluation.clientReaction}"</p>
                    </div>
                  </div>
                )}

                {/* Strengths & Improvement Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-emerald-200 space-y-1.5">
                    <span className="font-bold text-emerald-800 block">What you did well:</span>
                    {currentEvaluation.strengths.map((str, i) => (
                      <p key={i} className="text-emerald-950 flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{str}</span>
                      </p>
                    ))}
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                    <span className="font-bold text-amber-800 block">What to improve:</span>
                    {currentEvaluation.areasToImprove.map((ar, i) => (
                      <p key={i} className="text-amber-950 flex items-start space-x-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{ar}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* Resubmit button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setShowResubmitForm(true)}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Submit a Revised Deliverable</span>
                  </button>
                </div>
              </div>
            )}

            {/* Submission Form (Shown if not yet evaluated OR if user clicked Resubmit) */}
            {!betaState.canPerformTasks ? (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                <p className="text-sm font-bold text-slate-800">
                  {betaState.isNotStarted
                    ? 'Your beta access has not been activated yet.'
                    : betaState.isRevoked
                    ? 'Your CoreGuide access has been temporarily disabled.'
                    : 'Your CoreGuide beta period has ended.'}
                </p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {betaState.isNotStarted
                    ? 'Your enrollment is awaiting administrator activation. Once activated, your 14-day beta period will begin from Day 1.'
                    : betaState.isRevoked
                    ? 'Please contact your CoreGuide administrator regarding your training account.'
                    : 'Thank you for helping us test CoreGuide. Deliverable submissions are closed for this beta account, while all prior scorecards, client chats, and competencies remain preserved.'}
                </p>
              </div>
            ) : (
              (!isEvaluated || showResubmitForm) && (
                <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
                {/* Method selector tabs */}
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setSubmissionMethod('file')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border ${
                      submissionMethod === 'file'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload File (PDF, Word, Excel, Image)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSubmissionMethod('link')}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border ${
                      submissionMethod === 'link'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span>Add Google Docs / Sheets Link</span>
                  </button>
                </div>

                {/* File Upload Section */}
                {submissionMethod === 'file' ? (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                    />

                    {!selectedFile ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`p-8 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                          isDragOver
                            ? 'border-indigo-600 bg-indigo-50/80'
                            : 'border-slate-300 hover:border-indigo-400 bg-white'
                        }`}
                      >
                        <Upload className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                        <p className="text-sm font-bold text-slate-900">
                          Click to browse or drag and drop your deliverable file
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Supported formats: PDF, Word (.docx), Excel (.xlsx, .csv), Images (.png, .jpg) up to 15MB
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="p-2 rounded-lg bg-indigo-50">
                            {getFileIcon(selectedFile.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatFileSize(selectedFile.size)} • Ready for evaluation
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                          title="Remove file"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Google Link Section */
                  <div className="space-y-2 bg-white p-5 rounded-2xl border border-slate-200">
                    <label className="text-xs font-bold text-slate-700 block">
                      Google Document or Spreadsheet URL:
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="url"
                        value={documentLink}
                        onChange={(e) => setDocumentLink(e.target.value)}
                        placeholder="https://docs.google.com/document/d/... or spreadsheet link"
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Ensure your Google Doc link is set to "Anyone with the link can view".
                    </p>
                  </div>
                )}

                {/* Optional Message to Client */}
                <div className="space-y-1.5 bg-white p-5 rounded-2xl border border-slate-200">
                  <label className="text-xs font-bold text-slate-700 block">
                    Optional: Message to client
                  </label>
                  <textarea
                    rows={3}
                    value={submissionMessage}
                    onChange={(e) => setSubmissionMessage(e.target.value)}
                    placeholder={`Hi ${client.ceoName.split(' ')[0]}, here is today's completed deliverable following your requested guidelines...`}
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Error Banner */}
                {evaluationError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{evaluationError}</span>
                  </div>
                )}

                {/* Submit Action Button */}
                <div className="flex items-center justify-between pt-2">
                  {showResubmitForm && (
                    <button
                      type="button"
                      onClick={() => setShowResubmitForm(false)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Cancel Resubmission
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || (submissionMethod === 'file' ? !selectedFile : !documentLink.trim())}
                    className="ml-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 text-white rounded-xl font-bold text-sm shadow-sm flex items-center space-x-2 transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Evaluating Deliverable...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Work</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ))}
          </div>
        </section>
      </div>

      {/* Previous Completed Tasks Collapsible Section (If any) */}
      {pastTasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <button
            onClick={() => setShowPastTasks(!showPastTasks)}
            className="w-full p-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Previous Simulation Tasks ({pastTasks.length})
              </h3>
              <p className="text-xs text-slate-500">
                Review briefs and deliverables from earlier days
              </p>
            </div>
            <div className="p-1 rounded-lg bg-slate-100 text-slate-600">
              {showPastTasks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showPastTasks && (
            <div className="divide-y divide-slate-100 border-t border-slate-100 p-4 space-y-3">
              {pastTasks.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                        Day {t.dayNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{t.title}</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-1">{t.brief}</p>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      Score: {t.evaluation?.score || 90}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
