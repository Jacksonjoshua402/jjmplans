import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Book, Course } from '../types/learning';

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

export function useLearning() {
  const [books, setBooks] = useState<Book[]>(loadBooks);
  const [courses, setCourses] = useState<Course[]>(loadCourses);

  useEffect(() => {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  }, [courses]);

  // Books Actions
  const addBook = useCallback((data: Omit<Book, 'id' | 'createdAt'>) => {
    setBooks(prev => [{ ...data, id: uuidv4(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const updateBook = useCallback((id: string, updates: Partial<Book>) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  }, []);

  // Courses Actions
  const addCourse = useCallback((data: Omit<Course, 'id' | 'createdAt'>) => {
    setCourses(prev => [{ ...data, id: uuidv4(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, ...updates };
      // Recalculate progress if lessons changed
      if (updates.lessons) {
        const total = updated.lessons.length;
        const completed = updated.lessons.filter(l => l.completed).length;
        updated.progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
      }
      return updated;
    }));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  const toggleLesson = useCallback((courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      const updatedLessons = c.lessons.map(l => 
        l.id === lessonId ? { ...l, completed: !l.completed } : l
      );
      const total = updatedLessons.length;
      const completed = updatedLessons.filter(l => l.completed).length;
      return {
        ...c,
        lessons: updatedLessons,
        progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0
      };
    }));
  }, []);

  return {
    books, addBook, updateBook, deleteBook,
    courses, addCourse, updateCourse, deleteCourse, toggleLesson
  };
}
