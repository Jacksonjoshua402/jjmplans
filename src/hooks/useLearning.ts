import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Book, Course } from '../types/learning';
import { useCloudSyncedState } from './useCloudSync';

const BOOKS_KEY = 'mydayplan-books';
const COURSES_KEY = 'mydayplan-courses';

function loadBooks(): Book[] {
  try {
    const stored = localStorage.getItem(BOOKS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function loadCourses(): Course[] {
  try {
    const stored = localStorage.getItem(COURSES_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveBooks(books: Book[]) { localStorage.setItem(BOOKS_KEY, JSON.stringify(books)); }
function saveCourses(courses: Course[]) { localStorage.setItem(COURSES_KEY, JSON.stringify(courses)); }

export function useLearning() {
  const [books, setBooks, resetBooksCloud] = useCloudSyncedState<Book[]>(BOOKS_KEY, loadBooks, saveBooks);
  const [courses, setCourses, resetCoursesCloud] = useCloudSyncedState<Course[]>(COURSES_KEY, loadCourses, saveCourses);

  const addBook = useCallback((data: Omit<Book, 'id' | 'createdAt'>) => {
    setBooks(prev => [{ ...data, id: uuidv4(), createdAt: new Date().toISOString() }, ...prev]);
  }, [setBooks]);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, [setBooks]);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  }, [setBooks]);

  const addCourse = useCallback((data: Omit<Course, 'id' | 'createdAt'>) => {
    setCourses(prev => [{ ...data, id: uuidv4(), createdAt: new Date().toISOString() }, ...prev]);
  }, [setCourses]);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, ...updates };
      if (updates.lessons) {
        const total = updated.lessons.length;
        const completed = updated.lessons.filter(l => l.completed).length;
        updated.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
      }
      return updated;
    }));
  }, [setCourses]);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  }, [setCourses]);

  const toggleLesson = useCallback((courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const updatedLessons = c.lessons.map(l =>
        l.id === lessonId ? { ...l, completed: !l.completed } : l
      );
      const total = updatedLessons.length;
      const completed = updatedLessons.filter(l => l.completed).length;
      return { ...c, lessons: updatedLessons, progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }));
  }, [setCourses]);

  return {
    books, addBook, updateBook, deleteBook,
    courses, addCourse, updateCourse, deleteCourse, toggleLesson,
    resetBooks: () => { localStorage.removeItem(BOOKS_KEY); resetBooksCloud(); setBooks([]); },
    resetCourses: () => { localStorage.removeItem(COURSES_KEY); resetCoursesCloud(); setCourses([]); },
  };
}
