import { useState, useEffect } from 'react';
import { getCategories } from '../services/api';
import { PostForm } from '../components/PostForm';
import { useNavigate } from 'react-router-dom';
import './SubmitPostPage.css';

export function SubmitPostPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      console.log('Categories loaded:', data);
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Set default categories as fallback
      setCategories(['Jobs', 'Rentals', 'Events', 'Announcements', 'Lost & Found']);
    }
  };

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="submit-post-page">
      <div className="container">
        <PostForm categories={categories} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
