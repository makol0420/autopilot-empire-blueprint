-- Create a table to track individual task completion within roadmap steps
CREATE TABLE public.roadmap_task_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  step_id INTEGER NOT NULL,
  task_name TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, step_id, task_name)
);

-- Enable Row Level Security
ALTER TABLE public.roadmap_task_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own task progress" 
ON public.roadmap_task_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own task progress" 
ON public.roadmap_task_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task progress" 
ON public.roadmap_task_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_roadmap_task_progress_updated_at
BEFORE UPDATE ON public.roadmap_task_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();