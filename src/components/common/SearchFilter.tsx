interface SearchFilterProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
    className?: string
  }
  
  export default function SearchFilter({
    className='',
    value,
    onChange,
    placeholder = 'Cari...',
  }: SearchFilterProps) {
    return (
      <div className={`relative ${className}`}>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full pl-9 pr-3 py-2 text-sm
            border rounded-lg
            focus:ring-2 focus:ring-blue-500
            outline-none
          "
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>
    )
  }
  