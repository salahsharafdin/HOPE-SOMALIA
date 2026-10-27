import React, { useState } from 'react';
import { Camera, Plus, Trash2, Users } from 'lucide-react';
import { getImageUrl } from '../../utils/imageUrl';
import { createLeadershipMember } from '../../data/aboutLeadershipTeam';

export default function AboutLeadershipEditor({
  members,
  onChange,
  disabled = false,
  onUploadPhoto,
}) {
  const [uploadingId, setUploadingId] = useState(null);

  const updateMember = (id, patch) => {
    onChange(members.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const removeMember = (id) => {
    onChange(members.filter((m) => m.id !== id));
  };

  const addMember = () => {
    onChange([...members, createLeadershipMember()]);
  };

  const handleFile = async (memberId, event) => {
    const file = event.target.files?.[0];
    if (!file || disabled) return;
    setUploadingId(memberId);
    try {
      await onUploadPhoto(memberId, file);
    } finally {
      setUploadingId(null);
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Edit leadership profiles below. Photos stay linked to each member by ID until you save or publish.
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={addMember}
          className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Team Member
        </button>
      </div>

      <div className="space-y-4">
        {members.map((member) => {
          const previewSrc = getImageUrl(member.image);
          const isUploading = uploadingId === member.id;

          return (
            <div
              key={member.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 min-w-0"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 min-w-0">
                <div className="flex flex-col items-center sm:items-start gap-2 shrink-0">
                  <div className="relative">
                    {previewSrc ? (
                      <img
                        src={previewSrc}
                        alt={member.name || 'Team member preview'}
                        className="w-24 h-24 rounded-full object-cover border-2 border-teal-500/50 shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center">
                        <Users className="w-8 h-8 text-slate-500" />
                      </div>
                    )}
                    {!disabled && (
                      <label
                        className={`absolute -bottom-1 -right-1 p-2 rounded-xl bg-teal-600 text-white shadow-md cursor-pointer hover:bg-teal-500 ${
                          isUploading ? 'opacity-60 pointer-events-none' : ''
                        }`}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFile(member.id, e)}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300 block">Full Name</label>
                    <input
                      type="text"
                      value={member.name}
                      disabled={disabled}
                      onChange={(e) => updateMember(member.id, { name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300 block">Job Title</label>
                    <input
                      type="text"
                      value={member.title}
                      disabled={disabled}
                      onChange={(e) => updateMember(member.id, { title: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300 block">Biography</label>
                    <textarea
                      rows={3}
                      value={member.bio}
                      disabled={disabled}
                      onChange={(e) => updateMember(member.id, { bio: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-slate-300 block">Profile Picture URL</label>
                    <input
                      type="text"
                      value={member.image}
                      disabled={disabled}
                      onChange={(e) => updateMember(member.id, { image: e.target.value })}
                      placeholder="https:// or /uploads/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white disabled:opacity-60 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>

              {!disabled && members.length > 1 && (
                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove Member
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
