import React, { useState } from 'react';
import { Language, StoreSettings } from '../types';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  settings: StoreSettings;
  language: Language;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  settings,
  language,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = (settings.adminPin || '8899').trim();
    if (pinInput.trim() === correctPin) {
      setErrorMsg('');
      setPinInput('');
      onSuccess();
    } else {
      setErrorMsg(
        language === 'km'
          ? 'លេខកូដសម្ងាត់មិនត្រឹមត្រូវទេ! (Incorrect PIN)'
          : 'Incorrect Admin PIN. Access Denied.'
      );
      setPinInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="w-full max-w-sm bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xl space-y-4 text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white font-bold flex items-center justify-center mx-auto text-sm">
            HS
          </div>
          <h3 className="font-display font-black text-lg text-neutral-950 uppercase tracking-tight">
            {language === 'km' ? 'ផ្ទាំងគ្រប់គ្រងហាង' : 'Store Admin Portal'}
          </h3>
          <p className="text-xs text-neutral-500 font-khmer">
            {language === 'km'
              ? 'សូមបញ្ចូលលេខកូដសម្ងាត់ Admin ដើម្បីចូលកែប្រែទិន្នន័យ'
              : 'Enter secret admin PIN to access store management'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <input
              type="password"
              autoFocus
              maxLength={12}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setErrorMsg('');
              }}
              placeholder="••••"
              className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-center text-lg font-mono font-bold tracking-widest focus:outline-none focus:border-black"
            />
            {errorMsg && (
              <p className="text-xs font-bold text-red-600 text-center font-khmer pt-1">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setPinInput('');
                onClose();
              }}
              className="py-2.5 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              <span>{language === 'km' ? 'បោះបង់' : 'Cancel'}</span>
            </button>

            <button
              type="submit"
              className="py-2.5 px-3 bg-neutral-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-colors shadow-xs cursor-pointer"
            >
              <span>{language === 'km' ? 'ផ្ទៀងផ្ទាត់ PIN' : 'Unlock Admin'}</span>
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-neutral-100 text-center">
          <span className="text-[11px] text-neutral-400 font-khmer">
            {language === 'km'
              ? '🔒 ផ្ទាំងគ្រប់គ្រងនេះសម្រាប់តែម្ចាស់ហាង HOME SPORT ប៉ុណ្ណោះ'
              : '🔒 Restricted access for HOME SPORT store owner only'}
          </span>
        </div>
      </div>
    </div>
  );
};
