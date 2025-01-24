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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useCreateProject, useUpdateProject } from "@/hooks/use-projects"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"

const formSchema = z.object({
  name: z.string().min(2, "Proje adı en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  deadline: z.string().min(1, "Son tarih gereklidir")
})

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  data?: any
}

export function ProjectModal({
  isOpen,
  onClose,
  data
}: ProjectModalProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      deadline: ""
    }
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset({
        name: "",
        description: "",
        deadline: ""
      })
    }
  }, [isOpen, form])

  useEffect(() => {
    if (data && isOpen) {
      form.reset({
        name: data.name,
        description: data.description,
        deadline: data.deadline ? new Date(data.deadline).toISOString().split('T')[0] : ""
      })
    }
  }, [data, isOpen, form])

  const createProjectMutation = useCreateProject()
  const updateProjectMutation = useUpdateProject()

  const onSubmit = async (values: any) => {
    try {
      if (data) {
        await updateProjectMutation.mutateAsync({ 
          projectId: data.id, 
          data: { ...values, deadline: new Date(values.deadline) } 
        })
      } else {
        await createProjectMutation.mutateAsync({
          ...values,
          deadline: new Date(values.deadline)
        })
      }
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  console.log('Modal data:', data)
  console.log('Form values:', form.getValues())

  return (
    <Modal
      title={data ? "Projeyi Düzenle" : "Yeni Proje"}
      description={data ? "Proje bilgilerini güncelleyin" : "Yeni bir proje oluşturun"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proje Adı</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={createProjectMutation.isPending || updateProjectMutation.isPending} 
                      placeholder="Proje adı" 
                      {...field} 
                    />
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
                    <Textarea 
                      disabled={createProjectMutation.isPending || updateProjectMutation.isPending} 
                      placeholder="Proje açıklaması" 
                      {...field} 
                    />
                  </FormControl>
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
                    <Input 
                      disabled={createProjectMutation.isPending || updateProjectMutation.isPending} 
                      type="date" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button 
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending} 
                variant="outline" 
                onClick={onClose}
                type="button"
              >
                İptal
              </Button>
              <Button 
                disabled={createProjectMutation.isPending || updateProjectMutation.isPending} 
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