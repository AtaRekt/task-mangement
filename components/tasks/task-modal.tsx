"use client"

import { useForm } from "react-hook-form"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  title: z.string().min(2, "Görev başlığı en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  deadline: z.string().min(1, "Son tarih gereklidir"),
  userId: z.string().min(1, "Kullanıcı seçilmelidir"),
  projectId: z.string(),
  status: z.enum(["TODO", "IN_PROGRESS", "COMPLETED"])
})

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  data?: any
  users?: any[]
  projects?: any[]
}

const taskStatuses = [
  { value: "TODO", label: "Yapılacak" },
  { value: "IN_PROGRESS", label: "Devam Ediyor" },
  { value: "COMPLETED", label: "Tamamlandı" },
]

const NO_PROJECT = "NO_PROJECT"

export function TaskModal({
  isOpen,
  onClose,
  data,
  users = [],
  projects = []
}: TaskModalProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      deadline: "",
      userId: "",
      projectId: "",
      status: "TODO"
    }
  })

  // Modal kapandığında formu sıfırla
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        title: "",
        description: "",
        deadline: "",
        userId: "",
        projectId: "",
        status: "TODO"
      })
    }
  }, [isOpen, form])

  // Data değiştiğinde formu güncelle
  useEffect(() => {
    if (data && isOpen) {
      form.reset({
        title: data.title,
        description: data.description,
        deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : "",
        userId: data.userId || "",
        projectId: data.projectId || "",
        status: data.status || "TODO"
      })
    }
  }, [data, isOpen, form])

  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()

  const onSubmit = async (values: any) => {
    try {
      if (data) {
        await updateTaskMutation.mutateAsync({ 
          taskId: data.id, 
          data: { ...values, deadline: new Date(values.deadline) } 
        })
      } else {
        await createTaskMutation.mutateAsync({
          ...values,
          deadline: new Date(values.deadline)
        })
      }
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  return (
    <Modal
      title={data ? "Görevi Düzenle" : "Yeni Görev"}
      description={data ? "Görev bilgilerini güncelleyin" : "Yeni bir görev oluşturun"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input placeholder="Görev başlığı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Görev açıklaması" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Durum seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {taskStatuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atanacak Kişi</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Kullanıcı seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proje</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Proje seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={NO_PROJECT}>Proje Yok</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Son Tarih</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button 
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending} 
                variant="outline" 
                onClick={onClose}
                type="button"
              >
                İptal
              </Button>
              <Button 
                disabled={createTaskMutation.isPending || updateTaskMutation.isPending} 
                type="submit"
              >
                {data ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
} 