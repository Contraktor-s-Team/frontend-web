import { Banknote, BanknoteArrowUp } from 'lucide-react';
import React, { useState } from 'react';
import { FaDownload, FaTrash, FaUniversity, FaRegCreditCard } from 'react-icons/fa';
import Button from '../../../components/Button/Button';

const paymentMethodsData = [
  {
    id: 1,
    type: 'card',
    label: 'Debit Card',
    logo: <FaRegCreditCard className="h-6 w-6 text-red-500" />,
    details: '1234 •••• •••• ••45',
    subText: 'Expires on 17 / 2022',
    isDefault: true,
    verified: false
  },
  {
    id: 2,
    type: 'bank',
    label: 'Bank Transfer',
    logo: <FaUniversity className="h-6 w-6 text-red-600" />,
    details: '007 •••••• 43',
    subText: '',
    isDefault: false,
    verified: true
  }
];

const transactionsData = [
  {
    id: 1,
    description: 'Payment for Plumbing Services',
    method: 'Visa •••• 1234',
    status: 'Successful',
    amount: '₦25,000.00',
    date: '13 June, 2025',
    time: '1:00 PM'
  },
  {
    id: 2,
    description: 'Wallet Fund via Transfer',
    method: 'GTBank •••• 0987',
    status: 'Pending',
    amount: '₦10,000.00',
    date: '13 June, 2025',
    time: '1:00 PM'
  },
  {
    id: 3,
    description: 'Payment for Plumbing Services',
    method: 'Visa •••• 1234',
    status: 'Successful',
    amount: '₦25,000.00',
    date: '13 June, 2025',
    time: '1:00 PM'
  },
  {
    id: 4,
    description: 'Scheduled Job: AC Installation',
    method: 'Wallet Balance',
    status: 'Failed',
    amount: '₦25,000.00',
    date: '13 June, 2025',
    time: '1:00 PM'
  }
];

const toggleSettingsList = [
  {
    id: 'autoCharge',
    label: 'Auto‑charge for scheduled jobs',
    description: 'Automatically pay when a job starts.',
    default: true
  },
  {
    id: 'promptBefore',
    label: 'Prompt before charging',
    description: 'Get notified before we charge you.',
    default: false
  },
  {
    id: 'emailConfirm',
    label: 'Payment confirmation emails',
    description: 'Receive receipts after each payment.',
    default: true
  },
  {
    id: 'upcomingAlerts',
    label: 'Upcoming payment alerts',
    description: 'Get notified before payments.',
    default: true
  },
  {
    id: 'saveCard',
    label: 'Save card for future use',
    description: 'Securely store your card details.',
    default: true
  }
];

const PaymentSettings = () => {
  const [methods, setMethods] = useState(paymentMethodsData);
  const [toggles, setToggles] = useState(
    toggleSettingsList.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.default }), {})
  );

  const handleToggle = (key) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="p-6 bg-white rounded-lg space-y-8">
      {/* Wallet Balance & Actions */}
      <div className="flex items-stretch space-x-4">
        {/* Left Card */}
        <div className="bg-pri-dark-1 text-white rounded-xl w-full max-w-87.25 p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-9.5 h-9.5 rounded-full bg-pri-light-3/50 flex items-center justify-center">
              <Banknote />
            </div>
            <p className="text-sm">Available Balance</p>
          </div>
          <p className="text-2xl font-manrope font-semibold mt-4.5">₦24,000.00</p>
          <div className="flex justify-end">
            <button className="mt-4 px-5 py-2 bg-white text-gray-950 rounded-full text-sm">Fund Wallet</button>
          </div>
        </div>

        {/* Right Card */}
        <div className="w-48 bg-white rounded-xl border border-pri-norm-1 text-pri-norm-1 p-5 flex flex-col justify-center items-center">
          <BanknoteArrowUp className="mb-2" />
          <span className="text-center text-sm">Withdraw Funds</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="flex gap-4 flex-wrap">
  {methods.map((m) => (
    <div
      key={m.id}
      className="w-[280px] bg-white border border-gray-200 rounded-xl p-4 relative shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {m.logo}
          <span className="font-medium text-gray-900">{m.label}</span>
        </div>
        {m.isDefault ? (
          <span className="text-xs px-3 py-1 bg-gray-100 text-gray-400 rounded-full">Default</span>
        ) : (
          <button className="text-xs px-3 py-1 border border-gray-300 text-gray-600 rounded-full hover:bg-gray-50 transition">
            Set as default
          </button>
        )}
      </div>

      <div className="text-sm text-gray-800">{m.details}</div>
      {m.subText && <div className="text-xs text-gray-500 mt-1">{m.subText}</div>}

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          {m.verified && (
            <span className="flex items-center text-xs font-medium text-green-600">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              Verified
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-sm text-pri-norm-1 font-medium">Edit</button>
          <button className="text-red-600 hover:text-red-800">
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  ))}

  {/* Add Payment Method Card */}
  <button className="w-[180px] h-[145px] border-2 border-dashed border-pri-norm-1 rounded-xl flex flex-col items-center justify-center text-pri-norm-1 hover:bg-blue-50 transition">
    <span className="text-3xl leading-none mb-1">＋</span>
    <span className="text-sm font-medium">Add Payment Method</span>
  </button>
</div>


      {/* Transaction History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Transaction History</h2>
          <button className="flex items-center text-pri-norm-1 text-sm">
            <FaDownload className="mr-1" />
            Download History
          </button>
        </div>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-gray-600">Description</th>
              <th className="py-3 px-4 text-gray-600">Payment Method</th>
              <th className="py-3 px-4 text-gray-600">Status</th>
              <th className="py-3 px-4 text-gray-600">Amount</th>
              <th className="py-3 px-4 text-gray-600">Date and Time</th>
            </tr>
          </thead>
          <tbody>
            {transactionsData.map((tx) => (
              <tr key={tx.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3 px-4">{tx.description}</td>
                <td className="py-3 px-4">{tx.method}</td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      tx.status === 'Successful'
                        ? 'bg-green-100 text-green-700'
                        : tx.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {tx.status}
                  </span>
                </td>
                <td className="py-3 px-4">{tx.amount}</td>
                <td className="py-3 px-4">
                  <div>{tx.date}</div>
                  <div className="text-gray-500">{tx.time}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Toggle Settings */}
      <div className="space-y-6 w-full max-w-166.25">
        {toggleSettingsList.map((opt) => (
          <div key={opt.id} className="flex items-start justify-between">
            <div className="max-w-md">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{opt.label}</h3>
              <p className="text-sm text-gray-500">{opt.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggle(opt.id)}
                className={`w-11 h-6 flex items-center ${
                  toggles[opt.id] ? 'bg-green-500' : 'bg-gray-300'
                } rounded-full p-1 transition-colors duration-300`}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                    toggles[opt.id] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
              <span className="text-sm font-medium text-gray-900">{toggles[opt.id] ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Save */}
      <Button variant='primary' className='capitalize mt-15 px-6 py-3.25'>
        save changes
      </Button>
    </div>
  );
};

export default PaymentSettings;
