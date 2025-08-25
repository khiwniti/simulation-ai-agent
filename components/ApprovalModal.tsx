
import React from 'react';
import { ApprovalRequest } from '../types';

interface ApprovalModalProps {
  request: ApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ request, onApprove, onReject }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6 border border-gray-700">
        <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-4 ring-4 ring-yellow-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-yellow-400">Approval Required</h2>
        </div>
        <p className="text-gray-300 mb-2">{request.message}</p>
        <div className="bg-gray-900 p-3 rounded-md text-sm text-gray-400 font-mono my-4 border border-gray-700">
          {request.details}
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onReject}
            className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-500 text-white font-semibold transition-colors"
          >
            Reject
          </button>
          <button
            onClick={onApprove}
            className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
};