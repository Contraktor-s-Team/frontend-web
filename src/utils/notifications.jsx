import { File, Briefcase, Banknote } from 'lucide-react';

export const getNotificationIcon = (type) => {
  const baseClasses = 'flex items-center justify-center w-14 h-14 rounded-full';
  
  if (type.includes('Job') || type.includes('job')) 
    return (
      <div className={`${baseClasses} bg-pri-light-1`}>
        <Briefcase size={24} className="text-pri-dark-1" />
      </div>
    );
    
  if (type.includes('Quote') || type.includes('quote')) 
    return (
      <div className={`${baseClasses} bg-sec-light-1`}>
        <File size={24} className="text-warning-dark-1" />
      </div>
    );
    
  if (type.includes('Payment') || type.includes('payment') || type.includes('Refund')) 
    return (
      <div className={`${baseClasses} bg-success-light-1`}>
        <Banknote size={24} className="text-success-dark-1" />
      </div>
    );
    
  if (type.includes('Rate')) 
    return (
      <div className={`${baseClasses} bg-pri-light-1`}>
        <Briefcase size={24} className="text-pri-dark-1" />
      </div>
    );
    
  return null;
};

export const notifications = [
  {
    id: 1,
    type: "Job Request Sent",
    time: "2 mins ago",
    message: "You've successfully sent a task request to Musa Ibrahim for 'Fix Kitchen Sink Leak'.",
    actionText: "View Job",
    category: "jobs",
    read: false
  },
  {
    id: 2,
    type: "New Quote Received",
    time: "1 hr ago",
    message: "Chinedu Okafor submitted a quote for 'Electrical Socket Fix'.",
    actionText: "Review Quote",
    category: "quotes",
    read: false
  },
  {
    id: 3,
    type: "Job Accepted by Artisan",
    time: "3 hr ago",
    message: "Musa Ibrahim accepted your request for 'Ceiling Leak Inspection'.",
    actionText: "View Details",
    category: "jobs",
    read: true
  },
  {
    id: 4,
    type: "Job Reminder",
    time: "8:00am",
    message: "'Bathroom Plumbing' starts in 2 hours — be ready for Musa Ibrahim's arrival.",
    actionText: "View Details",
    category: "jobs",
    read: true
  },
  {
    id: 5,
    type: "Payment Confirmed",
    time: "Yesterday",
    message: "Your ₦12,000 payment for 'Pipe Repair' has been released to the artisan.",
    actionText: "Download Receipt",
    category: "payments",
    read: true
  },
  {
    id: 6,
    type: "Rate Your Artisan",
    time: "2 days ago",
    message: "You worked with Fatima Bello on a recent job. Leave a review?",
    actionText: "Leave a review",
    category: "jobs",
    read: true
  },
  {
    id: 7,
    type: "Job Cancelled",
    time: "3 days ago",
    message: "'Install Wall Socket' was cancelled due to artisan unavailability.",
    actionText: "View Job",
    category: "jobs",
    read: true
  }
];