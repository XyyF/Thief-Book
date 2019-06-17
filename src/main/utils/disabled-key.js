export const disabledKeys = [
    'CapsLock', 'Tab',
]

export function transElectronKeyToLabel(key) {
    return key
        .replace(/CommandOrControl/g, '⌘')
        .replace(/Control/g, '⌃')
        .replace(/Shift/g, '⇧')
        .replace(/Alt/g, '⌥')
}

export function transBrowserKeyToLabel(key) {
    return key
        .replace(/Meta/g, '⌘')
        .replace(/Control/g, '⌃')
        .replace(/Shift/g, '⇧')
        .replace(/Alt/g, '⌥')
        .toUpperCase()
}

export function transLabelToElectronKey(key) {
    return key
        .replace(/⌘/g, 'CommandOrControl')
        .replace(/⌃/g, 'Control')
        .replace(/⇧/g, 'Shift')
        .replace(/⌥/g, 'Alt')
}

export default {
    disabledKeys,
    transElectronKeyToLabel,
    transBrowserKeyToLabel,
    transLabelToElectronKey,
}