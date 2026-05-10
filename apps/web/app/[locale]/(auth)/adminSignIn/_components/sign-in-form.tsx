'use client'

import { signInSchema } from '@/schema/validation'
import { authClient } from '@/lib/auth/auth-client'
import { useForm } from '@tanstack/react-form'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from '@workspace/ui/components/input-group'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { redirect } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export default function SignInForm() {
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    validators: {
      onSubmit: signInSchema
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: '/'
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
      } else {
        toast.success('登录成功，正在跳转')
        redirect({ href: '/', locale })
      }
    }
  })
  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>登录</CardTitle>
        <CardDescription>登录以使用</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-in-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-isvalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>邮箱地址</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="请填写你的邮箱地址"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="password">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>密码</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type={showPassword ? 'text' : 'password'}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="请输入密码"
                        autoComplete="off"
                      />
                      <InputGroupAddon
                        className="cursor-pointer pl-2"
                        align="inline-end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            重置
          </Button>
          <Button type="submit" form="sign-in-form" disabled={isLoading}>
            {isLoading ? '请稍候……' : '提交'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
