const questions = document.querySelectorAll('.questions-block__heading');

questions.forEach(question => {
    const arrow = question.querySelector('.questions-block__arrow');
    const answer = question.nextElementSibling;

    question.addEventListener('click', () => {
        answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        arrow.style.transform = arrow.style.transform === 'rotate(180deg)' ? '' : 'rotate(180deg)';
    });
});

const menuLinks = document.querySelectorAll('.menu-link');
const contentBlocks = document.querySelectorAll('.inform-block__content');
const greenLines = document.querySelectorAll('.green-line'); // Выберите все зеленые линии

menuLinks.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = e.target.getAttribute('data-target');

    contentBlocks.forEach((block) => {
      block.classList.remove('active');
    });

    const targetBlock = document.getElementById(targetId);
    if (targetBlock) {
      targetBlock.classList.add('active');
      
      // Переместите зеленую линию под активный заголовок
      greenLines.forEach((line, i) => {
        if (i === index) {
          line.style.transform = 'scaleX(1)';
        } else {
          line.style.transform = 'scaleX(0)';
        }
      });
    }
  });
});

// Обработчик клика на мерной шкале срока кредита
function formatNumber(input) {
    // Удалите все нечисловые символы и разделите число на тысячи
    let value = input.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    input.value = value;
}
// Функция для установки ползунка в заданное значение
function setSliderToValue(value) {
    const slider = document.getElementById("numberSlider");
    slider.value = value;
    updateInputFromSlider(slider);
}

function updateInputFromSlider(slider) {
    // Обновляем значение поля ввода на основе положения ползунка
    const inputValue = document.getElementById("numberInput");
    inputValue.value = slider.value;
    formatNumber(inputValue);
}

// Функция для установки срока кредита и обновления ползунка
function setLoanTerm(termInMonths) {
    const loanTermRange = document.getElementById("loanTermRange");
    const loanTermInput = document.getElementById("loanTerm");

    loanTermRange.value = termInMonths;
    updateLoanTermInput(); // Вызываем функцию для обновления инпута срока кредита
}

function updateSliderFromInput(input) {
    // Обновляем положение ползунка на основе значения поля ввода
    const slider = document.getElementById("numberSlider");
    slider.value = input.value;
    formatNumber(input);
}
// Функция для обновления значения срока кредита в инпуте
function updateLoanTermInput() {
    const loanTerm = document.getElementById("loanTermRange").value;
    const loanTermInput = document.getElementById("loanTerm");

    const termString = formatLoanTerm(loanTerm);
    loanTermInput.value = termString;
}


// Функция для определения правильного окончания слова
function getPluralForm(n) {
    if (n === 1) {
        return '';
    }
    if (n >= 2 && n <= 4) {
        return 'а';
    }
    return 'ов';
}
// Функция для преобразования срока кредита в годах и месяцах
function formatLoanTerm(term) {
    const years = Math.floor(term / 12);
    const months = term % 12;

    let yearString = 'год';
    let monthString = 'месяц';

    if (years !== 1) {
        yearString = 'года';
        if (years >= 5 || years === 0) {
            yearString = 'лет';
        }
    }

    if (months !== 1) {
        if (months >= 2 && months <= 4) {
            monthString = 'месяца';
        } else {
            monthString = 'месяцев';
        }
    }

    let termString = '';

    if (years > 0) {
        termString += `${years} ${yearString}`;
    }

    if (months > 0) {
        if (termString !== '') {
            termString += ' ';
        }
        termString += `${months} ${monthString}`;
    }

    return termString.trim() || '0 месяцев';
}
function parseLoanTerm(termString) {
    const parts = termString.split('-').map(part => part.trim());
    if (parts.length === 2) {
        const yearsMatch = parts[0].match(/\d+/);
        const monthsMatch = parts[1].match(/\d+/);
        let years = 0;
        let months = 0;

        if (yearsMatch) {
            years = parseInt(yearsMatch[0]);
        }

        if (monthsMatch) {
            months = parseInt(monthsMatch[0]);
        }

        return [years, months];
    }
    return [0, 0];
}

// Получаем ползунок и поле ввода
const numberSlider = document.getElementById("numberSlider");
const numberInput = document.getElementById("numberInput");

// Обработчик события для поля ввода
numberInput.addEventListener("input", function () {
    // Получаем значение суммы кредита из поля ввода и удаляем разделители тысяч
    let loanAmount = parseFloat(this.value.replace(/\s+/g, ''));

    // Ограничиваем значение суммы кредита между 1 и 5000000
    if (loanAmount < 1) {
        loanAmount = 50000;
    } else if (loanAmount > 2000000) {
        loanAmount = 2000000;
    }


    numberInput.value = loanAmount;

    // Устанавливаем значение ползунка в соответствии с новой суммой кредита
    numberSlider.value = loanAmount;


    calculateProgress("numberSlider", loanAmount );

    // Вызываем функцию formatNumber для форматирования с разделителями тысяч
    formatNumber(numberInput);
    // Обновляем расчет кредита
    calculateLoan();
});
// // Получаем элемент поля суммы кредита
// const loanAmountInput = document.getElementById("numberInput");

// // Добавляем обработчик события ввода для поля суммы кредита
// loanAmountInput.addEventListener("input", function() {
//     // Получаем введенное значение и удаляем из него нечисловые символы и пробелы
//     let inputAmount = parseFloat(loanAmountInput.value.replace(/\s+/g, ''));

//     // Ограничиваем введенное значение до 2000000, если оно больше
//     const maxLoanAmount = 2000000;
//     if (inputAmount > maxLoanAmount) {
//         inputAmount = maxLoanAmount;
//         loanAmountInput.value = formatNumber(maxLoanAmount);
//     }

//     // Форматируем введенное значение с разделением на тысячи и обновляем поле ввода
//     loanAmountInput.value = formatNumber(inputAmount);
// });

function calculateLoan() {
    // Получаем значение суммы кредита
    let loanAmountInput = document.getElementById("numberInput");
    let loanAmount = parseFloat(loanAmountInput.value.replace(/\s+/g, ''));

    // Ограничиваем сумму кредита до 2000000
    const maxLoanAmount = 2000000;
    if (loanAmount > maxLoanAmount) {
        loanAmount = maxLoanAmount;
        loanAmountInput.value = formatNumber(maxLoanAmount);
    }

    // Если сумма кредита меньше 50000, приравниваем ее к 50000
    const minLoanAmount = 50000;
    if (loanAmount < minLoanAmount) {
        loanAmount = minLoanAmount;
        loanAmountInput.value = formatNumber(minLoanAmount);
    }

    // Получаем значение срока кредита в месяцах
    const loanTerm = parseFloat(document.getElementById("loanTermRange").value);

    // Получаем значение свитчера для страхования
    const insuranceSwitch = document.getElementById("insuranceSwitch");

    // Определяем годовую процентную ставку в зависимости от наличия страхования
    const annualInterestRate = insuranceSwitch.checked ? 0.17 : 0.25;

    // Рассчитываем ежемесячный платеж по кредиту, используя ограниченную сумму
    const monthlyInterestRate = annualInterestRate / 12;
    const numberOfPayments = loanTerm;
    let monthlyPayment = 0; // Инициализируем значение ежемесячного платежа как 0

    if (!isNaN(loanAmount) && loanAmount >= minLoanAmount) {
        // Выполняем расчет только если значение суммы кредита корректное и не меньше 50000
        monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));
    }

    // Формируем строку с результатом
    let resultString = `
    <div class="res">
    <div class="result-wrap">
<div class="result-row">
    <div class="result-label monthly-payment">Ежемесячный платеж:</div>
    <div class="result-value monthly-payment">${monthlyPayment.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} ₽</div>
</div>
<div class="divider"></div>
<div class="result-row">
    <div class="result-label interest-rate">Процентная ставка:</div>
    <div class="result-value interest-rate">${(annualInterestRate * 100)}%</div>
</div>
</div>
<div class="hero-block__btn mes">
<a href="https://brainysoft.ru/" target="_blank" class="result-button">Оставить заявку</a>
</div>
</div>
`;

    // Выводим результат
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = resultString;
}
// Обработчик события input для ползунка суммы кредита
document.getElementById("numberSlider").addEventListener("input", function() {
    updateInputFromSlider(this); // Обновляем поле ввода суммы кредита
    calculateLoan(); // Пересчитываем кредит
});

// Обработчик события input для ползунка срока кредита
document.getElementById("loanTermRange").addEventListener("input", function() {
    updateLoanTermInput(); // Обновляем поле ввода срока кредита
    calculateLoan(); // Пересчитываем кредит
});

// Обработчик события change для свитчера страхования
document.getElementById("insuranceSwitch").addEventListener("change", function() {
    calculateLoan(); // Пересчитываем кредит при изменении свитчера
});

// Функция для обновления значения суммы кредита из ползунка
function updateInputFromSlider(slider) {
    const inputValue = document.getElementById("numberInput");
    inputValue.value = slider.value;
    formatNumber(inputValue);
}

// Функция для обновления значения срока кредита в инпуте
function updateLoanTermInput() {
    const loanTerm = document.getElementById("loanTermRange").value;
    const loanTermInput = document.getElementById("loanTerm");
    const termString = formatLoanTerm(loanTerm);
    loanTermInput.value = termString;
}

// Обновляем значения при загрузке страницы
updateLoanTermInput();

// Обновляем значение инпута срока кредита при изменении ползунка
document.getElementById("loanTermRange").addEventListener("input", function () {
    updateLoanTermInput();
});

// Добавляем обработчик для кнопки "Рассчитать"
document.getElementById("calculateButton").addEventListener("click", function () {
    calculateLoan(); // Вызываем функцию расчета при нажатии на кнопку
});

// Обновляем значение инпута на основе ползунка
document.getElementById("numberSlider").addEventListener("input", function () {
    updateInputFromSlider(this);
});
calculateLoan();


function calculateProgress( id, value = undefined){
        let e = document.getElementById(id)
        console.log(id);
        e.style.setProperty('--value', value ? value : e.value);
        e.style.setProperty('--min', e.min == '' ? '0' : e.min);
        e.style.setProperty('--max', e.max == '' ? '100' : e.max);
        e.addEventListener('input', () => e.style.setProperty('--value', e.value));
}


calculateProgress(id="numberSlider")
calculateProgress(id="loanTermRange");
