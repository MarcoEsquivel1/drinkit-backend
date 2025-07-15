export enum UserGender {
  M = 'M',
  F = 'F',
  O = 'O',
}

export enum OrderStatus {
  ENTERED = 'ENTERED',
  PROCESS = 'PROCESS',
  BILLED = 'BILLED',
  ASSIGNING = 'ASSIGNING',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  VOIDED = 'VOIDED',
  REFUNDED = 'REFUNDED',
}

export enum TransactionType {
  CASH = 'CASH',
  CARD = 'CARD',
  REDMILLA = 'REDMILLA',
  INSTALLMENT = 'INSTALLMENT',
  TRANSFER = 'TRANSFER',
  LINK = 'LINK',
  REVERSE = 'REVERSE',
  VOID = 'VOID',
  REFUND = 'REFUND',
  BALANCE = 'BALANCE',
}

export enum PaymentMethodType {
  BALANCE = 'BALANCE',
  CASH = 'CASH',
  CARD = 'CARD',
  REDMILLA = 'REDMILLA',
  INSTALLMENT = 'INSTALLMENT',
  TRANSFER = 'TRANSFER',
  LINK = 'LINK',
}
