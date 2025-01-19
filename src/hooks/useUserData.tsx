import { useState, useEffect } from 'react';

const useUserData = () => {
  const [userInfo, setUserInfo] = useState<chrome.identity.UserInfo | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // chrome.identity.getProfileUserInfo((userInfo: chrome.identity.UserInfo) => {
    //   if (chrome.runtime.lastError) {
    //     setError(chrome.runtime.lastError.message || 'An error occurred');
    //     setLoading(false);
    //   } else {
    //     setUserInfo(userInfo);
    //     console.log('chrome.identity.getProfileUserInfo  userInfo:', userInfo);
    //     setLoading(false);
    //   }
    // });
    // chrome.identity.launchWebAuthFlow(
    //   {
    //     url: 'https://accounts.google.com/o/oauth2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=token&scope=https://www.googleapis.com/auth/userinfo.email',
    //     interactive: true,
    //   },
    //   (redirectUrl: string) => {
    //     if (chrome.runtime.lastError) {
    //       setError(chrome.runtime.lastError.message || 'An error occurred');
    //       setLoading(false);
    //     } else {
    //       console.log(
    //         'chrome.identity.launchWebAuthFlow  redirectUrl:',
    //         redirectUrl
    //       );
    //       setLoading(false);
    //     }
    //   }
    // );
    // TODO: `You can't sign in to this app because it doesn't comply with Google's OAuth 2.0 policy for keeping apps secure`
  }, []);

  console.log(
    'chrome.identity.getProfileUserInfo  chrome.identity:',
    chrome.identity
  );
  return { userInfo, loading, error };
};

export default useUserData;
