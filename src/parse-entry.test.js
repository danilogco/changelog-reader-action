const { parseEntry } = require('./parse-entry')

const entryDescription = `
### Added
- New attribute isOrdered on TextFieldList. Basicaly, <ol> becomes <ul> when not ordered.
- It is possible to change the row count of the TextField in TextFieldList.
- New attribute maxFieldCount on TextFieldList. It hides the add button when the value of maxFieldCount is reached.
- New DatePickerField component to display a date input.
- New attribute isSmall on TextField to display a smaller version of he TextField.

### Changed
- All form components can be updated using the value attribute.
- **BREACKING CHANGES** The default behavior of TextFieldList is to be "not ordered".
  You'll have to add the new isOrdered attribute on your existing components.
- FormErrors become FormErrorMessages.
- FormErrorMessages try to translate the error key automatically.
- ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.
- FormErrorMessages filter error that are equal to false
- If an error is equal to en object instead of true, the object is passed to the translator as variables by FormErrorMessages.
- RadioButton and CheckboxButton support other type than string for their children attribute.

### Fixed
- Update types to allow no theme data into ThemeProvider.
- **SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.
`

test('get readable data from text entry', () => {
  const input = `
    ## [v0.0.26] - 2019-02-10
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('v0.0.26')
  expect(output.date).toEqual('2019-02-10')
  expect(output.status).toEqual('released')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

test('get readable data from text entry | no title for version', () => {
  const input = `
    [v0.0.26] - 2019-02-10
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('v0.0.26')
  expect(output.date).toEqual('2019-02-10')
  expect(output.status).toEqual('released')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

test('get readable data from text entry | version patern X.X.X', () => {
  const input = `
    [0.0.26] - 2019-02-10
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('0.0.26')
  expect(output.date).toEqual('2019-02-10')
  expect(output.status).toEqual('released')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

test('get readable data from text entry | raw version number', () => {
  const input = `
    v0.0.26 - 2019-02-10
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('v0.0.26')
  expect(output.date).toEqual('2019-02-10')
  expect(output.status).toEqual('released')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

// https://github.com/mindsers/changelog-reader-action/issues/4
test('get readable data from text entry | unreleased version', () => {
  const input = `
    ## [Unreleased]
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('Unreleased')
  expect(output.date).toBeUndefined()
  expect(output.status).toEqual('unreleased')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

// https://github.com/mindsers/changelog-reader-action/issues/8
test('get readable data from text entry | unreleased version', () => {
  const input = `
    ## [1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay] - 2019-02-10
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay')
  expect(output.date).toEqual('2019-02-10')
  expect(output.status).toEqual('prereleased')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

test('get readable data from text entry | unexpected characters between version and date', () => {
  const input = `
    ## [1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay] |+. - \\\\  2019-02-10
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('1.0.0-alpha-a.b-c-somethinglong+build.1-aef.1-its-okay')
  expect(output.date).toEqual('2019-02-10')
  expect(output.status).toEqual('prereleased')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

// https://github.com/mindsers/changelog-reader-action/issues/10
test('get readable data from text entry | Fake date', () => {
  const input = `
    ## [1.0.0] - SomeWords instead of a Date
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('1.0.0')
  expect(output.date).toBeUndefined()
  expect(output.status).toEqual('released')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

test('get readable data from text entry | build number with plus sign', () => {
  const input = `
    ## [2.0.0+build.1848] - SomeWords instead of a Date
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('2.0.0+build.1848')
  expect(output.date).toBeUndefined()
  expect(output.status).toEqual('released')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

test('get readable data from text entry | yanked release', () => {
  const input = `
    ## [2.0.0] - 2019-02-10 [YANKED]
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('2.0.0')
  expect(output.date).toEqual('2019-02-10')
  expect(output.status).toEqual('yanked')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})

test('get readable data from text entry | yanked release with no date', () => {
  const input = `
    ## [2.0.0] [YANKED]
    ${entryDescription}
  `
  const output = parseEntry(input)

  expect(output.id).toEqual('2.0.0')
  expect(output.date).toBeUndefined()
  expect(output.status).toEqual('yanked')
  expect(output.text).toContain(`### Added`)
  expect(output.text).toContain(
    `ThemeProvider doesn't loads the font anymore. We created a more generic component (UIKitInitializer) that'll do it.`
  )
  expect(output.text).toContain(
    `**SECURITY** The list components don't use the nth-child CSS attributes in favor of nth-of-type.`
  )
})
