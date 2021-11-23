import React from 'react';
import { Caption } from 'react-native-paper';
import { Address } from '../api/location';

interface Props {
  address: Address;
}

export default function AddressLine({ address }: Props) {
  if (address === null) return null;

  return <Caption>{address}</Caption>;
}
