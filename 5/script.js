function task1Reverse() {
    let num = prompt("Введите число");
    
    if (num === null) {
        document.getElementById("t1_1").innerHTML = "отмена";
        return;
    }
    
    let reversed = parseInt(num.toString().split('').reverse().join(''));
    document.getElementById("t1_1").innerHTML = `Исходное число: ${num}<br>Результат: ${reversed}`;
}

function task1UniqueDigits() {
    let num = prompt("Введите число");
    
    if (num === null) {
        document.getElementById("t1_2").innerHTML = "отмена";
        return;
    }
    
    let str = num.toString();
    let unique = '';
    
    for (let i = 0; i < str.length; i++) {
        if (unique.indexOf(str[i]) === -1) {
            unique += str[i];
        }
    }
    
    let result = parseInt(unique);
    document.getElementById("t1_2").innerHTML = `Исходное число: ${num}<br>Результат: ${result}`;
}

function task1CountDigit() {
    let num = prompt("Введите число");
    
    if (num === null) {
        document.getElementById("t1_3").innerHTML = "отмена";
        return;
    }
    
    let digit = prompt("Какую цифру посчитать?", "5");
    
    if (digit === null) {
        document.getElementById("t1_3").innerHTML = "отмена";
        return;
    }
    
    let str = num.toString();
    let count = 0;
    
    for (let i = 0; i < str.length; i++) {
        if (str[i] === digit) {
            count++;
        }
    }
    
    document.getElementById("t1_3").innerHTML = `Число: ${num}, цифра: ${digit}<br>Результат: ${count} раза`;
}

function task1MaxSequence() {
    let num = prompt("Введите число");
    
    if (num === null) {
        document.getElementById("t1_4").innerHTML = "отмена";
        return;
    }
    
    let binary = (+num).toString(2);
    
    let maxZeros = 0;
    let maxOnes = 0;
    let currentZeros = 0;
    let currentOnes = 0;
    
    for (let i = 0; i < binary.length; i++) {
        if (binary[i] === '0') {
            currentZeros++;
            currentOnes = 0;
            if (currentZeros > maxZeros) maxZeros = currentZeros;
        } else {
            currentOnes++;
            currentZeros = 0;
            if (currentOnes > maxOnes) maxOnes = currentOnes;
        }
    }
    
    document.getElementById("t1_4").innerHTML = `Число: ${num}<br>Двоичная запись: ${binary}<br>Самая длинная последовательность нулей: ${maxZeros}<br>Самая длинная последовательность единиц: ${maxOnes}`;
}

function task2FirstUnique() {
    let str = prompt("Введите строку");
    
    if (str === null) {
        document.getElementById("t2_1").innerHTML = "отмена";
        return;
    }
    
    let result = '';
    
    for (let i = 0; i < str.length; i++) {
        let count = 0;
        for (let j = 0; j < str.length; j++) {
            if (str[i] === str[j]) {
                count++;
            }
        }
        if (count === 1) {
            result = str[i];
            break;
        }
    }
    
    if (result === '') {
        result = 'нет неповторяющихся символов';
    }
    
    document.getElementById("t2_1").innerHTML = `Исходная строка: "${str}"<br>Первый неповторяющийся символ: "${result}"`;
}

function task2GenerateRandom() {
    let length = prompt("Введите длину строки");
    
    if (length === null) {
        document.getElementById("t2_2").innerHTML = "отмена";
        return;
    }
    
    length = +length;
    
    if (isNaN(length) || length <= 0) {
        document.getElementById("t2_2").innerHTML = "Непонятное число";
        return;
    }
    
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    
    document.getElementById("t2_2").innerHTML = `Длина: ${length}<br>Сгенерированная строка: "${result}"`;
}

function task2UniqueChars() {
    let str = prompt("Введите строку");
    
    if (str === null) {
        document.getElementById("t2_3").innerHTML = "отмена";
        return;
    }
    
    let unique = '';
    
    for (let i = 0; i < str.length; i++) {
        if (unique.indexOf(str[i]) === -1) {
            unique += str[i];
        }
    }
    
    document.getElementById("t2_3").innerHTML = `Исходная строка: "${str}"<br>Уникальные символы: "${unique}"`;
}