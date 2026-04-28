import { z } from "zod"

export const signUpSchema = z
  .object({
    email: z.email("请输入有效的邮箱地址"),
    name: z.string().min(2, "名字至少 2 个字符").max(50, "名字太长了"),
    password: z.string().min(8, "密码至少 8 位").max(32),
    confirmPassword: z.string().min(8, "请再次输入密码"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  })

export type SignUpInput = z.infer<typeof signUpSchema>

export const signInSchema = z.object({
  email: z.email("请输入有效的邮箱地址"),
  password: z.string(),
})
