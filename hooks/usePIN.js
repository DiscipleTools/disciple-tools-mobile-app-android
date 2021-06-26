import React from 'react';
import { useDispatch } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import * as Random from 'expo-random';

import { setHasPIN, setCNoncePIN } from 'store/actions/auth.actions';

const usePIN = () => {
  const dispatch = useDispatch();

  const getPIN = async () => {
    // TODO: use Constant
    return SecureStore.getItemAsync('pinCode');
  };

  const setPIN = async (code) => {
    // TODO: use Constant
    await SecureStore.setItemAsync('pinCode', code);
    // TODO: check SecureStore to determine
    dispatch(setHasPIN(true));
  };

  const deletePIN = async () => {
    // TODO: use Constant
    await SecureStore.deleteItemAsync('pinCode');
    dispatch(setHasPIN(false));
  };

  const setCNonce = async () => {
    const cnonce = Random.getRandomBytes(256).toString();
    await SecureStore.setItemAsync('cnoncePINDT', new Date().toString());
    await SecureStore.setItemAsync('cnoncePIN', cnonce);
    dispatch(setCNoncePIN(cnonce));
  };

  return {
    getPIN,
    setPIN,
    deletePIN,
    setCNonce,
  };
};
export default usePIN;
