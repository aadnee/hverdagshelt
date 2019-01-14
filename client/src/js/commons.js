export const PENDING = 1;
export const INPROGRESS = 2;
export const DONE = 3;
export const REJECTED = 4;

export const STATUS = [
  { value: PENDING, norwegian: 'Påventende', english: 'Pending' },
  { value: INPROGRESS, norwegian: 'Under behandling', english: 'In progress' },
  { value: DONE, norwegian: 'Ferdig', english: 'Done' },
  { value: REJECTED, norwegian: 'Avslått', english: 'Rejected' }
];

export const USER = 1;
export const COMPANY = 2;
export const EMPLOYEE = 3;
export const ADMIN = 4;

export const USERTYPE = [
  { key: USER, text: 'Bruker', value: USER, norwegian: 'Bruker', english: 'User' },
  { key: COMPANY, text: 'Bedrift', value: COMPANY, norwegian: 'Bedrift', english: 'Company' },
  { key: EMPLOYEE, text: 'Ansatt', value: EMPLOYEE, norwegian: 'Ansatt', english: 'Employee' },
  { key: ADMIN, text: 'Administrator', value: ADMIN, norwegian: 'Administrator', english: 'Administrator' }
];
