import { describe, it, expect } from 'vitest'
import {
  monthTableName,
  createTableStatement,
  parseMonthTable,
  isExpired,
  rowsToSqlDump,
} from './tables'

describe('monthTableName', () => {
  it('formats the UTC year/month, zero-padded, from a Date', () => {
    expect(monthTableName(new Date(Date.UTC(2026, 5, 18)))).toBe('contacts_2026_06')
    expect(monthTableName(new Date(Date.UTC(2026, 11, 1)))).toBe('contacts_2026_12')
  })

  it('accepts an epoch-ms number', () => {
    expect(monthTableName(Date.UTC(2026, 0, 9))).toBe('contacts_2026_01')
  })
})

describe('createTableStatement', () => {
  it('substitutes the table name from the versioned template', () => {
    const sql = createTableStatement('contacts_2026_06')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS contacts_2026_06')
    expect(sql).toContain('created_at TEXT NOT NULL')
    expect(sql).not.toContain('__TABLE__')
    expect(sql).toBe(sql.trim())
  })
})

describe('parseMonthTable', () => {
  it('parses a valid month-table name', () => {
    expect(parseMonthTable('contacts_2026_06')).toEqual({ year: 2026, month: 6 })
  })

  it('returns null for non-matching names', () => {
    expect(parseMonthTable('contacts')).toBeNull()
    expect(parseMonthTable('contacts_2026_6')).toBeNull()
    expect(parseMonthTable('sqlite_sequence')).toBeNull()
  })
})

describe('isExpired', () => {
  const now = new Date(Date.UTC(2026, 5, 15)) // 2026-06

  it('is true when the month is at least retentionMonths behind now', () => {
    expect(isExpired('contacts_2025_12', now, 6)).toBe(true)
  })

  it('is false when the month is within the window', () => {
    expect(isExpired('contacts_2026_01', now, 6)).toBe(false)
  })

  it('is false for a future month', () => {
    expect(isExpired('contacts_2026_07', now, 6)).toBe(false)
  })

  it('is false for a non-month-table name', () => {
    expect(isExpired('sqlite_sequence', now, 6)).toBe(false)
  })

  it('accepts an epoch-ms number for now', () => {
    expect(isExpired('contacts_2025_06', Date.UTC(2026, 5, 15), 6)).toBe(true)
  })
})

describe('rowsToSqlDump', () => {
  it('emits the CREATE statement alone for no rows', () => {
    const dump = rowsToSqlDump('contacts_2020_01', [])
    expect(dump).toBe(`${createTableStatement('contacts_2020_01')};\n`)
  })

  it('escapes strings, passes numbers raw, and renders null/undefined as NULL', () => {
    const dump = rowsToSqlDump('contacts_2020_01', [
      { id: 'a', name: "O'Brien", count: 3, note: null, extra: undefined },
    ])
    expect(dump).toContain(
      "INSERT INTO contacts_2020_01 (id, name, count, note, extra) VALUES ('a', 'O''Brien', 3, NULL, NULL);"
    )
  })
})
