import React from 'react';

const TableRow = ({ user, columnWidths, onClick }) => {
  return (
    <tr onClick={onClick}>
      <td style={{ width: columnWidths.lastName }}>{user.lastName}</td>
      <td style={{ width: columnWidths.firstName }}>{user.firstName}</td>
      <td style={{ width: columnWidths.middleName }}>{user.maidenName || '-'}</td>
      <td style={{ width: columnWidths.age }}>{user.age}</td>
      <td style={{ width: columnWidths.gender }}>{user.genderDisplay}</td>
      <td style={{ width: columnWidths.phone }}>{user.phone}</td>
      <td style={{ width: columnWidths.email }}>{user.email}</td>
      <td style={{ width: columnWidths.country }}>{user.country || '-'}</td>
      <td style={{ width: columnWidths.city }}>{user.city || '-'}</td>
    </tr>
  );
};

export default TableRow;