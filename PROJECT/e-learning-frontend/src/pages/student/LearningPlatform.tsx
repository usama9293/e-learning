import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';


const LearningPlatform = () => {
  const { id } = useParams(); // ✅ courseId from URL
  const courseId  = parseInt(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('materials');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [data, setData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unreadChats, setUnreadChats] = useState(0);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [file, setFile] = useState(null);

  const userRole = localStorage.getItem('role');
  const courseUrl = userRole === 'tutor' ? '/tutor/courses' : '/students/courses';

  const endpoints = {
    materials: `/course/${courseId}/materials`,
    assignments: `/course/${courseId}/assignments`,
    chats: `/course/${courseId}/chats`,
    announcements: `/course/${courseId}/announcements`,
    unreadCounts: `/course/${courseId}/unread-counts`
  };


  useEffect(() => { 
    const loadCourses = async () => {
      console.log('loading')
      try {
        const res = await api.get(courseUrl);
        console.log(res.data);
        setCourses(res.data);
        if (!id && res.data.length > 0) {
          navigate(`/course/${res.data[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error('Failed to load courses:', err);
        setCourses([]);
      }
    };
    loadCourses();
  }, []);

  useEffect(() => {
    if (!courseId) return;
    fetch(endpoints.unreadCounts)
      .then(res => res.json())
      .then(({ chats = 0, announcements = 0 }) => {
        setUnreadChats(chats);
        setUnreadAnnouncements(announcements);
      })
      .catch(() => {
        setUnreadChats(0);
        setUnreadAnnouncements(0);
      });
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setData(null);
      setSubmitSuccess(false);
      setSubmitError(null);
      try {
        const response = await api.get(endpoints[activeTab]);
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, courseId]);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (assignmentId) => {
    if (!file) {
      setSubmitError('Please select a file before submitting.');
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('answerFile', file);
      formData.append('assignmentId', assignmentId);

      const res = await fetch(`/course/${courseId}/assignments/${assignmentId}/submit`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Submission failed');
      setSubmitSuccess(true);
      setFile(null);
      setSelectedAssignmentId(null);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const Badge = ({ count }) =>
    count > 0 ? (
      <span
        style={{
          marginLeft: 6,
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '50%',
          padding: '2px 7px',
          fontSize: 12,
          fontWeight: 'bold',
          minWidth: 18,
          textAlign: 'center',
          display: 'inline-block',
        }}
      >
        {count}
      </span>
    ) : null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      {/* 👉 Sidebar */}
      <div style={{
  width: 280,
  borderRight: '1px solid #ddd',
  padding: '20px 16px',
  backgroundColor: '#fdfdfd',
  boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
}}>
  <h3 style={{ marginBottom: 20, color: '#333' }}>📚 Your Courses</h3>
  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    {courses.map(course => (
      <li key={course.id} style={{ marginBottom: 16 }}>
        <div
          onClick={() => navigate(`/course/${course.id}`)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 10,
            borderRadius: 8,
            cursor: 'pointer',
            border: courseId === course.id ? '2px solid #007BFF' : '1px solid #ccc',
            backgroundColor: courseId === course.id ? '#e9f3ff' : '#fff',
            boxShadow: courseId === course.id ? '0 0 8px rgba(0,123,255,0.2)' : 'none',
            transition: 'all 0.2s ease-in-out',
          }}
        >

          {/* 👇 Course Image */}
          <img
            src={course.image || 'https://via.placeholder.com/40'} // Replace with your default image path
            alt={course.name}
            style={{
              width: 40,
              height: 40,
              objectFit: 'cover',
              borderRadius: '50%',
              border: '1px solid #ccc'
            }}
          />
          <div style={{ flex: 1 }}>
            <span style={{
              fontSize: 15,
              fontWeight: 500,
              color: courseId === course.id ? '#007BFF' : '#333',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {course.name}
            </span>
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

      {/* 👉 Main Content */}
      <div style={{ flex: 1, padding: '30px 40px' }}>
        <h2 style={{ marginBottom: 25 }}>📝 Course: {id}</h2>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #ccc', marginBottom: 20 }}>
          {Object.keys(endpoints).filter(k => k !== 'unreadCounts').map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #007BFF' : '3px solid transparent',
                background: 'none',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: activeTab === tab ? 'bold' : 400,
                color: activeTab === tab ? '#007BFF' : '#555',
                position: 'relative'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'chats' && <Badge count={unreadChats} />}
              {tab === 'announcements' && <Badge count={unreadAnnouncements} />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {loading && <p>Loading {activeTab}...</p>}
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!loading && !error && data && (
            <>
              {/* TODO: Render actual tab content here based on activeTab */}
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPlatform;
