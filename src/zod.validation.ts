import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema, z } from 'zod'
import { fromZodError } from 'zod-validation-error'

export const userBodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'RULER']),
})

export const registerBodyTypeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
})

export const loginBodyTypeSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export type UserBodyTypeSchema = z.infer<typeof userBodySchema>
export type RegisterBodyTypeSchema = z.infer<typeof registerBodyTypeSchema>
export type LoginBodyTypeSchema = z.infer<typeof loginBodyTypeSchema>

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('Validation failed')
    }
    return value
  }
}
