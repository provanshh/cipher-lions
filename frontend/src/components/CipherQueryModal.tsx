import { useState } from "react";
import { X, Send, CheckCircle2, Loader2, Upload, FileText } from "lucide-react";
import { Button } from "./Button";

interface CipherQueryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    isMandatory?: boolean;
}

export const CipherQueryModal = ({ isOpen, onClose, onSuccess, isMandatory }: CipherQueryModalProps) => {
    const [step, setStep] = useState<"form" | "sending" | "success">("form");
    const [formData, setFormData] = useState({
        aadhar: "",
        phone: "",
        age: "",
        imageProof: null as File | null,
        idProof: null as File | null,
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("sending");

        // Simulate sending animation
        setTimeout(() => {
            setStep("success");
        }, 2000);
    };

    const handleClose = () => {
        setStep("form");
        setFormData({ aadhar: "", phone: "", age: "", imageProof: null, idProof: null });
        onClose();
    };

    const handleSuccess = () => {
        setStep("form");
        setFormData({ aadhar: "", phone: "", age: "", imageProof: null, idProof: null });
        if (onSuccess) onSuccess();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#171723] border border-[#2A2A3C] rounded-xl w-full max-w-md overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
                <div className="scanline"></div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white neon-text">Cipher Query</h2>
                        {!isMandatory && (
                            <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        )}
                    </div>

                    {step === "form" && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Aadhar Number</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="12-digit Aadhar No"
                                    className="w-full bg-[#11111D] border border-[#2A2A3C] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cipher-purple transition-colors"
                                    value={formData.aadhar}
                                    onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    placeholder="Your phone number"
                                    className="w-full bg-[#11111D] border border-[#2A2A3C] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cipher-purple transition-colors"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Age</label>
                                <input
                                    required
                                    type="number"
                                    placeholder="Enter age"
                                    className="w-full bg-[#11111D] border border-[#2A2A3C] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-cipher-purple transition-colors"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-400">Image Proof</label>
                                    <label className="flex flex-col items-center justify-center w-full h-24 bg-[#11111D] border-2 border-dashed border-[#2A2A3C] rounded-lg cursor-pointer hover:border-cipher-purple transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-6 h-6 text-gray-500 mb-1" />
                                            <p className="text-[10px] text-gray-500">
                                                {formData.imageProof ? formData.imageProof.name : "Upload Image"}
                                            </p>
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => setFormData({ ...formData, imageProof: e.target.files ? e.target.files[0] : null })} />
                                    </label>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-xs font-medium text-gray-400">ID Proof</label>
                                    <label className="flex flex-col items-center justify-center w-full h-24 bg-[#11111D] border-2 border-dashed border-[#2A2A3C] rounded-lg cursor-pointer hover:border-cipher-purple transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <FileText className="w-6 h-6 text-gray-500 mb-1" />
                                            <p className="text-[10px] text-gray-500">
                                                {formData.idProof ? formData.idProof.name : "Upload ID"}
                                            </p>
                                        </div>
                                        <input type="file" className="hidden" onChange={(e) => setFormData({ ...formData, idProof: e.target.files ? e.target.files[0] : null })} />
                                    </label>
                                </div>
                            </div>

                            <Button type="submit" variant="primary" className="w-full mt-4 flex items-center justify-center flex-row gap-2 h-12">
                                <Send size={18} className="flex-shrink-0" />
                                <span className="whitespace-nowrap font-bold">Send Query</span>
                            </Button>
                        </form>
                    )}

                    {step === "sending" && (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <Loader2 className="h-16 w-16 text-cipher-purple animate-spin mb-4" />
                            <p className="text-lg font-medium text-white">Sending request to Cipher...</p>
                            <p className="text-sm text-gray-500 mt-2">Connecting to secure servers</p>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                            <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="h-12 w-12 text-green-500 animate-in zoom-in duration-500" />
                            </div>
                            <p className="text-xl font-bold text-white mb-2">Query Sent!</p>
                            <p className="text-gray-400 mb-8 max-w-[250px] mx-auto">Your request has been successfully transmitted to the Cipher network.</p>
                            <Button onClick={handleSuccess} variant="secondary">Close</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
