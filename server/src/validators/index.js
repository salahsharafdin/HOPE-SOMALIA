const { z } = require('zod');

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role selection is required'),
});


const programSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(3, 'Description is required'),
  content: z.string().optional(),
  image: z.string().optional(),
  objectives: z.string().optional(),
  locations: z.string().optional(),
  beneficiaries: z.string().optional(),
  status: z.enum(['Active', 'Paused', 'Upcoming']).default('Active'),
  order: z.number().optional(),
});

const projectSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(3, 'Description is required'),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  programId: z.string().nullable().optional(),
  location: z.string().min(2, 'Location is required'),
  region: z.string().default('Somalia'),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  budget: z.number().min(0).default(0),
  beneficiaries: z.number().min(0).default(0),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(['Planned', 'Active', 'Completed', 'Paused']).default('Active'),
  objectives: z.string().optional(),
  results: z.string().optional(),
  impact: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

const newsSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  excerpt: z.string().min(3, 'Excerpt is required'),
  content: z.string().min(3, 'Content is required'),
  featuredImage: z.string().optional(),
  categoryId: z.string().nullable().optional(),
  tags: z.string().optional(),
  status: z.enum(['Draft', 'Published', 'Archived']).default('Published'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

const storySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  location: z.string().min(2, 'Location is required'),
  image: z.string().optional(),
  story: z.string().min(3, 'Story is required'),
  programName: z.string().optional(),
  impact: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

const donationSchema = z.object({
  donorName: z.string().min(2, 'Name is required'),
  donorEmail: z.string().email('Invalid email'),
  donorPhone: z.string().optional(),
  country: z.string().default('Somalia'),
  amount: z.number().min(1, 'Amount must be at least $1'),
  currency: z.string().default('USD'),
  type: z.enum(['one-time', 'monthly']).default('one-time'),
  purpose: z.string().default('General Fund'),
  paymentMethod: z.enum(['Card', 'PayPal', 'Mobile Money', 'Bank Transfer']).default('Card'),
});

const volunteerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Phone number is required'),
  country: z.string().default('Somalia'),
  skills: z.string().min(2, 'Skills are required'),
  experience: z.string().optional(),
  availability: z.string().default('Part-time'),
  motivation: z.string().min(3, 'Motivation statement is required'),
  cvUrl: z.string().optional(),
});

const messageSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(3, 'Message is required'),
});

module.exports = {
  loginSchema,
  programSchema,
  projectSchema,
  newsSchema,
  storySchema,
  donationSchema,
  volunteerSchema,
  messageSchema,
};
