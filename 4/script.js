let name = "Джон";
let admin = name;

function showAdmin() {
    alert(admin);
}

alert(admin);
document.getElementById("task1Result").innerHTML = "admin = " + admin;

function fixSum() {
    let a = +prompt("Первое число:", 1);
    let b = +prompt("Второе число:", 2);
    
    if (isNaN(a) || isNaN(b)) {
        alert("не число");
        return;
    }
    
    let sum = a + b;
    alert("Сумма: " + sum);
    document.getElementById("task2Result").innerHTML = a + " + " + b + " = " + sum;
}

let evenNumbers = [];
for (let i = 2; i <= 10; i += 2) {
    evenNumbers.push(i);
}

document.getElementById("task3Result").innerHTML = evenNumbers.join(", ");

function showEvenNumbers() {
    alert(evenNumbers.join(", "));
}

function runTask4() {
    let i = 0;
    while (i < 3) {
        alert(`number ${i}!`);
        i++;
    }
}

function runTask5() {
    let userNumber;
    while (true) {
        userNumber = prompt("Введите число больше 100:");
        
        if (userNumber === null) {
            alert("Вы отменили ввод");
            document.getElementById("task5Result").innerHTML = "отмена";
            break;
        }
        
        userNumber = +userNumber;
        
        if (userNumber > 100) {
            alert("Число больше 100: " + userNumber);
            document.getElementById("task5Result").innerHTML = "выполнено";
            break;
        } else {
            alert("Число должно быть больше 100");
        }
    }
}

function task6() {
    let n = +prompt("Введите число", "10");
    
    if (isNaN(n) || n < 2) {
        alert("Введите число больше или равное 2");
        return;
    }
    
    let arr = [];
    
    for (let i = 2; i <= n; i++) {
        let isPrime = true;
        
        for (let j = 2; j < i; j++) {
            if (i % j === 0) {
                isPrime = false;
                break;
            }
        }
        
        if (isPrime) {
            arr.push(i);
        }
    }
    
    alert("Простые числа от 2 до " + n + ": " + arr.join(", "));
    document.getElementById("task6Result").innerHTML = "Простые числа от 2 до " + n + ": " + arr.join(", ");
}

