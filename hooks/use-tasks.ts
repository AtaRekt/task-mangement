import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getTasks, createTask, updateTask, deleteTask } from "@/app/dashboard/tasks/actions"
import { toast } from "sonner"

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      try {
        const data = await getTasks()
        return data
      } catch (error) {
        console.error('Error fetching tasks:', error)
        throw new Error('Failed to fetch tasks')
      }
    }
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createTask(data)
      return response
    },
    onSuccess: () => {
      toast.success("Görev oluşturuldu")
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: () => {
      toast.error("Görev oluşturulurken bir hata oluştu")
    }
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ taskId, data }: { taskId: string, data: any }) => {
      const response = await updateTask(taskId, data)
      return response
    },
    onSuccess: () => {
      toast.success("Görev güncellendi")
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: () => {
      toast.error("Görev güncellenirken bir hata oluştu")
    }
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Görev silindi")
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    onError: () => {
      toast.error("Görev silinirken bir hata oluştu")
    }
  })
} 