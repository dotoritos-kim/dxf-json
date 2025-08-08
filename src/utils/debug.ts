let isOn = false;

export function enableSelectiveLog() {
    isOn = true;
}

export function disableSelectiveLog() {
    isOn = false;
}

export function selectiveLog(s: any, mode: 'log' | 'error' | 'warn' = 'log') {
    if (isOn) {
        console[mode](s);
    }
}
