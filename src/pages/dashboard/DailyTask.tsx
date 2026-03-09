import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useAuth } from '../auth/useAuth'
import Swal from 'sweetalert2'
import TaskItem from '../../components/cards/TaskItem'
import Modal from '../../components/ui/Modal'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import SearchFilter from '../../components/common/SearchFilter'
import TaskSkeleton from '../skeleton/TaskSkeleton'
import ImageSlider from '../../components/common/ImageSlider'
import { DndContext, closestCorners, useDraggable, useDroppable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import toast from "react-hot-toast"
import StaffRequestModal from '../../components/ui/StaffRequestModal'

  // SEDIKIT PENJELASAN TIPE DATA UNTUK MEMUDAHKAN PENGEMBANGAN
  interface TaskFile {
    id: number
    file_name: string
    file_path: string
    file_type: string
  }

  // fungsi untuk menentukan warna badge berdasarkan kategori pekerjaan
  const jobTypeColor = (type: string) => {
    switch (type) {
      case 'Dokumentasi':
        return 'blue'
      case 'Maintenance':
        return 'yellow'
      case 'Design':
        return 'purple'
      case 'Video Editor':
        return 'gray'
      case 'IT Support':
        return 'green'
      case 'Development':
        return 'cyan'
      case 'Social Media':
        return 'pink'
      case 'Event':
        return 'indigo'
      case 'Customer Service':
        return 'orange'
      default:
        return 'gray'
    }
  }

  // nanti bisa ditambahin field lain sesuai kebutuhan, misal: created_at, updated_at, dll
  interface Task {
  id: number
  date: string | null
  deadline: string
  activity: string
  position: 'STAFF IT' | 'STAFF ASCX' | 'SUPERVISOR ASCX'
  status: 'Pending' | 'In Progress' | 'Done'
  job_type_id: number
  job_type?: {
    id: number
    name: string
  }
  files: TaskFile[]
  link?: string
  completed_at?: string | null
  user: {
    id: number
    name: string
    role: string
  }
}

function KanbanColumn({ title, color, count, children }: any) {
  const { setNodeRef } = useDroppable({
    id:
      title === 'PENDING'
        ? 'Pending'
        : title === 'IN PROGRESS'
        ? 'In Progress'
        : 'Done',
  })

  const colorMap: any = {
    red: "text-red-600 border-red-300",
    blue: "text-blue-600 border-blue-400",
    green: "text-green-600 border-green-400",
  }

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-50 rounded-xl border min-h-[500px] flex flex-col"
    >
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h3 className={`font-semibold ${colorMap[color]}`}>
          {title}
        </h3>

        <span className="bg-gray-200 text-sm px-2 py-1 rounded-full">
          {count}
        </span>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="
      text-center text-gray-400 text-sm
      border-2 border-dashed rounded-lg
      py-10
    ">
      Tidak ada task
      <div className="mt-2 text-xs">
        Drop task here
      </div>
    </div>
  )
}

const isTaskOverdue = (
  deadline: string,
  completedAt?: string | null
) => {
  const now = new Date()
  const due = new Date(deadline)

  // Kalau sudah pernah diselesaikan
  if (completedAt) {
    const completed = new Date(completedAt)

    // selesai sebelum deadline → tidak overdue
    if (completed <= due) return false

    // selesai setelah deadline → overdue
    return true
  }

  // belum selesai dan sudah lewat deadline
  return now > due
}

function DraggableTask({ task, children }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
  useDraggable({
    id: task.id,
    //disabled: task.status === 'Done'
  })
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,

      transition: isDragging
      ? 'none'
      : 'transform 220ms cubic-bezier(0.2, 0, 0, 1)',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${
        isTaskOverdue(task.deadline, task.completed_at)
          ? 'border-2 border-red-500 rounded-lg'
          : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="
          absolute bottom-2 right-2
          cursor-grab active:cursor-grabbing
          text-gray-400
        "
      >
        ☰
      </div>

      {children}
    </div>
  )
}

const mapTaskForCard = (task: Task) => ({
  ...task,
  job_type: task.job_type?.name || '-',
  files: task.files.map(f => ({
    id: f.id,
    name: f.file_name,
    url: `${import.meta.env.VITE_API_URL}/storage/${f.file_path}`,
    mime: f.file_type,
  })),
})

export default function DailyTask() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [existingFiles, setExistingFiles] = useState<TaskFile[]>([])
  const [jobTypes, setJobTypes] = useState<{ id: number; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await api.get<{ data: Task[] }>('/tasks')
      setTasks(res.data.data ?? [])
    } catch (error) {
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        const res = await api.get(`${import.meta.env.VITE_API_URL}/api/job-types`)
        setJobTypes(res.data.data || [])
      } catch {
        setJobTypes([])
      }
    }
  
    fetchJobTypes()
  }, [])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
  
    const taskId = Number(active.id)
    const newStatus = over.id as Task['status']
  
    const task = tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return
  
    // optimistic UI
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    )
  
    try {
      const formData = new FormData()
      formData.append("deadline", task.deadline)
      formData.append("activity", task.activity)
      formData.append("position", task.position)
      formData.append("status", newStatus)
      formData.append("job_type_id", String(task.job_type_id))
  
      if (task.link) {
        formData.append("link", task.link)
      }
  
      await api.post(`/tasks/${taskId}?_method=PUT`, formData)
    } catch {
      fetchTasks()
    }
  }
  
  
  useEffect(() => {
    fetchTasks()
  }, [])
  
  const { user } = useAuth()

  const userId = user?.id // dari useAuth()
  const userRole = user?.role

  // Real-time updates with Echo
  {/*useEffect(() => {
    if (!user) return // nanti dari auth
  
    echo.private(`tasks.${user.id}`)
      .listen('.task.created', (e: any) => {
        setTasks(prev => [e.task, ...prev])
      })
      .listen('.task.updated', (e: any) => {
        setTasks(prev =>
          prev.map(t => t.id === e.task.id ? e.task : t)
        )
      })
      .listen('.task.deleted', (e: any) => {
        setTasks(prev =>
          prev.filter(t => t.id !== e.task_id)
        )
      })
  
    return () => {
      echo.leave(`tasks.${user.id}`)
    }
  }, [user])*/}

  const getSafePosition = () => {
    if (userId === 3) return form.position // IT bebas
    if (userRole === 'SUPERVISOR_ASCX') return 'SUPERVISOR ASCX'
    return 'STAFF ASCX'
  }

  const [open, setOpen] = useState(false)
  const [openRequest, setOpenRequest] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<{
    deadline: string
    activity: string
    position: 'STAFF IT' | 'STAFF ASCX' | 'SUPERVISOR ASCX'
    status: 'Pending' | 'In Progress' | 'Done'
    job_type_id: number
    files: File[]
    link?: string
  }>({
    deadline: '',
    activity: '',
    position: 'STAFF ASCX',
    status: 'Pending',
    job_type_id: 0,
    files: [],
    link: '',
  }) 
  const [viewTask, setViewTask] = useState<Task | null>(null)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users')
        setUsers(res.data.data || [])
      } catch {
        setUsers([])
      }
    }

    fetchUsers()
  }, [])

  const openAdd = () => {
    setForm({
      deadline: '',
      activity: '',
      position: getSafePosition(),
      status: 'Pending',
      job_type_id: jobTypes.length ? jobTypes[0].id : 0,
      files: [],
      link: '',
    })
    setAttachmentType('file')
    setAttachmentLink('')
    setExistingFiles([])
    setEditingId(null)
    setOpen(true)
  }
  
  const openEdit = (task: Task) => {
    setForm({
      deadline: task.deadline,
      activity: task.activity,
      position: task.position,
      status: task.status,
      job_type_id: task.job_type_id,
      files: [], // ✅ kosongkan
      link: task.link ?? '',
    })

    setAttachmentLink(task.link ?? '')
    setExistingFiles(task.files || [])
    setEditingId(task.id)
    setOpen(true)
  }

  const [attachmentType, setAttachmentType] = useState<'file' | 'link'>('file')
  const [attachmentLink, setAttachmentLink] = useState('')

  const handleSubmit = async () => {
    if (!form.deadline || !form.activity) return;
  
    const toastId = toast.loading("Menyimpan...");
  
    try {

      if (!form.job_type_id) {
        toast.error("Pilih kategori pekerjaan dulu")
        return
      }

      const payload = new FormData();
      payload.append('deadline', form.deadline);
      payload.append('activity', form.activity);
      payload.append('position', getSafePosition());
      payload.append('status', form.status);
      payload.append('job_type_id', String(form.job_type_id));
  
      if (form.files.length > 0) {
        payload.append(
          'replace_files',
          uploadMode === 'replace' ? '1' : '0'
        );
  
        form.files.forEach(file =>
          payload.append('files[]', file)
        );
      }
  
      if (attachmentType === 'link') {
        payload.append('link', attachmentLink);
      }
  
      if (editingId) {
        const res = await api.post(`/tasks/${editingId}?_method=PUT`, payload);
  
        setTasks(prev =>
          prev.map(t => t.id === editingId ? res.data.data : t)
        );
  
        toast.success("Task berhasil diupdate!", { id: toastId });
      } else {
        const res = await api.post('/tasks', payload);
  
        setTasks(prev => [res.data.data, ...prev]);
  
        toast.success("Task berhasil ditambahkan!", { id: toastId });
      }

      setOpen(false);
  
    } catch (e) {
      toast.error("Gagal menyimpan task", { id: toastId });
    }
  };
  
  const [uploadMode, setUploadMode] =
  useState<'replace' | 'append'>('replace')
   
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setForm({
      ...form,
      files: Array.from(e.target.files),
    })
  }
  
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Hapus Task?',
      text: 'Task yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
    })
  
    if (!result.isConfirmed) return
  
    try {
      await api.delete(`/tasks/${id}`)
  
      // update UI langsung
      setTasks(prev => prev.filter(t => t.id !== id))
  
      Swal.fire({
        title: 'Berhasil!',
        text: 'Task berhasil dihapus.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      })
    } catch (error) {
      Swal.fire({
        title: 'Gagal',
        text: 'Task gagal dihapus.',
        icon: 'error',
      })
    }
  }

  const [search, setSearch] = useState('')
  const [filterMonth, setFilterMonth] = useState<string>('') // 01-12
  const [filterYear, setFilterYear] = useState<string>('')   // 2025, 2026, dll
  const [filterJobType, setFilterJobType] = useState<string>('')
  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(task.date || task.deadline)
    const taskMonth = String(taskDate.getMonth() + 1).padStart(2, '0')
    const taskYear = String(taskDate.getFullYear())
    const keyword = search.toLowerCase()
  
    const matchSearch =
    task.activity.toLowerCase().includes(keyword) ||
    task.job_type?.name.toLowerCase().includes(keyword) ||
    task.position.toLowerCase().includes(keyword) ||
    task.status.toLowerCase().includes(keyword)
  
    const matchMonth = filterMonth
      ? taskMonth === filterMonth
      : true
  
    const matchYear = filterYear
      ? taskYear === filterYear
      : true
  
      const matchJobType = filterJobType
      ? task.job_type_id === Number(filterJobType)
      : true
  
    return matchSearch && matchMonth && matchYear && matchJobType
  })  
  
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterMonth, filterYear])

  // Pagination
const ITEMS_PER_PAGE = 5
const [currentPage, setCurrentPage] = useState(1)

const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)

const paginatedTasks = filteredTasks.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
) 

const pendingTasks = paginatedTasks.filter(
  t => t.status === 'Pending'
)

const progressTasks = paginatedTasks.filter(
  t => t.status === 'In Progress'
)

const doneTasks = paginatedTasks.filter(
  t => t.status === 'Done'
)

const POSITION_OPTIONS =
  userId === 3
    ? ['STAFF IT', 'STAFF ASCX'] // 🔥 special IT
    : userRole === 'SUPERVISOR_ASCX'
    ? ['SUPERVISOR ASCX']
    : ['STAFF ASCX']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="
  flex flex-col gap-3
  sm:flex-row sm:items-center sm:justify-between
">

<div className="flex flex-col gap-3">
  <h2 className="text-xl font-bold">
    Daily Task / Activity Log
  </h2>

<div className="flex flex-col sm:flex-row gap-2 w-full">
  {loading ? (
        <div className="h-10 sm:w-auto md:w-32 bg-gray-200 animate-pulse rounded-lg" />
      ) : (
    <select
      value={filterMonth}
      onChange={e => setFilterMonth(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm"
    >
      <option value="">Semua Bulan</option>
      {Array.from({ length: 12 }).map((_, i) => {
        const month = String(i + 1).padStart(2, '0')
        return (
          <option key={month} value={month}>
            {new Date(2025, i).toLocaleString('id-ID', { month: 'long' })}
          </option>
        )
      })}
    </select>
    )
  }


  {loading ? (
      <div className="h-10 sm:w-auto md:w-32 bg-gray-200 animate-pulse rounded-lg" />
    ) : (
    <select
      value={filterYear}
      onChange={e => setFilterYear(e.target.value)}
      className="border rounded-lg px-3 py-2 text-sm"
    >
      <option value="">Semua Tahun</option>
      {Array.from(new Set(tasks.map(t =>
        new Date(t.deadline).getFullYear()
      ))).map(year => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
    )
  
  }
  {loading ? (
      <div className="h-10 sm:w-auto md:w-48 bg-gray-200 animate-pulse rounded-lg" />
    ) : (
      <select
        value={filterJobType}
        onChange={e => {
          setFilterJobType(e.target.value)
          setCurrentPage(1)
        }}
        className="border rounded-lg px-3 py-2 text-sm"
      >
        <option value="">Semua Kategori</option>
        {jobTypes.map(jt => (
          <option key={jt.id} value={jt.id}>
            {jt.name}
          </option>
        ))}
      </select>
    )
  }
</div>
</div>
</div>

<div className="flex flex-col sm:flex-row gap-2 w-full">
    {loading ? (
      <div className="h-10 w-full sm:flex-1 min-w-0 bg-gray-200 animate-pulse rounded-lg" />
    ) : (
  <SearchFilter
    value={search}
    onChange={setSearch}
    placeholder="Cari aktivitas, kategori pekerjaan, atau berdasarkan status..."
    className="flex-1 min-w-0"
  />
  )}

{loading ? (
  <div className="h-10 sm:w-auto md:w-24 bg-gray-200 animate-pulse rounded-lg" />
) : (
  <div className="relative">
    
    {/* MAIN BUTTON */}
    <button
      onClick={() => setOpenDropdown(!openDropdown)}
      className="bg-black text-white px-3 py-2 rounded-lg text-sm flex items-center gap-2 w-full"
    >
      ⚡ Actions
    </button>

    {/* DROPDOWN */}
    {openDropdown && (
      <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">

        {/* ➕ Add Task */}
        <button
          onClick={() => {
            openAdd()
            setOpenDropdown(false)
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          ➕ Add Task
        </button>

        {/* 📝 Request Task */}
        <button
          onClick={() => {
            setOpenRequest(true)
            setOpenDropdown(false)
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
        >
          📝 Request Task
        </button>

      </div>
    )}
  </div>
)}
</div>

      {/* Task List */}
      <DndContext
  collisionDetection={closestCorners}
  onDragEnd={handleDragEnd}
>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{/* ================= PENDING ================= */}
<KanbanColumn
  title="PENDING"
  color="red"
  count={pendingTasks.length}
>
  {loading ? (
    <TaskSkeleton />
  ) : pendingTasks.length === 0 ? (
    <EmptyState />
  ) : (
    pendingTasks.map(task => (
      <DraggableTask key={task.id} task={task}>
        <TaskItem
          task={{...mapTaskForCard(task), isOverdue: isTaskOverdue(task.deadline, task.completed_at)}}
          onView={() => setViewTask(task)}
          onEdit={() => openEdit(task)}
          onDelete={() => handleDelete(task.id)}
        />
      </DraggableTask>
    ))
  )}
</KanbanColumn>

{/* ================= IN PROGRESS ================= */}
<KanbanColumn
  title="IN PROGRESS"
  color="blue"
  count={progressTasks.length}
>{loading ? (
    <TaskSkeleton />
  ) : progressTasks.length === 0 ? (
    <EmptyState />
  ) : (
  progressTasks.length === 0
    ? <EmptyState />
    : progressTasks.map(task => (
      <DraggableTask key={task.id} task={task}>
        <TaskItem
          task={{...mapTaskForCard(task), isOverdue: isTaskOverdue(task.deadline, task.completed_at)}}
          onView={() => setViewTask(task)}
          onEdit={() => openEdit(task)}
          onDelete={() => handleDelete(task.id)}
        />
      </DraggableTask>
    ))
  )}
</KanbanColumn>

{/* ================= DONE ================= */}
<KanbanColumn
  title="DONE"
  color="green"
  count={doneTasks.length}
> {loading ? (
    <TaskSkeleton />
  ) : doneTasks.length === 0 ? (
    <EmptyState />
  ) : (
  doneTasks.length === 0
    ? <EmptyState />
    : doneTasks.map(task => (
      <DraggableTask key={task.id} task={task}>
      <TaskItem
        task={{...mapTaskForCard(task), isOverdue: isTaskOverdue(task.deadline, task.completed_at)}}
        onView={() => setViewTask(task)}
        onEdit={() => openEdit(task)}
        onDelete={() => handleDelete(task.id)}
      />
    </DraggableTask>
      ))
  )}
</KanbanColumn>

</div>

</DndContext>

{totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 pt-4">
    <button
      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
      className="px-3 py-1 text-sm rounded-lg border disabled:opacity-50"
    >
      Prev
    </button>

    {Array.from({ length: totalPages }).map((_, i) => {
      const page = i + 1
      return (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`
            px-3 py-1 text-sm rounded-lg border
            ${currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-white'}
          `}
        >
          {page}
        </button>
      )
    })}

    <button
      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-3 py-1 text-sm rounded-lg border disabled:opacity-50"
    >
      Next
    </button>
  </div>
)}

      {/* Modal */}
      <Modal
  open={open}
  title={editingId ? 'Edit Daily Task' : 'Tambah Daily Task'}
  onClose={() => setOpen(false)}
>
  <div className="space-y-4">
    {/* GRID 2 KOLOM */}
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    {/* Deadline */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Deadline
      </label>
      <input
        type="datetime-local"
        value={form.deadline}
        onChange={e =>
          setForm({ ...form, deadline: e.target.value })
        }
        className="
          w-full border rounded-lg
          px-3 py-2 text-sm
          focus:ring-2 focus:ring-blue-500 outline-none
        "
      />
    </div>

{/* Status */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Status
  </label>
  <select
    value={form.status}
    onChange={e =>
      setForm({
        ...form,
        status: e.target.value as 'Pending' | 'In Progress' | 'Done',
      })
    }
    className="
      w-full border rounded-lg
      px-3 py-2 text-sm
      focus:ring-2 focus:ring-blue-500 outline-none
    "
  >
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Done">Done</option>
  </select>
</div>

{/* Position */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Jabatan
  </label>
  {POSITION_OPTIONS.length > 1 ? (
  <select
    value={form.position}
    onChange={e =>
      setForm({
        ...form,
        position: e.target.value as
          | 'STAFF IT'
          | 'STAFF ASCX'
          | 'SUPERVISOR ASCX',
      })
    }
    className="w-full border rounded-lg px-3 py-2 text-sm"
  >
    {POSITION_OPTIONS.map(pos => (
      <option key={pos} value={pos}>
        {pos}
      </option>
    ))}
  </select>
) : (
  <input
    value={POSITION_OPTIONS[0]}
    readOnly
    className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100"
  />
)}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Kategori Pekerjaan
  </label>
  <select
  disabled={jobTypes.length === 0}
  value={form.job_type_id}
  onChange={e =>
    setForm({
      ...form,
      job_type_id: Number(e.target.value),
    })
  }
  className="w-full border rounded-lg px-3 py-2 text-sm"
>
  <option value={0}>Pilih Job Type</option>
  {jobTypes.map(jt => (
    <option key={jt.id} value={jt.id}>
      {jt.name}
    </option>
  ))}
</select>
</div>
  </div>
  
    {/* File Upload */}
    {/* Attachment Type */}
<div>
<div className=' mb-3 text-sm'>
{editingId && (
  <div>
    <p className="text-gray-500 mb-2">Lampiran saat ini</p>

    {(() => {
      const imageFiles = existingFiles.filter(f =>
        f.file_type?.startsWith('image/')
      )

      const otherFiles = existingFiles.filter(f =>
        !f.file_type?.startsWith('image/')
      )

      if (imageFiles.length === 0 && otherFiles.length === 0 && !form.link) {
        return (
          <p className="text-xs text-gray-400">
            Tidak ada file atau link
          </p>
        )
      }

      return (
        <div className="space-y-4">
          {/* IMAGE PREVIEW */}
          {imageFiles.length > 0 && (
            <ImageSlider
              images={imageFiles.map(img => ({
                id: img.id,
                url: `${import.meta.env.VITE_API_URL}/storage/${img.file_path}`,
                name: img.file_name,
              }))}
            />
          )}

          {/* OTHER FILES */}
          {otherFiles.map(file => (
            <div
              key={file.id}
              className="border rounded-lg p-3 flex justify-between items-center text-sm"
            >
              <span className="truncate">📎 {file.file_name}</span>
              <a
                href={`${import.meta.env.VITE_API_URL}/storage/${file.file_path}`}
                target="_blank"
                className="text-blue-600 hover:underline"
              >
                Lihat
              </a>
            </div>
          ))}

          {/* LINK */}
          {form.link && (
            <div className="border rounded-lg p-3 text-sm">
              <p className="text-gray-500 mb-1">Link</p>
              <a
                href={form.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {form.link}
              </a>
            </div>
          )}
        </div>
      )
    })()}
  </div>
)}

</div>
<div className=' mb-3 text-sm'>
{editingId && existingFiles.length > 0 && (
  <div className="mb-4">
  <label className="block text-xs text-gray-500 mb-1">
    Mode Upload
  </label>

  <select
    value={uploadMode}
    onChange={e =>
      setUploadMode(e.target.value as 'replace' | 'append')
    }
    className="
      w-full border rounded-lg
      px-3 py-2 text-sm
      focus:ring-2 focus:ring-blue-500 outline-none
    "
  >
    <option value="append">
      ➕ Tambah File (file lama tetap)
    </option>
    <option value="replace">
      🔁 Ganti Semua File
    </option>
  </select>

  {uploadMode === 'replace' && (
    <p className="text-xs text-red-500 mt-1">
      ⚠ Semua file lama akan dihapus
    </p>
  )}
</div>
)}
</div>

  <label className="block text-sm font-medium text-gray-700 mb-2">
    Lampiran
  </label>

  <div className="flex gap-4 mb-3 text-sm">
    <label className="flex items-center gap-1">
      <input
        type="radio"
        checked={attachmentType === 'file'}
        onChange={() => setAttachmentType('file')}
      />
      Upload File
    </label>

    <label className="flex items-center gap-1">
      <input
        type="radio"
        checked={attachmentType === 'link'}
        onChange={() => setAttachmentType('link')}
      />
      Tambah Link
    </label>
  </div>

  {/* Upload File */}
  {attachmentType === 'file' && (
    <>
      <input
        type="file"
        multiple
        accept="
          image/*,
          video/*,
          audio/*,
          application/pdf,
          application/msword,
          application/vnd.openxmlformats-officedocument.wordprocessingml.document,
          application/vnd.ms-excel,
          application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
          application/vnd.ms-powerpoint,
          application/vnd.openxmlformats-officedocument.presentationml.presentation
        "
        onChange={handleFileChange}
        className="text-sm"
      />

    {uploadMode === 'append' && (
      <p className="text-xs text-gray-500 mt-1">
        File baru akan ditambahkan
      </p>
    )}

    {uploadMode === 'replace' && (
      <p className="text-xs text-red-500 mt-1">
        File lama akan diganti
      </p>
    )}

      {form.files.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-gray-600">
          {form.files.map((file, i) => (
  <li key={i}>📎 {file.name}</li>
))}
        </ul>
      )}
    </>
  )}

  {/* Link */}
  {attachmentType === 'link' && (
    <>
    <input
      type="url"
      placeholder="https://drive.google.com atau https://example.com"
      value={attachmentLink}
      onChange={e => setAttachmentLink(e.target.value)}
      className="
        w-full border rounded-lg px-3 py-2 text-sm
        focus:ring-2 focus:ring-blue-500 outline-none
      "
    />
    <p className="text-xs text-gray-500 mt-1">
      Bisa diisi tanpa upload file
    </p>
    </>
  )}
</div>

{/* Activity */}
<div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Aktivitas
      </label>
      <textarea
        rows={4}
        placeholder="Deskripsi aktivitas..."
        value={form.activity}
        onChange={e =>
          setForm({ ...form, activity: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>

    {/* Actions */}
    <div className="flex justify-end gap-2 pt-4">
      <button
        onClick={() => setOpen(false)}
        className="px-4 py-2 text-sm rounded-lg bg-gray-200"
      >
        Batal
      </button>
      <button
        onClick={handleSubmit}
        disabled={!form.deadline || !form.activity}
        className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  </div>
</Modal>

<StaffRequestModal
  open={openRequest}
  onClose={() => setOpenRequest(false)}
  users={users}
  user={user}
  jobTypes={jobTypes}
/>

{/* View Task Modal */}
<Modal
  open={!!viewTask}
  title="Detail Daily Task"
  onClose={() => setViewTask(null)}
>
  {viewTask && (
    <div className="space-y-4 text-sm">

      {/* Deadline */}
      <div>
        <p className="text-gray-500">Deadline</p>
        <div className="flex items-center justify-between gap-2">
          <p className={`font-medium ${
            isTaskOverdue(viewTask.deadline, viewTask.completed_at)
              ? 'text-red-600'
              : ''
          }`}>
            {new Date(viewTask.deadline).toLocaleString()}
          </p>

          {isTaskOverdue(viewTask.deadline, viewTask.completed_at) && (
            <Badge color="red">Overdue</Badge>
          )}
        </div>   
      </div>

      {/* Status & Position */}
      <div className="flex gap-3">
        <div>
          <p className="text-gray-500">Status</p>
          <Badge
            color={
              viewTask.status === 'Done'
                ? 'green'
                : viewTask.status === 'In Progress'
                ? 'yellow'
                : 'red'
            }
          >
            {viewTask.status}
          </Badge>
        </div>

        <div>
          <p className="text-gray-500">Jabatan</p>
          <Badge color="blue">{viewTask.position}</Badge>
        </div>

        <div>
          <p className="text-gray-500">Kategori Pekerjaan</p>
          <Badge color={jobTypeColor(viewTask.job_type?.name ?? '')}>
            {viewTask.job_type?.name}
          </Badge>
        </div>
      </div>

      {/* Activity */}
      <div>
        <p className="text-gray-500 mb-1">Aktivitas</p>
        <p className="bg-gray-50 p-3 rounded-lg">
          {viewTask.activity}
        </p>
      </div>

      {/* Files */}
{/* Files & Link */}
<div>
  <p className="text-gray-500 mb-2">Lampiran</p>

  {(() => {
    const imageFiles = viewTask.files.filter(f =>
      f.file_type?.startsWith('image/')
    )

    const otherFiles = viewTask.files.filter(f =>
      !f.file_type?.startsWith('image/')
    )

    const hasAnything =
      imageFiles.length > 0 ||
      otherFiles.length > 0 ||
      viewTask.link

    if (!hasAnything) {
      return (
        <p className="text-xs text-gray-400">
          Tidak ada lampiran
        </p>
      )
    }

    return (
      <div className="space-y-4">

        {/* IMAGE SLIDER */}
        {imageFiles.length > 0 && (
          <ImageSlider
            images={imageFiles.map(img => ({
              id: img.id,
              url: `${import.meta.env.VITE_API_URL}/storage/${img.file_path}`,
              name: img.file_name,
            }))}
          />
        )}

        {/* OTHER FILES */}
        {otherFiles.map(file => (
          <div
            key={file.id}
            className="border rounded-lg p-3 flex justify-between items-center text-sm"
          >
            <span className="truncate">
              📎 {file.file_name}
            </span>
            <a
              href={`${import.meta.env.VITE_API_URL}/storage/${file.file_path}`}
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Download
            </a>
          </div>
        ))}

        {/* LINK */}
        {viewTask.link && (
          <div className="border rounded-lg p-3 text-sm">
            <p className="text-gray-500 mb-1">🔗 Link</p>
            <a
              href={viewTask.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {viewTask.link}
            </a>
          </div>
        )}

      </div>
    )
  })()}
</div>

      {/* Action */}
      <div className="flex justify-end pt-4">
        <Button onClick={() => setViewTask(null)}>
          Tutup
        </Button>
      </div>
    </div>
  )}
</Modal>

    </div>
  )
}
