import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProblemEditModal.module.css';

interface ProblemEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemId: string;
  onSuccess: () => void;
}

interface ProblemEditData {
  problem: {
    _id: string;
    title: string;
    difficulty: string;
    description: string;
    tags: string[];
    constraints: string[];
    hints: string[];
    timeLimit: number;
    memoryLimit: number;
    allowedLanguages: string[];
    examples: Array<{
      input: string;
      output: string;
      explanation?: string;
    }>;
  };
  formOptions: {
    availableTags: string[];
    availableDifficulties: string[];
    allowedLanguages: string[];
  };
}

const ProblemEditModal: React.FC<ProblemEditModalProps> = ({ isOpen, onClose, problemId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<ProblemEditData | null>(null);
  const [formData, setFormData] = useState<any>({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (isOpen && problemId) {
      loadProblemEditData();
    }
  }, [isOpen, problemId]);

  const loadProblemEditData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/dashboard/problem/edit/${problemId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
      if (response.data.success) {
        setEditData(response.data.data);
        setFormData(response.data.data.problem);
      }
    } catch (error: any) {
      alert('Failed to load problem data: ' + error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await axios.put(`${backendUrl}/dashboard/problem/update`, {
        problemId,
        updateData: formData
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
      if (response.data.success) {
        alert('✅ Problem updated successfully!');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      alert('Failed to update problem: ' + error.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: string) => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = formData[field].filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Edit Problem</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        {loading ? (
          <div className={styles.loading}>Loading problem data...</div>
        ) : editData ? (
          <div className={styles.modalContent}>
            <div className={styles.formGrid}>
              {/* Basic Info */}
              <div className={styles.formGroup}>
                <label>Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Difficulty</label>
                <select
                  value={formData.difficulty || ''}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                >
                  {editData.formOptions.availableDifficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={6}
                />
              </div>

              {/* Tags */}
              <div className={styles.formGroup}>
                <label>Tags</label>
                {formData.tags?.map((tag: string, index: number) => (
                  <div key={index} className={styles.arrayItem}>
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                    />
                    <button onClick={() => removeArrayItem('tags', index)}>Remove</button>
                  </div>
                ))}
                <button onClick={() => addArrayItem('tags')}>Add Tag</button>
              </div>

              {/* Examples */}
              <div className={styles.formGroup}>
                <label>Examples</label>
                {formData.examples?.map((example: any, index: number) => (
                  <div key={index} className={styles.exampleItem}>
                    <h4>Example {index + 1}</h4>
                    <input
                      placeholder="Input"
                      value={example.input || ''}
                      onChange={(e) => {
                        const newExamples = [...formData.examples];
                        newExamples[index].input = e.target.value;
                        setFormData({ ...formData, examples: newExamples });
                      }}
                    />
                    <input
                      placeholder="Output"
                      value={example.output || ''}
                      onChange={(e) => {
                        const newExamples = [...formData.examples];
                        newExamples[index].output = e.target.value;
                        setFormData({ ...formData, examples: newExamples });
                      }}
                    />
                    <input
                      placeholder="Explanation (optional)"
                      value={example.explanation || ''}
                      onChange={(e) => {
                        const newExamples = [...formData.examples];
                        newExamples[index].explanation = e.target.value;
                        setFormData({ ...formData, examples: newExamples });
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Limits */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Time Limit (seconds)</label>
                  <input
                    type="number"
                    value={formData.timeLimit || 1}
                    onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value))}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Memory Limit (MB)</label>
                  <input
                    type="number"
                    value={formData.memoryLimit || 128}
                    onChange={(e) => handleInputChange('memoryLimit', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button 
            className={styles.saveBtn} 
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemEditModal;
