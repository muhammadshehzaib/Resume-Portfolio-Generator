'use client';

import { useState } from 'react';
import { ParsedResume } from '@/lib/types';
import { uploadPhoto, updateSettings } from '@/lib/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface EditModeProps {
  data: ParsedResume;
  portfolioId: string;
  photoUrl?: string;
  sectionOrder?: string[];
  onSave: (data: ParsedResume) => Promise<void>;
  onCancel: () => void;
  onPhotoUpload?: (photoUrl: string) => void;
  onSectionOrderUpdate?: (order: string[]) => void;
}

function SortableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing"
    >
      <span className="text-gray-700 font-medium">{label}</span>
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
      </svg>
    </div>
  );
}

export default function EditMode({ data, portfolioId, photoUrl, sectionOrder, onSave, onCancel, onPhotoUpload, onSectionOrderUpdate }: EditModeProps) {
  const [formData, setFormData] = useState<ParsedResume>(data);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [photoUploading, setPhotoUploading] = useState(false);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(photoUrl);
  const [currentSectionOrder, setCurrentSectionOrder] = useState<string[]>(
    sectionOrder || ['experience', 'education', 'projects', 'skills', 'certifications']
  );
  const [orderChanged, setOrderChanged] = useState(false);

  const SECTION_LABELS: { [key: string]: string } = {
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    skills: 'Skills',
    certifications: 'Certifications',
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = currentSectionOrder.indexOf(active.id as string);
      const newIndex = currentSectionOrder.indexOf(over.id as string);
      const newOrder = arrayMove(currentSectionOrder, oldIndex, newIndex);
      setCurrentSectionOrder(newOrder);
      setOrderChanged(true);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(undefined);
    try {
      // Save form data (ParsedResume)
      await onSave(formData);
      
      // Save section order if changed
      if (orderChanged) {
        await updateSettings(portfolioId, { section_order: currentSectionOrder });
        if (onSectionOrderUpdate) {
          onSectionOrderUpdate(currentSectionOrder);
        }
        setOrderChanged(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setPhotoUploading(true);
    setError(undefined);
    try {
      const result = await uploadPhoto(portfolioId, file);
      setCurrentPhotoUrl(result.photo_url);
      if (onPhotoUpload && result.photo_url) {
        onPhotoUpload(result.photo_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold text-gray-900">Edit Portfolio</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">Profile Photo</label>
            <div className="flex gap-4 items-start">
              {currentPhotoUrl && (
                <div className="relative w-24 h-24">
                  <img
                    src={currentPhotoUrl}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handlePhotoUpload(file);
                      }
                    }}
                    disabled={photoUploading}
                    className="hidden"
                  />
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {photoUploading ? 'Uploading...' : 'Upload Photo'}
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-2">JPEG, PNG, or WebP (Max 5 MB)</p>
              </div>
            </div>
          </div>

          {/* Section Order */}
          <div className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
            <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              SECTION ORDER
            </h3>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={currentSectionOrder} strategy={verticalListSortingStrategy}>
                <div className="space-y-2">
                  {currentSectionOrder.map((section) => (
                    <SortableItem key={section} id={section} label={SECTION_LABELS[section]} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <p className="text-[10px] text-gray-400 mt-3 italic text-center">Drag and drop to rearrange sections</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={formData.contact.email || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={formData.contact.phone || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.contact.location || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, location: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={formData.contact.linkedin || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, linkedin: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="url"
                placeholder="GitHub URL"
                value={formData.contact.github || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: { ...formData.contact, github: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Professional Summary</label>
            <textarea
              value={formData.summary || ''}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Skills (comma-separated)</label>
            <textarea
              value={formData.skills.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Python, React, AWS, ..."
            />
          </div>

          {/* Experience */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Work Experience</h3>
            <div className="space-y-4">
              {formData.experiences.map((exp, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => {
                      const newExp = [...formData.experiences];
                      newExp[idx].title = e.target.value;
                      setFormData({ ...formData, experiences: newExp });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...formData.experiences];
                      newExp[idx].company = e.target.value;
                      setFormData({ ...formData, experiences: newExp });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={exp.start_date}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].start_date = e.target.value;
                        setFormData({ ...formData, experiences: newExp });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="End Date (or blank for current)"
                      value={exp.end_date || ''}
                      onChange={(e) => {
                        const newExp = [...formData.experiences];
                        newExp[idx].end_date = e.target.value || undefined;
                        setFormData({ ...formData, experiences: newExp });
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <textarea
                    placeholder="Description (one bullet point per line)"
                    value={exp.description.join('\n')}
                    onChange={(e) => {
                      const newExp = [...formData.experiences];
                      newExp[idx].description = e.target.value.split('\n').filter(Boolean);
                      setFormData({ ...formData, experiences: newExp });
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const newExp = formData.experiences.filter((_, i) => i !== idx);
                      setFormData({ ...formData, experiences: newExp });
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                experiences: [...formData.experiences, {
                  title: '',
                  company: '',
                  start_date: '',
                  end_date: undefined,
                  description: []
                }]
              })}
              className="mt-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Experience
            </button>
          </div>

          {/* Education */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
            <div className="space-y-4">
              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[idx].degree = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[idx].institution = e.target.value;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.field || ''}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[idx].field = e.target.value || undefined;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Year"
                    value={edu.graduation_year || ''}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[idx].graduation_year = e.target.value || undefined;
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const newEdu = formData.education.filter((_, i) => i !== idx);
                      setFormData({ ...formData, education: newEdu });
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                education: [...formData.education, {
                  degree: '',
                  institution: '',
                  field: undefined,
                  graduation_year: undefined,
                  gpa: undefined
                }]
              })}
              className="mt-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Education
            </button>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Projects</h3>
            <div className="space-y-4">
              {formData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={proj.name}
                    onChange={(e) => {
                      const newProj = [...formData.projects];
                      newProj[idx].name = e.target.value;
                      setFormData({ ...formData, projects: newProj });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={proj.description}
                    onChange={(e) => {
                      const newProj = [...formData.projects];
                      newProj[idx].description = e.target.value;
                      setFormData({ ...formData, projects: newProj });
                    }}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={proj.technologies.join(', ')}
                    onChange={(e) => {
                      const newProj = [...formData.projects];
                      newProj[idx].technologies = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                      setFormData({ ...formData, projects: newProj });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                  />
                  <input
                    type="url"
                    placeholder="Project URL"
                    value={proj.url || ''}
                    onChange={(e) => {
                      const newProj = [...formData.projects];
                      newProj[idx].url = e.target.value || undefined;
                      setFormData({ ...formData, projects: newProj });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => {
                      const newProj = formData.projects.filter((_, i) => i !== idx);
                      setFormData({ ...formData, projects: newProj });
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFormData({
                ...formData,
                projects: [...formData.projects, {
                  name: '',
                  description: '',
                  technologies: [],
                  url: undefined
                }]
              })}
              className="mt-2 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Project
            </button>
          </div>

          {/* Certifications */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Certifications (comma-separated)</label>
            <textarea
              value={formData.certifications.join(', ')}
              onChange={(e) => setFormData({
                ...formData,
                certifications: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
              })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
