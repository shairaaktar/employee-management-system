import { useState } from "react";
import API from "../api";
import toast from "react-hot-toast";
import { CheckCircle, RotateCcw, Paperclip } from "lucide-react";

export default function TaskCard({ task, onUpdate }) {
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const addComment = async () => {
    if (!comment.trim()) return;
    try {
      await API.post(`/tasks/${task._id}/comments`, { text: comment });
      setComment("");
      toast.success("Comment added");
      onUpdate();
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    const form = new FormData();
    form.append("file", file);
    setUploading(true);
    try {
      await API.post(`/tasks/${task._id}/attachments`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("File uploaded");
      setFile(null);
      onUpdate();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const markProgress = async (p, note = "") => {
    try {
      await API.put(`/tasks/${task._id}/progress`, { progress: p, note });
      toast.success("Progress updated");
      onUpdate();
    } catch {
      toast.error("Failed to update progress");
    }
  };

  const approve = async () => {
    try {
      await API.put(`/tasks/${task._id}/approve`);
      toast.success("Task approved");
      onUpdate();
    } catch {
      toast.error("Approve failed");
    }
  };

  const returnTask = async () => {
    const reason = prompt("Reason for returning the task to employee:");
    if (!reason) return;
    try {
      await API.put(`/tasks/${task._id}/return`, { reason });
      toast.success("Task returned");
      onUpdate();
    } catch {
      toast.error("Return failed");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            Assigned: {task.assignedTo?.name || "—"} • Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : "—"}
          </p>
        </div>

        <div className="text-right">
          {task.blocked && <div className="text-xs text-red-600 font-semibold">Blocked</div>}
          <div className="text-xs text-gray-500 mt-2">Progress: {task.progress}%</div>
        </div>
      </div>

      
      <div className="mt-3 flex items-center gap-2">
        <Paperclip size={16} />
        <div className="text-sm">
          {task.attachments?.length > 0 ? (
            task.attachments.map((a, i) => (
              <div key={i}>
                <a className="text-blue-600 text-sm hover:underline" href={a.filePath} target="_blank" rel="noreferrer">{a.fileName}</a>
              </div>
            ))
          ) : (
            <span className="text-gray-400">No attachments</span>
          )}
        </div>
      </div>

    
      <div className="mt-3">
        <div className="text-sm font-medium mb-1">Comments</div>
        <div className="max-h-28 overflow-y-auto text-sm space-y-2">
          {task.comments?.length ? task.comments.map((c) => (
            <div key={c._id} className="text-xs text-gray-700">
              <strong>{c.user?.name || "User"}</strong>: {c.text}
            </div>
          )) : <div className="text-xs text-gray-400">No comments</div>}
        </div>

        <div className="flex gap-2 mt-2">
          <input value={comment} onChange={e=>setComment(e.target.value)} className="border p-1 rounded w-full" placeholder="Add comment..." />
          <button onClick={addComment} className="bg-blue-600 text-white px-3 rounded">Send</button>
        </div>
      </div>

     
      <div className="mt-3 flex items-center gap-2">
        <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
        <button onClick={uploadFile} disabled={uploading || !file} className="bg-gray-800 text-white px-3 py-1 rounded">
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

     
      <div className="flex justify-end gap-2 mt-4">
        {task.needsApproval && (
          <>
            <button onClick={approve} className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2">
              <CheckCircle size={16} /> Approve
            </button>
            <button onClick={returnTask} className="bg-yellow-400 text-black px-3 py-1 rounded">Return</button>
          </>
        )}

        <button onClick={()=>markProgress(Math.min(100, (task.progress||0)+10), "Quick update")} className="bg-indigo-500 text-white px-3 py-1 rounded">
          +10%
        </button>

        <button onClick={()=>markProgress(0, "Reset progress")} className="bg-gray-200 px-3 py-1 rounded">Reset</button>
      </div>
    </div>
  );
}
