import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getUsers, createUser, updateUser, deleteUser } from "@/app/dashboard/users/actions"
import { toast } from "sonner"

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        const data = await getUsers()
        return data
      } catch (error) {
        console.error('Error fetching users:', error)
        throw new Error('Failed to fetch users')
      }
    }
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ userId, data }: { userId: string, data: any }) => {
      const response = await updateUser(userId, data)
      return response
    },
    onSuccess: () => {
      toast.success("Kullanıcı güncellendi")
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      console.error("Update user error:", error)
      if (error.message === "Cannot update admin role") {
        toast.error("Admin yetkisi güncellenemez")
      } else {
        toast.error("Kullanıcı güncellenirken bir hata oluştu")
      }
    }
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteUser(id)
      return response
    },
    onSuccess: () => {
      toast.success("Kullanıcı silindi")
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      console.error("Delete user error:", error)
      if (error.message === "Cannot delete yourself") {
        toast.error("Kendinizi silemezsiniz")
      } else {
        toast.error("Kullanıcı silinirken bir hata oluştu")
      }
    }
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createUser(data)
      return response
    },
    onSuccess: () => {
      toast.success("Kullanıcı oluşturuldu")
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error: any) => {
      console.error("Create user error:", error)
      if (error.message === "Email already exists") {
        toast.error("Bu e-posta adresi zaten kullanımda")
      } else {
        toast.error("Kullanıcı oluşturulurken bir hata oluştu")
      }
    }
  })
} 