import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProjects, createProject, updateProject, deleteProject } from "@/app/dashboard/projects/actions"
import { toast } from "sonner"

interface Project {
    id: string
    name: string
}

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: async () => {
            try {
                const data = await getProjects()
                return data
            } catch (error) {
                console.error('Error fetching projects:', error)
                throw new Error('Failed to fetch projects')
            }
        }
    })
}

export const useProject = (id: string) => {
    const queryClient = useQueryClient()

    return useQuery({
        queryKey: ['projects', id],
        queryFn: async () => {
            try {
                const cachedProjects = queryClient.getQueryData<any[]>(['projects'])
                if (cachedProjects) {
                    console.log('Cached projects:', cachedProjects)
                    const cachedProject = cachedProjects.find((p: Project) => p.id === id)
                    if (cachedProject) return cachedProject
                }
            } catch (error) {
                console.error('Error fetching project:', error)
                throw new Error('Failed to fetch project')
            }

            // If not in cache, fetch individual project
            try {
                console.log('Fetching project:', id)
                const data = await getProjects()
                const project = data.find((p: Project) => p.id === id)
                if (!project) throw new Error('Project not found', { cause: 'Project not found' })
                console.log('Fetched project:', project)
                return project
            } catch (error) {
                console.error('Error fetching project:', error)
                throw new Error('Failed to fetch project')
            }
        }
    })
}

export const useCreateProject = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: any) => {
            const response = await createProject(data)
            if (!response) throw new Error("Failed to create project")
            return response
        },
        onSuccess: () => {
            toast.success("Proje oluşturuldu")
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
        onError: (error: any) => {
            console.error("Create project error:", error)
            toast.error("Proje oluşturulurken bir hata oluştu")
        }
    })
}

export const useUpdateProject = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ projectId, data }: { projectId: string, data: any }) => {
            const response = await updateProject(projectId, data)
            if (!response) throw new Error("Failed to update project")
            return response
        },
        onSuccess: () => {
            toast.success("Proje güncellendi")
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
        onError: (error: any) => {
            console.error("Update project error:", error)
            toast.error("Proje güncellenirken bir hata oluştu")
        }
    })
}

export const useDeleteProject = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await deleteProject(id)
            if (!response) throw new Error("Failed to delete project")
            return response
        },
        onSuccess: () => {
            toast.success("Proje silindi")
            queryClient.invalidateQueries({ queryKey: ['projects'] })
        },
        onError: (error: any) => {
            console.error("Delete project error:", error)
            toast.error("Proje silinirken bir hata oluştu")
        }
    })
} 