import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { updatePassword } from 'firebase/auth';
import { Alert } from 'react-native';
import { auth } from '../config/firebase';

const AuthFlowContext = createContext(null);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const AuthFlowProvider = ({ children }) => {
  const [otpRequest, setOtpRequest] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setTimeout(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendOtp = useCallback(
    (email) => {
      if (cooldown > 0) {
        throw new Error(`Please wait ${cooldown}s before requesting a new OTP.`);
      }
      const normalized = email.trim().toLowerCase();
      const otp = generateOtp();
      setOtpRequest({
        email: normalized,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
        verified: false,
      });
      setCooldown(45);
      console.log('Password reset OTP:', otp);
      return otp;
    },
    [cooldown]
  );

  const verifyOtp = useCallback(
    (email, otp) => {
      if (!otpRequest) {
        throw new Error('Request an OTP first');
      }
      const normalized = email.trim().toLowerCase();
      if (otpRequest.email !== normalized) {
        throw new Error('Email does not match the OTP request');
      }
      if (otpRequest.expiresAt < Date.now()) {
        throw new Error('OTP has expired');
      }
      if (otpRequest.otp !== otp) {
        throw new Error('Invalid OTP');
      }
      setOtpRequest((prev) => ({ ...prev, verified: true }));
      return true;
    },
    [otpRequest]
  );

  const resetPassword = useCallback(
    async (email, newPassword) => {
      if (!otpRequest || !otpRequest.verified) {
        throw new Error('OTP verification is required before resetting the password.');
      }
      const normalized = email.trim().toLowerCase();
      if (otpRequest.email !== normalized) {
        throw new Error('Email does not match the verified OTP.');
      }

      try {
        const activeUser = auth.currentUser;
        if (activeUser?.email?.toLowerCase() === normalized) {
          await updatePassword(activeUser, newPassword);
        }
        Alert.alert('Success', 'Password updated. You can log in with the new password.');
      } finally {
        setOtpRequest(null);
      }
    },
    [otpRequest]
  );

  const value = useMemo(
    () => ({
      sendOtp,
      verifyOtp,
      resetPassword,
      otpCooldown: cooldown,
      otpExpiresAt: otpRequest?.expiresAt ?? null,
      lastOtp: __DEV__ ? otpRequest?.otp : undefined,
    }),
    [cooldown, otpRequest, resetPassword, sendOtp, verifyOtp]
  );

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
};

export const useAuthFlow = () => {
  const ctx = useContext(AuthFlowContext);
  if (!ctx) {
    throw new Error('useAuthFlow must be used inside AuthFlowProvider');
  }
  return ctx;
};
