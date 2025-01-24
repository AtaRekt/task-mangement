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
import { useUpdateUser, useCreateUser } from "@/hooks/use-users"
import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  role: z.string(),
  password: z.string()
    .min(6, "Şifre en az 6 karakter olmalıdır")
    .optional()
    .transform(val => val === "" ? undefined : val)
})

const roles = [
  { value: "0", label: "Kullanıcı" },
  { value: "1", label: "Admin" },
]

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  data?: any
}

export function UserModal({
  isOpen,
  onClose,
  data
}: UserModalProps) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "0",
      password: "",
    }
  })

  useEffect(() => {
    if (!isOpen) {
      form.reset()
    }
  }, [isOpen, form])

  useEffect(() => {
    if (data && isOpen) {
      form.reset({
        name: data.name,
        email: data.email,
        role: data.role.toString(),
        password: "",
      })
    }
  }, [data, isOpen, form])

  const updateUserMutation = useUpdateUser()
  const createUserMutation = useCreateUser()

  const onSubmit = async (values: any) => {
    try {
      if (data) {
        await updateUserMutation.mutateAsync({ 
          userId: data.id, 
          data: values 
        })
      } else {
        await createUserMutation.mutateAsync(values)
      }
      onClose()
    } catch (error) {
      console.error("Form submission error:", error)
    }
  }

  const title = data ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı"
  const description = data ? "Kullanıcı bilgilerini güncelleyin" : "Yeni bir kullanıcı oluşturun"
  const buttonText = data ? "Güncelle" : "Oluştur"
  const loading = data ? updateUserMutation.isPending : createUserMutation.isPending

  return (
    <Modal
      title={title}
      description={description}
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
                  <FormLabel>İsim</FormLabel>
                  <FormControl>
                    <Input placeholder="İsim" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input placeholder="E-posta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yetki</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Yetki seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{data ? "Yeni Şifre (Opsiyonel)" : "Şifre"}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={data ? "Yeni şifre" : "Şifre"}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button 
                disabled={loading} 
                variant="outline" 
                onClick={onClose}
                type="button"
              >
                İptal
              </Button>
              <Button 
                disabled={loading} 
                type="submit"
              >
                {buttonText}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
} 