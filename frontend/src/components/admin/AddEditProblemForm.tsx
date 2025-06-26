import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { X, Plus } from "lucide-react";

interface Example {
  id: string;
  input: string;
  output: string;
  explanation?: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

// interface AddEditProblemFormProps {
//   onSubmit: (data: any) => void;
//   onCancel: () => void;
//   initialData?: any;
//   isEdit?: boolean;
// }
//define properly the above interface
// keeping any for data and intialdata gives error asking not to use
// im creating a temporary solution for now below but it's bullshit


// This is the properly typed props interface for the AddEditProblemForm component. (Using gemini 2.5 PRO) May have to review later
interface ProblemFormData {
  title: string;
  difficulty: string;
  description: string;
  constraints: string;
  solution: string;
  examples: Example[];
  tags: Tag[];
}
interface AddEditProblemFormProps {
  /**
   * Callback function to handle the form submission.
   * It receives the fully structured problem data.
   */
  onSubmit: (data: ProblemFormData) => void;
  /**
   * Callback function to handle the cancellation of the form.
   */
  onCancel: () => void;
  /**
   * Optional initial data to populate the form for editing.
   * We use `Partial` because not all fields may be present initially.
   */
  initialData?: Partial<ProblemFormData>;
  /**
   * Flag to indicate if the form is in "edit" mode or "add" mode.
   * Defaults to false.
   */
  isEdit?: boolean;
}

const AddEditProblemForm = ({
  onSubmit,
  onCancel,
  initialData,
  isEdit = false,
}: AddEditProblemFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    difficulty: initialData?.difficulty || "",
    description: initialData?.description || "",
    constraints: initialData?.constraints || "",
    solution: initialData?.solution || "",
  });

  const [examples, setExamples] = useState<Example[]>(
    initialData?.examples || [
      { id: "1", input: "", output: "", explanation: "" },
    ]
  );

  const [tags, setTags] = useState<Tag[]>(initialData?.tags || []);

  const [newTag, setNewTag] = useState("");

  const availableTagColors = [
    "bg-blue-500/20 text-blue-400",
    "bg-green-500/20 text-green-400",
    "bg-purple-500/20 text-purple-400",
    "bg-orange-500/20 text-orange-400",
    "bg-pink-500/20 text-pink-400",
    "bg-cyan-500/20 text-cyan-400",
    "bg-red-500/20 text-red-400",
    "bg-indigo-500/20 text-indigo-400",
    "bg-teal-500/20 text-teal-400",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addExample = () => {
    const newExample: Example = {
      id: Date.now().toString(),
      input: "",
      output: "",
      explanation: "",
    };
    setExamples((prev) => [...prev, newExample]);
  };

  const removeExample = (id: string) => {
    if (examples.length > 1) {
      setExamples((prev) => prev.filter((ex) => ex.id !== id));
    }
  };

  const updateExample = (id: string, field: keyof Example, value: string) => {
    setExamples((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, [field]: value } : ex))
    );
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !tags.find((tag) => tag.name.toLowerCase() === newTag.toLowerCase())
    ) {
      const newTagObj: Tag = {
        id: Date.now().toString(),
        name: newTag.trim(),
        color: availableTagColors[tags.length % availableTagColors.length],
      };
      setTags((prev) => [...prev, newTagObj]);
      setNewTag("");
    }
  };

  const removeTag = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      examples: examples.filter((ex) => ex.input.trim() || ex.output.trim()),
      tags,
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {isEdit ? "Edit Problem" : "Add New Problem"}
            </h2>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">
              Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter problem title"
              className="bg-slate-800 border-slate-600 text-white"
              required
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label className="text-white">Difficulty *</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
            >
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem
                  value="Easy"
                  className="text-white hover:bg-slate-700"
                >
                  Easy
                </SelectItem>
                <SelectItem
                  value="Medium"
                  className="text-white hover:bg-slate-700"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="Hard"
                  className="text-white hover:bg-slate-700"
                >
                  Hard
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-white">Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color} flex items-center gap-1`}
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    className="hover:text-white/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="bg-slate-800 border-slate-600 text-white"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Add
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter problem description (supports markdown)"
              className="bg-slate-800 border-slate-600 text-white min-h-[120px]"
              required
            />
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-white">Input/Output Examples</Label>
              <Button
                type="button"
                onClick={addExample}
                variant="outline"
                size="sm"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Example
              </Button>
            </div>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={example.id}
                  className="bg-slate-800 p-4 rounded-lg border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-white font-medium">
                      Example {index + 1}
                    </h4>
                    {examples.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExample(example.id)}
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300 text-sm">Input</Label>
                      <Textarea
                        value={example.input}
                        onChange={(e) =>
                          updateExample(example.id, "input", e.target.value)
                        }
                        placeholder="Input data"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300 text-sm">Output</Label>
                      <Textarea
                        value={example.output}
                        onChange={(e) =>
                          updateExample(example.id, "output", e.target.value)
                        }
                        placeholder="Expected output"
                        className="bg-slate-700 border-slate-600 text-white mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <Label className="text-slate-300 text-sm">
                      Explanation (Optional)
                    </Label>
                    <Textarea
                      value={example.explanation || ""}
                      onChange={(e) =>
                        updateExample(example.id, "explanation", e.target.value)
                      }
                      placeholder="Explanation of the example"
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <Label htmlFor="constraints" className="text-white">
              Constraints
            </Label>
            <Textarea
              id="constraints"
              value={formData.constraints}
              onChange={(e) => handleInputChange("constraints", e.target.value)}
              placeholder="Enter problem constraints (e.g., 1 ≤ n ≤ 1000)"
              className="bg-slate-800 border-slate-600 text-white"
              rows={4}
            />
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <Label htmlFor="solution" className="text-white">
              Solution (Optional)
            </Label>
            <Textarea
              id="solution"
              value={formData.solution}
              onChange={(e) => handleInputChange("solution", e.target.value)}
              placeholder="Enter solution code or explanation"
              className="bg-slate-800 border-slate-600 text-white"
              rows={6}
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-slate-700">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isEdit ? "Update Problem" : "Create Problem"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditProblemForm;
