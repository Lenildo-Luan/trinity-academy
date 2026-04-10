import type { Meta, StoryObj } from '@storybook/react'
import { TextInput, OTPInput } from '@/components/atoms'

const textInputMeta = {
  title: 'Components/TextInput',
  component: TextInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'The type of the input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof TextInput>

export default textInputMeta
type TextInputStory = StoryObj<typeof textInputMeta>

export const Default: TextInputStory = {
  args: {
    placeholder: 'Enter text...',
  },
}

export const Email: TextInputStory = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
}

export const Password: TextInputStory = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
}

export const Disabled: TextInputStory = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit this',
  },
}

export const WithValue: TextInputStory = {
  args: {
    defaultValue: 'Some text content',
  },
}

// OTP Input Stories
const otpInputMeta = {
  title: 'Components/OTPInput',
  component: OTPInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OTPInput>

type OTPInputStory = StoryObj<typeof otpInputMeta>

export const OTPDefault: OTPInputStory = {
  args: {
    maxLength: 6,
    name: 'otp',
  },
}

export const OTPFourDigits: OTPInputStory = {
  args: {
    maxLength: 4,
    name: 'otp',
  },
}

export const OTPWithValue: OTPInputStory = {
  args: {
    maxLength: 6,
    name: 'otp',
    value: '123456',
  },
}
