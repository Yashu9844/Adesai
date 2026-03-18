"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { FormInput } from "@/components/ui/FormInput";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { Wrench, Loader2 } from "lucide-react";
import { addToolAction } from "@/actions/tool.actions";

export default function AddToolPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [photoBase64, setPhotoBase64] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    totalQuantity: "1",
    dailyPrice: "0",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoSelect = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPhotoBase64(reader.result as string);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);

    const res = await addToolAction({
      name: formData.name,
      totalQuantity: parseInt(formData.totalQuantity, 10),
      dailyPrice: parseInt(formData.dailyPrice, 10),
    }, photoBase64);

    setLoading(false);

    if (res.success) {
      router.push("/inventory");
      router.refresh();
    } else {
      alert(res.error || "Failed to add tool. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[300px] h-[300px] rounded-full bg-violet-400/20 blur-[80px]" />
        <div className="absolute bottom-[20%] left-[-20%] w-[400px] h-[400px] rounded-full bg-teal-400/20 blur-[100px]" />
      </div>

      <Header title="Add New Tool" subtitle="Expand your inventory catalog" showNotification={false} onBack={() => router.back()} />

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-40">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <section className="bg-white/60 backdrop-blur-2xl rounded-[1.5rem] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/80">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Wrench className="w-4 h-4 text-violet-500" />
              Tool Details
            </h2>
            
            <div className="space-y-4">
              <FormInput 
                id="name"
                name="name"
                label="Tool Name"
                placeholder="e.g. Concrete Mixer"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                    id="totalQuantity"
                    name="totalQuantity"
                    label="Total Quantity"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={formData.totalQuantity}
                    onChange={handleInputChange}
                    required
                />
                <FormInput 
                    id="dailyPrice"
                    name="dailyPrice"
                    label="Daily Rate (₹)"
                    type="number"
                    min="0"
                    placeholder="150"
                    value={formData.dailyPrice}
                    onChange={handleInputChange}
                    required
                />
              </div>
            </div>
          </section>

          <section className="bg-white/60 backdrop-blur-2xl rounded-[1.5rem] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-white/80">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tool Image</h2>
            <PhotoUpload label="Upload Tool Graphic" onPhotoSelect={handlePhotoSelect} />
          </section>

        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button 
          onClick={handleSubmit} 
          disabled={loading || !formData.name.trim()}
          className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-violet-600 to-teal-500 text-white font-bold rounded-[1.25rem] text-center shadow-[0_4px_20px_-2px_rgba(79,70,229,0.4)] hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (
             <><Loader2 className="w-5 h-5 animate-spin" /> Adding to Inventory...</>
          ) : (
             "Confirm & Add Tool"
          )}
        </button>
      </div>
    </div>
  );
}
