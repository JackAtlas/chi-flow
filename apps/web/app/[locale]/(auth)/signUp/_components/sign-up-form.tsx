'use client'

import { signUpSchema } from '@/schema/validation'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'
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
import { Button } from '@workspace/ui/components/button'
import { authClient } from '@/lib/auth/auth-client'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import { redirect } from '@/i18n/navigation'
import { useLocale } from 'next-intl'

export default function SignUpForm() {
  const locale = useLocale()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const form = useForm({
    defaultValues: {
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: signUpSchema
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true)
      const { error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: value.name,
        callbackURL: '/'
      })

      if (error) {
        toast.error(error.message)
        setIsLoading(false)
      } else {
        toast.success('注册成功，正在跳转……')
        redirect({ href: '/', locale })
      }
    }
  })

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>注册</CardTitle>
        <CardDescription>注册以使用</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="sign-up-form"
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
                  <Field data-invalid={isInvalid}>
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
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>用户名</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="请填写你的用户名"
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="confirmPassword">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>确认密码</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type={showPassword ? 'text' : 'password'}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="请重复输入密码"
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
          <Button type="submit" form="sign-up-form" disabled={isLoading}>
            {isLoading ? '请稍候……' : '提交'}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )
}
