import React from 'react'
import { format } from 'date-fns'
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'

const currencyFormat = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'CHF' })
const numberFormat = new Intl.NumberFormat('de-DE')

const formatNumber = (number: number, formatter: Intl.NumberFormat = numberFormat): string => {
  return formatter
    .formatToParts(number)
    .map(({ type, value }) => {
      switch (type) {
        case 'group':
          return "'"
        case 'decimal':
          return '.'
        default:
          return value
      }
    })
    .join('')
}

export const SimpleTable = ({ rows }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Count</TableCell>
            <TableCell align="right">Plus</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow key={row.date}>
                <TableCell>{format(row.date, 'EEE. dd.MM.yyyy')}</TableCell>
                <TableCell align="right">{row.count && formatNumber(row.count, numberFormat)}</TableCell>
                <TableCell align="right">{row.plus && formatNumber(row.plus, numberFormat)}</TableCell>
                <TableCell align="right">{formatNumber(row.amount, currencyFormat)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
