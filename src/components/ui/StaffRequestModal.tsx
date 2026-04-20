import { useState, useEffect } from "react";
import axios from "axios";
import Select from 'react-select'
import toast from "react-hot-toast";
import Modal from "./Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  users: any[];
  user: any;
  jobTypes: JobType[];
};

type JobType = {
  id: number;
  name: string;
};

export default function StaffRequestModal({ open, onClose, users, user, jobTypes }: Props) {

    const [form, setForm] = useState({
      user_id: "",
      deadline: "",
      activity: "",
      position: "",
      status: "Pending",
      job_type_id: 0,
      link: "",
    });

    const [selectedUser, setSelectedUser] = useState<any>(null);

    const resetForm = () => {
        setForm({
          user_id: "",
          deadline: "",
          activity: "",
          position: "",
          status: "Pending",
          job_type_id: 0,
          link: "",
        });
      
        setSelectedUser(null); // 🔥 penting
      };

    const isValid =
        form.user_id &&
        form.deadline &&
        form.activity &&
        form.job_type_id;
  
    const [loading, setLoading] = useState(false); // ⬅️ pindah ke atas
  
    useEffect(() => {
      if (!open) return;
  
      if (user.role === "SUPERVISOR_ASCX") {
        setForm(prev => ({ ...prev, position: "SUPERVISOR ASCX" }));
      } else if (user.id === 3) {
        setForm(prev => ({ ...prev, position: "STAFF IT" }));
      } else {
        setForm(prev => ({ ...prev, position: "STAFF ASCX" }));
      }
    }, [open, user]);
  
    // 🔥 TARUH DI SINI (SETELAH SEMUA HOOK)
    if (!open) return null;

  const normalizeRole = (role: string) =>
  role?.toUpperCase().replace(/\s+/g, "_");

  // 🔥 filter user (tidak termasuk diri sendiri)
  const filteredUsers = users.filter(u => {
    const role = normalizeRole(u.role);
  
    // ❌ buang assistant manager
    if (role === "ASSISTANT_MANAGER_ASCX") return false;
  
    // ❌ tidak boleh diri sendiri
    if (
      ["SUPERVISOR_ASCX", "STAFF_ASCX", "STAFF_IT"].includes(
        normalizeRole(user.role)
      )
    ) {
      return u.id !== user.id;
    }
  
    return true;
  });

  const staffOptions = filteredUsers.map(u => ({
    value: u.id,
    label: `${u.name}`,
  }));

  const handleSubmit = async () => {
    if (!form.user_id) {
      toast.error("Pilih staff terlebih dahulu");
      return;
    }
  
    if (!form.deadline || !form.activity) {
      toast.error("Lengkapi data terlebih dahulu");
      return;
    }
  
    if (loading) return;
  
    setLoading(true);
  
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/staff-request`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      toast.success("Request task berhasil dibuat 🎉");
  
      resetForm();   // 🔥 reset form
      onClose();     // 🔥 tutup modal
    } catch (err: any) {
      console.error(err.response?.data);
  
      toast.error(
        err.response?.data?.message || "Terjadi kesalahan saat submit"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
    open={open}
    title="Request Task"
    onClose={onClose}
    >

        <label className="text-sm font-medium">Pilih Supervisor & Staff</label>
        {/* Assign To */}
       
        <Select
        value={selectedUser}
        options={staffOptions}
        isSearchable
        isClearable
        noOptionsMessage={() => "Staff tidak ditemukan"}
        loadingMessage={() => "Loading staff..."}
        placeholder="Cari & pilih staff..."
        className="text-sm mb-3"
        onChange={(selected: any) => {
            setSelectedUser(selected);
            setForm({ ...form, user_id: selected?.value || "" });
          }}
        />

        {/* Deadline */}
        <label className="text-sm font-medium">Deadline</label>
        <input
          type="datetime-local"
          value={form.deadline}
          onChange={e => setForm({ ...form, deadline: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
        />

        {/* Job Type */}
        <label className="text-sm font-medium">Kategori Pekerjaan</label>
        <select
          value={form.job_type_id}
          onChange={e =>
            setForm({ ...form, job_type_id: Number(e.target.value) })
          }
          className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
        >
          <option value={0}>Pilih kategori</option>

          {jobTypes.map(j => (
            <option key={j.id} value={j.id}>
              {j.name}
            </option>
          ))}
        </select>

        {/* Activity */}
        <label className="text-sm font-medium">Aktivitas</label>
        <textarea
          rows={4}
          placeholder="Activity"
          value={form.activity}
          onChange={e => setForm({ ...form, activity: e.target.value })}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-3"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Batal</button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading || jobTypes.length === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
            {loading ? "Loading..." : "Submit"}
           </button>
        </div>
      </Modal>
  );
}