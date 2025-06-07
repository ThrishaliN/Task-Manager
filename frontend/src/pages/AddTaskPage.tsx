import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/layout/Container';
import PageHeader from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/Card';
import TaskForm from '../components/tasks/TaskForm';
import { TaskFormData } from '../types';
import { createTask } from '../utils/taskService';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';

const AddTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      await createTask(data);
      toast.success('Task created successfully');
      navigate('/tasks');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <PageHeader
        title="Create New Task"
        description="Add a new task to your workflow"
      >
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/tasks')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
      </PageHeader>
      
      <Card>
        <CardContent className="pt-6">
          <TaskForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitText="Create Task"
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddTaskPage;