import React, { useState } from 'react';
import { File, X } from 'lucide-react';
import Button from '../Button/Button';
import { notifications, getNotificationIcon } from '../../utils/notifications.jsx';

const NotificationsModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('all');
  if (!isOpen) return null;

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(notification => 
        notification.category === activeTab
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-tl-[30px] text-left overflow-hidden shadow-xl transform transition-all fixed top-0 right-0 left-4 sm:left-auto sm:right-0 sm:w-[504px]">
          <div className="bg-white w-full shadow-lg rounded-lg overflow-hidden flex flex-col h-screen">
            <div className="px-7 pt-9 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center pb-5 border-b border-neu-light-3">
                <h3 className="font-manrope text-2xl font-semibold text-gray-900">Notifications</h3>
                <button 
                  className="cursor-pointer hover:scale-90 transition-transform focus:outline-none"
                  onClick={onClose}
                >
                  <X className="h-8 w-8" />
                </button>
              </div>
              
              {/* Filter Tabs */}
              <div className="flex items-stretch gap-2 mt-5.5 w-full">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'jobs', label: 'Jobs' },
                  { id: 'quotes', label: 'Quotes' },
                  { id: 'payments', label: 'Payments' }
                ].map((tab) => (
                  <div 
                    key={tab.id} 
                    className={activeTab !== tab.id ? 'flex-1' : 'flex-shrink-0'}
                  >
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={` cursor-pointer w-full px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap border transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-pri-light-1 border-pri-norm-1 text-pri-dark-1' 
                          : 'text-neu-norm-3 border-neu-light-3 hover:bg-neu-light-1'
                      }`}
                    >
                      {tab.label}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notification list */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`border-b border-neu-light-3 hover:bg-neu-light-1 transition-colors`}
                  >
                    <div className="flex items-start gap-4 p-6">
                      {getNotificationIcon(notification.type)}
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                            {!notification.read && (
                                <span className="mr-2 inline-block h-3 w-3 rounded-full bg-sec-norm-1"></span>
                              )}

                              <p className="text-sm font-medium">
                                {notification.type}
                              </p>
                            </div>
                            <p className="mt-3.5 text-sm text-gray-600">{notification.message}</p>
                          </div>
                          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                            {notification.time}
                          </span>
                        </div>
                        
                        <div className="mt-3.5 flex justify-between items-center">
                          <Button 
                            variant="primary-trans" 
                            size="small"
                            className="!px-3 !py-1.5 !text-sm !font-medium"
                          >
                            {notification.actionText}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <File className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 font-medium text-gray-500">No notifications yet</p>
                  <p className="text-xs text-gray-400 mt-1">We'll let you know when something arrives</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;