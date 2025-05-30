import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Stack,
  Card,
  CardContent,
  Typography,
 

  
} from '@mui/material';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/Tabs';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useSnackbar } from 'notistack';


const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>(); // ✅ courseId from URL
  // const courseId  = parseInt(id);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const SERVER_URL = 'http://localhost:8000/api/api_v1';
  const [activeTab, setActiveTab] = useState("materials");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [data, setData] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [file, setFile] = useState(null);
  const user  = JSON.parse(localStorage.getItem("user") || '{}');
  const userInfo = user.info;
  const [submissions, setSubmissions] = useState<Record<number, any>>({});
  

  const userRole = localStorage.getItem('role');
 
  const endpoints = {
    materials: `/course/${courseId}/materials`,
    assignments: `/course/${courseId}/assignments`,
    chats: `/course/${courseId}/chats`,
    announcements: `/course/${courseId}/announcements`,
    unreadCounts: `/course/${courseId}/unread-counts`
  };

  function selectCourse(id,course = null){
    
   
    if (course) {
      setSelectedCourse(course);
     
    }
    else{
      const found = sessions.find((session) => session.id === courseId);
      if (found) {
        setSelectedCourse(found);
        
      }
    }
    
    handleTabChange("materials");
    navigate(`/course/${id}`,{ replace : true })
  }
  useEffect(() => { 
    const loadSessions = async () => {
      
      try{
        const res = await api.get(`/students/${userInfo.id}/sessions`);
        setSessions(res.data)
        if (! Number(courseId)){
          selectCourse(res.data[0].id,res.data[0])
        }
       
       
      }
    
      catch(err){
        enqueueSnackbar('Failed to load sessions:', { variant: 'error' });
        setSessions([]);
      }
    } 
    

    loadSessions();
  }, []);

 
  
  useEffect(() => {
    if (courseId && sessions.length > 0) {
      const found = sessions.find((session) => session.id.toString() === courseId);
      if (found) {
        setSelectedCourse(found);
      }
    }
  }, [courseId, sessions]);

  
  const ALLOWED_FILE_TYPES = ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'jpg', 'jpeg', 'png'];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
        enqueueSnackbar(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`, { variant: 'error' });
        e.target.value = null;
        return;
      }
      setFile(selectedFile);
    }
  };

  // Add function to check if assignment is submitted
  const checkSubmission = async (assignmentId: number) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/submissions`);
      if (response.data && response.data.length > 0) {
        setSubmissions(prev => ({
          ...prev,
          [assignmentId]: response.data[0]
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking submission:', err);
      return false;
    }
  };

  // Add useEffect to check submissions when assignments are loaded
  useEffect(() => {
    if (data && data.length > 0) {
      data.forEach(async (assignment) => {
        await checkSubmission(assignment.id);
      });
    }
  }, [data]);

  const handleSubmit = async (assignmentId) => {
    // Check if already submitted
    const isSubmitted = await checkSubmission(assignmentId);
    if (isSubmitted) {
      setSubmitError("You have already submitted this assignment. Only one submission is allowed.");
      return;
    }

    if (!file) {
      setSubmitError("Please select a file before submitting.");
      return;
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_TYPES.includes(fileExtension)) {
      setSubmitError(`Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('content', 'Assignment submission');

      const response = await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Store the submission details
      setSubmissions(prev => ({
        ...prev,
        [assignmentId]: response.data
      }));

      setSubmitSuccess(true);
      setFile(null);
      setSelectedAssignmentId(null);
      enqueueSnackbar('Assignment submitted successfully!', { variant: 'success' });
      
      // Refresh the assignments list
      handleTabChange('assignments');
    } catch (err: any) {
      console.error('Submission error:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to submit assignment';
      setSubmitError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };
 
  useEffect(() => {
    if (!courseId || !activeTab) return;

    setLoading(false);
    setError(null);
    setData(null);
    setSubmitSuccess(false);
    setSubmitError(null);

    
  }, [activeTab, courseId]);

  useEffect(() => {
    // Trigger materials tab on initial load
    handleTabChange("materials");
  }, []); // Empty dependency array means this runs once on mount

  const handleTabChange = async (value: string) => {
 
    setActiveTab(value);
  
  
    try{
      const res = await api.get(`/${value}/${selectedCourse.id}`)
      setData(res.data)
    
    }catch(err){
      enqueueSnackbar("Failed to Load sessions", { variant: 'error' });
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
    {sessions.map((session) => {
      const isActive = session.id.toString() === courseId;
      return (
        <li
          key={session.id}
          className={`cursor-pointer p-2 border-b hover:bg-gray-100 ${
            isActive ? 'bg-blue-500 text-white font-semibold' : ''
          }`}
        >
          <div
            onClick={() => selectCourse(session.id,session)}
            style={{
              marginBottom:5,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              borderSpacing:10,
              padding: 10,
              borderRadius: 8,
              cursor: 'pointer',
              border: courseId === session.id.toString() ? '2px solid #007BFF' : '1px solid #ccc',
              backgroundColor: courseId === session.id.toString() ? '#e9f3ff' : '#fff',
              boxShadow: courseId === session.id.toString() ? '0 0 8px rgba(0,123,255,0.2)' : 'none',
              transition: 'all 0.2s ease-in-out',
            }}
          >

            {/* 👇 Course Image */}
            <img
              src={session.course.image || 'https://via.placeholder.com/40'} // Replace with your default image path
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
                color: courseId === session.id ? '#007BFF' : '#333',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {session.course.name}
              </span>
            </div>
          </div>
        </li>
      );
    })}
  
  </ul>
</div>

      {/* 👉 Main Content */}
      <div style={{ flex: 1, padding: '30px 40px' }}>
        {(!sessions || sessions.length === 0) ? (
          <div style={{ textAlign: 'center', marginTop: 100, fontSize: 24, color: '#888' }}>
            No Enrolled Course
          </div>
        ) : (
          <>
            <h2 style={{ marginBottom: 10 }}>
              Course: {selectedCourse?.course?.name || ' '} 
            </h2>
            <div style={{ marginBottom: 10 }}>
              <strong>Tutor:</strong> {selectedCourse?.tutor?.full_name || 'N/A'}
            </div>
            <div style={{ marginBottom: 10 }}>
              <strong>Session Days:</strong> {selectedCourse?.days || 'N/A'}
            </div>
            <div style={{ marginBottom: 25 }}>
              <strong>Session Time:</strong> {selectedCourse?.start_time || 'N/A'} - {selectedCourse?.end_time || 'N/A'}
            </div>

            {/* Tabs */}
            <div className="p-6">
              {/* <h1 className="text-3xl font-bold mb-6">Course ID: {courseId}</h1> */}

              <Tabs defaultValue="materials" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  {/* <TabsTrigger value="chats">Chats</TabsTrigger>
                  <TabsTrigger value="announcements">Announcements</TabsTrigger> */}
                </TabsList>

                <TabsContent value="materials">
                  {loading && <p>Loading materials...</p>}
                  {error && <p className="text-red-500">{typeof error === 'string' ? error : 'An error occurred'}</p>}
                  {data && data.map((item: any) => (
                    <Card key={item.id} sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" component="div" gutterBottom>
                        {item.name}
                      </Typography>
                  
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {item.description || 'No description provided.'}
                      </Typography>
                  
                      {/* Optional: Preview File Link */}
                      {item.file_url && (
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                            View File
                          </a>
                        </Typography>
                      )}
                  
                      {/* Buttons */}
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          color="primary"
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                        >
                          Download
                        </Button>
                  
                        
                  
                        
                      </Stack>
                    </CardContent>
                  </Card>
                  ))}
                </TabsContent>

                <TabsContent value="assignments">
                  {loading && <p>Loading assignments...</p>}
                  {error && <p className="text-red-500">{typeof error === 'string' ? error : 'An error occurred'}</p>}
                  {data && data.map((item: any) => (
                    <div key={item.id} className="mb-6 border p-4 rounded-lg">
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                      <p>{item.description}</p>
                      <p><strong>Due Date:</strong> {new Date(item.due_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</p>
                      
                      {submissions[item.id] ? (
                        <div className="mt-2 p-3 bg-green-50 rounded">
                          <p className="text-green-700">✓ Submitted</p>
                          <p className="text-sm text-gray-600">Submitted on: {new Date(submissions[item.id].submitted_at).toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-1">Note: Only one submission is allowed per assignment.</p>
                        </div>
                      ) : (
                        <>
                          <Input type="file" className="mt-2" onChange={handleFileChange} />
                          <Button
                            className="mt-2"
                            onClick={() => handleSubmit(item.id)}
                            disabled={submitting}
                          >
                            {submitting && selectedAssignmentId === item.id ? 'Submitting...' : 'Submit'}
                          </Button>
                        </>
                      )}
                      
                      {submitSuccess && selectedAssignmentId === item.id && (
                        <p className="text-green-500 mt-2">Submitted successfully!</p>
                      )}
                      {submitError && (
                        <p className="text-red-500 mt-2">{typeof submitError === 'string' ? submitError : 'An error occurred'}</p>
                      )}
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="chats">
                  {loading && <p>Loading chats...</p>}
                  {error && <p className="text-red-500">{typeof error === 'string' ? error : 'An error occurred'}</p>}
                  {data && data.map((chat: any) => (
                    <div key={chat.id} className="mb-4">
                      <p><strong>{chat.sender}</strong>: {chat.message}</p>
                      <small className="text-gray-500">{chat.time}</small>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="announcements">
                  {loading && <p>Loading announcements...</p>}
                  {error && <p className="text-red-500">{typeof error === 'string' ? error : 'An error occurred'}</p>}
                  {data && data.map((announcement: any) => (
                    <div key={announcement.id} className="mb-4 border p-4 rounded-lg">
                      <h2 className="text-lg font-semibold">{announcement.title}</h2>
                      <p>{announcement.content}</p>
                      <small className="text-gray-500">{announcement.date}</small>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};




export default  CoursePage;
