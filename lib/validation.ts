// Form validation utilities
export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

// Email validation regex
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Password validation regex (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

// Phone validation regex (basic international format)
export const PHONE_REGEX = /^[+]?[1-9][\d]{0,15}$/

// Common validation rules
export const commonValidationRules: ValidationRules = {
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/,
  },
  email: {
    required: true,
    pattern: EMAIL_REGEX,
  },
  password: {
    required: true,
    minLength: 8,
    pattern: PASSWORD_REGEX,
  },
  phone: {
    pattern: PHONE_REGEX,
  },
  age: {
    custom: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 1 || Number(value) > 120)) {
        return "Age must be between 1 and 120"
      }
      return null
    },
  },
  height: {
    custom: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 50 || Number(value) > 300)) {
        return "Height must be between 50 and 300 cm"
      }
      return null
    },
  },
  weight: {
    custom: (value: string) => {
      if (value && (isNaN(Number(value)) || Number(value) < 20 || Number(value) > 500)) {
        return "Weight must be between 20 and 500 kg"
      }
      return null
    },
  },
}

// Validate a single field
export const validateField = (value: any, rules: ValidationRule): string | null => {
  // Required validation
  if (rules.required && (!value || (typeof value === "string" && !value.trim()))) {
    return "This field is required"
  }

  // Skip other validations if field is empty and not required
  if (!value || (typeof value === "string" && !value.trim())) {
    return null
  }

  // String-specific validations
  if (typeof value === "string") {
    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `Must be at least ${rules.minLength} characters`
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `Must be no more than ${rules.maxLength} characters`
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      if (rules.pattern === EMAIL_REGEX) {
        return "Please enter a valid email address"
      }
      if (rules.pattern === PASSWORD_REGEX) {
        return "Password must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number"
      }
      if (rules.pattern === PHONE_REGEX) {
        return "Please enter a valid phone number"
      }
      return "Invalid format"
    }
  }

  // Custom validation
  if (rules.custom) {
    return rules.custom(value)
  }

  return null
}

// Validate multiple fields
export const validateForm = (data: any, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {}

  Object.keys(rules).forEach((field) => {
    const error = validateField(data[field], rules[field])
    if (error) {
      errors[field] = error
    }
  })

  return errors
}

// Password strength calculation
export const calculatePasswordStrength = (password: string): number => {
  let strength = 0

  if (password.length >= 8) strength += 25
  if (/[a-z]/.test(password)) strength += 25
  if (/[A-Z]/.test(password)) strength += 25
  if (/[0-9]/.test(password)) strength += 25
  if (/[^A-Za-z0-9]/.test(password)) strength += 25

  return Math.min(strength, 100)
}

// Get password strength text
export const getPasswordStrengthText = (strength: number): string => {
  if (strength < 25) return "Very Weak"
  if (strength < 50) return "Weak"
  if (strength < 75) return "Fair"
  if (strength < 100) return "Good"
  return "Strong"
}

// Get password strength color
export const getPasswordStrengthColor = (strength: number): string => {
  if (strength < 25) return "bg-red-500"
  if (strength < 50) return "bg-orange-500"
  if (strength < 75) return "bg-yellow-500"
  return "bg-green-500"
}
