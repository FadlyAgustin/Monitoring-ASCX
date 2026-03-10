import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import echo from '../../ts/echo'
import { useAuth } from '../auth/useAuth'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import SearchFilter from '../../components/common/SearchFilter'
import Pagination from '../../components/common/Pagination'
import Modal from '../../components/ui/Modal'
import ImageSlider from '../../components/common/ImageSlider'
import Select from 'react-select'
import TableSkeleton from '../skeleton/TableSkeleton'
import CardSkeleton from '../skeleton/CardSkeleton'

const ITEMS_PER_PAGE = 10

const today = new Date()
const CURRENT_MONTH = String(today.getMonth() + 1) // 1–12
const CURRENT_YEAR = String(today.getFullYear())

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

interface TaskFile {
    id: number
    file_name: string
    file_path: string
    file_type: string
  }

type Task = {
  id: number
  date: string
  deadline: string
  name: string
  position: string
  jobType: string
  activity: string
  status: 'Pending' | 'In Progress' | 'Done'
  files?: TaskFile[]
  link?: string
  completed_at?: string | null
  is_seen_by_supervisor?: boolean
}

export default function SupervisorDashboard() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [openAssign, setOpenAssign] = useState(false)
  const [staffs, setStaffs] = useState<any[]>([])
  const [loadingStaff, setLoadingStaff] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [jobTypes, setJobTypes] = useState<any[]>([])
  const [, setLoadingJobTypes] = useState(true)

  const fetchJobTypes = async () => {
    try {
      setLoadingJobTypes(true)
  
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/job-types`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
  
      setJobTypes(res.data.data ?? res.data)
  
    } catch (err) {
      console.error(err)
      setJobTypes([])
    } finally {
      setLoadingJobTypes(false)
    }
  }
  
  useEffect(() => {
    fetchJobTypes()
  }, [])

  const [form, setForm] = useState({
    user_id: '',
    deadline: '',
    activity: '',
    status: 'Pending',
    job_type_id: '',
    link: '',
  })

  const isLeader =
  user?.role === 'ASSISTANT_MANAGER_ASCX' ||
  user?.role === 'SUPERVISOR_ASCX'

  const isAsstman = user?.role === 'ASSISTANT_MANAGER_ASCX'

  useEffect(() => {
    if (isLeader) fetchStaffs()
  }, [isLeader])
  
  const fetchStaffs = async () => {
  
    try {
      setLoadingStaff(true)

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/staff`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
  
      setStaffs(res.data.data ?? res.data)
    } catch {
      setStaffs([])
    } finally {
      setLoadingStaff(false)
    }
  }

  const staffOptions = staffs.map((staff: any) => ({
    value: staff.id,
    label: staff.name,
  })) .sort((a, b) => a.label.localeCompare(b.label))

  const handleAssignTask = async () => {
    setSubmitting(true)
    try {
      const payload = {
        user_id: Number(form.user_id),
        deadline: form.deadline,
        activity: form.activity,
        status: 'Pending',
        job_type_id: Number(form.job_type_id),
      }
  
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/add-task-to-staff`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
  
      toast.success('Task berhasil di-submit!')
  
      setOpenAssign(false)
      fetchTasks()
  
      setForm({
        user_id: '',
        deadline: '',
        activity: '',
        status: 'Pending',
        job_type_id: '',
        link: '',
      })
  
    } catch (error) {
      console.error(error)
      toast.error('Gagal menambahkan task')
    } finally {
      setSubmitting(false)
    }
  }

  // ✅ HARUS di dalam component
  const [month, setMonth] = useState(CURRENT_MONTH)
  const [year, setYear] = useState(CURRENT_YEAR)

  const [jobType, setJobType] = useState('all')
  
  const [data, setData] = useState<Task[]>([])

  useEffect(() => {
  fetchTasks()
}, [page, search, month, year, jobType])

// REALTIME ECHO
useEffect(() => {
  if (!user) return;

  const channel = echo.private("tasks.supervisor");

  channel
    .listen(".task.created", fetchTasks)
    .listen(".task.updated", fetchTasks)
    .listen(".task.deleted", fetchTasks)
    .listen(".task.seen", fetchTasks);

  return () => {
    echo.leave("tasks.supervisor");
  };
}, [user]);


const [loading, setLoading] = useState(true);

const fetchTasks = async () => {
  setLoading(true);

  try {
    const params: any = {
      page,
      search,
    }

    if (month !== 'all') params.month = month
    if (year !== 'all') params.year = year
    if (jobType !== 'all') params.jobType = jobType

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/leader`,
      {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    const mapped = res.data.data.map((t: any) => ({
      id: t.id,
      date: t.date,
      deadline: t.deadline,
      name: t.user?.name ?? '-',
      position: t.position,
      jobType: t.job_type?.name,
      activity: t.activity,
      status: t.status,
      files: t.files?.map((f:any)=>({
        id: f.id,
        file_name: f.file_name,
        file_type: f.file_type,
        file_path: f.file_path, // ✅ WAJIB ADA
      })) ?? [],
      link: t.link,
      completed_at: t.completed_at,
      is_seen_by_supervisor: t.is_seen_by_supervisor,
    }))

    setData(mapped)
  } catch (err) {
    console.error(err)
  }finally {
    setLoading(false)
  }
}

const openDetail = async (id:number) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/leader/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );

    const t = res.data;

    const mapped: Task = {
      id: t.id,
      date: t.date,
      deadline: t.deadline,
      name: t.user?.name ?? '-',
      position: t.position,
      jobType: t.job_type?.name,
      activity: t.activity,
      status: t.status,
      files: t.files?.map((f:any)=>({
        id: f.id,
        file_name: f.file_name,
        file_type: f.file_type,
        file_path: f.file_path,
      })) ?? [],
      link: t.link,
      completed_at: t.completed_at,
      is_seen_by_supervisor: t.is_seen_by_supervisor,
    };

    setViewData(mapped);
    fetchTasks();

  } catch(err){
    console.error(err);
  }
};

const [progress,setProgress] = useState(0)

const downloadZip = async (taskId:number) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/tasks/${taskId}/download-zip`,
    {
      responseType: "blob",
      headers:{
        Authorization:`Bearer ${localStorage.getItem('token')}`
      },
      onDownloadProgress:(e)=>{
        const percent = Math.round(
          (e.loaded * 100) / (e.total || 1)
        )
        setProgress(percent)
      }
    }
  )

  const url = window.URL.createObjectURL(res.data)
  const a = document.createElement("a")
  a.href = url
  a.download = `task-${taskId}.zip`
  a.click()

  setProgress(0)
}

  const [viewData, setViewData] = useState<Task | null>(null) 

  const filteredData = data.filter(item => {
    const date = new Date(item.date)
    const itemMonth = date.getMonth() + 1
    const itemYear = date.getFullYear()
    const keyword = search.toLowerCase()
  
    const matchSearch =
    item.activity.toLowerCase().includes(keyword) ||
    item.jobType.toLowerCase().includes(keyword) ||
    item.name.toLowerCase().includes(keyword) ||
    item.position.toLowerCase().includes(keyword) ||
    item.status.toLowerCase().includes(keyword)
  
    const matchMonth = month === 'all' || itemMonth === Number(month)
    const matchYear = year === 'all' || itemYear === Number(year)
    const matchJobType = jobType === 'all' || item.jobType === jobType
  
    return matchSearch && matchMonth && matchYear && matchJobType
  })
  
  const isEmpty = filteredData.length === 0
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE)
  const paginatedData = filteredData.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  const isDeadlineOverdue = (
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
  
  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const imageFiles =
  viewData?.files?.filter(f =>
    f.file_type?.startsWith("image")
  ) || []

  const otherFiles =
  viewData?.files?.filter(f =>
    !f.file_type || !f.file_type.startsWith("image")
  ) || []

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
        {loading ? (
          <>
            <div className="h-10 w-full sm:w-40 bg-gray-200 animate-pulse rounded-md" />
            <div className="h-10 w-full sm:w-40 bg-gray-200 animate-pulse rounded-md" />
            <div className="h-10 w-full sm:w-40 bg-gray-200 animate-pulse rounded-md" />
          </>
        ) : (
          <>
            {/* Filter Bulan */}
            <select
              value={month}
              onChange={e => {
                setMonth(e.target.value)
                setPage(1)
              }}
              className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option value="all">Semua Bulan</option>
              {Array.from({ length: 12 }).map((_, i) => {
                const m = String(i + 1).padStart(2, '0')
                return (
                  <option key={m} value={m}>
                    {new Date(2025, i).toLocaleString('id-ID', { month: 'long' })}
                  </option>
                )
              })}
            </select>

            {/* Filter Tahun */}
            <select
              value={year}
              onChange={e => {
                setYear(e.target.value)
                setPage(1)
              }}
              className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option value="all">Semua Tahun</option>
              {Array.from(
                new Set(
                  data
                    .filter(item => item.date)
                    .map(item =>
                      new Date(item.date as string).getFullYear()
                    )
                )
              ).map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            {/* Filter Job Type */}
            <select
              value={jobType}
              onChange={e => {
                setJobType(e.target.value)
                setPage(1)
              }}
              className="border rounded-md px-3 py-2 text-sm w-full sm:w-auto"
            >
              <option value="all">Semua Kategori Pekerjaan</option>
              {jobTypes.map(type => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        {loadingStaff ? (
            <div className="h-10 w-full sm:flex-1 min-w-0 bg-gray-200 animate-pulse rounded-lg" />
        ) : isLeader ? (
        <SearchFilter value={search} onChange={value => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Cari aktivitas, kategori pekerjaan, nama atau berdasarkan status..."
          className="flex-1 min-w-0"
        />
        ) : null}

        {isAsstman && (
          loadingStaff ? (
            <div className="h-10 w-full sm:w-auto md:w-24 bg-gray-200 animate-pulse rounded-lg" />
          ) : (
            <Button  variant="dark" onClick={() => setOpenAssign(true)}>
              + Task
            </Button>
          )
        )}
        </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full bg-white rounded shadow text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-2 text-left">Tanggal Dibuat</th>
        <th className="p-2 text-left">Deadline</th>
        <th className="p-2 text-left">Nama</th>
        <th className="p-2 text-left">Posisi</th>
        <th className="p-2 text-left">Kategori Pekerjaan</th>
        <th className="p-2 text-left">Aktivitas</th>
        <th className="p-2 text-left">Status</th>
        <th className="p-2 text-left">Action</th>
      </tr>
    </thead>

    <tbody>
    {loading ? (
    <TableSkeleton />
  ) : isEmpty ? (
  <tr>
    <td colSpan={7} className="p-6 text-center text-gray-500">
      <p className="font-medium text-gray-700">
        Tidak ada data aktivitas
      </p>

      <p className="text-xs mt-1">
        {month !== 'all' && (
          <>
            Bulan{' '}
            <strong>
              {new Date(Number(year), Number(month) - 1).toLocaleString(
                'id-ID',
                { month: 'long' }
              )}
            </strong>
          </>
        )}

        {year !== 'all' && <> {year}</>}

        {jobType !== 'all' && (
          <>
            {' '}dengan Kategori Pekerjaan{' '}
            <strong>{jobType}</strong>
          </>
        )}
      </p>
    </td>
  </tr>
) : (
        paginatedData.map((item) => (
          <tr key={item.id} className={`border-t ${
            !item.is_seen_by_supervisor ? "bg-green-50 border-l-4 border-green-400" : ""
          }`}>
            {/* TANGGAL (created_at kalau ada, atau deadline saja) */}
            <td className="p-2 font-medium">
              {formatDateTime(item.date)}
            </td>

            {/* DEADLINE */}
            <td
              className={`p-2 font-medium ${
                isDeadlineOverdue(item.deadline, item.completed_at)
                  ? 'text-red-600 font-bold'
                  : ''
              }`}
            >
              {formatDateTime(item.deadline)}
            </td>
            <td className="p-2 font-medium">{item.name}</td>
            <td className="p-2">
              <Badge color="dark">{item.position}</Badge>
            </td>
            <td className="p-2">
              <Badge color={jobTypeColor(item.jobType)}>
                {item.jobType}
              </Badge>
            </td>
            <td className="p-2 max-w-xs">
              <p className="line-clamp-2 text-gray-700">
                {item.activity}
              </p>
            </td>

            <td className="p-2">
              <Badge
                color={
                  item.status === 'Done'
                    ? 'green'
                    : item.status === 'In Progress'
                    ? 'yellow'
                    : 'red'
                }
              >
                {item.status}
              </Badge>
            </td>
            <td className="p-2">
            <Button size="sm" className="m-1" onClick={() => openDetail(item.id)}>View</Button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

{/* Mobile Card View */}
<div className="space-y-3 md:hidden">
{loading ? (
    [...Array(5)].map((_, i) => <CardSkeleton key={i} />)
  ) : isEmpty ? (
    <div className="p-4 bg-white rounded shadow text-center text-gray-500">
      <p className="font-medium">Tidak ada data aktivitas</p>
      <p className="text-xs">
        Bulan{' '}
        {new Date(Number(year), Number(month) - 1).toLocaleString('id-ID', {
          month: 'long',
        })}{' '}
        {year}
      </p>
    </div>
  ) : (
    paginatedData.map((item, i) => (
      <div
        key={i}
        className={`relative bg-white rounded shadow p-4 my-2 space-y-2 text-sm ${
          !item.is_seen_by_supervisor ? 'ring-2 ring-green-400' : ''
        }`}
      >
       
          {!item.is_seen_by_supervisor && (
          <div className="py-2">
            <span className="absolute top-2 right-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full animate-pulse">
              Task Baru
            </span>
          </div>
          )}
        
        <div className="flex justify-between">
          <span className="text-gray-500">Tanggal dibuat</span>

  <span
    className="font-medium"
  >
    {formatDateTime(item.date)}
  </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Nama</span>
          <span className="font-medium">{item.name}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Posisi</span>
          <Badge color="dark">{item.position}</Badge>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Kategori Pekerjaan</span>
          <Badge color={jobTypeColor(item.jobType)}>
            {item.jobType}
          </Badge>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Aktivitas</p>
          <p className="font-medium line-clamp-2">
            {item.activity}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <Badge
            color={
              item.status === 'Done'
                ? 'green'
                : item.status === 'In Progress'
                ? 'yellow'
                : 'red'
            }
          >
            {item.status}
          </Badge>

          <div className="flex gap-2">
            <Button size="sm" onClick={() => openDetail(item.id)}>View</Button>
          </div>
        </div>
      </div>
    ))
  )}
</div>

      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

{/* View Task Modal */}
<Modal
  open={!!viewData}
  title="Detail Daily Task"
  onClose={() => setViewData(null)}
>
  {viewData && (
    <div className="space-y-4 text-sm">

      {/* Deadline */}
      <div>
        <p className="text-gray-500">Deadline</p>
        <div className='flex items-center justify-between gap-2'>
          <p
            className={`font-medium ${
              isDeadlineOverdue(viewData.deadline, viewData.completed_at)
                ? 'text-red-600'
                : ''
            }`}
          >
            {formatDateTime(viewData.deadline)}
          </p>

          {isDeadlineOverdue(viewData.deadline, viewData.completed_at) && (
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
              viewData.status === 'Done'
                ? 'green'
                : viewData.status === 'In Progress'
                ? 'yellow'
                : 'red'
            }
          >
            {viewData.status}
          </Badge>
        </div>

        <div>
          <p className="text-gray-500">Position</p>
          <Badge color="blue">{viewData.position}</Badge>
        </div>

        <div>
        <p className="text-gray-500">Kategori Pekerjaan</p>
          <Badge color={jobTypeColor(viewData.jobType)}>
            {viewData.jobType}
          </Badge>
        </div>
      </div>

      {/* Activity */}
      <div>
        <p className="text-gray-500 mb-1">Aktivitas</p>
        <p className="bg-gray-50 p-3 rounded-lg">
          {viewData.activity}
        </p>
      </div>

      {/* Files */}
<div>

  <p className="text-gray-500 mb-2">Lampiran</p>

  {/* FILE */}
{viewData.files && viewData.files.length > 0 && (
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

    {/* SINGLE DOWNLOAD BUTTON */}
    {imageFiles.length > 0 && (
  <>
    <Button
      variant="dark"
      className="w-full"
      onClick={() => downloadZip(viewData!.id)}
    >
      Download Semua Gambar
    </Button>

    {progress > 0 && (
      <div className="w-full bg-gray-200 h-2 mt-2 rounded">
        <div
          className="bg-green-500 h-2 rounded"
          style={{width:`${progress}%`}}
        />
      </div>
    )}
  </>
)}

  </div>
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
{(!viewData.files || viewData.files.length === 0) && viewData.link && (
  <div className="border rounded-lg p-3 text-sm">
    <p className="text-gray-500 mb-1">Link</p>
    <a
      href={viewData.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline break-all"
    >
      {viewData.link}
    </a>
  </div>
)}

{/* EMPTY */}
{(!viewData.files || viewData.files.length === 0) && !viewData.link && (
  <p className="text-xs text-gray-400">
    Tidak ada file atau link
  </p>
)}

  
</div>

      {/* Action */}
      <div className="flex justify-end pt-4">
        <Button onClick={() => setViewData(null)}>
          Tutup
        </Button>
      </div>
    </div>
  )}
</Modal>

{/* Create Task Modal */}
<Modal
  open={openAssign}
  title="Tambahkan Task ke Staff"
  onClose={() => setOpenAssign(false)}
>
  <div className="space-y-4">

    {/* Pilih Staff */}
    <div>
      <label className="text-sm font-medium">Pilih Supervisor & Staff</label>
      <Select
        options={staffOptions}
        isSearchable
        isClearable
        noOptionsMessage={() => "Staff tidak ditemukan"}
        loadingMessage={() => "Loading staff..."}
        placeholder="Cari & pilih staff..."
        className="text-sm"
        onChange={(selected: any) => {
          setForm({
            ...form,
            user_id: selected?.value || '',
          })
        }}
      />
    </div>

  <div>
    {/* Deadline */}
    <label className="text-sm font-medium">Deadline</label>
    <input
      type="datetime-local"
      value={form.deadline}
      onChange={e =>
        setForm({ ...form, deadline: e.target.value })
      }
      className="w-full border rounded-lg
      px-3 py-2 text-sm
      focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

  <div>
    {/* Job Type */}
    <label className="text-sm font-medium">Kategori Pekerjaan</label>
    <select
      value={form.job_type_id}
      onChange={e =>
        setForm({ ...form, job_type_id: e.target.value })
      }
      className="w-full border rounded-lg
      px-3 py-2 text-sm
      focus:ring-2 focus:ring-blue-500 outline-none"
    >
      <option value="">-- Pilih Kategori --</option>

      {jobTypes.map(type => (
        <option key={type.id} value={type.id}>
          {type.name}
        </option>
      ))}
    </select>
  </div>

  <div>
    {/* Activity */}
    <label className="text-sm font-medium">Aktivitas</label>
    <textarea
      rows={4}
      placeholder="Deskripsi tugas..."
      value={form.activity}
      onChange={e =>
        setForm({ ...form, activity: e.target.value })
      }
      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
    />
  </div>

    {/* Submit */}
    <div className="flex justify-end gap-2">
      <button
        onClick={() => setOpenAssign(false)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        Batal
      </button>

      <button
      onClick={handleAssignTask}
      className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
      disabled={
        submitting ||
        !form.user_id ||
        !form.deadline ||
        !form.activity ||
        !form.job_type_id
      }
    >
      {submitting && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {submitting ? 'Menyimpan...' : 'Submit'}
    </button>
    </div>
  </div>
</Modal>

    </div>
  )
}
