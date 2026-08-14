import React from 'react';
import { Ticket } from 'lucide-react';
import PrimaryButton from '../../../../../components/ui/PrimaryButton';

const CreateTicketForm = ({ formData, handleInputChange, handleSubmit, loading }) => {
  const handleClearForm = () => {
    handleInputChange({ target: { name: 'subject', value: '' } });
    handleInputChange({ target: { name: 'message', value: '' } });
    handleInputChange({ target: { name: 'priority', value: 'LOW' } });
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='mb-6 flex items-center gap-3'>
        <div className='rounded-full bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20 p-3'>
          <Ticket className='text-[#7C3AED]' size={24} />
        </div>
        <div>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 dark:text-white'>
            Create New Ticket
          </h2>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Fill out the form below to submit your request
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Subject */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-gray-900 dark:text-white'>
            Subject <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='subject'
            value={formData.subject}
            onChange={handleInputChange}
            placeholder='e.g., Account Problem'
            required
            className='w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition'
          />
        </div>

        {/* Priority */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-gray-900 dark:text-white'>
            Priority <span className='text-red-500'>*</span>
          </label>
          <div className='grid grid-cols-4 gap-3'>
            {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map((priority) => (
              <label
                key={priority}
                className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 cursor-pointer transition text-base ${
                  formData.priority === priority
                    ? 'border-[#7C3AED] bg-[#7C3AED]/10 dark:bg-[#7C3AED]/20'
                    : 'border-gray-300 dark:border-zinc-600 hover:border-[#7C3AED]/50'
                }`}
              >
                <input
                  type='radio'
                  name='priority'
                  value={priority}
                  checked={formData.priority === priority}
                  onChange={handleInputChange}
                  className='sr-only'
                />
                <span className={`text-sm font-medium ${
                  formData.priority === priority
                    ? 'text-[#7C3AED] dark:text-[#b388fc]'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {priority}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className='mb-2 block text-sm font-semibold text-gray-900 dark:text-white'>
            Message <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='message'
            value={formData.message}
            onChange={handleInputChange}
            placeholder='Describe your issue in detail...'
            rows={6}
            required
            className='w-full rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent transition resize-none'
          />
          <p className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
            Please provide as much detail as possible to help us assist you better
          </p>
        </div>

        {/* Submit Button */}
        <div className='flex flex-col sm:flex-row gap-3 pt-4'>
          <PrimaryButton
            type='submit'
            disabled={loading}
            className='w-full sm:w-auto'
          >
            {loading ? 'Creating Ticket...' : 'Submit Ticket'}
          </PrimaryButton>
          <button
            type='button'
            onClick={handleClearForm}
            className='w-full sm:w-auto rounded border border-gray-300 dark:border-zinc-600 px-6 py-3 text-base font-normal text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-700'
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketForm;
