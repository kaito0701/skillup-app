import { useState, useEffect } from "react";
import { ArrowLeft, Plus, MapPin, Edit, Trash2, Loader2 } from "lucide-react";
import { AnimatedCard } from "../AnimatedCard";
import { AnimatedButton } from "../AnimatedButton";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { motion } from "motion/react";
import { getAllResources, addResource, updateResource, deleteResource } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface AdminResourcesScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminResourcesScreen({ onNavigate }: AdminResourcesScreenProps) {
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [filter, setFilter] = useState<"all" | "Training Center" | "Job Fair" | "Workshop">("all");
  
  // Form state
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("Training Center");
  const [formAddress, setFormAddress] = useState("");
  const [formContact, setFormContact] = useState("");
  const [formLat, setFormLat] = useState("14.5995");
  const [formLng, setFormLng] = useState("120.9842");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setIsLoading(true);
      const data = await getAllResources();
      setResources(data || []);
    } catch (error: any) {
      console.error("Failed to load resources:", error);
      toast.error("Failed to load resources");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingResource(null);
    setFormName("");
    setFormType("Training Center");
    setFormAddress("");
    setFormContact("");
    setFormLat("14.5995");
    setFormLng("120.9842");
    setShowDialog(true);
  };

  const handleEdit = (resource: any) => {
    setEditingResource(resource);
    setFormName(resource.name);
    setFormType(resource.type);
    setFormAddress(resource.address);
    setFormContact(resource.contact || "");
    setFormLat(resource.latitude?.toString() || "14.5995");
    setFormLng(resource.longitude?.toString() || "120.9842");
    setShowDialog(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim() || !formType || !formAddress.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);

      const resourceData = {
        name: formName.trim(),
        type: formType,
        address: formAddress.trim(),
        contact: formContact.trim(),
        latitude: parseFloat(formLat) || 14.5995,
        longitude: parseFloat(formLng) || 120.9842,
      };

      if (editingResource) {
        await updateResource(editingResource.id, resourceData);
        toast.success("Resource updated successfully!");
      } else {
        await addResource(resourceData);
        toast.success("Resource added successfully!");
      }

      setShowDialog(false);
      loadResources();
    } catch (error: any) {
      console.error("Save resource error:", error);
      toast.error(error.message || "Failed to save resource");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (resource: any) => {
    if (!confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      return;
    }

    try {
      await deleteResource(resource.id);
      toast.success("Resource deleted successfully!");
      loadResources();
    } catch (error: any) {
      console.error("Delete resource error:", error);
      toast.error(error.message || "Failed to delete resource");
    }
  };

  const filteredResources = filter === "all" 
    ? resources 
    : resources.filter(r => r.type === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading resources...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 pt-8 pb-20 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => onNavigate("admin-dashboard")}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl">Community Resources</h1>
            <p className="text-emerald-100">{filteredResources.length} resources</p>
          </div>
          <AnimatedButton
            onClick={handleAddNew}
            className="bg-white text-emerald-600 hover:bg-emerald-50 h-10"
          >
            <Plus className="w-5 h-5 mr-1" />
            Add
          </AnimatedButton>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {["all", "Training Center", "Job Fair", "Workshop"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-white text-emerald-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="px-6 -mt-12 pb-8">
        <div className="space-y-3">
          {filteredResources.length === 0 ? (
            <AnimatedCard className="bg-white p-6 rounded-2xl shadow-md text-center">
              <p className="text-gray-600 mb-4">No resources yet.</p>
              <AnimatedButton onClick={handleAddNew} className="bg-emerald-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add First Resource
              </AnimatedButton>
            </AnimatedCard>
          ) : (
            filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnimatedCard className="bg-white p-4 rounded-2xl shadow-md">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{resource.name}</h3>
                        <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <div className="flex items-start gap-2 text-gray-600 text-sm mb-1">
                        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{resource.address}</span>
                      </div>
                      {resource.contact && (
                        <p className="text-gray-600 text-sm">📞 {resource.contact}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <AnimatedButton
                      onClick={() => handleEdit(resource)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </AnimatedButton>
                    <AnimatedButton
                      onClick={() => handleDelete(resource)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </AnimatedButton>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingResource ? "Edit Resource" : "Add New Resource"}</DialogTitle>
            <DialogDescription>
              {editingResource ? "Update resource information" : "Add a new community resource"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="TESDA Manila Training Center"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type *</Label>
              <Select value={formType} onValueChange={setFormType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Training Center">Training Center</SelectItem>
                  <SelectItem value="Job Fair">Job Fair</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formAddress}
                onChange={(e) => setFormAddress(e.target.value)}
                placeholder="Muralla St, Intramuros, Manila"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                value={formContact}
                onChange={(e) => setFormContact(e.target.value)}
                placeholder="+63 912 345 6789"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formLat}
                  onChange={(e) => setFormLat(e.target.value)}
                  placeholder="14.5995"
                />
              </div>
              <div>
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formLng}
                  onChange={(e) => setFormLng(e.target.value)}
                  placeholder="120.9842"
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <AnimatedButton
                type="button"
                onClick={() => setShowDialog(false)}
                variant="outline"
                className="flex-1"
                disabled={isSaving}
              >
                Cancel
              </AnimatedButton>
              <AnimatedButton
                type="submit"
                className="flex-1 bg-emerald-600 text-white"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : editingResource ? "Update" : "Add"}
              </AnimatedButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
