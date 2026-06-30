import { useState, useMemo } from 'react';
import { Plus, Search, Monitor, Trash2, Pencil, CheckCircle2, Circle, Layout, Play } from 'lucide-react';
import { useLearning } from '../hooks/useLearning';
import type { Course, CourseStatus, Lesson } from '../types/learning';
import { LEARNING_CATEGORIES, PLATFORMS } from '../types/learning';
import { v4 as uuidv4 } from 'uuid';

export default function CoursesSection() {
  const { courses, addCourse, updateCourse, deleteCourse, toggleLesson } = useLearning();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CourseStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return c.title.toLowerCase().includes(q) || c.instructor.toLowerCase().includes(q);
      }
      return true;
    });
  }, [courses, search, statusFilter]);

  const handleOpenEdit = (c: Course) => {
    setEditingCourse(c);
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 mb-4">
          <Monitor size={14} className="text-blue-400" />
          <span className="text-xs font-bold tracking-[0.2em] text-blue-400 uppercase">Learning Hub</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Courses & Lessons
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Manage your online courses, track lesson completion, and master new skills.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search courses or instructors..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all text-sm" 
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="all">All Status</option>
            <option value="in-progress">In Progress</option>
            <option value="enrolled">Enrolled</option>
            <option value="completed">Completed</option>
          </select>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-semibold shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95"
          >
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEdit={handleOpenEdit} 
              onDelete={deleteCourse} 
              onToggleLesson={toggleLesson} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-dashed border-slate-700">
          <Layout size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-slate-300 font-semibold mb-1">No courses found</h3>
          <p className="text-slate-500 text-sm mb-6">Enroll in a course to get started</p>
          <button 
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-semibold hover:bg-blue-500/30 transition-all"
          >
            <Plus size={16} /> Add Your First Course
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <CourseFormModal 
          initial={editingCourse} 
          onClose={() => setModalOpen(false)} 
          onSubmit={(data) => {
            if (editingCourse) updateCourse(editingCourse.id, data);
            else addCourse(data);
            setModalOpen(false);
          }} 
        />
      )}
    </div>
  );
}

function CourseCard({ course, onEdit, onDelete, onToggleLesson }: { 
  course: Course; 
  onEdit: (c: Course) => void; 
  onDelete: (id: string) => void;
  onToggleLesson: (cId: string, lId: string) => void;
}) {
  const completed = course.lessons.filter(l => l.completed).length;
  const total = course.lessons.length;
  
  return (
    <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-blue-500/40 transition-all group shadow-xl flex flex-col h-full">
      <div className="aspect-video bg-slate-700 relative overflow-hidden flex-shrink-0">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40">
            <Monitor size={48} className="text-blue-500/40 mb-2" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(course)} className="p-2 rounded-lg bg-black/60 text-white hover:bg-blue-500 transition-colors"><Pencil size={14}/></button>
          <button onClick={() => onDelete(course.id)} className="p-2 rounded-lg bg-black/60 text-white hover:bg-rose-500 transition-colors"><Trash2 size={14}/></button>
        </div>
        <div className="absolute bottom-3 left-3 flex gap-2">
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
            {course.platform}
          </span>
          <span className={`px-2 py-0.5 rounded backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider ${
            course.status === 'in-progress' ? 'bg-blue-500/80' : 
            course.status === 'completed' ? 'bg-emerald-500/80' : 'bg-slate-600/80'
          }`}>
            {course.status.replace('-', ' ')}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-slate-400 mb-4">{course.instructor}</p>
        
        <div className="space-y-4 flex-1">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
              <span>Course Progress</span>
              <span className="text-blue-400">{course.progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${course.progressPercent}%` }} />
            </div>
            <p className="text-[10px] text-slate-500">{completed} of {total} lessons completed</p>
          </div>

          {/* Quick Lesson View */}
          <div className="space-y-2 border-t border-slate-700/50 pt-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Recent Lessons</p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto no-scrollbar">
              {course.lessons.slice(0, 5).map(lesson => (
                <div 
                  key={lesson.id} 
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors cursor-pointer ${lesson.completed ? 'bg-slate-700/20' : 'bg-slate-700/40 hover:bg-slate-700/60'}`}
                  onClick={() => onToggleLesson(course.id, lesson.id)}
                >
                  {lesson.completed ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Circle size={14} className="text-slate-500" />}
                  <span className={`text-[11px] truncate flex-1 ${lesson.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {lesson.title}
                  </span>
                  {lesson.duration && <span className="text-[9px] text-slate-600">{lesson.duration}</span>}
                </div>
              ))}
              {total > 5 && (
                <button onClick={() => onEdit(course)} className="w-full text-center text-[10px] font-bold text-blue-400 hover:text-blue-300 py-1 transition-colors">
                  View all {total} lessons
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CourseFormModal({ initial, onClose, onSubmit }: { initial: Course | null; onClose: () => void; onSubmit: (data: any) => void }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [instructor, setInstructor] = useState(initial?.instructor || '');
  const [platform, setPlatform] = useState(initial?.platform || PLATFORMS[0]);
  const [status, setStatus] = useState<CourseStatus>(initial?.status || 'enrolled');
  const [category, setCategory] = useState(initial?.category || LEARNING_CATEGORIES[0]);
  const [lessons, setLessons] = useState<Lesson[]>(initial?.lessons || []);
  const [notes, setNotes] = useState(initial?.notes || '');
  const [thumbnail, setThumbnail] = useState(initial?.thumbnail || '');
  
  const [newLessonTitle, setNewLessonTitle] = useState('');

  const handleAddLesson = () => {
    if (!newLessonTitle.trim()) return;
    setLessons([...lessons, { id: uuidv4(), title: newLessonTitle.trim(), completed: false }]);
    setNewLessonTitle('');
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setThumbnail(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl animate-in p-6 my-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white"><Plus className="rotate-45" size={24}/></button>
        <h2 className="text-2xl font-bold text-white mb-6">{initial ? 'Edit Course' : 'Add New Course'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div 
              onClick={() => document.getElementById('thumbnail-upload')?.click()}
              className="w-full aspect-video bg-slate-800 rounded-xl border-2 border-dashed border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden group"
            >
              {thumbnail ? (
                <img src={thumbnail} className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Plus className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Thumbnail</span>
                </div>
              )}
              <input id="thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
            
            <input 
              type="text" placeholder="Course Title" value={title} onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/40" 
            />
            <input 
              type="text" placeholder="Instructor" value={instructor} onChange={e => setInstructor(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-blue-500/40" 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm">
                {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={status} onChange={e => setStatus(e.target.value as any)} className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm">
                <option value="enrolled">Enrolled</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm">
              {LEARNING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <textarea 
              placeholder="Notes..." value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm resize-none"
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Curriculum / Lessons ({lessons.length})</label>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" placeholder="Lesson title..." value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddLesson()}
                className="flex-1 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs" 
              />
              <button onClick={handleAddLesson} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <Plus size={16}/>
              </button>
            </div>
            
            <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl p-2 space-y-1 overflow-y-auto max-h-[250px] no-scrollbar">
              {lessons.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 p-4">
                  <Play size={24} className="mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">No lessons added</p>
                </div>
              ) : (
                lessons.map((lesson, idx) => (
                  <div key={lesson.id} className="flex items-center gap-2 p-2 bg-slate-800 rounded-lg group">
                    <span className="text-[10px] text-slate-600 font-bold w-4">{idx + 1}.</span>
                    <span className="text-xs text-slate-300 flex-1 truncate">{lesson.title}</span>
                    <button onClick={() => removeLesson(lesson.id)} className="p-1 text-slate-500 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={12}/>
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <button 
              onClick={() => onSubmit({ title, instructor, platform, status, category, lessons, notes, thumbnail })}
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all mt-4"
            >
              Save Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
