import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/Tabs';
import MaterialsTabContent from './MaterialsTabContent';
import AssignmentTabContent from './AssignmentTabContent';

interface Session {
  id: number;
  course: {
    id: number;
    name: string;
    image?: string;
  };
  days: string;
  start_time: string;
  end_time: string;
}

interface State {
  activeTab: string;
  selectedCourse: Session | null;
  sessions: Session[];
  loading: boolean;
  error: string | null;
  data: any;
}

const TutorCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const userInfo = user.info;
  const userRole = localStorage.getItem('role');

  const [state, setState] = useState<State>({
    activeTab: "materials",
    selectedCourse: null,
    sessions: [],
    loading: false,
    error: null,
    data: null
  });

  const fetchData = useCallback(async (tab: string, courseId: number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const url = tab === 'assignments' ? `/assignments/${courseId}` : `/${tab}`;
      const res = await api.get(url);
      setState(prev => ({ ...prev, data: res.data, loading: false }));
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch data', 
        loading: false 
      }));
    }
  }, []);

  const loadSessions = useCallback(async () => {
    try {
      const url = userRole === 'student' 
        ? `/students/${userInfo.id}/sessions`
        : `/tutors/${userInfo.id}/sessions`;
      
      const res = await api.get(url);
      setState(prev => ({ ...prev, sessions: res.data }));
      
      if (!Number(courseId) && res.data.length > 0) {
        selectCourse(res.data[0].id, res.data[0]);
      }
    } catch (err) {
      setState(prev => ({ ...prev, sessions: [] }));
    }
  }, [userInfo.id, userRole, courseId]);

  const selectCourse = useCallback((id: number, course: Session | null) => {
    if (course) {
      setState(prev => ({ ...prev, selectedCourse: course }));
    } else {
      const found = state.sessions.find(session => session.id === Number(courseId));
      if (found) {
        setState(prev => ({ ...prev, selectedCourse: found }));
      }
    }
    handleTabChange("materials");
    navigate(`/tutor-course/${id}`, { replace: true });
  }, [state.sessions, courseId, navigate]);

  const handleTabChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, activeTab: value }));
    if (state.selectedCourse?.id) {
      fetchData(value, state.selectedCourse.id);
    }
  }, [state.selectedCourse?.id, fetchData]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (courseId && state.sessions.length > 0) {
      const found = state.sessions.find(session => session.id.toString() === courseId);
      if (found) {
        setState(prev => ({ ...prev, selectedCourse: found }));
      }
    }
  }, [courseId, state.sessions]);

  useEffect(() => {
    if (state.selectedCourse?.id) {
      fetchData("materials", state.selectedCourse.id);
    }
  }, [state.selectedCourse?.id, fetchData]);

  const SessionListItem = React.memo(({ session, isActive }: { session: Session; isActive: boolean }) => (
    <li>
      <div
        onClick={() => selectCourse(session.id, session)}
        style={{
          marginBottom: 5,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 10,
          borderRadius: 8,
          cursor: 'pointer',
          border: isActive ? '2px solid #007BFF' : '1px solid #ccc',
          backgroundColor: isActive ? '#e9f3ff' : '#fff',
          boxShadow: isActive ? '0 0 8px rgba(0,123,255,0.2)' : 'none',
          transition: 'all 0.2s ease-in-out',
        }}
      >
        <img
          src={session.course.image || 'https://via.placeholder.com/40'}
          alt={session.course.name}
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
            color: isActive ? '#007BFF' : '#333',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {session.course.name}
          </span>
        </div>
      </div>
    </li>
  ));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{
        width: 280,
        borderRight: '1px solid #ddd',
        padding: '20px 16px',
        backgroundColor: '#fdfdfd',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ marginBottom: 20, color: '#333' }}>Assigned Sessions</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {state.sessions.map((session) => (
            <SessionListItem 
              key={session.id}
              session={session}
              isActive={session.id.toString() === courseId}
            />
          ))}
        </ul>
      </div>

      <div style={{ flex: 1, padding: '30px 40px' }}>
        {(!state.sessions || state.sessions.length === 0) ? (
          <div style={{ textAlign: 'center', marginTop: 100, fontSize: 24, color: '#888' }}>
            No Assigned Course
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: 10 }}>
              Course: {state.selectedCourse?.course?.name || ' '} 
            </h2>
            <div style={{ marginBottom: 10 }}>
              <strong>Session Days:</strong> {state.selectedCourse?.days || 'N/A'}
            </div>
            <div style={{ marginBottom: 25 }}>
              <strong>Session Time:</strong> {state.selectedCourse?.start_time || 'N/A'} - {state.selectedCourse?.end_time || 'N/A'}
            </div>

            <div className="p-6">
              <Tabs defaultValue="materials" onValueChange={handleTabChange}>
                <TabsList>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="chats">Chats</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger>
                </TabsList>

                <TabsContent value="materials">
                  {state.loading && <p>Loading materials...</p>}
                  {state.error && <p className="text-red-500">{state.error}</p>}
                  {state.data && <MaterialsTabContent selectedCourse={state.selectedCourse} />}
                </TabsContent>

                <TabsContent value="assignments">
                  {state.loading && <p>Loading assignments...</p>}
                  {state.error && <p className="text-red-500">{state.error}</p>}
                  <AssignmentTabContent selectedCourse={state.selectedCourse} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(TutorCoursePage);
