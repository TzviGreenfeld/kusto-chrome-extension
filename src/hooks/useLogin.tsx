import { useState, useEffect } from 'react';

export interface UserData {
  name: string;
}

export interface UseLogin {
  getUserData: () => UserData | null;
  updateUserData: (newUserData: UserData) => void;
  isUserDataEmpty: () => boolean;
}

export default function useLogin(): UseLogin {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    chrome.storage.local.get(['UserDataRecord'], (result) => {
      setUserData(result.UserData);
    });
  }, []);

  const getUserData = (): UserData | null => {
    chrome.storage.local.get(['UserDataRecord'], (result) => {
      setUserData(result.UserDataRecord);
    });
    return userData;
  };

  const updateUserData = (newUserData: UserData): void => {
    setUserData(newUserData);
    chrome.storage.local.set({ UserDataRecord: newUserData }, () => {
      console.log('UserDataRecord updated:', newUserData);
    });
  };

  const isUserDataEmpty = (): boolean => {
    return userData == null || userData.name === '';
  };

  return {
    getUserData,
    updateUserData,
    isUserDataEmpty,
  };
}
