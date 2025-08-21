"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCVBuilderStore } from '@/stores/cv-builder';
import { ContactInfo } from '@/types/cv';
import { FormInput, Button } from '@/components/ui';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  github: z.string().url('Please enter a valid GitHub URL').optional().or(z.literal('')),
  portfolio: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactStep() {
  const { cvData, steps, updateContact, updateStepCompletion } = useCVBuilderStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: cvData.contact || {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
      github: '',
      portfolio: '',
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Update store when form values change
  useEffect(() => {
    const contact: ContactInfo = {
      name: watchedValues.name || '',
      email: watchedValues.email || '',
      phone: watchedValues.phone || '',
      location: watchedValues.location || '',
      linkedin: watchedValues.linkedin || undefined,
      website: watchedValues.website || undefined,
      github: watchedValues.github || undefined,
      portfolio: watchedValues.portfolio || undefined,
    };
    
    // Only update if the contact data has actually changed
    const currentContact = cvData.contact;
    const hasChanged = !currentContact || 
      currentContact.name !== contact.name ||
      currentContact.email !== contact.email ||
      currentContact.phone !== contact.phone ||
      currentContact.location !== contact.location ||
      currentContact.linkedin !== contact.linkedin ||
      currentContact.website !== contact.website ||
      currentContact.github !== contact.github ||
      currentContact.portfolio !== contact.portfolio;
    
    if (hasChanged) {
      updateContact(contact);
    }
    
    // Only update step completion if it has actually changed
    const currentStep = steps.find(step => step.id === 'contact');
    if (!currentStep || currentStep.isCompleted !== isValid) {
      updateStepCompletion('contact', isValid);
    }
  }, [watchedValues, isValid, cvData.contact, steps]);

  // Initialize form with existing data
  useEffect(() => {
    if (cvData.contact) {
      Object.entries(cvData.contact).forEach(([key, value]) => {
        setValue(key as keyof ContactFormData, value || '');
      });
    }
  }, [cvData.contact, setValue]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
        <p className="text-gray-600">
          Let&apos;s start with your basic contact details. This information will appear at the top of your CV.
        </p>
      </div>

      <form className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Required Fields */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Required Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Full Name"
              {...register('name')}
              error={errors.name?.message}
              placeholder="John Doe"
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="john.doe@example.com"
              required
            />

            <FormInput
              label="Phone Number"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+1 (555) 123-4567"
              required
            />

            <FormInput
              label="Location"
              {...register('location')}
              error={errors.location?.message}
              placeholder="New York, NY"
              required
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Optional Links
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Add relevant professional links)
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="LinkedIn Profile"
              {...register('linkedin')}
              error={errors.linkedin?.message}
              placeholder="https://linkedin.com/in/johndoe"
            />

            <FormInput
              label="Personal Website"
              {...register('website')}
              error={errors.website?.message}
              placeholder="https://johndoe.com"
            />

            <FormInput
              label="GitHub Profile"
              {...register('github')}
              error={errors.github?.message}
              placeholder="https://github.com/johndoe"
            />

            <FormInput
              label="Portfolio"
              {...register('portfolio')}
              error={errors.portfolio?.message}
              placeholder="https://portfolio.johndoe.com"
            />
          </div>
        </div>

        {/* Validation Status */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            {isValid ? (
              <>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">All required fields completed</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-amber-600">Please complete all required fields</span>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}