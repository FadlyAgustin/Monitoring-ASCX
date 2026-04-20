import Badge from '../common/Badge'
import Button from '../common/Button'

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

interface TaskItemProps {
  task: {
    deadline: string
    completed_at?: string | null
    activity: string
    position: string
    status: 'Pending' | 'In Progress' | 'Done'
    files: {
      id: number
      name: string
      url: string
      mime: string
    }[]
    job_type: string
    user: {
      role: string
    }
    delete_status?: 'none' | 'pending' | 'approved' | 'rejected'
    isOverdue?: boolean
  }
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function TaskItem(
  {
  task,
  onView,
  onEdit,
  onDelete,
}: TaskItemProps) {
  
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">
            Deadline: {new Date(task.deadline).toLocaleString()}
          </p>
          <h3 className="font-medium line-clamp-1">{task.activity}</h3>
          <p className="text-xs text-gray-500">
            Position: {task.position}
          </p>
        </div>

        <div className="flex flex-col gap-2 items-end">
        <Badge color={jobTypeColor(task.job_type)}>
          {task.job_type}
        </Badge>
        <Badge
          color={
            task.status === 'Done'
              ? 'green'
              : task.status === 'In Progress'
              ? 'yellow'
              : 'red'
          }
        >
          {task.status}
        </Badge>
      </div>
    </div>

      <div className="flex gap-2 pt-2">
        <Button size="sm" onClick={onView}>
          View
        </Button>

        {/* Disable Edit button if delete_status is pending, and show tooltip */} 
        <Button
          size="sm"
          variant="warning"
          onClick={onEdit}
          disabled={task.delete_status?.toLowerCase() === 'pending'}
          className={
            task.delete_status?.toLowerCase() === 'pending'
              ? 'opacity-50 cursor-not-allowed'
              : ''
          }
          title={
            task.delete_status?.toLowerCase() === 'pending'
              ? 'Tidak bisa edit saat menunggu approval delete'
              : 'Edit task'
          }
        >
          Edit
        </Button>

        {/* Delete button logic: */} 
        {task.delete_status?.toLowerCase() === 'pending' ? (
          <Button size="sm" disabled className="bg-yellow-100 text-yellow-700">
            ⏳ Waiting Approval
          </Button>
        ) : task.delete_status === 'rejected' ? (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="danger" onClick={onDelete}>
              Delete
            </Button>
            <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 whitespace-nowrap">
              Rejected
            </span>
          </div>
        ) : (
          <Button size="sm" variant="danger" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}