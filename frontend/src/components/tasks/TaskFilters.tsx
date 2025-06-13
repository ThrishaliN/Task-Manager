 import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, FileText } from 'lucide-react';
import Button from '../ui/Button';
import { TaskStatus } from '../../types';

interface TaskFiltersProps {
onSearch: (term: string) => void;
onFilterStatus: (status: TaskStatus | '') => void;
onGeneratePDF: () => void;
searchTerm: string;
statusFilter: TaskStatus | '';
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
onSearch,
onFilterStatus,
onGeneratePDF,
searchTerm,
statusFilter,
}) => {
const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
const searchInputRef = useRef<HTMLInputElement>(null);

// Update local state when props change
useEffect(() => {
setLocalSearchTerm(searchTerm);
}, [searchTerm]);

// Focus search input on mount
useEffect(() => {
if (searchInputRef.current) {
searchInputRef.current.focus();
}
}, []);

const handleSearchSubmit = (e: React.FormEvent) => {
e.preventDefault();
onSearch(localSearchTerm);
};

return (
<div className="mb-6 space-y-4 md:flex md:items-center md:justify-between md:space-x-4 md:space-y-0">
<div className="flex-1 md:max-w-md">
<form onSubmit={handleSearchSubmit}>
<div className="relative">
<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
<Search className="h-4 w-4 text-gray-400" />
</div>
<input
ref={searchInputRef}
type="search"
className="form-input pl-10 pr-10"
placeholder="Search tasks..."
value={localSearchTerm}
onChange={(e) => setLocalSearchTerm(e.target.value)}
/>
{localSearchTerm && (
<button
type="button"
className="absolute inset-y-0 right-0 flex items-center pr-3"
onClick={() => {
setLocalSearchTerm('');
onSearch('');
}}
>
<span className="text-gray-400 hover:text-gray-500">×</span>
</button>
)}
</div>
</form>
</div>

<div className="flex flex-wrap items-center space-x-2">
<div className="relative inline-block">
<select
className="form-select appearance-none pr-8 py-2"
value={statusFilter}
onChange={(e) => onFilterStatus(e.target.value as TaskStatus | '')}
>
<option value="">All Statuses</option>
<option value="pending">Pending</option>
<option value="in-progress">In Progress</option>
<option value="completed">Completed</option>
</select>
<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
<Filter className="h-4 w-4" />
</div>
</div>

<Button
onClick={onGeneratePDF}
variant="secondary"
className="ml-2 flex items-center"
>
<FileText className="mr-1.5 h-4 w-4" />
<span>Export PDF</span>
</Button>
</div>
</div>
);
};

export default TaskFilters;